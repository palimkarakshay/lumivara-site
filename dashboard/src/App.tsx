import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, RefreshCcw, Activity } from "lucide-react";
import { AuthGate } from "./components/AuthGate";
import { ModelSwitcher } from "./components/ModelSwitcher";
import { WorkflowList } from "./components/WorkflowList";
import { WorkflowCard } from "./components/WorkflowCard";
import { LogViewer } from "./components/LogViewer";
import { ToastStack } from "./components/Toast";
import { useToasts } from "./hooks/useToasts";
import { clearPAT, loadPAT } from "./lib/auth";
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
    <Authed
      token={token}
      onSignOut={() => {
        clearPAT();
        setToken(null);
      }}
    />
  );
}

function Authed({ token, onSignOut }: { token: string; onSignOut: () => void }) {
  const octo = useMemo(() => makeClient(token), [token]);
  const qc = useQueryClient();
  const toasts = useToasts();
  const [logRun, setLogRun] = useState<WorkflowRun | null>(null);

  const runsQ = useQuery({
    queryKey: ["runs"],
    queryFn: () => listWorkflowRuns(octo, 15),
    refetchInterval: 30_000,
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

  return (
    <div className="mx-auto flex min-h-full max-w-2xl flex-col gap-4 p-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
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

      <WorkflowList
        octo={octo}
        onSuccess={toasts.success}
        onError={toasts.error}
      />

      <section className="space-y-3">
        <header className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
            Recent runs
          </h2>
          {runsQ.isFetching && (
            <span className="text-[11px] text-neutral-500">refreshing…</span>
          )}
        </header>
        {runsQ.isError && (
          <p className="text-sm text-rose-400">{explainError(runsQ.error)}</p>
        )}
        {runsQ.data?.length === 0 && (
          <p className="text-sm text-neutral-500">No runs yet.</p>
        )}
        <div className="grid grid-cols-1 gap-3">
          {runsQ.data?.map((run) => (
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
