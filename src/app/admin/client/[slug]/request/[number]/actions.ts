"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/admin-allowlist";
import { canAccessClient, findClient } from "@/lib/admin/clients";
import { dispatchDecision } from "@/lib/admin/webhooks";

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
