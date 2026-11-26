import { z } from "zod";
import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const agentFields = z.object({
    name: z.string().trim().min(1, "Name is required").max(60),
    role: z.string().trim().max(80).default(""),
    instructions: z.string().trim().min(1, "Instructions are required").max(8000),
    provider: z.enum(["OPENAI", "ANTHROPIC", "GEMINI"]),
    model: z.string().min(1),
    // Optional: the DB generates one on create; the dialog's "Shuffle" sends a new one.
    avatarSeed: z.string().min(1).max(100).optional(),
});

export const agentsRouter = createTRPCRouter({
    list: protectedProcedure.query(({ ctx }) =>
        prisma.agent.findMany({
            where: { userId: ctx.auth.user.id },
            orderBy: { createdAt: "asc" },
        }),
    ),

    create: protectedProcedure.input(agentFields).mutation(({ ctx, input }) =>
        prisma.agent.create({ data: { ...input, userId: ctx.auth.user.id } }),
    ),

    update: protectedProcedure
        .input(agentFields.extend({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input;
            // updateMany + userId = ownership check built into the query
            await prisma.agent.updateMany({ where: { id, userId: ctx.auth.user.id }, data });
            return { id };
        }),

    remove: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            await prisma.agent.deleteMany({ where: { id: input.id, userId: ctx.auth.user.id } });
            return { id: input.id };
        }),
});
