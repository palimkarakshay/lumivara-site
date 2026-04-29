import { describe, it, expect } from "vitest";
import { services, type Service } from "@/content/services";

describe("services content", () => {
  it("exports exactly 6 services", () => {
    expect(services).toHaveLength(6);
  });

  it("each service has a unique slug", () => {
    const slugs = services.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("each service has required string fields", () => {
    for (const s of services) {
      expect(s.slug.length).toBeGreaterThan(0);
      expect(s.title.length).toBeGreaterThan(0);
      expect(s.tagline.length).toBeGreaterThan(0);
      expect(s.shortDescription.length).toBeGreaterThan(0);
    }
  });

  it("each service has at least one subService", () => {
    for (const s of services) {
      expect(s.subServices.length).toBeGreaterThan(0);
    }
  });

  it("relatedSlugs references exactly 2 other service slugs", () => {
    const allSlugs = new Set(services.map((s) => s.slug));
    for (const s of services) {
      expect(s.relatedSlugs).toHaveLength(2);
      for (const related of s.relatedSlugs) {
        expect(allSlugs.has(related)).toBe(true);
        expect(related).not.toBe(s.slug);
      }
    }
  });

  it("each service has non-empty kpis array", () => {
    for (const s of services) {
      expect(s.kpis.length).toBeGreaterThan(0);
    }
  });
});
