import { useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  ArrowDown,
  Eye,
  EyeOff,
  Loader2,
  LogOut,
  RefreshCcw,
} from "lucide-react";
import { AuthGate } from "./components/AuthGate";
import { ModelSwitcher } from "./components/ModelSwitcher";
import { WorkflowList } from "./components/WorkflowList";
import { WorkflowCard } from "./components/WorkflowCard";
import { LogViewer } from "./components/LogViewer";
import { ToastStack } from "./components/Toast";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useToasts } from "./hooks/useToasts";
import { usePullToRefresh } from "./hooks/usePullToRefresh";
import { clearPAT, loadPAT } from "./lib/auth";
import { isRelevantWorkflow } from "./lib/config";
import {
  explainError,
  listWorkflowRuns,
  listWorkflows,
  makeClient,
  type Workflow,
  type WorkflowRun,
} from "./lib/github";

export function App() {
  const [token, setToken] = useState<string | null>(() => loadPAT());

  if (!token) return <AuthGate onAuthed={setToken} />;

  return (
    <ErrorBoundary>
      <Authed
        token={token}
        onSignOut={() => {
          clearPAT();
          setToken(null);
        }}
      />
    </ErrorBoundary>
  );
}

const STORAGE_KEY_RUNS_SHOW_ALL = "lumivara.ops.runs.showAll";

function Authed({ token, onSignOut }: { token: string; onSignOut: () => void }) {
  const octo = useMemo(() => makeClient(token), [token]);
  const qc = useQueryClient();
  const toasts = useToasts();
  const [logRun, setLogRun] = useState<WorkflowRun | null>(null);
  const [showAllRuns, setShowAllRuns] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_RUNS_SHOW_ALL) === "1";
    } catch {
      return false;
    }
  });
  const setShowAllPersist = (v: boolean) => {
    setShowAllRuns(v);
    try {
      localStorage.setItem(STORAGE_KEY_RUNS_SHOW_ALL, v ? "1" : "0");
    } catch {
      /* ignore */
    }
  };

  const runsQ = useQuery({
    queryKey: ["runs"],
    queryFn: () => listWorkflowRuns(octo, 25),
    refetchInterval: 60_000,
  });

  const workflowsQ = useQuery({
    queryKey: ["workflows"],
    queryFn: () => listWorkflows(octo),
  });

  const wfById = useMemo(() => {
    const map = new Map<number, Workflow>();
    workflowsQ.data?.forEach((w) => map.set(w.id, w));
    return map;
  }, [workflowsQ.data]);

  const visibleRuns = useMemo(() => {
    if (!runsQ.data) return [];
    if (showAllRuns) return runsQ.data;
    return runsQ.data.filter((r) => {
      const wf = wfById.get(r.workflow_id);
      // Drop runs whose workflow we know and don't care about. Keep
      // unknown-workflow runs visible so missing data doesn't hide them.
      return !wf || isRelevantWorkflow(wf.path);
    });
  }, [runsQ.data, wfById, showAllRuns]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const ptr = usePullToRefresh(containerRef.current, async () => {
    await Promise.all([
      qc.invalidateQueries({ queryKey: ["runs"] }),
      qc.invalidateQueries({ queryKey: ["workflows"] }),
      qc.invalidateQueries({ queryKey: ["var", "default"] }),
      qc.invalidateQueries({ queryKey: ["var", "override"] }),
      qc.invalidateQueries({ queryKey: ["var", "pauseSchedule"] }),
    ]);
  });

  return (
    <div
      ref={containerRef}
      className="mx-auto flex min-h-full max-w-2xl flex-col gap-4 p-3 pb-[max(1rem,env(safe-area-inset-bottom))] lg:max-w-6xl"
    >
      <PullIndicator pull={ptr.pull} refreshing={ptr.refreshing} />

      <header className="flex items-center justify-between gap-2 pt-[env(safe-area-inset-top)]">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-emerald-400" />
          <h1 className="text-base font-semibold text-neutral-100">
            AI Ops · Lumivara
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => qc.invalidateQueries()}
            aria-label="Refresh all"
            className="rounded-md p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
          >
            <RefreshCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onSignOut}
            aria-label="Sign out"
            className="rounded-md p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <ModelSwitcher
        octo={octo}
        onSuccess={toasts.success}
        onError={toasts.error}
      />

      {/* Two-column layout on lg+ — workflows on the left, runs on the
          right. Single column below 1024px. */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <WorkflowList
          octo={octo}
          onSuccess={toasts.success}
          onError={toasts.error}
        />

        <section className="space-y-3">
          <header className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
              Recent runs
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAllPersist(!showAllRuns)}
                className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-neutral-200"
                aria-pressed={showAllRuns}
              >
                {showAllRuns ? (
                  <Eye className="h-3 w-3" />
                ) : (
                  <EyeOff className="h-3 w-3" />
                )}
                {showAllRuns ? "All" : "Filtered"}
              </button>
              {runsQ.isFetching && (
                <Loader2 className="h-3 w-3 animate-spin text-neutral-500" />
              )}
            </div>
          </header>
          {runsQ.isError && (
            <p className="text-sm text-rose-400">
              {explainError(runsQ.error, "actions-read")}
            </p>
          )}
          {!runsQ.isLoading && visibleRuns.length === 0 && (
            <p className="text-sm text-neutral-500">
              {showAllRuns
                ? "No runs yet."
                : "No relevant runs. Tap 'Filtered' to show all."}
            </p>
          )}
          <div className="grid grid-cols-1 gap-3">
            {visibleRuns.map((run) => (
              <WorkflowCard
                key={run.id}
                octo={octo}
                run={run}
                workflow={wfById.get(run.workflow_id)}
                onViewLogs={setLogRun}
                onSuccess={toasts.success}
                onError={toasts.error}
              />
            ))}
          </div>
        </section>
      </div>

      {logRun && (
        <LogViewer
          octo={octo}
          runId={logRun.id}
          runTitle={logRun.display_title}
          onClose={() => setLogRun(null)}
        />
      )}

      <ToastStack toasts={toasts.toasts} onDismiss={toasts.dismiss} />
    </div>
  );
}

function PullIndicator({
  pull,
  refreshing,
}: {
  pull: number;
  refreshing: boolean;
}) {
  if (pull === 0 && !refreshing) return null;
  const visible = refreshing || pull > 0;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-30 flex justify-center"
      style={{
        transform: `translateY(${Math.min(pull, 80)}px)`,
        transition: refreshing ? "transform 200ms ease" : undefined,
        opacity: visible ? 1 : 0,
      }}
    >
      <div className="mt-2 rounded-full border border-neutral-700 bg-neutral-900/90 p-1.5 shadow">
        {refreshing ? (
          <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
        ) : (
          <ArrowDown
            className="h-4 w-4 text-neutral-400"
            style={{
              transform: `rotate(${Math.min(pull * 2.5, 180)}deg)`,
            }}
          />
        )}
      </div>
    </div>
  );
}
