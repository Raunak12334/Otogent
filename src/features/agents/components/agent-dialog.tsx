"use client";

import { Shuffle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateAgent, useUpdateAgent } from "../hooks/use-agents";
import { choiceKey, DEFAULT_OPTION, MODEL_OPTIONS } from "@/config/models";
import { AgentAvatar } from "./agent-avatar";
import type { AgentItem } from "./agent-card";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Pass an agent to edit it; leave empty to create. */
    agent?: AgentItem | null;
};

export function AgentDialog({ open, onOpenChange, agent }: Props) {
    const create = useCreateAgent();
    const update = useUpdateAgent();
    const isEdit = Boolean(agent);

    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [instructions, setInstructions] = useState("");
    const [choice, setChoice] = useState<string>(choiceKey(DEFAULT_OPTION));
    const [avatarSeed, setAvatarSeed] = useState("");

    useEffect(() => {
        if (!open) return;
        setName(agent?.name ?? "");
        setRole(agent?.role ?? "");
        setInstructions(agent?.instructions ?? "");
        setChoice(agent ? choiceKey(agent) : choiceKey(DEFAULT_OPTION));
        setAvatarSeed(agent?.avatarSeed ?? crypto.randomUUID());
    }, [open, agent]);

    const pending = create.isPending || update.isPending;
    const canSave = name.trim() !== "" && instructions.trim() !== "" && !pending;

    const save = () => {
        const picked = MODEL_OPTIONS.find((o) => choiceKey(o) === choice) ?? DEFAULT_OPTION;
        const values = {
            name,
            role,
            instructions,
            provider: picked.provider,
            model: picked.model,
            avatarSeed,
        };
        const done = { onSuccess: () => onOpenChange(false) };
        if (agent) update.mutate({ id: agent.id, ...values }, done);
        else create.mutate(values, done);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit agent" : "Create agent"}</DialogTitle>
                    <DialogDescription>
                        An agent is a saved strategy. Automations run it with live market data.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
                    <div className="flex items-center gap-3">
                        {avatarSeed ? <AgentAvatar seed={avatarSeed} name={name} size={56} /> : null}
                        <Button type="button" variant="outline" size="sm" onClick={() => setAvatarSeed(crypto.randomUUID())}>
                            <Shuffle className="size-4" /> Shuffle avatar
                        </Button>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="agent-name">Name</Label>
                        <Input id="agent-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Funding Watcher" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="agent-role">Role</Label>
                        <Input id="agent-role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Funding rate analyst" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="agent-instructions">Instructions</Label>
                        <Textarea
                            id="agent-instructions"
                            rows={6}
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            placeholder="Describe the strategy in plain language: what to watch, when to alert, and what never to do."
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="agent-model">Model</Label>
                        <Select value={choice} onValueChange={setChoice}>
                            <SelectTrigger id="agent-model">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {MODEL_OPTIONS.map((o) => (
                                    <SelectItem key={choiceKey(o)} value={choiceKey(o)}>
                                        {o.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={save} disabled={!canSave}>
                        {pending ? "Saving…" : isEdit ? "Save changes" : "Create agent"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
