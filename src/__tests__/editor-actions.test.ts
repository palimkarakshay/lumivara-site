import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/admin/editor-github", () => ({
  buildEditorBranchName: vi.fn(() => "auto/editor-test-1"),
  createBranch: vi.fn(),
  getBranchSha: vi.fn(),
  getFileSha: vi.fn(),
  openPullRequest: vi.fn(),
  putContents: vi.fn(),
}));

import { auth } from "@/auth";
import {
  createBranch,
  getBranchSha,
  getFileSha,
  openPullRequest,
  putContents,
} from "@/lib/admin/editor-github";
import {
  __resetDraftStoreForTests,
  getDraft,
  setDraft,
} from "@/lib/admin/editor-store";
import {
  discardDraftAction,
  publishDraftAction,
  saveDraftAction,
} from "@/app/admin/editor/actions";

const FRONTMATTER = {
  title: "Test",
  excerpt: "Excerpt",
  category: "perspective",
  publishedDate: "2026-05-01",
  readingTime: "3 min",
};

beforeEach(() => {
  __resetDraftStoreForTests();
  (auth as unknown as { mockReset: () => void }).mockReset();
  vi.mocked(getBranchSha).mockReset();
  vi.mocked(createBranch).mockReset();
  vi.mocked(getFileSha).mockReset();
  vi.mocked(putContents).mockReset();
  vi.mocked(openPullRequest).mockReset();
});

afterEach(() => {
  vi.clearAllMocks();
});

function setSession(email: string | null) {
  // `auth` from next-auth v5 has multiple overloads (it doubles as middleware).
  // Cast through `unknown` to satisfy the overloaded function signature for
  // the test mock and return only the shape our code actually reads.
  const value = email
    ? { user: { email }, expires: new Date(Date.now() + 60_000).toISOString() }
    : null;
  (auth as unknown as { mockResolvedValue: (v: unknown) => void }).mockResolvedValue(
    value,
  );
}

function signInAsOperator() {
  setSession("hello@lumivara.ca");
}

function signInAsStranger() {
  setSession("stranger@example.test");
}

describe("saveDraftAction", () => {
  it("rejects when not signed in", async () => {
    setSession(null);
    const result = await saveDraftAction("test", "body", FRONTMATTER);
    expect(result.ok).toBe(false);
  });

  it("rejects non-admin emails", async () => {
    signInAsStranger();
    const result = await saveDraftAction("test", "body", FRONTMATTER);
    expect(result.ok).toBe(false);
  });

  it("rejects malformed slugs", async () => {
    signInAsOperator();
    const result = await saveDraftAction("../etc/passwd", "body", FRONTMATTER);
    expect(result.ok).toBe(false);
  });

  it("persists the draft for the operator email on success", async () => {
    signInAsOperator();
    const result = await saveDraftAction("test", "draft body", FRONTMATTER);
    expect(result.ok).toBe(true);
    expect(getDraft("hello@lumivara.ca", "test")?.body).toBe("draft body");
  });
});

describe("discardDraftAction", () => {
  it("clears the draft when signed in as admin", async () => {
    signInAsOperator();
    setDraft("hello@lumivara.ca", "test", { body: "x", frontmatter: FRONTMATTER });
    const result = await discardDraftAction("test");
    expect(result.ok).toBe(true);
    expect(getDraft("hello@lumivara.ca", "test")).toBeNull();
  });

  it("rejects strangers without touching the store", async () => {
    setDraft("hello@lumivara.ca", "test", { body: "x", frontmatter: FRONTMATTER });
    signInAsStranger();
    const result = await discardDraftAction("test");
    expect(result.ok).toBe(false);
    expect(getDraft("hello@lumivara.ca", "test")).not.toBeNull();
  });
});

describe("publishDraftAction", () => {
  it("rejects strangers", async () => {
    signInAsStranger();
    const result = await publishDraftAction("test");
    expect(result.ok).toBe(false);
    expect(getBranchSha).not.toHaveBeenCalled();
  });

  it("returns ok:false when there is no draft to publish", async () => {
    signInAsOperator();
    const result = await publishDraftAction("test");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/no draft/i);
    }
  });

  it("walks the publish sequence and clears the draft on success", async () => {
    signInAsOperator();
    setDraft("hello@lumivara.ca", "test", { body: "draft body", frontmatter: FRONTMATTER });

    vi.mocked(getBranchSha).mockResolvedValue({ ok: true, data: "main-sha" });
    vi.mocked(createBranch).mockResolvedValue({
      ok: true,
      data: { ref: "refs/heads/auto/editor-test-1" },
    });
    vi.mocked(getFileSha).mockResolvedValue({ ok: true, data: "old-file-sha" });
    vi.mocked(putContents).mockResolvedValue({
      ok: true,
      data: { commitSha: "new-commit" },
    });
    vi.mocked(openPullRequest).mockResolvedValue({
      ok: true,
      data: { number: 42, htmlUrl: "https://github.com/p/r/pull/42" },
    });

    const result = await publishDraftAction("test");
    expect(result).toEqual({
      ok: true,
      data: { prNumber: 42, htmlUrl: "https://github.com/p/r/pull/42" },
    });
    expect(getBranchSha).toHaveBeenCalledWith("main");
    expect(createBranch).toHaveBeenCalledWith("auto/editor-test-1", "main-sha");
    expect(getFileSha).toHaveBeenCalledWith(
      "src/content/insights/test.mdx",
      "main",
    );
    const putArgs = vi.mocked(putContents).mock.calls[0][0];
    expect(putArgs.path).toBe("src/content/insights/test.mdx");
    expect(putArgs.branch).toBe("auto/editor-test-1");
    expect(putArgs.sha).toBe("old-file-sha");
    expect(putArgs.content).toContain("draft body");
    expect(putArgs.content).toContain("title: Test");
    const prArgs = vi.mocked(openPullRequest).mock.calls[0][0];
    expect(prArgs.base).toBe("main");
    expect(prArgs.head).toBe("auto/editor-test-1");
    expect(prArgs.title).toBe("content(editor): update test");
    expect(getDraft("hello@lumivara.ca", "test")).toBeNull();
  });

  it("returns the GitHub error verbatim when the PR open fails (e.g. read-only PAT)", async () => {
    signInAsOperator();
    setDraft("hello@lumivara.ca", "test", { body: "x", frontmatter: FRONTMATTER });
    vi.mocked(getBranchSha).mockResolvedValue({ ok: true, data: "main-sha" });
    vi.mocked(createBranch).mockResolvedValue({
      ok: true,
      data: { ref: "refs/heads/auto/editor-test-1" },
    });
    vi.mocked(getFileSha).mockResolvedValue({ ok: true, data: null });
    vi.mocked(putContents).mockResolvedValue({
      ok: true,
      data: { commitSha: "abc" },
    });
    vi.mocked(openPullRequest).mockResolvedValue({
      ok: false,
      error: "GitHub 403: Resource not accessible by integration",
    });

    const result = await publishDraftAction("test");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("403");
    }
    // Draft should remain since publish failed mid-flight.
    expect(getDraft("hello@lumivara.ca", "test")).not.toBeNull();
  });
});
