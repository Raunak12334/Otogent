"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAgents, useRemoveAgent } from "../hooks/use-agents";
import { AgentCard, type AgentItem } from "./agent-card";
import { AgentDialog } from "./agent-dialog";

export function AgentsList() {
    const { data: agents, isLoading, isError } = useAgents();
    const remove = useRemoveAgent();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<AgentItem | null>(null);

    const openCreate = () => {
        setEditing(null);
        setDialogOpen(true);
    };
    const openEdit = (agent: AgentItem) => {
        setEditing(agent);
        setDialogOpen(true);
    };
    const confirmDelete = (agent: AgentItem) => {
        if (window.confirm(`Delete "${agent.name}"? This can't be undone.`)) {
            remove.mutate({ id: agent.id });
        }
    };

    return (
        <div className="mx-auto w-full max-w-6xl p-6 md:p-10">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">Your agents</h1>
                    <p className="text-muted-foreground">
                        Create and manage the agents that run your trading automations.
                    </p>
                </div>
                <Button onClick={openCreate}>
                    <Plus className="size-4" /> Create agent
                </Button>
            </div>

            {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading agents…</p>
            ) : isError ? (
                <p className="text-sm text-destructive">Couldn't load your agents. Refresh to try again.</p>
            ) : agents && agents.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {agents.map((agent: AgentItem) => (
                        <AgentCard
                            key={agent.id}
                            agent={agent}
                            onEdit={openEdit}
                            onDelete={confirmDelete}
                        // chatHref={`/agents/${agent.id}`}  // enable when the chat page exists
                        />
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed p-10 text-center">
                    <h2 className="font-medium">No agents yet</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Write your first strategy in plain language and pick a model.
                    </p>
                    <Button className="mt-4" onClick={openCreate}>
                        <Plus className="size-4" /> Create your first agent
                    </Button>
                </div>
            )}

            <AgentDialog open={dialogOpen} onOpenChange={setDialogOpen} agent={editing} />
        </div>
    );
}
