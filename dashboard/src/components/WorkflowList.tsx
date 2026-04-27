import { useMemo, useState } from "react";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Clock,
  Loader2,
  Pause,
  Play,
  RefreshCcw,
  Timer,
} from "lucide-react";
import clsx from "clsx";
import type { Octokit } from "@octokit/rest";
import {
  explainError,
  extractCrons,
  getWorkflowFileContent,
  listWorkflows,
  setWorkflowEnabled,
  type Workflow,
} from "../lib/github";
import { isRelevantWorkflow } from "../lib/config";
import { describeCron, formatRelative, soonestNext } from "../lib/cron";
import { addPause, removePause, usePauseSchedule } from "../lib/pauseSchedule";

type Props = {
  octo: Octokit;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
};

const STORAGE_KEY_SHOW_ALL = "lumivara.ops.workflows.showAll";

export function WorkflowList({ octo, onSuccess, onError }: Props) {
  const qc = useQueryClient();
  const [showAll, setShowAll] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_SHOW_ALL) === "1";
    } catch {
      return false;
    }
  });
  const setShowAllPersist = (v: boolean) => {
    setShowAll(v);
    try {
      localStorage.setItem(STORAGE_KEY_SHOW_ALL, v ? "1" : "0");
    } catch {
      /* ignore */
    }
  };

  const q = useQuery({
    queryKey: ["workflows"],
    queryFn: () => listWorkflows(octo),
  });

  const visible = useMemo(() => {
    if (!q.data) return [];
    if (showAll) return q.data;
    return q.data.filter((w) => isRelevantWorkflow(w.path));
  }, [q.data, showAll]);

  // Fetch each visible workflow's YAML once per session to extract cron
  // schedules. Cached for an hour — schedules rarely change.
  const cronQueries = useQueries({
    queries: visible.map((wf) => ({
      queryKey: ["workflow-yaml", wf.path],
      queryFn: () => getWorkflowFileContent(octo, wf.path),
      staleTime: 60 * 60 * 1000,
    })),
  });

  const pauseSchedule = usePauseSchedule(octo);

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
    onError: (err) =>
      onError(`Toggle failed: ${explainError(err, "actions-write")}`),
  });

  const setPause = useMutation({
    mutationFn: async ({
      wf,
      hours,
    }: {
      wf: Workflow;
      hours: number;
    }) => {
      // Pause now, then write a schedule entry that auto-resume.yml will
      // pick up on its next 15-min poll.
      await setWorkflowEnabled(octo, wf.id, false);
      const until = new Date(Date.now() + hours * 3600_000);
      await addPause(octo, pauseSchedule.raw, {
        path: wf.path,
        kind: "until",
        until,
      });
    },
    onMutate: ({ wf }) => setPendingId(wf.id),
    onSettled: () => {
      setPendingId(null);
      qc.invalidateQueries({ queryKey: ["workflows"] });
      pauseSchedule.invalidate();
    },
    onSuccess: (_d, { wf, hours }) =>
      onSuccess(`${wf.name} paused for ${hours}h`),
    onError: (err) =>
      onError(`Pause failed: ${explainError(err, "variables-write")}`),
  });

  const clearPause = useMutation({
    mutationFn: ({ wf }: { wf: Workflow }) =>
      removePause(octo, pauseSchedule.raw, wf.path),
    onSettled: () => pauseSchedule.invalidate(),
  });

  return (
    <section className="space-y-2 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
      <header className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
          Workflows
        </h2>
        <div className="flex items-center gap-2">
          <label className="flex cursor-pointer items-center gap-1 text-[11px] text-neutral-400">
            <input
              type="checkbox"
              checked={showAll}
              onChange={(e) => setShowAllPersist(e.target.checked)}
              className="h-3 w-3"
            />
            Show all
          </label>
          <button
            type="button"
            onClick={() => qc.invalidateQueries({ queryKey: ["workflows"] })}
            className="text-neutral-400 hover:text-neutral-200"
            aria-label="Refresh"
          >
            <RefreshCcw className="h-4 w-4" />
          </button>
        </div>
      </header>

      {q.isLoading && (
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      )}
      {q.isError && (
        <p className="text-sm text-rose-400">
          {explainError(q.error, "actions-read")}
        </p>
      )}
      {!q.isLoading && visible.length === 0 && (
        <p className="text-sm text-neutral-500">
          No relevant workflows. Toggle "Show all" to see the rest.
        </p>
      )}

      <ul className="divide-y divide-neutral-800">
        {visible.map((wf, i) => {
          const enabled = wf.state === "active";
          const busy = pendingId === wf.id || setPause.isPending;
          const yaml = cronQueries[i]?.data;
          const crons = yaml ? extractCrons(yaml) : [];
          const next = crons.length ? soonestNext(crons) : null;
          const pause = pauseSchedule.byPath.get(wf.path);
          return (
            <li key={wf.id} className="space-y-1.5 py-2">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm text-neutral-200">{wf.name}</p>
                  <p className="truncate text-[11px] text-neutral-500">
                    {wf.path}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <PauseDurationButton
                    disabled={busy}
                    onPick={(hours) => setPause.mutate({ wf, hours })}
                  />
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
                    {busy && pendingId === wf.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : enabled ? (
                      <Play className="h-3.5 w-3.5" />
                    ) : (
                      <Pause className="h-3.5 w-3.5" />
                    )}
                    {enabled ? "Active" : "Paused"}
                  </button>
                </div>
              </div>

              {/* Schedule + pause meta line */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pl-0 text-[11px] text-neutral-500">
                {enabled && next && (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> next{" "}
                    <span className="text-neutral-300">
                      {formatRelative(next)}
                    </span>
                    <span className="text-neutral-600">
                      ({describeCron(crons[0])})
                    </span>
                  </span>
                )}
                {enabled && !next && crons.length > 0 && (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {crons[0]}
                  </span>
                )}
                {!enabled && pause && (
                  <span className="inline-flex items-center gap-1 text-amber-400">
                    <Timer className="h-3 w-3" /> auto-resume{" "}
                    {pause.kind === "until"
                      ? formatRelative(pause.until!)
                      : `after ${pause.runs} runs`}
                    <button
                      type="button"
                      onClick={() => clearPause.mutate({ wf })}
                      className="ml-1 rounded border border-amber-700/40 px-1 text-[10px] text-amber-300 hover:bg-amber-950/40"
                    >
                      cancel
                    </button>
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function PauseDurationButton({
  disabled,
  onPick,
}: {
  disabled: boolean;
  onPick: (hours: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const presets = [
    { label: "1h", h: 1 },
    { label: "4h", h: 4 },
    { label: "1d", h: 24 },
    { label: "1w", h: 24 * 7 },
  ];
  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 rounded-md border border-neutral-700 px-2 py-1.5 text-[11px] text-neutral-300 hover:bg-neutral-800 disabled:opacity-50"
        aria-label="Pause for duration"
      >
        <Timer className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-1 flex flex-col gap-1 rounded-lg border border-neutral-700 bg-neutral-950 p-1 shadow-xl"
        >
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setOpen(false);
                onPick(p.h);
              }}
              className="rounded px-3 py-1.5 text-left text-xs text-neutral-200 hover:bg-neutral-800"
            >
              Pause {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
