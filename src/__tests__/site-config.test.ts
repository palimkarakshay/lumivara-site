import { describe, it, expect } from "vitest";
import { siteConfig } from "@/lib/site-config";

describe("siteConfig", () => {
  it("has a non-empty site name", () => {
    expect(siteConfig.name.length).toBeGreaterThan(0);
  });

  it("has a valid email address", () => {
    expect(siteConfig.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it("nav contains at least one entry with href and label", () => {
    expect(siteConfig.nav.length).toBeGreaterThan(0);
    for (const item of siteConfig.nav) {
      expect(item.label.length).toBeGreaterThan(0);
      expect(item.href.startsWith("/")).toBe(true);
    }
  });

  it("has a linkedin URL", () => {
    expect(siteConfig.linkedin).toMatch(/^https:\/\//);
  });

  it("engagementModes is non-empty", () => {
    expect(siteConfig.engagementModes.length).toBeGreaterThan(0);
  });
});
