// HMAC-signed webhook helper for n8n intake. Server-only — pulls the secret
// from `N8N_HMAC_SECRET` and never exposes it to the client. Format:
//   X-Lumivara-Signature: t=<unix>,v1=<hex>
// The `v1` digest covers `${t}.${body}`. n8n validates by recomputing the
// same digest with its own copy of the secret and comparing in constant time.

import { createHmac, timingSafeEqual } from "node:crypto";

const HEADER_NAME = "X-Lumivara-Signature";
const SCHEME = "v1";
const TOLERANCE_SECONDS = 300; // 5 min — replay window

export type SignedRequest = {
  url: string;
  body: string;
  headers: Record<string, string>;
};

export type WebhookConfig = {
  url: string | null;
  secret: string | null;
};

export function readWebhookConfig(): WebhookConfig {
  return {
    url: process.env.N8N_INTAKE_WEBHOOK_URL?.trim() || null,
    secret: process.env.N8N_HMAC_SECRET?.trim() || null,
  };
}

export function signPayload(
  body: string,
  secret: string,
  now: Date = new Date(),
): { header: string; timestamp: number } {
  const t = Math.floor(now.getTime() / 1000);
  const digest = createHmac("sha256", secret)
    .update(`${t}.${body}`)
    .digest("hex");
  return { header: `t=${t},${SCHEME}=${digest}`, timestamp: t };
}

export function verifySignature(
  body: string,
  header: string | null,
  secret: string,
  now: Date = new Date(),
): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(
    header.split(",").map((p) => p.split("=") as [string, string]),
  );
  const t = Number(parts.t);
  const supplied = parts[SCHEME];
  if (!Number.isFinite(t) || !supplied) return false;
  if (Math.abs(Math.floor(now.getTime() / 1000) - t) > TOLERANCE_SECONDS) {
    return false;
  }
  const expected = createHmac("sha256", secret)
    .update(`${t}.${body}`)
    .digest("hex");
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(supplied, "hex");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export type IntakePayload = {
  title: string;
  body: string;
  source: "web" | "email" | "sms";
  clientSlug: string;
  /** Reply-to address: email for web/email, phone for sms. */
  replyTo: string | null;
};

export type DispatchResult =
  | { ok: true; status: number }
  | { ok: false; error: string };

/** POST a signed payload to the intake webhook. Used by `submitIdea`. */
export async function dispatchIntake(
  payload: IntakePayload,
): Promise<DispatchResult> {
  const cfg = readWebhookConfig();
  if (!cfg.url || !cfg.secret) {
    return {
      ok: false,
      error:
        "Intake is not wired up yet. Set N8N_INTAKE_WEBHOOK_URL and N8N_HMAC_SECRET.",
    };
  }
  const body = JSON.stringify(payload);
  const { header } = signPayload(body, cfg.secret);
  try {
    const res = await fetch(cfg.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [HEADER_NAME]: header,
      },
      body,
      cache: "no-store",
    });
    if (!res.ok) {
      return { ok: false, error: `n8n ${res.status}: ${res.statusText}` };
    }
    return { ok: true, status: res.status };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export const WEBHOOK_HEADER_NAME = HEADER_NAME;
