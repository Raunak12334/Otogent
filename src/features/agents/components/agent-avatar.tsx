"use client";

// Local DiceBear 10 rendering (no network). Same API ai-teammates uses.
// Requires: npm i @dicebear/core @dicebear/styles
// Attribution: "Adventurer" by Lisa Wischofsky, CC BY 4.0, via DiceBear. Credit it in Terms/footer.
import { Avatar, Style } from "@dicebear/core";
import definition from "@dicebear/styles/adventurer.json";
import Image from "next/image";
import { useMemo } from "react";

const style = new Style(definition);

type Props = { seed: string; name?: string; size?: number; className?: string };

export function AgentAvatar({ seed, name = "", size = 48, className }: Props) {
    // Deterministic: same seed -> same face. Memoised because each SVG is ~14 KB.
    const src = useMemo(() => new Avatar(style, { seed }).toDataUri(), [seed]);
    return (
        <Image
            src={src}
            alt={name ? `${name} avatar` : ""}
            width={size}
            height={size}
            unoptimized
            className={`shrink-0 rounded-xl border bg-muted ${className ?? ""}`}
            style={{ width: size, height: size }}
        />
    );
}
