"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/admin-allowlist";
import { canAccessClient, findClient } from "@/lib/admin/clients";
import { TIERS } from "@/lib/admin/tiers";
import {
  clearDeployReservation,
  deployIdempotencyKey,
  reserveDeploy,
} from "@/lib/admin/vercel";
import { dispatchDecision, dispatchDeploy } from "@/lib/admin/webhooks";

export type DecisionResult = { ok: true } | { ok: false; error: string };

export type DecisionInput =
  | { kind: "option"; optionId: string; optionLabel: string }
  | { kind: "free"; text: string };

export async function submitClientDecision(
  slug: string,
  issueNumber: number,
  decision: DecisionInput,
): Promise<DecisionResult> {
  const session = await auth();
  const email = session?.user?.email ?? null;
  if (!isAdminEmail(email)) return { ok: false, error: "Sign in first." };
  if (!canAccessClient(email, slug)) {
    return { ok: false, error: "Not authorized for this client." };
  }
  const client = findClient(slug);
  if (!client) return { ok: false, error: "Unknown client." };
  if (!Number.isInteger(issueNumber) || issueNumber <= 0) {
    return { ok: false, error: "Invalid request id." };
  }

  if (decision.kind === "option") {
    if (!/^[A-Z]$/.test(decision.optionId)) {
      return { ok: false, error: "Invalid option." };
    }
    if (decision.optionLabel.trim().length === 0) {
      return { ok: false, error: "Option missing a label." };
    }
  } else if (decision.kind === "free") {
    if (decision.text.trim().length < 2) {
      return { ok: false, error: "Add a short answer." };
    }
    if (decision.text.length > 2000) {
      return { ok: false, error: "Answer is too long." };
    }
  }

  const result = await dispatchDecision({
    issueNumber,
    clientSlug: slug,
    kind: decision.kind,
    optionId: decision.kind === "option" ? decision.optionId : null,
    optionLabel: decision.kind === "option" ? decision.optionLabel : null,
    text: decision.kind === "free" ? decision.text.trim() : null,
  });
  if (!result.ok) return result;

  revalidatePath(`/admin/client/${slug}`);
  revalidatePath(`/admin/client/${slug}/request/${issueNumber}`);
  return { ok: true };
}

export type ConfirmDeployResult =
  | { ok: true; alreadyInFlight?: boolean }
  | { ok: false; error: string };

/**
 * Phase 5 (#95): client taps "Confirm Deploy" -> we reserve an
 * idempotency key (per slug+SHA), HMAC-sign the payload, and POST to the
 * operator's deploy webhook. Tier-gated to plans where features.deployApproval
 * is true; Starter sees the preview link but can't fire the deploy.
 */
export async function confirmDeploy(
  slug: string,
  issueNumber: number,
  prHeadSha: string,
): Promise<ConfirmDeployResult> {
  const session = await auth();
  const email = session?.user?.email ?? null;
  if (!isAdminEmail(email)) return { ok: false, error: "Sign in first." };
  if (!canAccessClient(email, slug)) {
    return { ok: false, error: "Not authorized for this client." };
  }
  const client = findClient(slug);
  if (!client) return { ok: false, error: "Unknown client." };
  if (!TIERS[client.tier].features.deployApproval) {
    return {
      ok: false,
      error:
        "Your plan doesn't include client-side deploy approval. Ask the operator to upgrade the tier.",
    };
  }
  if (!Number.isInteger(issueNumber) || issueNumber <= 0) {
    return { ok: false, error: "Invalid request id." };
  }
  if (!/^[a-f0-9]{7,40}$/i.test(prHeadSha)) {
    return { ok: false, error: "Invalid PR head SHA." };
  }

  const key = deployIdempotencyKey(slug, prHeadSha);
  const reserved = reserveDeploy(key);
  if (!reserved) {
    return { ok: true, alreadyInFlight: true };
  }

  const result = await dispatchDeploy({
    issueNumber,
    clientSlug: slug,
    prHeadSha,
    idempotencyKey: key,
  });

  if (!result.ok) {
    // Free the reservation so a corrected retry isn't blocked for 60 s.
    clearDeployReservation(key);
    return result;
  }

  revalidatePath(`/admin/client/${slug}`);
  revalidatePath(`/admin/client/${slug}/preview`);
  revalidatePath(`/admin/client/${slug}/request/${issueNumber}`);
  return { ok: true };
}
