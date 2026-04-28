import { describe, expect, it } from "vitest";

import {
  clearDeployReservation,
  deployIdempotencyKey,
  reserveDeploy,
} from "@/lib/admin/vercel";

describe("deployIdempotencyKey", () => {
  it("derives the same key for the same slug + SHA", () => {
    const a = deployIdempotencyKey("lumivara", "abc1234567890def");
    const b = deployIdempotencyKey("lumivara", "abc1234567890def");
    expect(a).toBe(b);
  });

  it("differs by slug", () => {
    expect(deployIdempotencyKey("lumivara", "abc1234567890def")).not.toBe(
      deployIdempotencyKey("acme", "abc1234567890def"),
    );
  });

  it("only uses the first 12 SHA chars", () => {
    expect(deployIdempotencyKey("x", "abc1234567890XXXXXXXXXX")).toBe(
      "x:abc123456789",
    );
  });
});

describe("reserveDeploy", () => {
  it("first reservation succeeds, second within TTL fails", () => {
    const key = `t1-${Date.now()}`;
    const now = Date.now();
    expect(reserveDeploy(key, now)).toBe(true);
    expect(reserveDeploy(key, now + 1000)).toBe(false);
  });

  it("succeeds again after the 60 s TTL elapses", () => {
    const key = `t2-${Date.now()}`;
    const now = Date.now();
    expect(reserveDeploy(key, now)).toBe(true);
    expect(reserveDeploy(key, now + 60_001)).toBe(true);
  });

  it("clearDeployReservation lets a corrected retry through immediately", () => {
    const key = `t3-${Date.now()}`;
    const now = Date.now();
    expect(reserveDeploy(key, now)).toBe(true);
    expect(reserveDeploy(key, now + 100)).toBe(false);
    clearDeployReservation(key);
    expect(reserveDeploy(key, now + 200)).toBe(true);
  });
});
