import { describe, it, expect } from "vitest";

import { nextRun, parseCron } from "@/lib/dashboard/cron";

describe("parseCron + nextRun", () => {
  it("expands every-30-minutes correctly", () => {
    const parsed = parseCron("*/30 * * * *");
    expect([...parsed.minutes].sort((a, b) => a - b)).toEqual([0, 30]);
  });

  it("computes next */30 fire from a non-aligned moment (UTC)", () => {
    const parsed = parseCron("*/30 * * * *");
    const from = new Date(Date.UTC(2025, 0, 1, 12, 17, 30));
    const next = nextRun(parsed, from);
    expect(next.toISOString()).toBe("2025-01-01T12:30:00.000Z");
  });

  it("rolls forward to the next hour when minute already passed", () => {
    const parsed = parseCron("*/30 * * * *");
    const from = new Date(Date.UTC(2025, 0, 1, 12, 45, 0));
    expect(nextRun(parsed, from).toISOString()).toBe(
      "2025-01-01T13:00:00.000Z",
    );
  });

  it("handles `0 */2 * * *` (every even hour at minute 0)", () => {
    const parsed = parseCron("0 */2 * * *");
    const from = new Date(Date.UTC(2025, 0, 1, 9, 5, 0));
    expect(nextRun(parsed, from).toISOString()).toBe(
      "2025-01-01T10:00:00.000Z",
    );
  });

  it("rolls past midnight when needed", () => {
    const parsed = parseCron("0 */2 * * *");
    const from = new Date(Date.UTC(2025, 0, 1, 23, 30, 0));
    expect(nextRun(parsed, from).toISOString()).toBe(
      "2025-01-02T00:00:00.000Z",
    );
  });

  it("rejects malformed expressions", () => {
    expect(() => parseCron("not a cron")).toThrow();
    expect(() => parseCron("*/0 * * * *")).toThrow();
  });
});
