/**
 * Server-only GitHub **write** helpers for the admin visual editor.
 *
 * Companion to `src/lib/admin/github.ts` (read-only). The split is deliberate
 * — it keeps the read surface auditable and constrains the new write
 *   capability that issue #120 introduces:
 *
 *   - Branch creation always targets `auto/editor-*` refs, never `main`.
 *   - File PUTs are scoped to a single path the caller passes in.
 *   - PR opens never auto-merge.
 *
 * Each call degrades gracefully (returns `{ ok: false, error }`) so a missing
 * token, a 403 from a read-only PAT, or a 404 on the file never crashes the
 * page — the editor surfaces the GitHub error verbatim.
 */

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
    "Content-Type": "application/json",
  };
}

export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

/**
 * Encode a UTF-8 string to base64. Works in Node and on Vercel Edge — `btoa`
 * is unsafe with non-ASCII; this round-trips through `Buffer` when available
 * and falls back to a TextEncoder + btoa pipeline otherwise.
 */
export function toBase64Utf8(input: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(input, "utf8").toString("base64");
  }
  // Edge / browser path. Encode bytes through a binary string before btoa.
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  // eslint-disable-next-line no-restricted-globals
  return btoa(binary);
}

/** Look up the SHA of `ref` (a branch name) on the default branch's repo. */
export async function getBranchSha(ref: string): Promise<Result<string>> {
  const cfg = readConfig();
  if (!cfg) {
    return { ok: false, error: "GITHUB_REPO and GITHUB_TOKEN are required." };
  }
  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${cfg.repo}/git/ref/heads/${encodeURIComponent(ref)}`,
      { headers: authHeaders(cfg.token), cache: "no-store" },
    );
    if (!res.ok) {
      const body = await res.text();
      return { ok: false, error: `GitHub ${res.status}: ${body || res.statusText}` };
    }
    const json = (await res.json()) as { object?: { sha?: string } };
    const sha = json.object?.sha;
    if (!sha) return { ok: false, error: "Missing object.sha in ref response." };
    return { ok: true, data: sha };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

/** Look up the SHA of an existing file at `ref`. Returns `null` if 404. */
export async function getFileSha(
  path: string,
  ref: string,
): Promise<Result<string | null>> {
  const cfg = readConfig();
  if (!cfg) {
    return { ok: false, error: "GITHUB_REPO and GITHUB_TOKEN are required." };
  }
  const url = `${GITHUB_API}/repos/${cfg.repo}/contents/${encodeURI(path)}?ref=${encodeURIComponent(ref)}`;
  try {
    const res = await fetch(url, {
      headers: authHeaders(cfg.token),
      cache: "no-store",
    });
    if (res.status === 404) return { ok: true, data: null };
    if (!res.ok) {
      const body = await res.text();
      return { ok: false, error: `GitHub ${res.status}: ${body || res.statusText}` };
    }
    const json = (await res.json()) as { sha?: string };
    return { ok: true, data: json.sha ?? null };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

/** Create a new branch at the given commit SHA. */
export async function createBranch(
  branch: string,
  fromSha: string,
): Promise<Result<{ ref: string }>> {
  const cfg = readConfig();
  if (!cfg) {
    return { ok: false, error: "GITHUB_REPO and GITHUB_TOKEN are required." };
  }
  try {
    const res = await fetch(`${GITHUB_API}/repos/${cfg.repo}/git/refs`, {
      method: "POST",
      headers: authHeaders(cfg.token),
      body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: fromSha }),
    });
    if (!res.ok) {
      const body = await res.text();
      return { ok: false, error: `GitHub ${res.status}: ${body || res.statusText}` };
    }
    const json = (await res.json()) as { ref?: string };
    return { ok: true, data: { ref: json.ref ?? `refs/heads/${branch}` } };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

/**
 * Create or update a file via the Contents API.
 *
 * Pass `sha` when updating an existing file; omit when creating a new path
 * (the API will return a 422 if you guess wrong, surfaced verbatim).
 */
export async function putContents(args: {
  path: string;
  branch: string;
  message: string;
  content: string;
  sha?: string | null;
}): Promise<Result<{ commitSha: string }>> {
  const cfg = readConfig();
  if (!cfg) {
    return { ok: false, error: "GITHUB_REPO and GITHUB_TOKEN are required." };
  }
  const body: Record<string, string> = {
    message: args.message,
    content: toBase64Utf8(args.content),
    branch: args.branch,
  };
  if (args.sha) body.sha = args.sha;

  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${cfg.repo}/contents/${encodeURI(args.path)}`,
      {
        method: "PUT",
        headers: authHeaders(cfg.token),
        body: JSON.stringify(body),
      },
    );
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `GitHub ${res.status}: ${text || res.statusText}` };
    }
    const json = (await res.json()) as { commit?: { sha?: string } };
    return { ok: true, data: { commitSha: json.commit?.sha ?? "" } };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function openPullRequest(args: {
  head: string;
  base: string;
  title: string;
  body: string;
}): Promise<Result<{ number: number; htmlUrl: string }>> {
  const cfg = readConfig();
  if (!cfg) {
    return { ok: false, error: "GITHUB_REPO and GITHUB_TOKEN are required." };
  }
  try {
    const res = await fetch(`${GITHUB_API}/repos/${cfg.repo}/pulls`, {
      method: "POST",
      headers: authHeaders(cfg.token),
      body: JSON.stringify({
        title: args.title,
        body: args.body,
        head: args.head,
        base: args.base,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `GitHub ${res.status}: ${text || res.statusText}` };
    }
    const json = (await res.json()) as {
      number?: number;
      html_url?: string;
    };
    if (typeof json.number !== "number" || !json.html_url) {
      return { ok: false, error: "Malformed PR response." };
    }
    return { ok: true, data: { number: json.number, htmlUrl: json.html_url } };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

/**
 * Build a unique branch name for an editor publish. Format:
 *   `auto/editor-<slug>-<unix-seconds>`
 * — kept under GitHub's 244-char ref limit and grep-friendly in the bot fleet.
 */
export function buildEditorBranchName(slug: string, now: Date = new Date()): string {
  const safe = slug.replace(/[^a-zA-Z0-9-_]/g, "-").slice(0, 80);
  const ts = Math.floor(now.getTime() / 1000);
  return `auto/editor-${safe}-${ts}`;
}
