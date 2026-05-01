import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Card } from "@/components/admin/Card";
import { EmptyState } from "@/components/admin/EmptyState";
import { Section } from "@/components/admin/Section";
import { isAdminEmail } from "@/lib/admin-allowlist";
import { getAllInsights } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Editor",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminEditorPage() {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) {
    redirect("/admin/sign-in?from=/admin/editor");
  }

  const insights = await getAllInsights();

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <p className="text-caption text-muted-strong uppercase tracking-wider">
          Mothership · Editor
        </p>
        <h1 className="font-display text-display-sm text-ink">Visual editor</h1>
        <p className="text-body-sm text-ink-soft max-w-2xl">
          Edit insight articles in four views — Existing, Draft, Preview,
          Deployed. Publishing opens a PR; CI and the Vercel preview gate the
          merge. v1 covers MDX insights only; page sections (home, services,
          how-we-work) ship in Phase 2 — see{" "}
          <Link
            href="https://github.com/palimkarakshay/lumivara-site/blob/main/docs/decks/adr-001-visual-editor.md"
            className="underline"
          >
            ADR-001
          </Link>
          .
        </p>
      </header>

      <Section
        eyebrow="Insights"
        title="Pick an article to edit"
        description="Each row links to the four-tab editor for that insight."
      >
        {insights.length === 0 ? (
          <EmptyState
            title="No insights yet."
            description="Drop an .mdx file into src/content/insights/ to make it editable here."
          />
        ) : (
          <Card>
            <ul className="flex flex-col divide-y divide-border-subtle">
              {insights.map((article) => (
                <li key={article.slug} className="py-3 first:pt-0 last:pb-0">
                  <Link
                    href={`/admin/editor/${article.slug}`}
                    className="flex flex-col gap-1 hover:bg-parchment rounded-md px-2 py-1 -mx-2 -my-1"
                  >
                    <span className="font-display text-base text-ink">
                      {article.title}
                    </span>
                    <span className="text-caption text-muted-strong">
                      {article.category} · {article.publishedDate} ·{" "}
                      {article.readingTime}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </Section>
    </div>
  );
}
