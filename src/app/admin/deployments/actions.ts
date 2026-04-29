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

/**
 * Operator-initiated "promote one specific drift commit to prod for client
 * X". Same guard as `promoteTipOfMain`, but the operator picks the SHA from
 * a specific drift row rather than implicitly using the tip of main. Useful
 * when several issues have merged in a row and the operator wants to ship
 * (and label-track) them one at a time.
 *
 * Forward-only invariant still holds: the guard refuses any SHA that is
 * older than current production. Picking an *older* drift commit than tip
 * of main simply leaves the newer commits pending until a follow-up
 * promote — exactly what "promote selected" means here. Cherry-picking
 * out-of-order is not supported on purpose.
 */
export async function promoteSelectedCommit(
  clientSlug: string,
  candidateSha: string,
  issueNumber: number,
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
  const recordedIssueNumber = Number.isInteger(issueNumber) && issueNumber > 0
    ? issueNumber
    : 0;

  const guard = await assertSafePromotion(candidate);
  if (!guard.ok) {
    await recordDeployAttempt({
      clientSlug,
      candidateSha: candidate,
      issueNumber: recordedIssueNumber,
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
      issueNumber: recordedIssueNumber,
      actorEmail: email,
      outcome: "noop",
      reason: "already_live",
      message: "Selected commit equals current production SHA.",
    });
    return { ok: true, noop: true };
  }

  const key = deployIdempotencyKey(clientSlug, candidate);
  if (!reserveDeploy(key)) {
    return { ok: true };
  }
  const dispatched = await dispatchDeploy({
    issueNumber: recordedIssueNumber,
    clientSlug,
    prHeadSha: candidate,
    idempotencyKey: key,
  });
  if (!dispatched.ok) {
    clearDeployReservation(key);
    await recordDeployAttempt({
      clientSlug,
      candidateSha: candidate,
      issueNumber: recordedIssueNumber,
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
    issueNumber: recordedIssueNumber,
    actorEmail: email,
    outcome: "dispatched",
    reason: null,
    message: null,
  });
  revalidatePath("/admin/deployments");
  return { ok: true };
}
