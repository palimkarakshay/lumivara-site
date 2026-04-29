// The single chokepoint for "is it safe to push this SHA to Vercel
// production?". `confirmDeploy` calls `assertSafePromotion` before
// dispatching the deploy webhook; the drift watcher re-uses the same
// predicate to decide whether to escalate. If you're touching deploy
// behaviour, do it here — duplicating the logic anywhere else breaks
// the integrity contract documented in
// `docs/deploy/production-integrity.md`.

import { latestProductionDeployment } from "./vercel";

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
 * Reasons a promote can be rejected. The string values are stable so the
 * UI, the drift watcher, and the n8n logs can switch on them without
 * parsing prose.
 */
export type GuardReason =
  | "github_not_configured"
  | "vercel_not_configured"
  | "candidate_not_on_main"
  | "would_overwrite_newer"
  | "already_live"
  | "vercel_lookup_failed";

export type GuardVerdict =
  | {
      ok: true;
      /** Current production SHA, lower-cased. Null when no prod deploy yet. */
      currentSha: string | null;
      /** SHA we're promoting to. Lower-cased. */
      candidateSha: string;
      /** True iff candidate equals currentSha (no-op promote). */
      noop: boolean;
    }
  | { ok: false; reason: GuardReason; message: string };

type RawCompare = {
  status: "diverged" | "ahead" | "behind" | "identical";
  ahead_by: number;
  behind_by: number;
};

/**
 * Compare two refs on the GitHub `main` timeline. The first arg is the
 * "base"; the second is the "head". Returns the API verdict directly so
 * the caller can decide what to do with it.
 *
 * - `identical` — same commit.
 * - `ahead`     — head is a strict descendant of base. Promote is OK.
 * - `behind`    — base is a descendant of head. Promote would overwrite.
 * - `diverged`  — neither is an ancestor of the other (off-tree).
 */
async function compareRefs(
  cfg: Cfg,
  base: string,
  head: string,
): Promise<RawCompare | null> {
  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${cfg.repo}/compare/${encodeURIComponent(base)}...${encodeURIComponent(head)}`,
      { headers: authHeaders(cfg.token), cache: "no-store" },
    );
    if (!res.ok) return null;
    return (await res.json()) as RawCompare;
  } catch {
    return null;
  }
}

/**
 * Top-level guard. Use this in any code path that triggers a Vercel
 * production deploy.
 *
 * Verdicts:
 *   - `ok: true, noop: true`  — candidate already live, fire-and-forget OK.
 *   - `ok: true, noop: false` — safe to dispatch the deploy hook.
 *   - `ok: false`             — refuse. Surface `message` to the UI.
 */
export async function assertSafePromotion(
  candidateSha: string,
): Promise<GuardVerdict> {
  const cfg = readConfig();
  if (!cfg) {
    return {
      ok: false,
      reason: "github_not_configured",
      message:
        "GITHUB_REPO and GITHUB_TOKEN must be set so we can verify ancestry on main.",
    };
  }
  const candidate = candidateSha.toLowerCase();
  if (!/^[a-f0-9]{7,40}$/.test(candidate)) {
    return {
      ok: false,
      reason: "candidate_not_on_main",
      message: "Candidate SHA looks malformed.",
    };
  }

  // 1. Candidate must be reachable from `main`. We compare main → candidate;
  //    if status is `behind` or `identical`, candidate is on main's history.
  //    If status is `ahead` or `diverged`, candidate is NOT on main and
  //    must be refused.
  const mainToCandidate = await compareRefs(cfg, "main", candidate);
  if (!mainToCandidate) {
    return {
      ok: false,
      reason: "candidate_not_on_main",
      message:
        "Couldn't verify the candidate is on `main`. Refusing to promote.",
    };
  }
  if (
    mainToCandidate.status !== "behind" &&
    mainToCandidate.status !== "identical"
  ) {
    return {
      ok: false,
      reason: "candidate_not_on_main",
      message:
        "This change isn't on `main` yet. Merge the PR first, then promote.",
    };
  }

  // 2. Compare to current production. If we have no prod deploy yet, any
  //    candidate on main is fine.
  const prod = await latestProductionDeployment();
  if (!prod.ok) {
    return {
      ok: false,
      reason: "vercel_lookup_failed",
      message: `Couldn't read Vercel production state: ${prod.error}`,
    };
  }
  const currentSha = prod.deployment?.commitSha ?? null;
  if (!currentSha) {
    return { ok: true, currentSha: null, candidateSha: candidate, noop: false };
  }
  if (currentSha === candidate) {
    return {
      ok: true,
      currentSha,
      candidateSha: candidate,
      noop: true,
    };
  }

  // 3. Walk currentSha → candidate. If candidate is `ahead` of currentSha
  //    (i.e., candidate is a descendant), promote is forward-only: OK.
  //    Otherwise we'd be moving production *backwards*: refuse.
  const prodToCandidate = await compareRefs(cfg, currentSha, candidate);
  if (!prodToCandidate) {
    return {
      ok: false,
      reason: "vercel_lookup_failed",
      message:
        "Couldn't compare candidate to current production SHA. Refusing to promote.",
    };
  }
  if (prodToCandidate.status === "ahead") {
    return { ok: true, currentSha, candidateSha: candidate, noop: false };
  }
  if (prodToCandidate.status === "identical") {
    return { ok: true, currentSha, candidateSha: candidate, noop: true };
  }
  return {
    ok: false,
    reason: "would_overwrite_newer",
    message:
      "This change is older than what's currently live. Promoting it would overwrite newer work.",
  };
}

/**
 * Convenience helper for the drift watcher (`deploy-drift-watcher.yml`):
 * "is `main` ahead of production?". Returns the count of commits on main
 * not yet on prod, or null when we couldn't determine it.
 */
export async function commitsAheadOfProduction(): Promise<number | null> {
  const cfg = readConfig();
  if (!cfg) return null;
  const prod = await latestProductionDeployment();
  if (!prod.ok || !prod.deployment?.commitSha) return null;
  const cmp = await compareRefs(cfg, prod.deployment.commitSha, "main");
  if (!cmp) return null;
  return cmp.ahead_by;
}
