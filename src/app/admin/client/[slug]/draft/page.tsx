import Link from "next/link";
import { notFound } from "next/navigation";

import { AutoRefresh } from "@/components/admin/AutoRefresh";
import { Card } from "@/components/admin/Card";
import { EmptyState } from "@/components/admin/EmptyState";
import { Section } from "@/components/admin/Section";
import {
  CATEGORY_META,
  SUGGESTION_CATEGORIES,
  type SuggestionCategory,
  categoryFromLabels,
  isSuggestion,
} from "@/lib/admin/categories";
import { findClient } from "@/lib/admin/clients";
import { relativeTime } from "@/lib/admin/format";
import { isGithubConfigured, listOpenIssues } from "@/lib/admin/github";

export const dynamic = "force-dynamic";

export default async function ClientDraftPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = findClient(slug);
  if (!client) notFound();

  const configured = isGithubConfigured();
  const result = await listOpenIssues({ clientSlug: slug, perPage: 50 });
  const issues = result.ok ? result.items : [];
  const suggestions = issues.filter((it) => isSuggestion(it.labels));

  const grouped = new Map<SuggestionCategory, typeof suggestions>();
  for (const cat of SUGGESTION_CATEGORIES) grouped.set(cat, []);
  for (const issue of suggestions) {
    const cat = categoryFromLabels(issue.labels);
    grouped.get(cat)!.push(issue);
  }

  return (
    <>
      <AutoRefresh />
      <header className="flex flex-col gap-2">
        <p className="text-caption text-muted-strong uppercase tracking-wider">
          Draft
        </p>
        <h2 className="font-display text-display-sm text-ink">
          Suggested changes, ready to triage
        </h2>
        <p className="text-body-sm text-ink-soft max-w-2xl">
          Ideas drafted up automatically — copy nits, broken images,
          security findings. Open one to review and approve, or send your
          own from{" "}
          <Link
            href={`/admin/client/${slug}/new`}
            className="underline text-accent-deep hover:text-accent"
          >
            New
          </Link>
          .
        </p>
      </header>

      {!configured ? (
        <Card emphasis="warning">
          <p className="font-medium text-ink">Live data is offline.</p>
          <p className="text-body-sm text-ink-soft mt-1">
            Suggestions will populate here as soon as we sync your account.
          </p>
        </Card>
      ) : null}

      {suggestions.length === 0 ? (
        <EmptyState
          title="No drafts queued."
          description="When automation drafts a suggestion for your site, it'll show up here for your call."
        />
      ) : (
        SUGGESTION_CATEGORIES.map((cat) => {
          const items = grouped.get(cat) ?? [];
          if (items.length === 0) return null;
          const meta = CATEGORY_META[cat];
          return (
            <Section
              key={cat}
              eyebrow={meta.label}
              title={`${items.length} ${
                items.length === 1 ? "suggestion" : "suggestions"
              }`}
              description={meta.description}
            >
              <ul className="grid gap-3 lg:grid-cols-2">
                {items.map((issue) => (
                  <li key={issue.number}>
                    <Card as="article" className="flex flex-col gap-3">
                      <header className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="font-display text-lg text-ink">
                          {issue.title}
                        </h3>
                        <span className="inline-flex shrink-0 items-center rounded-full border border-border-subtle bg-canvas px-2 py-0.5 text-caption uppercase tracking-wider text-ink-soft">
                          {meta.label}
                        </span>
                      </header>
                      <p className="text-caption text-muted-strong">
                        Updated {relativeTime(issue.updatedAt)}
                      </p>
                      <div>
                        <Link
                          href={`/admin/client/${slug}/request/${issue.number}`}
                          className="inline-flex min-h-[40px] items-center justify-center rounded-md border border-border-subtle bg-canvas px-4 text-body-sm font-medium text-ink hover:bg-parchment"
                        >
                          Open request
                        </Link>
                      </div>
                    </Card>
                  </li>
                ))}
              </ul>
            </Section>
          );
        })
      )}
    </>
  );
}
