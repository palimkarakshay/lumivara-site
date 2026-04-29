import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Card } from "@/components/admin/Card";
import { EmptyState } from "@/components/admin/EmptyState";
import { RunStateBadge } from "@/components/admin/RunStateBadge";
import { Section } from "@/components/admin/Section";
import { isAdminEmail } from "@/lib/admin-allowlist";
import { formatUtc, relativeTime } from "@/lib/admin/format";
import {
  isGithubConfigured,
  listRecentRuns,
  repoSlug,
  summariseChecks,
  type CheckSummary,
} from "@/lib/admin/github";
import { fetchLatestWorkflowRun } from "@/lib/dashboard/github-actions";
import { loadWorkflowSchedules } from "@/lib/dashboard/workflow-schedules";

export const dynamic = "force-dynamic";

const TRIAGE_FILE = "triage.yml";
const EXECUTE_FILE = "execute.yml";

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

export default async function RunsDashboardPage() {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) {
    redirect("/admin/sign-in?from=/admin/runs");
  }

  const now = new Date();
  const [schedules, triageRun, executeRun, recent, checks] = await Promise.all([
    loadWorkflowSchedules(now),
    fetchLatestWorkflowRun(TRIAGE_FILE),
    fetchLatestWorkflowRun(EXECUTE_FILE),
    listRecentRuns(20),
    summariseChecks([TRIAGE_FILE, EXECUTE_FILE]),
  ]);

  const triageSchedule = schedules.find((s) => s.workflow === "Triage");
  const executeSchedule = schedules.find((s) => s.workflow === "Execute");
  const configured = isGithubConfigured();
  const repo = repoSlug();

  const checkByFile = new Map<string, CheckSummary>();
  if (checks.ok) {
    for (const c of checks.items) checkByFile.set(c.workflowFile, c);
  }

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <p className="text-caption text-muted-strong uppercase tracking-wider">
          Runs
        </p>
        <h1 className="font-display text-display-sm text-ink">
          Triage &amp; execute
        </h1>
        <p className="text-body-sm text-ink-soft max-w-2xl">
          Schedule, last run, and quick health check for the two workflows that
          drive the autopilot. Brain controls (default model + next-run
          override) live in <a href="/admin/brain" className="underline">Brain</a>.
        </p>
      </header>

      {!configured ? (
        <Card emphasis="warning">
          <p className="font-medium text-ink">GitHub API is not configured.</p>
          <p className="text-body-sm text-ink-soft mt-1">
            Set <code className="font-mono">GITHUB_REPO</code> and{" "}
            <code className="font-mono">GITHUB_TOKEN</code> to load run data.
            The schedule cards still work because they read{" "}
            <code className="font-mono">.github/workflows/*.yml</code> directly.
          </p>
        </Card>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-2">
        <WorkflowScheduleCard
          title="Triage"
          file={TRIAGE_FILE}
          crons={triageSchedule?.crons ?? []}
          nextRun={triageSchedule?.nextRun ?? null}
          run={triageRun}
          now={now}
        />
        <WorkflowScheduleCard
          title="Execute"
          file={EXECUTE_FILE}
          crons={executeSchedule?.crons ?? []}
          nextRun={executeSchedule?.nextRun ?? null}
          run={executeRun}
          now={now}
        />
      </section>

      <Section
        eyebrow="History"
        title="Recent runs"
        description="The last 20 runs across every workflow. Use the GitHub link to drill into job-level logs."
        action={
          repo ? (
            <a
              href={`https://github.com/${repo}/actions`}
              target="_blank"
              rel="noreferrer"
              className="text-caption underline text-ink-soft hover:text-ink"
            >
              View all on GitHub ↗
            </a>
          ) : null
        }
      >
        {!recent.ok ? (
          <Card>
            <p className="text-body-sm text-[color:var(--error)]">{recent.error}</p>
          </Card>
        ) : recent.items.length === 0 ? (
          <EmptyState title="No runs yet." />
        ) : (
          <Card>
            <ul className="flex flex-col">
              {recent.items.map((r) => (
                <li
                  key={r.id}
                  className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle py-3 last:border-b-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body-sm font-medium text-ink">
                      {r.workflowName}{" "}
                      <span className="font-mono text-muted-strong">
                        · #{r.runNumber}
                      </span>
                    </p>
                    <p className="truncate text-caption text-ink-soft">
                      {r.displayTitle}
                    </p>
                    <p className="text-caption text-muted-strong">
                      {eventLabel(r.event)} by {r.actor} ·{" "}
                      {relativeTime(r.startedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <RunStateBadge status={r.status} conclusion={r.conclusion} />
                    <a
                      href={r.htmlUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-caption underline text-ink-soft hover:text-ink"
                    >
                      logs ↗
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </Section>
    </div>
  );
}

function WorkflowScheduleCard({
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
  run: Awaited<ReturnType<typeof fetchLatestWorkflowRun>>;
  now: Date;
}) {
  return (
    <Card>
      <header className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-lg text-ink">{title}</h2>
        <code className="text-caption text-muted-strong font-mono">{file}</code>
      </header>

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
              ? `${formatUtc(nextRun)} UTC (${relativeTime(nextRun.toISOString(), now)})`
              : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-label text-muted-strong">Last run</dt>
          <dd className="text-ink mt-1">
            {!run.ok ? (
              <span className="text-[color:var(--error)]">{run.error}</span>
            ) : !run.run ? (
              <span className="text-ink-soft">No runs recorded yet.</span>
            ) : (
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-2">
                  <RunStateBadge
                    status={run.run.status}
                    conclusion={run.run.conclusion}
                  />
                  <span className="text-ink">{run.run.displayTitle}</span>
                </span>
                <span className="text-ink-soft text-caption">
                  Triggered by{" "}
                  <span className="font-medium">{run.run.actor}</span> ·{" "}
                  {formatUtc(new Date(run.run.startedAt))} UTC (
                  {relativeTime(run.run.startedAt, now)})
                </span>
                <a
                  href={run.run.htmlUrl}
                  className="text-caption underline w-fit"
                  target="_blank"
                  rel="noreferrer"
                >
                  View run #{run.run.runNumber} on GitHub ↗
                </a>
              </div>
            )}
          </dd>
        </div>
      </dl>
    </Card>
  );
}
