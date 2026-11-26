// SINGLE SOURCE OF TRUTH for selectable models. Shared by: the Agent dialog, the chat route
// (/api/agents/chat), the Agent workflow node executor, and the LLM helper. Do not duplicate these ids.
// `provider` must match the AgentProvider enum in Prisma and the CredentialType values.
// Add your OpenAI / Gemini model ids here when you wire those providers.
export const MODEL_OPTIONS = [
    { provider: "GEMINI", model: "", label: "" },
    // { provider: "OPENAI", model: "<openai-model-id>", label: "OpenAI ..." },
    // { provider: "GEMINI", model: "<gemini-model-id>", label: "Gemini ..." },
] as const;

export type AgentProviderValue = (typeof MODEL_OPTIONS)[number]["provider"] | "OPENAI" | "GEMINI";

export const choiceKey = (o: { provider: string; model: string }) => `${o.provider}:${o.model}`;
export const DEFAULT_OPTION = MODEL_OPTIONS[0];
