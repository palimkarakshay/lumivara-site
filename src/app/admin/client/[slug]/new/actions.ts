"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/admin-allowlist";
import { findClient } from "@/lib/admin/clients";
import { dispatchIntake } from "@/lib/admin/webhooks";

export type SubmitResult =
  | { ok: true }
  | { ok: false; error: string };

export async function submitIdea(
  slug: string,
  formData: FormData,
): Promise<SubmitResult> {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) {
    return { ok: false, error: "Sign in first." };
  }

  const client = findClient(slug);
  if (!client) return { ok: false, error: "Unknown client." };

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (title.length < 4) {
    return { ok: false, error: "Give the request a short title (4+ chars)." };
  }
  if (body.length < 10) {
    return { ok: false, error: "Add a few details so we know what to build." };
  }

  const result = await dispatchIntake({
    title,
    body,
    source: "web",
    clientSlug: slug,
    replyTo: session?.user?.email ?? null,
  });

  if (!result.ok) return result;

  revalidatePath(`/admin/client/${slug}`);
  return { ok: true };
}
