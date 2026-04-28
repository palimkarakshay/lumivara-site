// Thin wrapper around the GitHub REST endpoints we need for the runs
// dashboard. We call them server-side with a fine-grained PAT that has
// `actions: read` and `variables: read+write` scopes on the configured
// repo. Each function degrades to a typed null/error so the page can render
// without exploding when the token is missing or rate-limited.

const GITHUB_API = "https://api.github.com";

type GithubConfig = {
  repo: string; // "owner/name"
  token: string;
};

function readConfig(): GithubConfig | null {
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

export type WorkflowRun = {
  id: number;
  htmlUrl: string;
  status: string | null;
  conclusion: string | null;
  event: string;
  actor: string;
  startedAt: string;
  displayTitle: string;
  runNumber: number;
};

export type WorkflowRunResult =
  | { ok: true; run: WorkflowRun | null }
  | { ok: false; error: string };

export async function fetchLatestWorkflowRun(
  workflowFile: string,
): Promise<WorkflowRunResult> {
  const cfg = readConfig();
  if (!cfg) {
    return {
      ok: false,
      error: "Set GITHUB_REPO and GITHUB_TOKEN to load run history.",
    };
  }
  const url = `${GITHUB_API}/repos/${cfg.repo}/actions/workflows/${encodeURIComponent(
    workflowFile,
  )}/runs?per_page=1`;
  try {
    const res = await fetch(url, {
      headers: authHeaders(cfg.token),
      cache: "no-store",
    });
    if (!res.ok) {
      return { ok: false, error: `GitHub ${res.status}: ${res.statusText}` };
    }
    const json = (await res.json()) as { workflow_runs?: RawRun[] };
    const raw = json.workflow_runs?.[0];
    if (!raw) return { ok: true, run: null };
    return {
      ok: true,
      run: {
        id: raw.id,
        htmlUrl: raw.html_url,
        status: raw.status,
        conclusion: raw.conclusion,
        event: raw.event,
        actor: raw.triggering_actor?.login ?? raw.actor?.login ?? "unknown",
        startedAt: raw.run_started_at ?? raw.created_at,
        displayTitle: raw.display_title ?? raw.name ?? workflowFile,
        runNumber: raw.run_number,
      },
    };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

type RawRun = {
  id: number;
  html_url: string;
  status: string | null;
  conclusion: string | null;
  event: string;
  triggering_actor?: { login: string };
  actor?: { login: string };
  run_started_at?: string;
  created_at: string;
  display_title?: string;
  name?: string;
  run_number: number;
};

export type RepoVariableResult =
  | { ok: true; value: string | null }
  | { ok: false; error: string };

export async function fetchRepoVariable(
  name: string,
): Promise<RepoVariableResult> {
  const cfg = readConfig();
  if (!cfg) {
    return {
      ok: false,
      error: "Set GITHUB_REPO and GITHUB_TOKEN to load repository variables.",
    };
  }
  const url = `${GITHUB_API}/repos/${cfg.repo}/actions/variables/${encodeURIComponent(name)}`;
  try {
    const res = await fetch(url, {
      headers: authHeaders(cfg.token),
      cache: "no-store",
    });
    if (res.status === 404) return { ok: true, value: null };
    if (!res.ok) {
      return { ok: false, error: `GitHub ${res.status}: ${res.statusText}` };
    }
    const json = (await res.json()) as { value?: string };
    return { ok: true, value: json.value ?? null };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export type RepoVariableWriteResult =
  | { ok: true }
  | { ok: false; error: string };

export async function setRepoVariable(
  name: string,
  value: string,
): Promise<RepoVariableWriteResult> {
  const cfg = readConfig();
  if (!cfg) {
    return {
      ok: false,
      error: "GITHUB_REPO and GITHUB_TOKEN must be configured.",
    };
  }
  const headers: HeadersInit = {
    ...authHeaders(cfg.token),
    "Content-Type": "application/json",
  };
  const baseUrl = `${GITHUB_API}/repos/${cfg.repo}/actions/variables`;
  // Try PATCH first (variable exists). If 404, POST to create.
  try {
    const patch = await fetch(`${baseUrl}/${encodeURIComponent(name)}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ name, value }),
      cache: "no-store",
    });
    if (patch.status === 204) return { ok: true };
    if (patch.status !== 404) {
      return {
        ok: false,
        error: `GitHub ${patch.status}: ${patch.statusText}`,
      };
    }
    const create = await fetch(baseUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ name, value }),
      cache: "no-store",
    });
    if (create.status === 201) return { ok: true };
    return {
      ok: false,
      error: `GitHub ${create.status}: ${create.statusText}`,
    };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function deleteRepoVariable(
  name: string,
): Promise<RepoVariableWriteResult> {
  const cfg = readConfig();
  if (!cfg) {
    return {
      ok: false,
      error: "GITHUB_REPO and GITHUB_TOKEN must be configured.",
    };
  }
  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${cfg.repo}/actions/variables/${encodeURIComponent(name)}`,
      {
        method: "DELETE",
        headers: authHeaders(cfg.token),
        cache: "no-store",
      },
    );
    if (res.status === 204 || res.status === 404) return { ok: true };
    return { ok: false, error: `GitHub ${res.status}: ${res.statusText}` };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function fetchRepoVariableUpdatedAt(
  name: string,
): Promise<{ updatedAt: string } | null> {
  const cfg = readConfig();
  if (!cfg) return null;
  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${cfg.repo}/actions/variables/${encodeURIComponent(name)}`,
      { headers: authHeaders(cfg.token), cache: "no-store" },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { updated_at?: string };
    return json.updated_at ? { updatedAt: json.updated_at } : null;
  } catch {
    return null;
  }
}

export function isGithubConfigured(): boolean {
  return readConfig() !== null;
}

export function repoSlug(): string | null {
  return readConfig()?.repo ?? null;
}
