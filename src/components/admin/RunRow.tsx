import { RunStateBadge } from "./RunStateBadge";
import { relativeTime } from "@/lib/admin/format";
import type { RecentRun } from "@/lib/admin/github";

type Props = {
  run: RecentRun;
};

export function RunRow({ run }: Props) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle py-3 last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className="truncate text-body-sm font-medium text-ink">
          {run.workflowName}
          <span className="text-muted-strong font-mono"> · #{run.runNumber}</span>
        </p>
        <p className="truncate text-caption text-ink-soft">
          {run.displayTitle}
        </p>
        <p className="text-caption text-muted-strong">
          {run.event} by {run.actor} · {relativeTime(run.startedAt)}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <RunStateBadge status={run.status} conclusion={run.conclusion} />
        <a
          href={run.htmlUrl}
          target="_blank"
          rel="noreferrer"
          className="text-caption underline text-ink-soft hover:text-ink"
        >
          logs ↗
        </a>
      </div>
    </li>
  );
}
