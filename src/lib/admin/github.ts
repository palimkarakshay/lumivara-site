// Server-only GitHub helpers for the admin dashboards. Calls REST with a
// fine-grained PAT held in `GITHUB_TOKEN`. Each call degrades gracefully
// (returns `{ ok: false, error }`) so a missing token never crashes the
// page — the UI shows the configuration banner instead.
//
// IMPORTANT: never import this from a Client Component. Tokens stay
// server-side. The `dashboard/` Vite SPA shipped a PAT to the browser; the
// Next admin replaces that surface entirely.

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

export function isGithubConfigured(): boolean {
  return readConfig() !== null;
}

export function repoSlug(): string | null {
  return readConfig()?.repo ?? null;
}

export type IssueSummary = {
  number: number;
  title: string;
  htmlUrl: string;
  createdAt: string;
  updatedAt: string;
  labels: string[];
  body: string;
  /** First open PR linked through `Closes #N` semantics, if surfaced by GH. */
  pullRequest: { url: string; htmlUrl: string } | null;
};

export type ListResult<T> =
  | { ok: true; items: T[] }
  | { ok: false; error: string };

type RawIssue = {
  number: number;
  title: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  body: string | null;
  labels: Array<string | { name?: string }>;
  pull_request?: { url: string; html_url: string };
};

function normaliseLabels(raw: RawIssue["labels"]): string[] {
  return raw
    .map((l) => (typeof l === "string" ? l : l.name ?? ""))
    .filter(Boolean);
}

/** Open issues, optionally filtered by `client/<slug>`. Excludes PRs. */
export async function listOpenIssues(opts: {
  clientSlug?: string;
  perPage?: number;
} = {}): Promise<ListResult<IssueSummary>> {
  const cfg = readConfig();
  if (!cfg) {
    return {
      ok: false,
      error: "Set GITHUB_REPO and GITHUB_TOKEN to load the issue list.",
    };
  }
  const params = new URLSearchParams({
    state: "open",
    per_page: String(opts.perPage ?? 50),
    sort: "updated",
    direction: "desc",
  });
  if (opts.clientSlug) params.set("labels", `client/${opts.clientSlug}`);

  const url = `${GITHUB_API}/repos/${cfg.repo}/issues?${params.toString()}`;
  try {
    const res = await fetch(url, {
      headers: authHeaders(cfg.token),
      next: { revalidate: 30 },
    });
    if (!res.ok) {
      return { ok: false, error: `GitHub ${res.status}: ${res.statusText}` };
    }
    const json = (await res.json()) as RawIssue[];
    const items = json
      .filter((it) => !it.pull_request)
      .map<IssueSummary>((it) => ({
        number: it.number,
        title: it.title,
        htmlUrl: it.html_url,
        createdAt: it.created_at,
        updatedAt: it.updated_at,
        body: it.body ?? "",
        labels: normaliseLabels(it.labels),
        pullRequest: it.pull_request
          ? { url: it.pull_request.url, htmlUrl: it.pull_request.html_url }
          : null,
      }));
    return { ok: true, items };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export type RecentRun = {
  id: number;
  workflowFile: string;
  workflowName: string;
  htmlUrl: string;
  status: string | null;
  conclusion: string | null;
  event: string;
  actor: string;
  startedAt: string;
  displayTitle: string;
  runNumber: number;
  headBranch: string | null;
};

type RawRun = {
  id: number;
  path: string;
  name: string | null;
  html_url: string;
  status: string | null;
  conclusion: string | null;
  event: string;
  triggering_actor?: { login: string };
  actor?: { login: string };
  run_started_at?: string;
  created_at: string;
  display_title?: string;
  run_number: number;
  head_branch: string | null;
};

/** Recent runs across every workflow — for the cross-cutting monitor. */
export async function listRecentRuns(
  perPage = 15,
): Promise<ListResult<RecentRun>> {
  const cfg = readConfig();
  if (!cfg) {
    return {
      ok: false,
      error: "Set GITHUB_REPO and GITHUB_TOKEN to load run history.",
    };
  }
  const url = `${GITHUB_API}/repos/${cfg.repo}/actions/runs?per_page=${perPage}`;
  try {
    const res = await fetch(url, {
      headers: authHeaders(cfg.token),
      cache: "no-store",
    });
    if (!res.ok) {
      return { ok: false, error: `GitHub ${res.status}: ${res.statusText}` };
    }
    const json = (await res.json()) as { workflow_runs?: RawRun[] };
    const items = (json.workflow_runs ?? []).map<RecentRun>((r) => ({
      id: r.id,
      workflowFile: r.path.replace(/^.*\//, ""),
      workflowName: r.name ?? r.path,
      htmlUrl: r.html_url,
      status: r.status,
      conclusion: r.conclusion,
      event: r.event,
      actor: r.triggering_actor?.login ?? r.actor?.login ?? "unknown",
      startedAt: r.run_started_at ?? r.created_at,
      displayTitle: r.display_title ?? r.name ?? r.path,
      runNumber: r.run_number,
      headBranch: r.head_branch,
    }));
    return { ok: true, items };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export type CheckSummary = {
  workflow: string;
  workflowFile: string;
  conclusion: string | null;
  status: string | null;
  htmlUrl: string;
  startedAt: string;
};

/** Latest run per workflow file — used by the tests panel. */
export async function summariseChecks(
  workflowFiles: string[],
): Promise<ListResult<CheckSummary>> {
  const cfg = readConfig();
  if (!cfg) {
    return {
      ok: false,
      error: "Set GITHUB_REPO and GITHUB_TOKEN to load check status.",
    };
  }
  try {
    const summaries = await Promise.all(
      workflowFiles.map(async (file) => {
        const url = `${GITHUB_API}/repos/${cfg.repo}/actions/workflows/${encodeURIComponent(file)}/runs?per_page=1`;
        const res = await fetch(url, {
          headers: authHeaders(cfg.token),
          cache: "no-store",
        });
        if (!res.ok) return null;
        const json = (await res.json()) as { workflow_runs?: RawRun[] };
        const r = json.workflow_runs?.[0];
        if (!r) return null;
        return {
          workflow: r.name ?? file,
          workflowFile: file,
          conclusion: r.conclusion,
          status: r.status,
          htmlUrl: r.html_url,
          startedAt: r.run_started_at ?? r.created_at,
        } satisfies CheckSummary;
      }),
    );
    return { ok: true, items: summaries.filter((s): s is CheckSummary => !!s) };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export type IssueDetail = IssueSummary & {
  state: "open" | "closed";
  closedAt: string | null;
  /** Linked PRs surfaced through the timeline / Issues API. */
  linkedPullNumbers: number[];
};

type RawIssueDetail = RawIssue & {
  state: string;
  closed_at: string | null;
};

export type SingleResult<T> = { ok: true; item: T } | { ok: false; error: string };

export async function getIssue(
  number: number,
): Promise<SingleResult<IssueDetail>> {
  const cfg = readConfig();
  if (!cfg) {
    return { ok: false, error: "Set GITHUB_REPO and GITHUB_TOKEN to load issues." };
  }
  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${cfg.repo}/issues/${number}`,
      { headers: authHeaders(cfg.token), cache: "no-store" },
    );
    if (res.status === 404) return { ok: false, error: "Not found." };
    if (!res.ok) {
      return { ok: false, error: `GitHub ${res.status}: ${res.statusText}` };
    }
    const json = (await res.json()) as RawIssueDetail;
    const item: IssueDetail = {
      number: json.number,
      title: json.title,
      htmlUrl: json.html_url,
      createdAt: json.created_at,
      updatedAt: json.updated_at,
      body: json.body ?? "",
      labels: normaliseLabels(json.labels),
      pullRequest: json.pull_request
        ? { url: json.pull_request.url, htmlUrl: json.pull_request.html_url }
        : null,
      state: json.state === "closed" ? "closed" : "open",
      closedAt: json.closed_at,
      linkedPullNumbers: [],
    };
    return { ok: true, item };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export type IssueComment = {
  id: number;
  body: string;
  createdAt: string;
  authorLogin: string | null;
};

type RawComment = {
  id: number;
  body: string | null;
  created_at: string;
  user: { login: string } | null;
};

export async function listIssueComments(
  number: number,
  perPage = 30,
): Promise<ListResult<IssueComment>> {
  const cfg = readConfig();
  if (!cfg) {
    return { ok: false, error: "Set GITHUB_REPO and GITHUB_TOKEN to load comments." };
  }
  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${cfg.repo}/issues/${number}/comments?per_page=${perPage}&sort=created&direction=desc`,
      { headers: authHeaders(cfg.token), cache: "no-store" },
    );
    if (!res.ok) {
      return { ok: false, error: `GitHub ${res.status}: ${res.statusText}` };
    }
    const json = (await res.json()) as RawComment[];
    return {
      ok: true,
      items: json.map((c) => ({
        id: c.id,
        body: c.body ?? "",
        createdAt: c.created_at,
        authorLogin: c.user?.login ?? null,
      })),
    };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export type WorkflowDescriptor = {
  id: number;
  name: string;
  path: string;
  state: string;
};

export async function listWorkflows(): Promise<
  ListResult<WorkflowDescriptor>
> {
  const cfg = readConfig();
  if (!cfg) {
    return {
      ok: false,
      error: "Set GITHUB_REPO and GITHUB_TOKEN to load workflows.",
    };
  }
  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${cfg.repo}/actions/workflows?per_page=100`,
      { headers: authHeaders(cfg.token), cache: "no-store" },
    );
    if (!res.ok) {
      return { ok: false, error: `GitHub ${res.status}: ${res.statusText}` };
    }
    const json = (await res.json()) as {
      workflows?: WorkflowDescriptor[];
    };
    return { ok: true, items: json.workflows ?? [] };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}
