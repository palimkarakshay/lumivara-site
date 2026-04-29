import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Power, RefreshCcw } from "lucide-react";
import clsx from "clsx";
import type { Octokit } from "@octokit/rest";
import {
  explainError,
  listWorkflows,
  setWorkflowEnabled,
  type Workflow,
} from "../lib/github";

type Props = {
  octo: Octokit;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
};

export function WorkflowList({ octo, onSuccess, onError }: Props) {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["workflows"],
    queryFn: () => listWorkflows(octo),
  });

  const [pendingId, setPendingId] = useState<number | null>(null);

  const toggle = useMutation({
    mutationFn: ({ wf, enabled }: { wf: Workflow; enabled: boolean }) =>
      setWorkflowEnabled(octo, wf.id, enabled),
    onMutate: ({ wf }) => setPendingId(wf.id),
    onSettled: () => {
      setPendingId(null);
      qc.invalidateQueries({ queryKey: ["workflows"] });
    },
    onSuccess: (_d, { wf, enabled }) =>
      onSuccess(`${wf.name} ${enabled ? "enabled" : "paused"}`),
    onError: (err) => onError(`Toggle failed: ${explainError(err)}`),
  });

  return (
    <section className="space-y-2 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
      <header className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
          Workflows
        </h2>
        <button
          type="button"
          onClick={() => qc.invalidateQueries({ queryKey: ["workflows"] })}
          className="text-neutral-400 hover:text-neutral-200"
          aria-label="Refresh"
        >
          <RefreshCcw className="h-4 w-4" />
        </button>
      </header>

      {q.isLoading && (
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      )}
      {q.isError && (
        <p className="text-sm text-rose-400">{explainError(q.error)}</p>
      )}

      <ul className="divide-y divide-neutral-800">
        {q.data?.map((wf) => {
          const enabled = wf.state === "active";
          const busy = pendingId === wf.id;
          return (
            <li
              key={wf.id}
              className="flex items-center justify-between gap-2 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm text-neutral-200">{wf.name}</p>
                <p className="truncate text-[11px] text-neutral-500">
                  {wf.path}
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggle.mutate({ wf, enabled: !enabled })}
                disabled={busy}
                className={clsx(
                  "inline-flex items-center gap-1 rounded-md border px-2 py-1.5 text-xs",
                  enabled
                    ? "border-emerald-700/60 bg-emerald-950/40 text-emerald-300"
                    : "border-neutral-700 bg-neutral-900 text-neutral-400",
                  busy && "opacity-50",
                )}
                aria-pressed={enabled}
              >
                {busy ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Power className="h-3.5 w-3.5" />
                )}
                {enabled ? "Active" : "Paused"}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
