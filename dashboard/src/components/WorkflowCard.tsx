import { useState } from "react";
import {
  CheckCircle2,
  CircleDashed,
  CircleDot,
  ExternalLink,
  GitMerge,
  GitPullRequest,
  Loader2,
  Play,
  ScrollText,
  XCircle,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Octokit } from "@octokit/rest";
import {
  squashMergePull,
  triggerWorkflow,
  explainError,
  type Workflow,
  type WorkflowRun,
} from "../lib/github";

type Props = {
  octo: Octokit;
  run: WorkflowRun;
  workflow: Workflow | undefined;
  onViewLogs: (run: WorkflowRun) => void;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
};

export function WorkflowCard({
  octo,
  run,
  workflow,
  onViewLogs,
  onSuccess,
  onError,
}: Props) {
  const qc = useQueryClient();
  const [busy, setBusy] = useState<null | "trigger" | "merge">(null);

  const trigger = useMutation({
    mutationFn: () => {
      if (!workflow) throw new Error("Workflow definition not loaded.");
      return triggerWorkflow(octo, workflow.id, run.head_branch ?? "main");
    },
    onMutate: () => setBusy("trigger"),
    onSettled: () => {
      setBusy(null);
      qc.invalidateQueries({ queryKey: ["runs"] });
    },
    onSuccess: () => onSuccess(`Dispatched ${workflow?.name ?? "workflow"}`),
    onError: (err) => onError(`Trigger failed: ${explainError(err)}`),
  });

  const merge = useMutation({
    mutationFn: (prNumber: number) => squashMergePull(octo, prNumber),
    onMutate: () => setBusy("merge"),
    onSettled: () => setBusy(null),
    onSuccess: (_d, prNumber) => onSuccess(`Merged PR #${prNumber}`),
    onError: (err) => onError(`Merge failed: ${explainError(err)}`),
  });

  const pr = run.pull_requests[0];
  const canMerge =
    !!pr && run.event === "pull_request" && run.conclusion === "success";

  return (
    <article className="space-y-3 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
      <header className="flex items-start gap-2">
        <StatusIcon run={run} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-neutral-100">
            {run.name ?? workflow?.name ?? `Workflow ${run.workflow_id}`}
          </h3>
          <p className="truncate text-xs text-neutral-400">
            {run.display_title}
          </p>
          <p className="mt-0.5 flex items-center gap-2 text-[11px] text-neutral-500">
            <span className="rounded bg-neutral-800 px-1.5 py-0.5 font-mono">
              {run.event}
            </span>
            <span>{relativeTime(run.created_at)}</span>
            <a
              href={run.html_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-0.5 hover:text-neutral-300"
            >
              run <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </div>
      </header>

      {pr && (
        <div className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-1.5 text-xs text-neutral-300">
          <GitPullRequest className="h-3.5 w-3.5 text-sky-400" />
          <span className="font-mono text-neutral-400">#{pr.number}</span>
          <span className="truncate">{run.display_title}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => trigger.mutate()}
          disabled={!workflow || busy !== null}
          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs font-medium text-neutral-200 hover:bg-neutral-800 disabled:opacity-50"
        >
          {busy === "trigger" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Play className="h-3.5 w-3.5" />
          )}
          Run now
        </button>

        <button
          type="button"
          onClick={() => onViewLogs(run)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs font-medium text-neutral-200 hover:bg-neutral-800"
        >
          <ScrollText className="h-3.5 w-3.5" />
          Thinking
        </button>

        {canMerge && (
          <button
            type="button"
            onClick={() => merge.mutate(pr!.number)}
            disabled={busy !== null}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white shadow hover:bg-emerald-500 disabled:opacity-50"
          >
            {busy === "merge" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <GitMerge className="h-3.5 w-3.5" />
            )}
            Merge & deploy
          </button>
        )}
      </div>
    </article>
  );
}

function StatusIcon({ run }: { run: WorkflowRun }) {
  const status = run.status;
  const conclusion = run.conclusion;
  if (status === "in_progress" || status === "queued" || status === "waiting")
    return (
      <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-sky-400" />
    );
  if (conclusion === "success")
    return <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />;
  if (conclusion === "failure" || conclusion === "timed_out")
    return <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />;
  if (conclusion === "cancelled" || conclusion === "skipped")
    return <CircleDashed className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />;
  return <CircleDot className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />;
}

const RT = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
function relativeTime(iso: string): string {
  const diff = (Date.parse(iso) - Date.now()) / 1000;
  const abs = Math.abs(diff);
  if (abs < 60) return RT.format(Math.round(diff), "second");
  if (abs < 3600) return RT.format(Math.round(diff / 60), "minute");
  if (abs < 86_400) return RT.format(Math.round(diff / 3600), "hour");
  return RT.format(Math.round(diff / 86_400), "day");
}
