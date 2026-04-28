// Append-only audit log of every promote attempt. Backed by Upstash Redis
// when `KV_REST_API_URL` and `KV_REST_API_TOKEN` are set; degrades to a
// no-op (with a stderr breadcrumb) otherwise so a misconfigured preview
// never breaks the user-visible promote flow.
//
// Why a log: when an automation error or n8n outage causes a deploy to
// silently fail, we still need a per-client trail of "who clicked what,
// what reason did the guard return, did the dispatch succeed". The
// `/admin/deployments` page reads the latest 20 entries so the operator
// can resume from the last known good state — see
// `docs/deploy/RESUME.md`.

import { Redis } from "@upstash/redis";

const KEY_PREFIX = "deploy:log:";
const MAX_ENTRIES_PER_CLIENT = 200;

let cachedClient: Redis | null = null;

function client(): Redis | null {
  if (cachedClient) return cachedClient;
  const url = process.env.KV_REST_API_URL?.trim();
  const token = process.env.KV_REST_API_TOKEN?.trim();
  if (!url || !token) return null;
  cachedClient = new Redis({ url, token });
  return cachedClient;
}

export type DeployOutcome =
  | "dispatched"
  | "rejected"
  | "noop"
  | "dispatch_failed";

export type DeployAttempt = {
  clientSlug: string;
  candidateSha: string;
  issueNumber: number;
  actorEmail: string | null;
  outcome: DeployOutcome;
  /** Free-form reason or one of GuardReason values. */
  reason: string | null;
  message: string | null;
  /** ISO. Filled by `recordDeployAttempt` if the caller didn't pass one. */
  recordedAt?: string;
};

export type DeployAttemptRecord = Required<DeployAttempt>;

export async function recordDeployAttempt(
  attempt: DeployAttempt,
): Promise<void> {
  const c = client();
  if (!c) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[deploy-log] KV_REST_API_URL/TOKEN not set — attempt not recorded:",
        attempt.outcome,
        attempt.candidateSha,
      );
    }
    return;
  }
  const entry: DeployAttemptRecord = {
    ...attempt,
    recordedAt: attempt.recordedAt ?? new Date().toISOString(),
  };
  const key = `${KEY_PREFIX}${attempt.clientSlug}`;
  // LPUSH so newest is index 0; LTRIM keeps the list bounded so we don't
  // pay storage forever for an obsolete history.
  try {
    await c.lpush(key, JSON.stringify(entry));
    await c.ltrim(key, 0, MAX_ENTRIES_PER_CLIENT - 1);
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[deploy-log] write failed:", (err as Error).message);
    }
  }
}

export type DeployLogResult =
  | { ok: true; entries: DeployAttemptRecord[]; configured: boolean }
  | { ok: false; error: string; configured: boolean };

export async function readDeployLog(
  clientSlug: string,
  limit = 20,
): Promise<DeployLogResult> {
  const c = client();
  if (!c) {
    return { ok: true, entries: [], configured: false };
  }
  const key = `${KEY_PREFIX}${clientSlug}`;
  try {
    const raw = await c.lrange<string>(key, 0, Math.max(0, limit - 1));
    const entries = raw
      .map((s) => safeParse(s))
      .filter((e): e is DeployAttemptRecord => e !== null);
    return { ok: true, entries, configured: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message, configured: true };
  }
}

function safeParse(raw: string): DeployAttemptRecord | null {
  try {
    const v = JSON.parse(raw) as DeployAttemptRecord;
    if (typeof v.candidateSha !== "string") return null;
    return v;
  } catch {
    return null;
  }
}

export function isDeployLogConfigured(): boolean {
  return client() !== null;
}
