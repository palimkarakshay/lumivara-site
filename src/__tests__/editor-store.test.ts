import { beforeEach, describe, expect, it } from "vitest";

import {
  __resetDraftStoreForTests,
  clearDraft,
  getDraft,
  setDraft,
} from "@/lib/admin/editor-store";

const FRONTMATTER = {
  title: "Test article",
  excerpt: "One sentence.",
  category: "perspective",
  publishedDate: "2026-05-01",
  readingTime: "3 min",
};

beforeEach(() => {
  __resetDraftStoreForTests();
});

describe("editor-store", () => {
  it("returns null when no draft exists", () => {
    expect(getDraft("hello@lumivara.ca", "any-slug")).toBeNull();
  });

  it("set/get round-trips a draft and stamps updatedAt", () => {
    const before = Date.now();
    const written = setDraft("hello@lumivara.ca", "slug-a", {
      body: "Hello world.",
      frontmatter: FRONTMATTER,
    });
    const read = getDraft("hello@lumivara.ca", "slug-a");
    expect(read).not.toBeNull();
    expect(read?.body).toBe("Hello world.");
    expect(read?.frontmatter).toEqual(FRONTMATTER);
    expect(read?.updatedAt).toBe(written.updatedAt);
    expect(new Date(written.updatedAt).getTime()).toBeGreaterThanOrEqual(
      before,
    );
  });

  it("isolates drafts by email", () => {
    setDraft("hello@lumivara.ca", "slug-a", {
      body: "operator copy",
      frontmatter: FRONTMATTER,
    });
    expect(getDraft("someone-else@example.test", "slug-a")).toBeNull();
  });

  it("isolates drafts by slug", () => {
    setDraft("hello@lumivara.ca", "slug-a", {
      body: "A",
      frontmatter: FRONTMATTER,
    });
    setDraft("hello@lumivara.ca", "slug-b", {
      body: "B",
      frontmatter: FRONTMATTER,
    });
    expect(getDraft("hello@lumivara.ca", "slug-a")?.body).toBe("A");
    expect(getDraft("hello@lumivara.ca", "slug-b")?.body).toBe("B");
  });

  it("normalises email casing/whitespace on reads", () => {
    setDraft("hello@lumivara.ca", "slug-a", {
      body: "ok",
      frontmatter: FRONTMATTER,
    });
    expect(getDraft(" Hello@Lumivara.CA ", "slug-a")?.body).toBe("ok");
  });

  it("clearDraft removes a single draft", () => {
    setDraft("hello@lumivara.ca", "slug-a", {
      body: "ok",
      frontmatter: FRONTMATTER,
    });
    clearDraft("hello@lumivara.ca", "slug-a");
    expect(getDraft("hello@lumivara.ca", "slug-a")).toBeNull();
  });

  it("returns null for empty email/slug", () => {
    expect(getDraft("", "slug-a")).toBeNull();
    expect(getDraft("hello@lumivara.ca", "")).toBeNull();
  });
});
