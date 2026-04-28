// Thin Vercel REST wrapper. Server-only — `VERCEL_API_TOKEN` is read-only,
// scoped to the project, and never sent to the browser. We use it only
// to look up the latest preview deployment for a given PR head SHA so the
// admin "View test build" button has a real URL to open. Production
// deploys are triggered by `VERCEL_DEPLOY_HOOK_<CLIENT>` (a different
// secret with strictly more privilege) routed through n8n.

const VERCEL_API = "https://api.vercel.com";

export type VercelConfig = {
  token: string;
  projectId: string | null;
  teamId: string | null;
};

function readConfig(): VercelConfig | null {
  const token = process.env.VERCEL_API_TOKEN?.trim();
  if (!token) return null;
  return {
    token,
    projectId: process.env.VERCEL_PROJECT_ID?.trim() || null,
    teamId: process.env.VERCEL_TEAM_ID?.trim() || null,
  };
}

export function isVercelConfigured(): boolean {
  return readConfig() !== null;
}

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
}

export type VercelPreview = {
  url: string;
  /** "READY" | "BUILDING" | "ERROR" | "QUEUED" | "CANCELED". */
  state: string;
  inspectorUrl: string | null;
  createdAt: string;
};

export type VercelLookupResult =
  | { ok: true; preview: VercelPreview | null }
  | { ok: false; error: string };

type RawDeployment = {
  url: string;
  state?: string;
  readyState?: string;
  meta?: {
    githubCommitSha?: string;
    githubCommitRef?: string;
    githubPrId?: string;
  };
  inspectorUrl?: string | null;
  createdAt?: number;
  created?: number;
};

/**
 * Find the latest preview deployment that matches the given PR head SHA.
 * Falls back to matching by branch (`headBranch`) when SHA isn't surfaced.
 * Returns null when nothing matches yet (preview still building or SHA
 * mismatch).
 */
export async function findPreviewByCommit(
  prHeadSha: string,
  headBranch: string | null,
): Promise<VercelLookupResult> {
  const cfg = readConfig();
  if (!cfg) {
    return {
      ok: false,
      error: "Set VERCEL_API_TOKEN to enable preview lookups.",
    };
  }
  const params = new URLSearchParams({ limit: "20", target: "preview" });
  if (cfg.projectId) params.set("projectId", cfg.projectId);
  if (cfg.teamId) params.set("teamId", cfg.teamId);

  const url = `${VERCEL_API}/v6/deployments?${params.toString()}`;
  try {
    const res = await fetch(url, {
      headers: authHeaders(cfg.token),
      cache: "no-store",
    });
    if (!res.ok) {
      return { ok: false, error: `Vercel ${res.status}: ${res.statusText}` };
    }
    const json = (await res.json()) as { deployments?: RawDeployment[] };
    const deploys = json.deployments ?? [];

    const bySha = deploys.find(
      (d) => d.meta?.githubCommitSha?.toLowerCase() === prHeadSha.toLowerCase(),
    );
    const byBranch =
      headBranch != null
        ? deploys.find((d) => d.meta?.githubCommitRef === headBranch)
        : undefined;
    const chosen = bySha ?? byBranch ?? null;
    if (!chosen) return { ok: true, preview: null };

    const created = chosen.createdAt ?? chosen.created ?? Date.now();
    return {
      ok: true,
      preview: {
        url: chosen.url.startsWith("http") ? chosen.url : `https://${chosen.url}`,
        state: chosen.readyState ?? chosen.state ?? "UNKNOWN",
        inspectorUrl: chosen.inspectorUrl ?? null,
        createdAt: new Date(created).toISOString(),
      },
    };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export type VercelProductionDeployment = {
  /** Full https URL of the production deployment (the alias, when present). */
  url: string;
  /** READY / BUILDING / ERROR / QUEUED / CANCELED. Only READY is "live". */
  state: string;
  /** Commit SHA serving production. Lower-cased. */
  commitSha: string | null;
  /** Branch the prod deploy was built from (typically `main`). */
  commitRef: string | null;
  inspectorUrl: string | null;
  /** ISO. Useful for "live since X". */
  createdAt: string;
};

export type ProductionLookupResult =
  | { ok: true; deployment: VercelProductionDeployment | null }
  | { ok: false; error: string };

/**
 * Latest production deployment in any state (READY first if present),
 * along with parsed git metadata. Used by /admin/deployments to render the
 * "live now" card and by `production-guard.ts` to compute drift.
 *
 * We pull `limit=10` so the most recent build, even if currently failing,
 * is visible — and we always prefer the latest READY one for the canonical
 * "what's serving traffic right now" answer.
 */
export async function latestProductionDeployment(): Promise<ProductionLookupResult> {
  const cfg = readConfig();
  if (!cfg) {
    return {
      ok: false,
      error: "Set VERCEL_API_TOKEN to enable production lookups.",
    };
  }
  const params = new URLSearchParams({ limit: "10", target: "production" });
  if (cfg.projectId) params.set("projectId", cfg.projectId);
  if (cfg.teamId) params.set("teamId", cfg.teamId);

  const url = `${VERCEL_API}/v6/deployments?${params.toString()}`;
  try {
    const res = await fetch(url, {
      headers: authHeaders(cfg.token),
      cache: "no-store",
    });
    if (!res.ok) {
      return { ok: false, error: `Vercel ${res.status}: ${res.statusText}` };
    }
    const json = (await res.json()) as { deployments?: RawDeployment[] };
    const deploys = json.deployments ?? [];
    if (deploys.length === 0) return { ok: true, deployment: null };

    // Prefer latest READY; fall back to the most recent regardless of state
    // so the "live since" panel still shows something during a deploy.
    const readyOrFirst =
      deploys.find((d) => (d.readyState ?? d.state) === "READY") ?? deploys[0];
    const created = readyOrFirst.createdAt ?? readyOrFirst.created ?? Date.now();
    return {
      ok: true,
      deployment: {
        url: readyOrFirst.url.startsWith("http")
          ? readyOrFirst.url
          : `https://${readyOrFirst.url}`,
        state: readyOrFirst.readyState ?? readyOrFirst.state ?? "UNKNOWN",
        commitSha: readyOrFirst.meta?.githubCommitSha?.toLowerCase() ?? null,
        commitRef: readyOrFirst.meta?.githubCommitRef ?? null,
        inspectorUrl: readyOrFirst.inspectorUrl ?? null,
        createdAt: new Date(created).toISOString(),
      },
    };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

/**
 * Idempotency keys we use for deploy-confirm. Derived purely from the PR
 * head SHA so a second click within the same SHA collapses to the same
 * key. Stored in-memory per server instance — fine for v1; replace with
 * Redis/Edge Config if we ever need multi-region coordination.
 */
const DEPLOY_TTL_MS = 60_000;
const DEPLOY_FIRED = new Map<string, number>();

export function deployIdempotencyKey(
  clientSlug: string,
  prHeadSha: string,
): string {
  return `${clientSlug}:${prHeadSha.slice(0, 12)}`;
}

/**
 * Reserve a key. Returns true if this is the first call within the TTL,
 * false if it's a duplicate. Caller decides UX: dispatch on true, "already
 * deploying" toast on false.
 */
export function reserveDeploy(key: string, now: number = Date.now()): boolean {
  const existing = DEPLOY_FIRED.get(key);
  if (existing && now - existing < DEPLOY_TTL_MS) return false;
  DEPLOY_FIRED.set(key, now);
  // Lazy GC — drop entries older than the TTL on every reserve. Cheap.
  for (const [k, t] of DEPLOY_FIRED) {
    if (now - t > DEPLOY_TTL_MS) DEPLOY_FIRED.delete(k);
  }
  return true;
}

export function clearDeployReservation(key: string): void {
  DEPLOY_FIRED.delete(key);
}
