import { describe, expect, it } from "vitest";

import {
  clientSlugFromLabels,
  getStatus,
  statusFromLabels,
} from "@/lib/admin/status-map";

describe("statusFromLabels", () => {
  it("returns null when nothing matches", () => {
    expect(statusFromLabels(["priority/P2", "type/tech-site"])).toBeNull();
  });

  it("translates status/in-progress to plain English", () => {
    const s = statusFromLabels(["status/in-progress", "model/opus"]);
    expect(s?.label).toBe("Building this");
    expect(s?.tone).toBe("progress");
    expect(s?.internal).toBeUndefined();
  });

  it("uses needs-clarification copy for the legacy needs-client-input label too", () => {
    const a = statusFromLabels(["status/needs-clarification"]);
    const b = statusFromLabels(["needs-client-input"]);
    expect(a?.label).toBe(b?.label);
    expect(a?.tone).toBe("blocked");
  });

  it("flags on-hold as internal so the client view can hide it", () => {
    expect(getStatus("status/on-hold")?.internal).toBe(true);
  });

  it("respects ENTRIES order — earliest match wins", () => {
    // status/triage appears before status/awaiting-review in ENTRIES; if both
    // ever land on the same issue, triage wins (more pessimistic for UX).
    const s = statusFromLabels(["status/awaiting-review", "status/triage"]);
    expect(s?.label).toBe("Reviewing your request");
  });
});

describe("clientSlugFromLabels", () => {
  it("returns the first client/<slug> label", () => {
    expect(
      clientSlugFromLabels(["priority/P1", "client/lumivara", "type/tech-site"]),
    ).toBe("lumivara");
  });

  it("returns null when no client label exists", () => {
    expect(clientSlugFromLabels(["status/triage"])).toBeNull();
  });

  it("ignores empty client/ values", () => {
    expect(clientSlugFromLabels(["client/", "client/"])).toBeNull();
  });
});
