import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/admin-allowlist";
import {
  fetchLatestWorkflowRun,
  fetchRepoVariable,
  isGithubConfigured,
  repoSlug,
  type WorkflowRunResult,
} from "@/lib/dashboard/github-actions";
import {
  DEFAULT_EXECUTE_MODEL_VAR,
  modelLabel,
} from "@/lib/dashboard/models";
import { loadWorkflowSchedules } from "@/lib/dashboard/workflow-schedules";

import { ModelForm } from "./model-form";

export const dynamic = "force-dynamic";

const TRIAGE_FILE = "triage.yml";
const EXECUTE_FILE = "execute.yml";

function formatUtc(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(date);
}

function relativeFromNow(target: Date, now: Date): string {
  const diffMs = target.getTime() - now.getTime();
  const future = diffMs >= 0;
  const abs = Math.abs(diffMs);
  const minutes = Math.round(abs / 60_000);
  if (minutes < 1) return future ? "in <1 min" : "<1 min ago";
  if (minutes < 60) return future ? `in ${minutes} min` : `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return future ? `in ${hours} h` : `${hours} h ago`;
  const days = Math.round(hours / 24);
  return future ? `in ${days} d` : `${days} d ago`;
}

function eventLabel(event: string): string {
  switch (event) {
    case "schedule":
      return "scheduled cron";
    case "workflow_dispatch":
      return "manual dispatch";
    case "issues":
      return "issue event";
    case "push":
      return "push";
    default:
      return event;
  }
}

function statusBadge(status: string | null, conclusion: string | null): string {
  if (status && status !== "completed") return status;
  return conclusion ?? "unknown";
}

export default async function RunsDashboardPage() {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) {
    redirect("/admin/sign-in?from=/admin/runs");
  }

  const now = new Date();
  const [schedules, triageRun, executeRun, modelVar] = await Promise.all([
    loadWorkflowSchedules(now),
    fetchLatestWorkflowRun(TRIAGE_FILE),
    fetchLatestWorkflowRun(EXECUTE_FILE),
    fetchRepoVariable(DEFAULT_EXECUTE_MODEL_VAR),
  ]);

  const triageSchedule = schedules.find((s) => s.workflow === "Triage");
  const executeSchedule = schedules.find((s) => s.workflow === "Execute");
  const configured = isGithubConfigured();
  const repo = repoSlug();

  const currentModel = modelVar.ok ? modelVar.value : null;
  const modelError = !modelVar.ok ? modelVar.error : null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-caption text-muted-strong uppercase tracking-wider">
          Automation
        </p>
        <h1 className="font-display text-3xl text-ink mt-1">Runs</h1>
        <p className="text-body-sm text-ink-soft mt-2">
          Schedule, last run, and the default model the next execute will use.
          {repo ? (
            <>
              {" "}
              Repo:{" "}
              <a
                href={`https://github.com/${repo}/actions`}
                className="underline"
                target="_blank"
                rel="noreferrer"
              >
                {repo}
              </a>
              .
            </>
          ) : null}
        </p>
      </div>

      {!configured ? (
        <div
          role="alert"
          className="rounded-lg border border-border-subtle bg-canvas-elevated p-4 text-body-sm text-ink"
        >
          <p className="font-medium">GitHub API is not configured.</p>
          <p className="text-ink-soft mt-1">
            Set <code>GITHUB_REPO</code> and <code>GITHUB_TOKEN</code> in the
            environment to load run history and edit the default model. The
            schedule cards below still work because they read{" "}
            <code>.github/workflows/*.yml</code> directly.
          </p>
        </div>
      ) : null}

      <WorkflowCard
        title="Triage"
        file={TRIAGE_FILE}
        crons={triageSchedule?.crons ?? []}
        nextRun={triageSchedule?.nextRun ?? null}
        run={triageRun}
        now={now}
      />

      <WorkflowCard
        title="Execute"
        file={EXECUTE_FILE}
        crons={executeSchedule?.crons ?? []}
        nextRun={executeSchedule?.nextRun ?? null}
        run={executeRun}
        now={now}
      />

      <section className="rounded-lg border border-border-subtle bg-canvas-elevated p-5">
        <h2 className="font-display text-lg text-ink">Default execute model</h2>
        <p className="text-body-sm text-ink-soft mt-1">
          Stored as the <code>{DEFAULT_EXECUTE_MODEL_VAR}</code> repository
          variable. Per-issue <code>model/*</code> labels still take precedence
          — this is the fallback when no label is set, and the override the
          operator can dispatch with.
        </p>
        <p className="text-body-sm text-ink mt-3">
          Currently:{" "}
          <span className="font-medium">{modelLabel(currentModel)}</span>
        </p>
        {modelError ? (
          <p className="text-caption text-red-700 mt-2">{modelError}</p>
        ) : null}
        <div className="mt-4">
          <ModelForm
            currentModelId={currentModel}
            disabled={!configured}
            disabledReason={
              configured
                ? undefined
                : "Configure GITHUB_REPO and GITHUB_TOKEN to enable editing."
            }
          />
        </div>
      </section>
    </div>
  );
}

function WorkflowCard({
  title,
  file,
  crons,
  nextRun,
  run,
  now,
}: {
  title: string;
  file: string;
  crons: string[];
  nextRun: Date | null;
  run: WorkflowRunResult;
  now: Date;
}) {
  return (
    <section className="rounded-lg border border-border-subtle bg-canvas-elevated p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-lg text-ink">{title}</h2>
        <code className="text-caption text-muted-strong">{file}</code>
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-3 text-body-sm">
        <div>
          <dt className="text-label text-muted-strong">Cron (UTC)</dt>
          <dd className="text-ink mt-1 font-mono">
            {crons.length === 0 ? "—" : crons.join(", ")}
          </dd>
        </div>
        <div>
          <dt className="text-label text-muted-strong">Next scheduled</dt>
          <dd className="text-ink mt-1">
            {nextRun
              ? `${formatUtc(nextRun)} UTC (${relativeFromNow(nextRun, now)})`
              : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-label text-muted-strong">Last run</dt>
          <dd className="text-ink mt-1">
            <LastRunDetails run={run} now={now} />
          </dd>
        </div>
      </dl>
    </section>
  );
}

function LastRunDetails({
  run,
  now,
}: {
  run: WorkflowRunResult;
  now: Date;
}) {
  if (!run.ok) {
    return <span className="text-red-700">{run.error}</span>;
  }
  if (!run.run) {
    return <span className="text-ink-soft">No runs recorded yet.</span>;
  }
  const r = run.run;
  const started = new Date(r.startedAt);
  return (
    <div className="flex flex-col gap-1">
      <span>
        <span className="font-medium">{statusBadge(r.status, r.conclusion)}</span>{" "}
        — {r.displayTitle}
      </span>
      <span className="text-ink-soft">
        Triggered by <span className="font-medium">{r.actor}</span> via{" "}
        {eventLabel(r.event)} · {formatUtc(started)} UTC (
        {relativeFromNow(started, now)})
      </span>
      <a
        href={r.htmlUrl}
        className="text-caption underline"
        target="_blank"
        rel="noreferrer"
      >
        View run #{r.runNumber} on GitHub →
      </a>
    </div>
  );
}
