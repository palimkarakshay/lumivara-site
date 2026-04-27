import { describe, expect, it } from "vitest";
import { encodePauseSchedule, parsePauseSchedule } from "./pauseSchedule";

describe("pauseSchedule codec", () => {
  it("round-trips an until-entry", () => {
    const until = new Date("2026-04-27T08:00:00Z");
    const raw = encodePauseSchedule([
      { kind: "until", path: ".github/workflows/triage.yml", until },
    ]);
    expect(raw).toBe(
      "until=2026-04-27T08:00:00.000Z;path=.github/workflows/triage.yml",
    );
    const parsed = parsePauseSchedule(raw);
    expect(parsed).toHaveLength(1);
    expect(parsed[0]).toMatchObject({
      kind: "until",
      path: ".github/workflows/triage.yml",
    });
    expect((parsed[0] as { until: Date }).until.toISOString()).toBe(
      until.toISOString(),
    );
  });

  it("round-trips a runs-entry", () => {
    const raw = encodePauseSchedule([
      { kind: "runs", path: ".github/workflows/execute.yml", runs: 3 },
    ]);
    expect(raw).toBe("runs=3;path=.github/workflows/execute.yml");
    expect(parsePauseSchedule(raw)).toEqual([
      { kind: "runs", path: ".github/workflows/execute.yml", runs: 3 },
    ]);
  });

  it("encodes multiple entries with a pipe separator", () => {
    const until = new Date("2026-04-28T00:00:00Z");
    const raw = encodePauseSchedule([
      { kind: "until", path: "a.yml", until },
      { kind: "runs", path: "b.yml", runs: 2 },
    ]);
    expect(raw).toBe(
      "until=2026-04-28T00:00:00.000Z;path=a.yml | runs=2;path=b.yml",
    );
    expect(parsePauseSchedule(raw)).toHaveLength(2);
  });

  it("ignores malformed entries silently", () => {
    expect(parsePauseSchedule("garbage")).toEqual([]);
    expect(parsePauseSchedule("until=not-a-date;path=x.yml")).toEqual([]);
    expect(parsePauseSchedule("path=x.yml")).toEqual([]); // no until/runs
  });

  it("handles empty / null / undefined input", () => {
    expect(parsePauseSchedule("")).toEqual([]);
    expect(parsePauseSchedule(null)).toEqual([]);
    expect(parsePauseSchedule(undefined)).toEqual([]);
  });
});
