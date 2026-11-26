"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";

export const useAgents = () => {
    const trpc = useTRPC();
    return useQuery(trpc.agents.list.queryOptions());
};

const useRefresh = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    return () => queryClient.invalidateQueries(trpc.agents.list.queryFilter());
};

export const useCreateAgent = () => {
    const trpc = useTRPC();
    const refresh = useRefresh();
    return useMutation(
        trpc.agents.create.mutationOptions({
            onSuccess: (agent) => {
                toast.success(`Agent "${agent.name}" created`);
                refresh();
            },
            onError: (e) => toast.error(e.message),
        }),
    );
};

export const useUpdateAgent = () => {
    const trpc = useTRPC();
    const refresh = useRefresh();
    return useMutation(
        trpc.agents.update.mutationOptions({
            onSuccess: () => {
                toast.success("Agent saved");
                refresh();
            },
            onError: (e) => toast.error(e.message),
        }),
    );
};

export const useRemoveAgent = () => {
    const trpc = useTRPC();
    const refresh = useRefresh();
    return useMutation(
        trpc.agents.remove.mutationOptions({
            onSuccess: () => {
                toast.success("Agent deleted");
                refresh();
            },
            onError: (e) => toast.error(e.message),
        }),
    );
};
