import { describe, expect, it } from "vitest";
import { explainError, extractCrons, extractThinking } from "./github";

describe("extractThinking", () => {
  it("extracts a single block between markers", () => {
    const log = [
      "2026-04-27T10:00:00.000Z setup",
      "2026-04-27T10:00:01.000Z >>> THINKING",
      "2026-04-27T10:00:02.000Z step 1",
      "2026-04-27T10:00:03.000Z step 2",
      "2026-04-27T10:00:04.000Z <<< END THINKING",
      "2026-04-27T10:00:05.000Z teardown",
    ].join("\n");
    expect(extractThinking(log)).toEqual(["step 1\nstep 2"]);
  });
  it("extracts multiple blocks in order", () => {
    const log = [
      ">>> THINKING",
      "block A",
      "<<< END THINKING",
      "noise",
      ">>> THINKING",
      "block B",
      "<<< END THINKING",
    ].join("\n");
    expect(extractThinking(log)).toEqual(["block A", "block B"]);
  });
  it("returns [] when no markers are present", () => {
    expect(extractThinking("just regular logs\nnothing to see")).toEqual([]);
  });
});

describe("extractCrons", () => {
  it("pulls cron lines from a workflow YAML", () => {
    const yaml = `
on:
  schedule:
    - cron: '0 */2 * * *'
    - cron: "*/30 * * * *"
    - cron: 30 9 * * *
permissions:
  contents: read
`;
    expect(extractCrons(yaml)).toEqual([
      "0 */2 * * *",
      "*/30 * * * *",
      "30 9 * * *",
    ]);
  });
  it("returns [] when no schedule trigger is present", () => {
    expect(extractCrons("on:\n  push:\n    branches: [main]\n")).toEqual([]);
  });
});

describe("explainError", () => {
  it("returns rotation guidance on 401", () => {
    expect(explainError({ status: 401 })).toMatch(/Rotate your PAT/);
  });
  it("names the missing scope when a hint is provided on 403", () => {
    expect(explainError({ status: 403 }, "variables-write")).toMatch(
      /Variables/,
    );
    expect(explainError({ status: 403 }, "actions-write")).toMatch(/Actions/);
    expect(explainError({ status: 403 }, "pulls-write")).toMatch(
      /Pull requests/,
    );
  });
  it("detects secondary rate limits via the message body", () => {
    expect(
      explainError({
        status: 403,
        message: "You have exceeded a secondary rate limit",
      }),
    ).toMatch(/Rate limited/);
  });
  it("falls back to the message for non-status errors", () => {
    expect(explainError(new Error("network down"))).toBe("network down");
  });
});
