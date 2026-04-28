import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: "default" | "success" | "warning" | "failure";
  className?: string;
};

const VALUE_TONE: Record<NonNullable<Props["tone"]>, string> = {
  default: "text-ink",
  success: "text-[color:var(--success)]",
  warning: "text-accent-deep",
  failure: "text-[color:var(--error)]",
};

/** Compact KPI tile for the overview row of the mothership dashboard. */
export function MetricTile({
  label,
  value,
  hint,
  tone = "default",
  className,
}: Props) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border-subtle bg-canvas-elevated p-4",
        className,
      )}
    >
      <p className="text-caption text-muted-strong uppercase tracking-wider">
        {label}
      </p>
      <p className={cn("font-display text-3xl mt-1", VALUE_TONE[tone])}>
        {value}
      </p>
      {hint ? (
        <p className="text-caption text-ink-soft mt-1">{hint}</p>
      ) : null}
    </div>
  );
}
