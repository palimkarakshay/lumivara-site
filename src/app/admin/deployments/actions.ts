"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/admin-allowlist";
import { canAccessClient, findClient } from "@/lib/admin/clients";
import { recordDeployAttempt } from "@/lib/admin/deploy-log";
import {
  assertSafePromotion,
  type GuardReason,
} from "@/lib/admin/production-guard";
import {
  clearDeployReservation,
  deployIdempotencyKey,
  reserveDeploy,
} from "@/lib/admin/vercel";
import { dispatchDeploy } from "@/lib/admin/webhooks";

export type PromoteResult =
  | { ok: true; noop?: false; rejected?: undefined }
  | { ok: true; noop: true; rejected?: undefined }
  | { ok: true; rejected: { reason: GuardReason; message: string } }
  | { ok: false; error: string };

/**
 * Operator-initiated "promote tip of main to prod for client X". Used
 * by /admin/deployments. Same guard as the client-initiated
 * `confirmDeploy` — a privileged path is not an excuse to skip the
 * forward-only invariant.
 */
export async function promoteTipOfMain(
  clientSlug: string,
  candidateSha: string,
): Promise<PromoteResult> {
  const session = await auth();
  const email = session?.user?.email ?? null;
  if (!isAdminEmail(email)) return { ok: false, error: "Sign in first." };
  if (!canAccessClient(email, clientSlug)) {
    return { ok: false, error: "Not authorized for this client." };
  }
  const client = findClient(clientSlug);
  if (!client) return { ok: false, error: "Unknown client." };
  if (!/^[a-f0-9]{7,40}$/i.test(candidateSha)) {
    return { ok: false, error: "Candidate SHA looks malformed." };
  }
  const candidate = candidateSha.toLowerCase();

  const guard = await assertSafePromotion(candidate);
  if (!guard.ok) {
    await recordDeployAttempt({
      clientSlug,
      candidateSha: candidate,
      issueNumber: 0,
      actorEmail: email,
      outcome: "rejected",
      reason: guard.reason,
      message: guard.message,
    });
    return {
      ok: true,
      rejected: { reason: guard.reason, message: guard.message },
    };
  }
  if (guard.noop) {
    await recordDeployAttempt({
      clientSlug,
      candidateSha: candidate,
      issueNumber: 0,
      actorEmail: email,
      outcome: "noop",
      reason: "already_live",
      message: "Tip of main equals current production SHA.",
    });
    return { ok: true, noop: true };
  }

  const key = deployIdempotencyKey(clientSlug, candidate);
  if (!reserveDeploy(key)) {
    return { ok: true };
  }
  const dispatched = await dispatchDeploy({
    issueNumber: 0,
    clientSlug,
    prHeadSha: candidate,
    idempotencyKey: key,
  });
  if (!dispatched.ok) {
    clearDeployReservation(key);
    await recordDeployAttempt({
      clientSlug,
      candidateSha: candidate,
      issueNumber: 0,
      actorEmail: email,
      outcome: "dispatch_failed",
      reason: "vercel_lookup_failed",
      message: dispatched.error,
    });
    return { ok: false, error: dispatched.error };
  }
  await recordDeployAttempt({
    clientSlug,
    candidateSha: candidate,
    issueNumber: 0,
    actorEmail: email,
    outcome: "dispatched",
    reason: null,
    message: null,
  });
  revalidatePath("/admin/deployments");
  return { ok: true };
}
