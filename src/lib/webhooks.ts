import { createHmac, timingSafeEqual } from "node:crypto";

export const SIGNATURE_HEADER = "X-Lumivara-Signature";
const MAX_AGE_SECONDS = 5 * 60;

export type SignedPayload = {
  body: string;
  signature: string;
  timestamp: number;
};

function hmac(secret: string, data: string): string {
  return createHmac("sha256", secret).update(data).digest("hex");
}

function buildSignature(timestamp: number, hex: string): string {
  return `t=${timestamp},v1=${hex}`;
}

export function signWebhookPayload(
  payload: unknown,
  secret: string,
  now: Date = new Date(),
): SignedPayload {
  if (!secret) {
    throw new Error("signWebhookPayload: secret is required");
  }
  const body = JSON.stringify(payload);
  const timestamp = Math.floor(now.getTime() / 1000);
  const digest = hmac(secret, `${timestamp}.${body}`);
  return { body, signature: buildSignature(timestamp, digest), timestamp };
}

export type SignatureVerification =
  | { ok: true; timestamp: number }
  | { ok: false; reason: "missing" | "malformed" | "stale" | "mismatch" };

export function verifyWebhookSignature(
  rawBody: string,
  header: string | null | undefined,
  secret: string,
  now: Date = new Date(),
): SignatureVerification {
  if (!secret) {
    throw new Error("verifyWebhookSignature: secret is required");
  }
  if (!header) return { ok: false, reason: "missing" };

  const parts = Object.fromEntries(
    header.split(",").map((segment) => {
      const [k, v] = segment.split("=", 2);
      return [k?.trim() ?? "", v?.trim() ?? ""];
    }),
  );
  const ts = Number(parts.t);
  const sent = parts.v1;
  if (!Number.isFinite(ts) || !sent) return { ok: false, reason: "malformed" };

  const ageSeconds = Math.abs(Math.floor(now.getTime() / 1000) - ts);
  if (ageSeconds > MAX_AGE_SECONDS) return { ok: false, reason: "stale" };

  const expected = hmac(secret, `${ts}.${rawBody}`);
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(sent, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, reason: "mismatch" };
  }
  return { ok: true, timestamp: ts };
}
