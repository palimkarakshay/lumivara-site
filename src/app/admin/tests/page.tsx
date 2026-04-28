import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Card } from "@/components/admin/Card";
import { EmptyState } from "@/components/admin/EmptyState";
import { MetricTile } from "@/components/admin/MetricTile";
import { RunStateBadge } from "@/components/admin/RunStateBadge";
import { Section } from "@/components/admin/Section";
import { isAdminEmail } from "@/lib/admin-allowlist";
import { relativeTime } from "@/lib/admin/format";
import {
  isGithubConfigured,
  listRecentRuns,
  repoSlug,
  summariseChecks,
  type CheckSummary,
} from "@/lib/admin/github";
import { runStateLabel } from "@/lib/admin/format";

export const dynamic = "force-dynamic";

/**
 * Workflows we treat as "automated test signal." Adding a workflow to this
 * list will cause it to surface in the tile grid; the order is the order it
 * appears in the UI.
 */
const TEST_WORKFLOWS: Array<{ file: string; label: string; hint: string }> = [
  { file: "ci.yml", label: "CI", hint: "Type-check + lint + unit + e2e" },
  { file: "type-check.yml", label: "Type-check", hint: "tsc --noEmit" },
  { file: "lint.yml", label: "Lint", hint: "eslint ." },
  { file: "test.yml", label: "Unit tests", hint: "vitest run" },
  { file: "e2e.yml", label: "E2E", hint: "playwright test" },
  { file: "a11y.yml", label: "Accessibility", hint: "axe-core scan" },
];

function tileToneFor(check: CheckSummary | undefined) {
  if (!check) return "default" as const;
  const { tone } = runStateLabel(check.status, check.conclusion);
  if (tone === "success") return "success" as const;
  if (tone === "failure") return "failure" as const;
  if (tone === "progress") return "warning" as const;
  return "default" as const;
}

export default async function TestsPage() {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) {
    redirect("/admin/sign-in?from=/admin/tests");
  }

  const configured = isGithubConfigured();
  const repo = repoSlug();

  const [checks, recent] = await Promise.all([
    summariseChecks(TEST_WORKFLOWS.map((w) => w.file)),
    listRecentRuns(20),
  ]);

  const byFile = new Map<string, CheckSummary>();
  if (checks.ok) for (const c of checks.items) byFile.set(c.workflowFile, c);

  const failingTestRuns = recent.ok
    ? recent.items.filter((r) => {
        if (!TEST_WORKFLOWS.some((w) => w.file === r.workflowFile)) return false;
        return r.conclusion === "failure" || r.conclusion === "timed_out";
      })
    : [];

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <p className="text-caption text-muted-strong uppercase tracking-wider">
          Tests
        </p>
        <h1 className="font-display text-display-sm text-ink">
          Automated checks
        </h1>
        <p className="text-body-sm text-ink-soft max-w-2xl">
          Every gate the autopilot has to clear before it can ship. Tiles show
          the latest run per workflow; the table at the bottom is the recent
          failure feed so regressions surface fast.
        </p>
      </header>

      {!configured ? (
        <Card emphasis="warning">
          <p className="font-medium text-ink">GitHub API is not configured.</p>
          <p className="text-body-sm text-ink-soft mt-1">
            Without a token the tile grid below is rendered with placeholders
            so the layout stays reviewable.
          </p>
        </Card>
      ) : null}

      <section
        aria-label="Test workflow tiles"
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {TEST_WORKFLOWS.map((wf) => {
          const check = byFile.get(wf.file);
          const tone = tileToneFor(check);
          return (
            <a
              key={wf.file}
              href={check?.htmlUrl ?? `https://github.com/${repo ?? ""}/actions/workflows/${wf.file}`}
              target="_blank"
              rel="noreferrer"
              className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
            >
              <MetricTile
                label={wf.label}
                tone={tone}
                value={
                  check ? (
                    <RunStateBadge
                      status={check.status}
                      conclusion={check.conclusion}
                    />
                  ) : (
                    <span className="text-muted-strong text-base">no run</span>
                  )
                }
                hint={
                  <>
                    <span className="font-mono">{wf.file}</span> ·{" "}
                    {check
                      ? relativeTime(check.startedAt)
                      : wf.hint}
                  </>
                }
              />
            </a>
          );
        })}
      </section>

      <Section
        eyebrow="Regression feed"
        title="Recent test failures"
        description="The last 20 runs filtered to test/CI workflows that ended in failure or timeout. Empty is good."
      >
        {!recent.ok ? (
          <Card>
            <p className="text-body-sm text-[color:var(--error)]">
              {recent.error}
            </p>
          </Card>
        ) : failingTestRuns.length === 0 ? (
          <EmptyState
            title="All green."
            description="No test or CI run has failed in the most recent window."
          />
        ) : (
          <Card>
            <ul className="flex flex-col">
              {failingTestRuns.map((r) => (
                <li
                  key={r.id}
                  className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle py-3 last:border-b-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body-sm font-medium text-ink">
                      {r.workflowName}
                      <span className="font-mono text-muted-strong">
                        {" "}
                        · #{r.runNumber}
                      </span>
                    </p>
                    <p className="truncate text-caption text-ink-soft">
                      {r.displayTitle}
                    </p>
                    <p className="text-caption text-muted-strong">
                      {r.event} · {r.headBranch ?? "—"} ·{" "}
                      {relativeTime(r.startedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <RunStateBadge
                      status={r.status}
                      conclusion={r.conclusion}
                    />
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
