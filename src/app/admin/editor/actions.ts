"use server";

import matter from "gray-matter";

import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/admin-allowlist";
import {
  buildEditorBranchName,
  createBranch,
  getBranchSha,
  getFileSha,
  openPullRequest,
  putContents,
} from "@/lib/admin/editor-github";
import {
  clearDraft,
  getDraft,
  setDraft,
  type DraftRecord,
} from "@/lib/admin/editor-store";
import type { InsightFrontmatter } from "@/lib/mdx";

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

const INSIGHT_PATH = (slug: string) => `src/content/insights/${slug}.mdx`;
const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,80}$/;

async function requireAdminEmail(): Promise<
  { ok: true; email: string } | { ok: false; error: string }
> {
  const session = await auth();
  const email = session?.user?.email;
  if (!isAdminEmail(email)) {
    return { ok: false, error: "Not signed in as an admin." };
  }
  return { ok: true, email: email! };
}

function validateSlug(slug: string): { ok: true } | { ok: false; error: string } {
  if (!SLUG_RE.test(slug)) {
    return { ok: false, error: "Invalid slug." };
  }
  return { ok: true };
}

export async function saveDraftAction(
  slug: string,
  body: string,
  frontmatter: InsightFrontmatter,
): Promise<ActionResult<DraftRecord>> {
  const auth = await requireAdminEmail();
  if (!auth.ok) return auth;
  const slugCheck = validateSlug(slug);
  if (!slugCheck.ok) return slugCheck;
  const record = setDraft(auth.email, slug, { body, frontmatter });
  return { ok: true, data: record };
}

export async function discardDraftAction(slug: string): Promise<ActionResult> {
  const auth = await requireAdminEmail();
  if (!auth.ok) return auth;
  const slugCheck = validateSlug(slug);
  if (!slugCheck.ok) return slugCheck;
  clearDraft(auth.email, slug);
  return { ok: true, data: undefined };
}

export async function publishDraftAction(
  slug: string,
): Promise<ActionResult<{ prNumber: number; htmlUrl: string }>> {
  const auth = await requireAdminEmail();
  if (!auth.ok) return auth;
  const slugCheck = validateSlug(slug);
  if (!slugCheck.ok) return slugCheck;

  const draft = getDraft(auth.email, slug);
  if (!draft) {
    return { ok: false, error: "No draft to publish for this slug." };
  }

  const path = INSIGHT_PATH(slug);
  // Reconstruct the full MDX file (frontmatter + body) the way `gray-matter`
  // would re-serialize it. This keeps round-trips lossless against the
  // existing parser in `src/lib/mdx.ts`.
  const fileContents = matter.stringify(draft.body, draft.frontmatter);

  const baseSha = await getBranchSha("main");
  if (!baseSha.ok) return baseSha;

  const branch = buildEditorBranchName(slug);
  const branchResult = await createBranch(branch, baseSha.data);
  if (!branchResult.ok) return branchResult;

  const existingSha = await getFileSha(path, "main");
  if (!existingSha.ok) return existingSha;

  const put = await putContents({
    path,
    branch,
    message: `content(editor): update ${slug}`,
    content: fileContents,
    sha: existingSha.data,
  });
  if (!put.ok) return put;

  const prTitle = `content(editor): update ${slug}`;
  const prBody = [
    `Drafted in \`/admin/editor/${slug}\` and published via the visual editor.`,
    "",
    "- Source: in-process draft buffer (see `src/lib/admin/editor-store.ts`).",
    "- Trust boundary: server action re-checked `isAdminEmail` before writing.",
    "- Auto-merge: disabled — operator merges after CI + Vercel preview.",
  ].join("\n");

  const pr = await openPullRequest({
    head: branch,
    base: "main",
    title: prTitle,
    body: prBody,
  });
  if (!pr.ok) return pr;

  // Drop the draft now that it's persisted as a PR. Operator can still
  // re-edit; they'll just start from the new on-disk version next time.
  clearDraft(auth.email, slug);

  return { ok: true, data: { prNumber: pr.data.number, htmlUrl: pr.data.htmlUrl } };
}
