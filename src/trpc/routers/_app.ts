import { credentialsRouter } from '@/features/credentials/server/routers';
import { createTRPCRouter } from '../init';
import { workflowsRouter } from '@/features/workflows/server/routers';
import { executionsRouter } from '@/features/executions/server/routers';
import { agentsRouter } from '@/features/agents/server/routers';

export const appRouter = createTRPCRouter({
    agents: agentsRouter,
    workflows: workflowsRouter,
    credentials: credentialsRouter,
    executions: executionsRouter,
});

export type AppRouter = typeof appRouter;

