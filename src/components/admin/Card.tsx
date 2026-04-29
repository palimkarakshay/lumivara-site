import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  /** Wrap as `<article>` for issue/run cards, `<section>` otherwise. */
  as?: "article" | "section" | "div";
  /** Subtle highlight when the card represents an action item. */
  emphasis?: "default" | "warning" | "success";
};

const EMPHASIS_CLASSES: Record<NonNullable<Props["emphasis"]>, string> = {
  default: "border-border-subtle",
  warning: "border-[color:var(--accent)]/60 ring-1 ring-[color:var(--accent)]/30",
  success:
    "border-[color:var(--success)]/40 ring-1 ring-[color:var(--success)]/20",
};

/** The single card shape used across every admin surface. */
export function Card({
  children,
  className,
  as = "section",
  emphasis = "default",
}: Props) {
  const Tag = as as "section";
  return (
    <Tag
      className={cn(
        "rounded-lg border bg-canvas-elevated p-5 shadow-xs",
        EMPHASIS_CLASSES[emphasis],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
