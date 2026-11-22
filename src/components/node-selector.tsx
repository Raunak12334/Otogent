"use client";

import { createId } from "@paralleldrive/cuid2";
import { useReactFlow } from "@xyflow/react";
import { GlobeIcon, MousePointer2Icon } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import { NodeType } from "@/generated/prisma/enums";
import { Separator } from "./ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

export type NodeTypeOption = {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string;
  initialData?: Record<string, unknown>;
};

const triggerNodes: NodeTypeOption[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "Trigger manually",
    description: "Starts the workflow when you manually run it",
    icon: MousePointer2Icon,
  },
  {
    type: NodeType.TELEGRAM_TRIGGER,
    label: "Telegram Trigger",
    description: "Runs when a message or command is sent to your Telegram bot",
    icon: "/telegram.svg",
  },
  {
    type: NodeType.WHATSAPP_TRIGGER,
    label: "WhatsApp Trigger",
    description:
      "Runs when a WhatsApp message arrives via the Business Cloud API",
    icon: "/whatsapp.svg",
  },
];

const executionNodes: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP Request",
    description: "Make an HTTP request",
    icon: GlobeIcon,
  },
  {
    type: NodeType.TELEGRAM_ACTION,
    label: "Send Telegram Message",
    description: "Send a message or reply to a Telegram chat",
    icon: "/telegram.svg",
    initialData: {
      variableName: "telegramResponse",
      authType: "inherit",
      chatId: "{{telegram.chatId}}",
      parseMode: "HTML",
    },
  },
  {
    type: NodeType.WHATSAPP_ACTION,
    label: "Send WhatsApp Message",
    description: "Send a text message to a WhatsApp number",
    icon: "/whatsapp.svg",
    initialData: {
      variableName: "whatsappResponse",
      authType: "inherit",
      recipientPhone: "{{whatsapp.from}}",
    },
  },
  {
    type: NodeType.OPENAI,
    label: "OpenAI",
    description: "Generate text and reason with OpenAI models",
    icon: "/openai.svg",
    initialData: {
      model: "gpt-4o-mini",
    },
  },
  {
    type: NodeType.ANTHROPIC,
    label: "Anthropic",
    description: "Generate text and analyze with Claude models",
    icon: "/anthropic.svg",
    initialData: {
      model: "claude-3-5-sonnet-latest",
    },
  },
  {
    type: NodeType.GEMINI,
    label: "Google Gemini",
    description: "Generate text and multimodal reasoning with Gemini",
    icon: "/gemini.svg",
    initialData: {
      model: "gemini-3.6-flash",
    },

  },
];

interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function NodeSelector({
  open,
  onOpenChange,
  children,
}: NodeSelectorProps) {
  const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();

  const handleNodeSelect = useCallback(
    (selection: NodeTypeOption) => {
      if (selection.type === NodeType.MANUAL_TRIGGER) {
        const nodes = getNodes();
        const hasManualTrigger = nodes.some(
          (node) => node.type === NodeType.MANUAL_TRIGGER,
        );
        if (hasManualTrigger) {
          toast.error("A workflow can only have one manual trigger.");
          return;
        }
      }
      setNodes((nodes) => {
        const hasInitialNode = nodes.some(
          (node) => node.type === NodeType.INITIAL,
        );
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const flowPosition = screenToFlowPosition({
          x: centerX + (Math.random() - 0.5) * 200,
          y: centerY + (Math.random() - 0.5) * 200,
        });

        const newNode = {
          id: createId(),
          data: selection.initialData || {},
          position: flowPosition,
          type: selection.type,
        };

        if (hasInitialNode) {
          return [newNode];
        }
        return [...nodes, newNode];
      });
      onOpenChange(false);
    },
    [getNodes, onOpenChange, screenToFlowPosition, setNodes],
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add a Node</SheetTitle>
          <SheetDescription>
            Select a trigger or action to add to your workflow.
          </SheetDescription>
        </SheetHeader>

        <div>
          {triggerNodes.map((nodeType) => {
            const Icon = nodeType.icon;
            return (
              <div
                key={nodeType.type}
                className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary"
                onClick={() => handleNodeSelect(nodeType)}
              >
                <div className="flex items-center gap-6 w-full overflow-hidden">
                  {typeof Icon === "string" ? (
                    <img
                      src={Icon}
                      alt={nodeType.label}
                      className="size-5 object-contain rounded-sm"
                    />
                  ) : (
                    <Icon className="size-5" />
                  )}
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium text-sm">
                      {nodeType.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {nodeType.description}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Separator />

        <div>
          {executionNodes.map((nodeType) => {
            const Icon = nodeType.icon;
            return (
              <div
                key={nodeType.type}
                className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary"
                onClick={() => handleNodeSelect(nodeType)}
              >
                <div className="flex items-center gap-6 w-full overflow-hidden">
                  {typeof Icon === "string" ? (
                    <img
                      src={Icon}
                      alt={nodeType.label}
                      className="size-5 object-contain rounded-sm"
                    />
                  ) : (
                    <Icon className="size-5" />
                  )}
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium text-sm">
                      {nodeType.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {nodeType.description}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}


