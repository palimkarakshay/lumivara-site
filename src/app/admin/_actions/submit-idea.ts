"use server";

import { z } from "zod";

import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/admin-allowlist";
import { SIGNATURE_HEADER, signWebhookPayload } from "@/lib/webhooks";

const InputSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  body: z.string().trim().min(1, "Tell us a bit more").max(4000),
});

export type SubmitIdeaInput = z.infer<typeof InputSchema>;

export type SubmitIdeaResult =
  | { ok: true; submittedAt: string; title: string; body: string }
  | { ok: false; error: string };

const WEBHOOK_TIMEOUT_MS = 10_000;

export async function submitIdea(
  _prevState: SubmitIdeaResult | null,
  formData: FormData,
): Promise<SubmitIdeaResult> {
  const session = await auth();
  const email = session?.user?.email ?? null;
  if (!isAdminEmail(email)) {
    return { ok: false, error: "Not authorized." };
  }

  const parsed = InputSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    body: String(formData.get("body") ?? ""),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const url = process.env.N8N_INTAKE_WEBHOOK_URL;
  const secret = process.env.N8N_HMAC_SECRET;
  if (!url || !secret) {
    return {
      ok: false,
      error:
        "Intake is not configured yet. Set N8N_INTAKE_WEBHOOK_URL and N8N_HMAC_SECRET.",
    };
  }

  const payload = {
    source: "web" as const,
    submittedBy: email,
    title: parsed.data.title,
    body: parsed.data.body,
    submittedAt: new Date().toISOString(),
  };

  const { body, signature } = signWebhookPayload(payload, secret);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [SIGNATURE_HEADER]: signature,
      },
      body,
      signal: controller.signal,
    });
    if (!response.ok) {
      return {
        ok: false,
        error: `Intake webhook returned ${response.status}. Try again in a moment.`,
      };
    }
  } catch (err) {
    const reason =
      err instanceof Error && err.name === "AbortError"
        ? "Intake webhook timed out."
        : "Could not reach the intake webhook.";
    return { ok: false, error: reason };
  } finally {
    clearTimeout(timeout);
  }

  return {
    ok: true,
    submittedAt: payload.submittedAt,
    title: payload.title,
    body: payload.body,
  };
}
