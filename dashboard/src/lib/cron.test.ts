import { describe, expect, it } from "vitest";
import { describeCron, formatRelative, nextRun, soonestNext } from "./cron";

const utc = (iso: string) => new Date(iso);

describe("nextRun", () => {
  describe("*/N * * * * (every N minutes)", () => {
    it("rounds up to the next N-minute mark", () => {
      const now = utc("2026-04-27T10:07:30Z");
      const next = nextRun("*/30 * * * *", now)!;
      expect(next.toISOString()).toBe("2026-04-27T10:30:00.000Z");
    });
    it("when sitting exactly on a mark, returns the mark after this one", () => {
      const now = utc("2026-04-27T10:30:00Z");
      const next = nextRun("*/30 * * * *", now)!;
      expect(next.toISOString()).toBe("2026-04-27T11:00:00.000Z");
    });
    it("handles every-minute", () => {
      const now = utc("2026-04-27T10:30:15Z");
      const next = nextRun("*/1 * * * *", now)!;
      expect(next.toISOString()).toBe("2026-04-27T10:31:00.000Z");
    });
  });

  describe("M */N * * * (every N hours at minute M)", () => {
    it("matches Lumivara's every-2-hours execute schedule", () => {
      const now = utc("2026-04-27T01:30:00Z");
      const next = nextRun("0 */2 * * *", now)!;
      expect(next.toISOString()).toBe("2026-04-27T02:00:00.000Z");
    });
    it("rolls forward when past the trigger minute in the active hour", () => {
      const now = utc("2026-04-27T02:05:00Z");
      const next = nextRun("0 */2 * * *", now)!;
      expect(next.toISOString()).toBe("2026-04-27T04:00:00.000Z");
    });
  });

  describe("M H * * * (daily at HH:MM UTC)", () => {
    it("returns today if the time is still ahead", () => {
      const now = utc("2026-04-27T05:00:00Z");
      const next = nextRun("30 9 * * *", now)!;
      expect(next.toISOString()).toBe("2026-04-27T09:30:00.000Z");
    });
    it("rolls to tomorrow if today's slot has passed", () => {
      const now = utc("2026-04-27T10:00:00Z");
      const next = nextRun("30 9 * * *", now)!;
      expect(next.toISOString()).toBe("2026-04-28T09:30:00.000Z");
    });
  });

  it("returns null for unsupported cron shapes", () => {
    expect(nextRun("0 0 1 * *", utc("2026-04-27T00:00:00Z"))).toBeNull();
    expect(nextRun("garbage", utc("2026-04-27T00:00:00Z"))).toBeNull();
  });
});

describe("soonestNext", () => {
  it("picks the earliest of multiple cron expressions", () => {
    const now = utc("2026-04-27T10:00:00Z");
    const soonest = soonestNext(["0 */6 * * *", "*/30 * * * *"], now)!;
    expect(soonest.toISOString()).toBe("2026-04-27T10:30:00.000Z");
  });
  it("returns null when nothing parses", () => {
    expect(soonestNext(["bogus", "0 0 1 1 1"], utc("2026-04-27T00:00:00Z"))).toBeNull();
  });
});

describe("describeCron", () => {
  it("explains common shapes in plain English", () => {
    expect(describeCron("*/30 * * * *")).toBe("every 30 min");
    expect(describeCron("0 */2 * * *")).toBe("every 2h at :00");
    expect(describeCron("30 9 * * *")).toBe("daily at 09:30 UTC");
  });
  it("falls back to the raw expression for unknown shapes", () => {
    expect(describeCron("0 0 1 * *")).toBe("0 0 1 * *");
  });
});

describe("formatRelative", () => {
  it("formats minute / hour / day distances", () => {
    const now = utc("2026-04-27T10:00:00Z");
    expect(formatRelative(utc("2026-04-27T10:00:30Z"), now)).toBe("in 30s");
    expect(formatRelative(utc("2026-04-27T10:05:00Z"), now)).toBe("in 5 min");
    expect(formatRelative(utc("2026-04-27T13:30:00Z"), now)).toBe("in 3h 30m");
    expect(formatRelative(utc("2026-04-29T10:00:00Z"), now)).toBe("in 2d");
  });
});
