import { describe, expect, it } from "vitest";

import { parseAsk, parseLatestAsk } from "@/lib/admin/ask-parser";

describe("parseAsk", () => {
  it("returns null for non-[ASK] comments", () => {
    expect(parseAsk("Hi! please ship soon")).toBeNull();
    expect(parseAsk("[FYI] heads up")).toBeNull();
  });

  it("parses a free-text question (no Options:)", () => {
    const ask = parseAsk("[ASK] What's your preferred CTA copy?");
    expect(ask?.question).toBe("What's your preferred CTA copy?");
    expect(ask?.options).toEqual([]);
  });

  it("extracts A/B options", () => {
    const ask = parseAsk(
      "[ASK] Do you prefer layout A or B? Options: A) sidebar B) topnav",
    );
    expect(ask?.question).toBe("Do you prefer layout A or B?");
    expect(ask?.options).toEqual([
      { id: "A", label: "sidebar" },
      { id: "B", label: "topnav" },
    ]);
  });

  it("supports up to 6 options", () => {
    const ask = parseAsk(
      "[ASK] Pick a colour. Options: A) red B) blue C) green D) gold E) ink F) parchment",
    );
    expect(ask?.options).toHaveLength(6);
    expect(ask?.options[5]).toEqual({ id: "F", label: "parchment" });
  });

  it("ignores the case of the prefix and Options:", () => {
    const ask = parseAsk("[ask] Sure? options: A) yes B) no");
    expect(ask?.options).toEqual([
      { id: "A", label: "yes" },
      { id: "B", label: "no" },
    ]);
  });

  it("trims trailing punctuation off labels", () => {
    const ask = parseAsk("[ASK] Layout? Options: A) sidebar. B) topnav,");
    expect(ask?.options).toEqual([
      { id: "A", label: "sidebar" },
      { id: "B", label: "topnav" },
    ]);
  });

  it("dedupes repeated option ids", () => {
    const ask = parseAsk("[ASK] Pick? Options: A) one A) two");
    expect(ask?.options).toEqual([{ id: "A", label: "one" }]);
  });

  it("bounds the raw line at 2000 chars", () => {
    const long = "x".repeat(5000);
    const ask = parseAsk(`[ASK] ${long}`);
    expect(ask?.raw.length).toBe(2000);
  });
});

describe("parseLatestAsk", () => {
  it("returns null when no comment is an ASK", () => {
    expect(
      parseLatestAsk([
        { body: "looks good", createdAt: "2026-04-28T10:00:00Z" },
        { body: "[FYI] heads up", createdAt: "2026-04-28T11:00:00Z" },
      ]),
    ).toBeNull();
  });

  it("picks the newest [ASK] across mixed comments", () => {
    const latest = parseLatestAsk([
      { body: "[ASK] old?", createdAt: "2026-04-27T10:00:00Z" },
      { body: "regular note", createdAt: "2026-04-28T09:00:00Z" },
      { body: "[ASK] fresh? Options: A) yes B) no", createdAt: "2026-04-28T15:00:00Z" },
    ]);
    expect(latest?.question).toBe("fresh?");
    expect(latest?.options).toHaveLength(2);
  });
});
