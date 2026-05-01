import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { Card } from "@/components/admin/Card";
import { Section } from "@/components/admin/Section";
import { isAdminEmail } from "@/lib/admin-allowlist";
import { getDraft } from "@/lib/admin/editor-store";
import { getInsightBySlug } from "@/lib/mdx";
import { siteConfig } from "@/lib/site-config";

import { DraftEditor } from "./DraftEditor";
import { EditorShell } from "./EditorShell";
import { PreviewFrame } from "./PreviewFrame";

type RouteParams = { params: Promise<{ slug: string }> };

export const metadata: Metadata = {
  title: "Editor",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminEditorSlugPage({ params }: RouteParams) {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) {
    redirect("/admin/sign-in?from=/admin/editor");
  }
  const { slug } = await params;
  const insight = await getInsightBySlug(slug);
  if (!insight) notFound();

  const operatorEmail = session?.user?.email ?? "";
  const draft = getDraft(operatorEmail, slug);

  const productionUrl = `${siteConfig.url.replace(/\/$/, "")}/insights/${slug}`;
  const localUrl = `/insights/${slug}`;
  const isProductionUrlLocal = siteConfig.url.includes("localhost");

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <p className="text-caption text-muted-strong uppercase tracking-wider">
          Mothership · Editor
        </p>
        <h1 className="font-display text-display-sm text-ink">
          {insight.frontmatter.title}
        </h1>
        <p className="text-body-sm text-ink-soft max-w-2xl">
          Editing <code className="font-mono">src/content/insights/{slug}.mdx</code>.
          Publishing opens a PR on{" "}
          <Link href="/admin/editor" className="underline">
            the editor index
          </Link>{" "}
          — back to the list anytime.
        </p>
      </header>

      <Section
        eyebrow="Four-view editor"
        title="Existing · Draft · Preview · Deployed"
        description="Existing reads `main`. Draft is your local buffer (auto-saved server-side). Preview iframes the live route — it reflects on-disk content until you publish. Deployed iframes the production domain."
      >
        <EditorShell
          slug={slug}
          panels={{
            existing: (
              <Card>
                <p className="text-caption text-muted-strong mb-2">
                  Source on `main` (read-only)
                </p>
                <pre className="whitespace-pre-wrap break-words font-mono text-body-sm text-ink">
                  {insight.content.trim()}
                </pre>
              </Card>
            ),
            draft: (
              <DraftEditor
                slug={slug}
                initialBody={draft?.body ?? insight.content}
                initialFrontmatter={draft?.frontmatter ?? insight.frontmatter}
                hasDraft={!!draft}
                draftUpdatedAt={draft?.updatedAt ?? null}
              />
            ),
            preview: (
              <div className="flex flex-col gap-3">
                <Card emphasis="warning">
                  <p className="text-body-sm text-ink">
                    Preview reflects on-disk content. Publish your draft to
                    update this view — runtime MDX rendering of unsaved drafts
                    is Phase 2 (see ADR-001).
                  </p>
                </Card>
                <PreviewFrame src={localUrl} title="Insight preview" />
              </div>
            ),
            deployed: (
              <div className="flex flex-col gap-3">
                <Card>
                  <p className="text-body-sm text-ink-soft">
                    Currently deployed at{" "}
                    <a
                      href={productionUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      {productionUrl}
                    </a>
                  </p>
                </Card>
                <PreviewFrame
                  src={productionUrl}
                  title="Deployed insight"
                  forceLink={isProductionUrlLocal}
                />
              </div>
            ),
          }}
        />
      </Section>
    </div>
  );
}
