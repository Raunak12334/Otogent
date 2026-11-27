import { Suspense } from "react";
import { LoadingView } from "@/components/entity-components";
import { AgentsList } from "@/features/agents/components/agent-list";

// If your other pages call requireAuth() / prefetch here, do the same.
export default function AgentsPage() {
  return (
    <Suspense fallback={<LoadingView entity="agents" />}>
      <AgentsList />
    </Suspense>
  );
}
