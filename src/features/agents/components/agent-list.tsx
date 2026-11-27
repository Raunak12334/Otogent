"use client";

import { useState } from "react";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityList,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { useAgents, useRemoveAgent } from "../hooks/use-agents";
import { useAgentsParams } from "../hooks/use-agents-params";
import { AgentCard, type AgentItem } from "./agent-card";
import { AgentDialog } from "./agent-dialog";

export const AgentsSearch = () => {
  const [params, setParams] = useAgentsParams();
  return (
    <EntitySearch
      value={params.search ?? ""}
      onChange={(value) => setParams({ ...params, search: value })}
      placeholder="Search Agents"
    />
  );
};

export const AgentsEmpty = ({ onNew }: { onNew: () => void }) => {
  return (
    <EmptyView
      onNew={onNew}
      message="You haven't started any agents yet. Get started"
    />
  );
};

export function AgentsList() {
  const { data: agents, isLoading, isError } = useAgents();
  const [params] = useAgentsParams();
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

  const trimmedSearch = (params.search ?? "").trim().toLowerCase();
  const filteredAgents = (agents ?? []).filter((agent: AgentItem) => {
    if (!trimmedSearch) return true;
    return (
      agent.name.toLowerCase().includes(trimmedSearch) ||
      agent.role.toLowerCase().includes(trimmedSearch) ||
      agent.model.toLowerCase().includes(trimmedSearch)
    );
  });

  return (
    <EntityContainer
      header={
        <EntityHeader
          title="Your agents"
          description="Create and manage the agents that run your trading automations."
          onNew={openCreate}
          newButtonLabel="Create agent"
        />
      }
      search={<AgentsSearch />}
    >
      {isLoading ? (
        <LoadingView entity="agents" />
      ) : isError ? (
        <ErrorView message="Couldn't load your agents. Refresh to try again." />
      ) : (
        <EntityList
          items={filteredAgents}
          getKey={(agent) => agent.id}
          renderItem={(agent: AgentItem) => (
            <AgentCard
              agent={agent}
              onEdit={openEdit}
              onDelete={confirmDelete}
            // chatHref={`/agents/${agent.id}`}  // enable when the chat page exists
            />
          )}
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          emptyView={<AgentsEmpty onNew={openCreate} />}
        />
      )}

      <AgentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        agent={editing}
      />
    </EntityContainer>
  );
}
