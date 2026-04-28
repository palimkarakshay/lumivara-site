import { describe, expect, it } from "vitest";

import {
  DEPLOYABLE_PATH_REGEX_SOURCE,
  isDeployablePath,
  summariseDrift,
  type MainCommit,
} from "@/lib/admin/main-history";

describe("isDeployablePath", () => {
  const cases: Array<[string, boolean]> = [
    ["src/app/page.tsx", true],
    ["src/lib/admin/vercel.ts", true],
    ["public/og.png", true],
    ["package.json", true],
    ["next.config.ts", true],
    ["next.config.mjs", true],
    ["tailwind.config.js", true],
    ["postcss.config.mjs", true],
    [".github/workflows/triage.yml", false],
    ["docs/deploy/RESUME.md", false],
    ["scripts/triage-prompt.md", false],
    ["dashboard/src/App.tsx", false],
    ["e2e/smoke.spec.ts", false],
    ["src/__tests__/foo.test.ts", true],
    ["package-lock.json", false],
  ];
  for (const [path, expected] of cases) {
    it(`${path} -> ${expected}`, () => {
      expect(isDeployablePath(path)).toBe(expected);
    });
  }

  it("regex source matches the vercel.json ignoreCommand source", () => {
    expect(DEPLOYABLE_PATH_REGEX_SOURCE).toBe(
      "^(src/|public/|package\\.json|next\\.config|tailwind\\.config|postcss\\.config)",
    );
  });
});

describe("summariseDrift", () => {
  const c = (over: Partial<MainCommit>): MainCommit => ({
    sha: over.sha ?? "abcdef0123456789",
    shortSha: (over.sha ?? "abcdef0").slice(0, 7),
    authorLogin: over.authorLogin ?? "alice",
    authoredAt: over.authoredAt ?? "2026-01-01T00:00:00Z",
    subject: over.subject ?? "feat: x",
    prNumber: over.prNumber ?? null,
    prTitle: over.prTitle ?? null,
    linkedIssueNumber: over.linkedIssueNumber ?? null,
    deployable: over.deployable ?? false,
    changedPaths: over.changedPaths ?? [],
  });

  it("partitions by deployable flag, keeps headSha as the first element", () => {
    const commits = [
      c({ sha: "111", deployable: true }),
      c({ sha: "222", deployable: false }),
      c({ sha: "333", deployable: true }),
    ];
    const summary = summariseDrift(commits);
    expect(summary.headSha).toBe("111");
    expect(summary.totalCommits).toBe(3);
    expect(summary.deployableCommits).toHaveLength(2);
    expect(summary.nonDeployableCommits).toHaveLength(1);
    expect(summary.deployableCommits.map((x) => x.sha)).toEqual(["111", "333"]);
  });

  it("returns null headSha when there is no drift", () => {
    expect(summariseDrift([])).toEqual({
      headSha: null,
      totalCommits: 0,
      deployableCommits: [],
      nonDeployableCommits: [],
    });
  });
});
