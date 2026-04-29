import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const ADMIN_EMAIL = "hello@lumivara.ca";

// Mocks. Hoisted via vi.mock so the module-under-test sees them at import time.

const authMock = vi.fn();
vi.mock("@/auth", () => ({
  auth: () => authMock(),
}));

const assertSafePromotionMock = vi.fn();
vi.mock("@/lib/admin/production-guard", () => ({
  assertSafePromotion: (...args: unknown[]) => assertSafePromotionMock(...args),
}));

const dispatchDeployMock = vi.fn();
vi.mock("@/lib/admin/webhooks", () => ({
  dispatchDeploy: (...args: unknown[]) => dispatchDeployMock(...args),
}));

const recordDeployAttemptMock = vi.fn();
vi.mock("@/lib/admin/deploy-log", () => ({
  recordDeployAttempt: (...args: unknown[]) => recordDeployAttemptMock(...args),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Now import the action under test. Must come after vi.mock calls.
import { promoteSelectedCommit } from "@/app/admin/deployments/actions";
import {
  clearDeployReservation,
  deployIdempotencyKey,
} from "@/lib/admin/vercel";

const VALID_SHA = "abcdef1234567890abcdef1234567890abcdef12";
const KEY = deployIdempotencyKey("lumivara", VALID_SHA);

beforeEach(() => {
  authMock.mockReset();
  assertSafePromotionMock.mockReset();
  dispatchDeployMock.mockReset();
  recordDeployAttemptMock.mockReset();
  // Default to admin session.
  authMock.mockResolvedValue({ user: { email: ADMIN_EMAIL } });
  // Reservation map is module-scoped; clear before each test so retries
  // don't bleed across cases.
  clearDeployReservation(KEY);
});

afterEach(() => {
  clearDeployReservation(KEY);
});

describe("promoteSelectedCommit", () => {
  it("rejects a malformed SHA before any guard call", async () => {
    const res = await promoteSelectedCommit("lumivara", "not-a-sha", 42);
    expect(res).toEqual({ ok: false, error: "Candidate SHA looks malformed." });
    expect(assertSafePromotionMock).not.toHaveBeenCalled();
    expect(dispatchDeployMock).not.toHaveBeenCalled();
  });

  it("rejects an unknown client slug", async () => {
    const res = await promoteSelectedCommit("does-not-exist", VALID_SHA, 42);
    // canAccessClient returns true for the operator on any slug, but
    // findClient still returns null — we surface the unknown-client error.
    expect(res).toEqual({ ok: false, error: "Unknown client." });
    expect(assertSafePromotionMock).not.toHaveBeenCalled();
  });

  it("rejects a non-admin email", async () => {
    authMock.mockResolvedValue({ user: { email: "stranger@example.com" } });
    const res = await promoteSelectedCommit("lumivara", VALID_SHA, 42);
    expect(res).toEqual({ ok: false, error: "Sign in first." });
    expect(assertSafePromotionMock).not.toHaveBeenCalled();
  });

  it("returns rejected with would_overwrite_newer when the guard refuses", async () => {
    assertSafePromotionMock.mockResolvedValue({
      ok: false,
      reason: "would_overwrite_newer",
      message: "older than current production",
    });
    const res = await promoteSelectedCommit("lumivara", VALID_SHA, 42);
    expect(res).toEqual({
      ok: true,
      rejected: {
        reason: "would_overwrite_newer",
        message: "older than current production",
      },
    });
    expect(dispatchDeployMock).not.toHaveBeenCalled();
    // Audit log still recorded the attempt with the issue number — important
    // because the operator needs to see *which* issue was refused.
    expect(recordDeployAttemptMock).toHaveBeenCalledWith(
      expect.objectContaining({
        issueNumber: 42,
        outcome: "rejected",
        reason: "would_overwrite_newer",
      }),
    );
  });

  it("short-circuits to noop when the candidate is already live", async () => {
    assertSafePromotionMock.mockResolvedValue({
      ok: true,
      currentSha: VALID_SHA,
      candidateSha: VALID_SHA,
      noop: true,
    });
    const res = await promoteSelectedCommit("lumivara", VALID_SHA, 42);
    expect(res).toEqual({ ok: true, noop: true });
    expect(dispatchDeployMock).not.toHaveBeenCalled();
    expect(recordDeployAttemptMock).toHaveBeenCalledWith(
      expect.objectContaining({
        issueNumber: 42,
        outcome: "noop",
        reason: "already_live",
      }),
    );
  });

  it("dispatches with the right idempotency key on the happy path and tags the audit log with the real issue number", async () => {
    assertSafePromotionMock.mockResolvedValue({
      ok: true,
      currentSha: "0".repeat(40),
      candidateSha: VALID_SHA,
      noop: false,
    });
    dispatchDeployMock.mockResolvedValue({ ok: true, status: 200 });

    const res = await promoteSelectedCommit("lumivara", VALID_SHA, 42);
    expect(res).toEqual({ ok: true });
    expect(dispatchDeployMock).toHaveBeenCalledWith({
      issueNumber: 42,
      clientSlug: "lumivara",
      prHeadSha: VALID_SHA,
      idempotencyKey: KEY,
    });
    expect(recordDeployAttemptMock).toHaveBeenCalledWith(
      expect.objectContaining({
        issueNumber: 42,
        outcome: "dispatched",
        candidateSha: VALID_SHA,
      }),
    );
  });

  it("falls back to issueNumber=0 in the audit log when caller passes 0", async () => {
    assertSafePromotionMock.mockResolvedValue({
      ok: true,
      currentSha: "0".repeat(40),
      candidateSha: VALID_SHA,
      noop: false,
    });
    dispatchDeployMock.mockResolvedValue({ ok: true, status: 200 });

    const res = await promoteSelectedCommit("lumivara", VALID_SHA, 0);
    expect(res).toEqual({ ok: true });
    expect(recordDeployAttemptMock).toHaveBeenCalledWith(
      expect.objectContaining({ issueNumber: 0, outcome: "dispatched" }),
    );
  });

  it("records dispatch_failed and surfaces the error when the webhook returns !ok", async () => {
    assertSafePromotionMock.mockResolvedValue({
      ok: true,
      currentSha: "0".repeat(40),
      candidateSha: VALID_SHA,
      noop: false,
    });
    dispatchDeployMock.mockResolvedValue({ ok: false, error: "n8n 500" });

    const res = await promoteSelectedCommit("lumivara", VALID_SHA, 42);
    expect(res).toEqual({ ok: false, error: "n8n 500" });
    expect(recordDeployAttemptMock).toHaveBeenCalledWith(
      expect.objectContaining({
        issueNumber: 42,
        outcome: "dispatch_failed",
        message: "n8n 500",
      }),
    );
  });
});
