import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Card } from "@/components/admin/Card";
import { EmptyState } from "@/components/admin/EmptyState";
import { IssueCard } from "@/components/admin/IssueCard";
import { MetricTile } from "@/components/admin/MetricTile";
import { RunRow } from "@/components/admin/RunRow";
import { Section } from "@/components/admin/Section";
import { isAdminEmail } from "@/lib/admin-allowlist";
import { relativeTime } from "@/lib/admin/format";
import {
  isGithubConfigured,
  listOpenIssues,
  listRecentRuns,
  repoSlug,
} from "@/lib/admin/github";
import { statusFromLabels } from "@/lib/admin/status-map";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) {
    redirect("/admin/sign-in?from=/admin");
  }

  const configured = isGithubConfigured();
  const repo = repoSlug();

  const [issuesResult, runsResult] = await Promise.all([
    listOpenIssues({ perPage: 80 }),
    listRecentRuns(10),
  ]);

  const issues = issuesResult.ok ? issuesResult.items : [];
  const runs = runsResult.ok ? runsResult.items : [];

  // Metric calculation — kept inline because each lives on a single card.
  const inProgress = issues.filter((it) =>
    it.labels.some(
      (l) => l === "status/in-progress" || l === "status/needs-continuation",
    ),
  ).length;
  const awaitingReview = issues.filter((it) =>
    it.labels.includes("status/awaiting-review"),
  ).length;
  const blocked = issues.filter((it) =>
    it.labels.some(
      (l) => l === "status/needs-clarification" || l === "needs-client-input",
    ),
  ).length;
  const failureCount = runs.filter(
    (r) => r.conclusion === "failure" || r.conclusion === "timed_out",
  ).length;
  const lastRun = runs[0];
  const actionableIssues = issues
    .filter((it) => {
      const s = statusFromLabels(it.labels);
      return (
        s &&
        (s.tone === "blocked" || s.tone === "review" || s.tone === "progress")
      );
    })
    .slice(0, 8);

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <p className="text-caption text-muted-strong uppercase tracking-wider">
          Mothership
        </p>
        <h1 className="font-display text-display-sm text-ink">
          Automation overview
        </h1>
        <p className="text-body-sm text-ink-soft max-w-2xl">
          Every autopilot run, every blocked request, every CI signal — one
          screen. Mobile shows the four most-tapped sections; desktop adds the
          Brain controller and per-client view.
          {repo ? (
            <>
              {" "}
              Repo:{" "}
              <a
                href={`https://github.com/${repo}`}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                {repo}
              </a>
              .
            </>
          ) : null}
        </p>
      </header>

      {!configured ? (
        <Card emphasis="warning">
          <p className="font-medium text-ink">GitHub API is not configured.</p>
          <p className="text-body-sm text-ink-soft mt-1">
            Set <code className="font-mono">GITHUB_REPO</code> and{" "}
            <code className="font-mono">GITHUB_TOKEN</code> in the environment
            so the dashboard can read live data. The page still renders so the
            layout can be reviewed without credentials.
          </p>
        </Card>
      ) : null}

      <section
        aria-label="Key metrics"
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        <MetricTile
          label="In progress"
          value={inProgress}
          tone={inProgress > 0 ? "warning" : "default"}
          hint="Execute is actively building these"
        />
        <MetricTile
          label="Awaiting your review"
          value={awaitingReview}
          tone={awaitingReview > 0 ? "warning" : "default"}
          hint="Tap to test in preview"
        />
        <MetricTile
          label="Blocked on clarification"
          value={blocked}
          tone={blocked > 0 ? "failure" : "success"}
          hint="Need an answer to keep going"
        />
        <MetricTile
          label="Recent failures"
          value={failureCount}
          tone={failureCount > 0 ? "failure" : "success"}
          hint={
            lastRun
              ? `Last run ${relativeTime(lastRun.startedAt)}`
              : "No recent runs"
          }
        />
      </section>

      <Section
        eyebrow="Action queue"
        title="What needs attention"
        description="Items where you (operator) are the unblock — review, clarify, or merge."
      >
        {actionableIssues.length === 0 ? (
          <EmptyState
            title="Inbox zero."
            description="No issues are waiting on you right now. The agent will surface a card here as soon as something needs a decision."
          />
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {actionableIssues.map((issue) => (
              <IssueCard key={issue.number} issue={issue} audience="operator" />
            ))}
          </div>
        )}
      </Section>

      <Section
        eyebrow="Pipeline"
        title="Latest workflow runs"
        description="Cross-cuts triage + execute + tests + deploys. Click a row for the full GitHub log."
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
        {!runsResult.ok ? (
          <Card>
            <p className="text-body-sm text-[color:var(--error)]">
              {runsResult.error}
            </p>
          </Card>
        ) : runs.length === 0 ? (
          <EmptyState title="No runs yet." description="Trigger triage or execute to populate this list." />
        ) : (
          <Card>
            <ul className="flex flex-col">
              {runs.map((run) => (
                <RunRow key={run.id} run={run} />
              ))}
            </ul>
          </Card>
        )}
      </Section>
    </div>
  );
}
