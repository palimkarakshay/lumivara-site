import { describe, expect, it } from "vitest";

import {
  SUGGESTION_CATEGORIES,
  categoryFromLabels,
  isSuggestion,
} from "@/lib/admin/categories";

describe("SUGGESTION_CATEGORIES", () => {
  it("includes the four canonical categories with `other` as the fallback bucket", () => {
    expect(SUGGESTION_CATEGORIES).toEqual([
      "vulnerability",
      "copy",
      "image",
      "other",
    ]);
  });
});

describe("categoryFromLabels", () => {
  it("maps each `category/<slug>` label to the matching category", () => {
    expect(categoryFromLabels(["category/vulnerability"])).toBe("vulnerability");
    expect(categoryFromLabels(["category/copy"])).toBe("copy");
    expect(categoryFromLabels(["category/image"])).toBe("image");
    expect(categoryFromLabels(["category/other"])).toBe("other");
  });

  it("is case-insensitive on the label prefix and slug", () => {
    expect(categoryFromLabels(["Category/Vulnerability"])).toBe("vulnerability");
  });

  it("falls back to `other` when no category label is present", () => {
    expect(categoryFromLabels(["client/lumivara", "suggestion"])).toBe("other");
  });

  it("falls back to `other` when the category slug is unknown", () => {
    expect(categoryFromLabels(["category/seo"])).toBe("other");
  });

  it("returns `other` for an empty label list", () => {
    expect(categoryFromLabels([])).toBe("other");
  });
});

describe("isSuggestion", () => {
  it("returns true when the `suggestion` label is present", () => {
    expect(isSuggestion(["suggestion", "client/lumivara"])).toBe(true);
  });

  it("matches case-insensitively", () => {
    expect(isSuggestion(["Suggestion"])).toBe(true);
  });

  it("returns false when no `suggestion` label is present", () => {
    expect(isSuggestion(["client/lumivara", "category/copy"])).toBe(false);
  });
});
