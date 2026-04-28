import { describe, expect, it } from "vitest";

import { signPayload, verifySignature } from "@/lib/admin/webhooks";

const SECRET = "test-secret-do-not-use-in-prod";

describe("signPayload + verifySignature", () => {
  it("verifies a freshly-signed payload", () => {
    const body = JSON.stringify({ title: "hi", body: "go" });
    const now = new Date("2026-04-28T12:00:00Z");
    const { header } = signPayload(body, SECRET, now);
    expect(verifySignature(body, header, SECRET, now)).toBe(true);
  });

  it("rejects a tampered body", () => {
    const body = JSON.stringify({ title: "hi", body: "go" });
    const now = new Date("2026-04-28T12:00:00Z");
    const { header } = signPayload(body, SECRET, now);
    expect(
      verifySignature(JSON.stringify({ title: "hi", body: "OOPS" }), header, SECRET, now),
    ).toBe(false);
  });

  it("rejects a stale signature outside the 5-minute tolerance", () => {
    const body = "{}";
    const signedAt = new Date("2026-04-28T12:00:00Z");
    const { header } = signPayload(body, SECRET, signedAt);
    const sixMinutesLater = new Date("2026-04-28T12:06:00Z");
    expect(verifySignature(body, header, SECRET, sixMinutesLater)).toBe(false);
  });

  it("rejects a wrong secret", () => {
    const body = "{}";
    const now = new Date();
    const { header } = signPayload(body, SECRET, now);
    expect(verifySignature(body, header, "different-secret", now)).toBe(false);
  });

  it("rejects a missing or malformed header", () => {
    expect(verifySignature("{}", null, SECRET)).toBe(false);
    expect(verifySignature("{}", "garbage", SECRET)).toBe(false);
  });
});
