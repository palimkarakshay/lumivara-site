import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockInstance,
} from "vitest";

import {
  buildEditorBranchName,
  createBranch,
  getBranchSha,
  getFileSha,
  openPullRequest,
  putContents,
  toBase64Utf8,
} from "@/lib/admin/editor-github";

type FetchInput = Parameters<typeof fetch>[0];
type FetchInit = Parameters<typeof fetch>[1];

let fetchMock: MockInstance<typeof fetch>;

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

beforeEach(() => {
  process.env.GITHUB_REPO = "palimkarakshay/lumivara-site";
  process.env.GITHUB_TOKEN = "test-token";
  fetchMock = vi.spyOn(globalThis, "fetch") as unknown as MockInstance<
    typeof fetch
  >;
});

afterEach(() => {
  fetchMock.mockRestore();
  delete process.env.GITHUB_REPO;
  delete process.env.GITHUB_TOKEN;
});

describe("toBase64Utf8", () => {
  it("encodes ASCII", () => {
    expect(toBase64Utf8("Hello")).toBe("SGVsbG8=");
  });
  it("encodes UTF-8 (multibyte)", () => {
    // "héllo" in UTF-8 is 0x68 0xc3 0xa9 0x6c 0x6c 0x6f → "aMOpbGxv"
    expect(toBase64Utf8("héllo")).toBe("aMOpbGxv");
  });
});

describe("buildEditorBranchName", () => {
  it("produces an auto/editor-* slug-stable name", () => {
    const fixed = new Date("2026-05-01T12:00:00Z");
    const name = buildEditorBranchName("clarity-is-the-first-hiring-problem", fixed);
    expect(name).toMatch(/^auto\/editor-clarity-is-the-first-hiring-problem-\d+$/);
  });
  it("scrubs unsafe characters", () => {
    const name = buildEditorBranchName("my slug/with..stuff", new Date(0));
    expect(name).toBe("auto/editor-my-slug-with--stuff-0");
  });
});

describe("missing config", () => {
  it("getBranchSha returns ok:false when env vars are missing", async () => {
    delete process.env.GITHUB_REPO;
    const result = await getBranchSha("main");
    expect(result.ok).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("getBranchSha", () => {
  it("returns the object SHA on 200", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(200, { object: { sha: "abc123" } }),
    );
    const result = await getBranchSha("main");
    expect(result).toEqual({ ok: true, data: "abc123" });
    const [url, init] = fetchMock.mock.calls[0] as [FetchInput, FetchInit];
    expect(String(url)).toBe(
      "https://api.github.com/repos/palimkarakshay/lumivara-site/git/ref/heads/main",
    );
    const headers = init?.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer test-token");
  });

  it("propagates a non-200 response as ok:false", async () => {
    fetchMock.mockResolvedValueOnce(new Response("nope", { status: 404 }));
    const result = await getBranchSha("missing");
    expect(result.ok).toBe(false);
    expect((result as { ok: false; error: string }).error).toMatch(/^GitHub 404/);
  });
});

describe("getFileSha", () => {
  it("returns null on 404 (creating a new file is allowed)", async () => {
    fetchMock.mockResolvedValueOnce(new Response("", { status: 404 }));
    const result = await getFileSha("src/content/insights/new.mdx", "main");
    expect(result).toEqual({ ok: true, data: null });
  });

  it("returns the file SHA on 200", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(200, { sha: "deadbeef" }));
    const result = await getFileSha("src/content/insights/x.mdx", "main");
    expect(result).toEqual({ ok: true, data: "deadbeef" });
  });
});

describe("createBranch / putContents / openPullRequest sequencing", () => {
  it("createBranch posts the expected ref + sha", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(201, { ref: "refs/heads/auto/editor-x" }),
    );
    const result = await createBranch("auto/editor-x", "abc123");
    expect(result.ok).toBe(true);
    const [url, init] = fetchMock.mock.calls[0] as [FetchInput, FetchInit];
    expect(String(url)).toBe(
      "https://api.github.com/repos/palimkarakshay/lumivara-site/git/refs",
    );
    expect(init?.method).toBe("POST");
    expect(JSON.parse(String(init?.body))).toEqual({
      ref: "refs/heads/auto/editor-x",
      sha: "abc123",
    });
  });

  it("putContents PUTs base64-encoded content with the correct path", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(201, { commit: { sha: "newcommit" } }),
    );
    const result = await putContents({
      path: "src/content/insights/x.mdx",
      branch: "auto/editor-x",
      message: "content(editor): update x",
      content: "Hello",
      sha: "oldfile",
    });
    expect(result).toEqual({ ok: true, data: { commitSha: "newcommit" } });
    const [url, init] = fetchMock.mock.calls[0] as [FetchInput, FetchInit];
    expect(String(url)).toBe(
      "https://api.github.com/repos/palimkarakshay/lumivara-site/contents/src/content/insights/x.mdx",
    );
    expect(init?.method).toBe("PUT");
    const body = JSON.parse(String(init?.body));
    expect(body.branch).toBe("auto/editor-x");
    expect(body.sha).toBe("oldfile");
    expect(body.content).toBe(toBase64Utf8("Hello"));
  });

  it("putContents omits sha when creating a new file", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(201, { commit: { sha: "new" } }),
    );
    await putContents({
      path: "src/content/insights/new.mdx",
      branch: "auto/editor-new",
      message: "create",
      content: "x",
    });
    const [, init] = fetchMock.mock.calls[0] as [FetchInput, FetchInit];
    const body = JSON.parse(String(init?.body));
    expect(body).not.toHaveProperty("sha");
  });

  it("openPullRequest returns number + html url on success", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(201, {
        number: 999,
        html_url: "https://github.com/p/r/pull/999",
      }),
    );
    const result = await openPullRequest({
      head: "auto/editor-x",
      base: "main",
      title: "content(editor): update x",
      body: "draft → publish",
    });
    expect(result).toEqual({
      ok: true,
      data: { number: 999, htmlUrl: "https://github.com/p/r/pull/999" },
    });
  });

  it("openPullRequest surfaces a 403 verbatim", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response("Resource not accessible by integration", { status: 403 }),
    );
    const result = await openPullRequest({
      head: "auto/editor-x",
      base: "main",
      title: "t",
      body: "b",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/^GitHub 403:/);
      expect(result.error).toContain("not accessible by integration");
    }
  });
});
