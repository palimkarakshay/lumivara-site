// 5-dot pipeline visualization. Goes from "Idea" → "Triaged" → "Built" →
// "Preview" → "Live". The component is purely presentational; the
// caller decides which dot is the current one. We render it both on
// `/admin/deployments` (per-row) and in the per-issue detail page.

import { cn } from "@/lib/utils";

export type DeploymentStage =
  | "idea"
  | "triaged"
  | "built"
  | "preview"
  | "live"
  | "failed";

const ORDER: DeploymentStage[] = ["idea", "triaged", "built", "preview", "live"];

const LABELS: Record<DeploymentStage, string> = {
  idea: "Idea",
  triaged: "Triaged",
  built: "Built",
  preview: "Preview",
  live: "Live",
  failed: "Failed",
};

export function DeploymentTimeline({
  current,
  compact = false,
}: {
  current: DeploymentStage;
  compact?: boolean;
}) {
  const reachedIdx = current === "failed" ? 3 : ORDER.indexOf(current);

  return (
    <ol
      role="list"
      aria-label={`Pipeline: ${LABELS[current]}`}
      className={cn(
        "flex flex-wrap items-center",
        compact ? "gap-1" : "gap-2",
      )}
    >
      {ORDER.map((stage, idx) => {
        const reached = idx <= reachedIdx;
        const isCurrent = idx === reachedIdx && current !== "live";
        const isLive = stage === "live" && current === "live";
        const isFailed = current === "failed" && idx === 3;
        return (
          <li key={stage} className="flex items-center gap-1.5">
            <span
              aria-hidden
              className={cn(
                "block rounded-full",
                compact ? "h-1.5 w-1.5" : "h-2 w-2",
                isFailed
                  ? "bg-[color:var(--error)]"
                  : isLive
                    ? "bg-[color:var(--success)]"
                    : reached
                      ? "bg-accent"
                      : "bg-border-subtle",
                isCurrent && "animate-pulse",
              )}
            />
            {!compact ? (
              <span
                className={cn(
                  "text-caption",
                  isLive
                    ? "text-[color:var(--success)] font-medium"
                    : isFailed
                      ? "text-[color:var(--error)] font-medium"
                      : reached
                        ? "text-ink"
                        : "text-muted-strong",
                )}
              >
                {LABELS[stage]}
              </span>
            ) : null}
            {idx < ORDER.length - 1 ? (
              <span
                aria-hidden
                className={cn(
                  "block h-px",
                  compact ? "w-3" : "w-6",
                  reached ? "bg-accent/60" : "bg-border-subtle",
                )}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
