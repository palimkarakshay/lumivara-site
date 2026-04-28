// Server-only walker over the `main` branch. Used by `/admin/deployments`
// (read) and `production-guard.ts` (assert). Given two SHAs, returns the
// first-parent chain between them with each commit's merge-PR resolved and
// its "deployable?" verdict pre-computed against the same regex Vercel's
// `ignoreCommand` uses.
//
// Why first-parent: squash merges produce one commit per PR on `main`. We
// follow that one commit, never the merged feature branch's internal
// commits — those are noise for promote tracking.

const GITHUB_API = "https://api.github.com";

type Cfg = { repo: string; token: string };

function readConfig(): Cfg | null {
  const repo = process.env.GITHUB_REPO?.trim();
  const token = process.env.GITHUB_TOKEN?.trim();
  if (!repo || !token) return null;
  if (!/^[^/]+\/[^/]+$/.test(repo)) return null;
  return { repo, token };
}

function authHeaders(token: string): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

/**
 * Mirrors the regex in `vercel.json` (`ignoreCommand`). A PR is
 * Vercel-deployable iff at least one of its files matches this. Kept here
 * as a string + RegExp so `/admin/deployments` can show it in the UI and
 * the drift watcher can use the same predicate verbatim.
 */
export const DEPLOYABLE_PATH_REGEX_SOURCE =
  "^(src/|public/|package\\.json|next\\.config|tailwind\\.config|postcss\\.config)";

const DEPLOYABLE_PATH_REGEX = new RegExp(DEPLOYABLE_PATH_REGEX_SOURCE);

export function isDeployablePath(path: string): boolean {
  return DEPLOYABLE_PATH_REGEX.test(path);
}

export type MainCommit = {
  sha: string;
  shortSha: string;
  authorLogin: string | null;
  authoredAt: string;
  /** First line of the commit message — typically `subject (#NN)`. */
  subject: string;
  /** PR number parsed out of `(#NN)` at end of subject, or null. */
  prNumber: number | null;
  /** PR title (looks up if `prNumber` is set). */
  prTitle: string | null;
  /** Linked issue number (`Closes #NN`) parsed from PR body. */
  linkedIssueNumber: number | null;
  /** True iff at least one file in the merge matches the deploy regex. */
  deployable: boolean;
  /** Files in the squash commit (truncated to first 50). */
  changedPaths: string[];
};

export type WalkResult =
  | { ok: true; commits: MainCommit[]; truncated: boolean }
  | { ok: false; error: string };

type RawCommit = {
  sha: string;
  commit: {
    author: { date: string; name: string };
    message: string;
  };
  author: { login: string } | null;
};

type RawCompare = {
  status: string;
  ahead_by: number;
  total_commits: number;
  commits: RawCommit[];
  files?: Array<{ filename: string }>;
};

type RawPull = {
  number: number;
  title: string;
  body: string | null;
  merge_commit_sha: string | null;
  state: string;
  merged: boolean;
};

const PR_SUBJECT_RE = /\(#(\d+)\)\s*$/;
const CLOSES_RE = /(?:closes|fixes|resolves)\s+#(\d+)/i;

function extractPrNumber(subject: string): number | null {
  const m = subject.match(PR_SUBJECT_RE);
  return m ? Number.parseInt(m[1], 10) : null;
}

async function fetchPullSummary(
  cfg: Cfg,
  prNumber: number,
): Promise<{ title: string; body: string } | null> {
  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${cfg.repo}/pulls/${prNumber}`,
      { headers: authHeaders(cfg.token), next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as RawPull;
    return { title: json.title, body: json.body ?? "" };
  } catch {
    return null;
  }
}

async function fetchCommitFiles(
  cfg: Cfg,
  sha: string,
): Promise<string[] | null> {
  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${cfg.repo}/commits/${sha}`,
      { headers: authHeaders(cfg.token), next: { revalidate: 600 } },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { files?: Array<{ filename: string }> };
    return (json.files ?? []).map((f) => f.filename).slice(0, 50);
  } catch {
    return null;
  }
}

/**
 * Walk first-parent commits in `(baseSha, headSha]`. `baseSha` is treated
 * as already-deployed (excluded), `headSha` is included.
 *
 * Implementation detail: we use the `compare` endpoint because it returns
 * the chain between two SHAs in one round-trip, then enrich each commit
 * sequentially. For our scale (≤30 commits between deploys typically) the
 * sequential PR fetch is fine; if it grows, switch to `Promise.allSettled`.
 */
export async function walkMainSince(
  baseSha: string,
  headRef = "main",
  opts: { maxCommits?: number } = {},
): Promise<WalkResult> {
  const cfg = readConfig();
  if (!cfg) {
    return {
      ok: false,
      error: "Set GITHUB_REPO and GITHUB_TOKEN to inspect main history.",
    };
  }
  const max = opts.maxCommits ?? 50;
  try {
    const url = `${GITHUB_API}/repos/${cfg.repo}/compare/${encodeURIComponent(baseSha)}...${encodeURIComponent(headRef)}?per_page=${max}`;
    const res = await fetch(url, {
      headers: authHeaders(cfg.token),
      cache: "no-store",
    });
    if (!res.ok) {
      return { ok: false, error: `GitHub ${res.status}: ${res.statusText}` };
    }
    const json = (await res.json()) as RawCompare;
    const truncated = json.total_commits > json.commits.length;
    const out: MainCommit[] = [];
    for (const raw of json.commits) {
      const subject = (raw.commit.message ?? "").split("\n")[0] ?? raw.sha;
      const prNumber = extractPrNumber(subject);
      const [pr, files] = await Promise.all([
        prNumber != null ? fetchPullSummary(cfg, prNumber) : Promise.resolve(null),
        fetchCommitFiles(cfg, raw.sha),
      ]);
      const paths = files ?? [];
      const linkedIssueNumber = pr?.body
        ? (pr.body.match(CLOSES_RE)?.[1]
            ? Number.parseInt(pr.body.match(CLOSES_RE)![1], 10)
            : null)
        : null;
      out.push({
        sha: raw.sha,
        shortSha: raw.sha.slice(0, 7),
        authorLogin: raw.author?.login ?? null,
        authoredAt: raw.commit.author.date,
        subject,
        prNumber,
        prTitle: pr?.title ?? null,
        linkedIssueNumber,
        deployable: paths.some(isDeployablePath),
        changedPaths: paths,
      });
    }
    // The `compare` endpoint orders oldest → newest. Reverse so consumers
    // can show "latest at the top" without re-sorting.
    out.reverse();
    return { ok: true, commits: out, truncated };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export type DriftSummary = {
  /** Latest commit on `main`. Null if walk failed. */
  headSha: string | null;
  /** Total commits between base and head. */
  totalCommits: number;
  /** Subset of `commits` that touch deployable paths. */
  deployableCommits: MainCommit[];
  /** Subset that touch only docs/scripts/workflows. */
  nonDeployableCommits: MainCommit[];
};

export function summariseDrift(commits: MainCommit[]): DriftSummary {
  return {
    headSha: commits[0]?.sha ?? null,
    totalCommits: commits.length,
    deployableCommits: commits.filter((c) => c.deployable),
    nonDeployableCommits: commits.filter((c) => !c.deployable),
  };
}
