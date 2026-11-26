"use client";

import { Copy, MessageSquare, MoreVertical, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AgentAvatar } from "./agent-avatar";

export type AgentItem = {
    id: string;
    name: string;
    role: string;
    instructions: string;
    provider: "OPENAI" | "ANTHROPIC" | "GEMINI";
    model: string;
    avatarSeed: string;
};

type Props = {
    agent: AgentItem;
    onEdit: (agent: AgentItem) => void;
    onDelete: (agent: AgentItem) => void;
    /** Set when the chat page exists, e.g. `/agents/${id}`. The Chat button is hidden without it. */
    chatHref?: string;
};

export function AgentCard({ agent, onEdit, onDelete, chatHref }: Props) {
    const copyId = async () => {
        await navigator.clipboard.writeText(agent.id);
        toast.success("Agent ID copied");
    };

    return (
        <Card className="flex flex-col gap-4 p-5">
            <div className="flex items-start gap-3">
                <AgentAvatar seed={agent.avatarSeed} name={agent.name} />
                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold">{agent.name}</h3>
                    <p className="truncate text-sm text-muted-foreground">{agent.role || "No role set"}</p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label={`Actions for ${agent.name}`}>
                            <MoreVertical className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(agent)}>
                            <Pencil className="size-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete(agent)}
                            className="text-destructive focus:text-destructive"
                        >
                            <Trash2 className="size-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <p className="line-clamp-3 min-h-[4.5rem] text-sm text-muted-foreground">{agent.instructions}</p>

            <div className="flex items-center justify-between border-t pt-4">
                <button
                    type="button"
                    onClick={copyId}
                    className="flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-xs text-muted-foreground hover:bg-muted"
                    title="Copy agent ID"
                >
                    <Copy className="size-3" />
                    {agent.id.slice(0, 8)}…
                </button>
                {chatHref ? (
                    <Button asChild variant="ghost" size="sm">
                        <Link href={chatHref}>
                            <MessageSquare className="size-4" /> Chat
                        </Link>
                    </Button>
                ) : (
                    <span className="text-xs text-muted-foreground">{agent.model}</span>
                )}
            </div>
        </Card>
    );
}
