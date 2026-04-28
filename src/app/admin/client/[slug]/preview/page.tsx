import { notFound } from "next/navigation";
import Link from "next/link";

import { Card } from "@/components/admin/Card";
import { EmptyState } from "@/components/admin/EmptyState";
import { Section } from "@/components/admin/Section";
import { findClient } from "@/lib/admin/clients";
import { listOpenIssues } from "@/lib/admin/github";
import { TIERS } from "@/lib/admin/tiers";
import { relativeTime } from "@/lib/admin/format";

export const dynamic = "force-dynamic";

export default async function ClientPreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = findClient(slug);
  if (!client) notFound();

  const tier = TIERS[client.tier];
  const result = await listOpenIssues({ clientSlug: slug, perPage: 50 });
  const issues = result.ok ? result.items : [];
  const ready = issues.filter((it) =>
    it.labels.includes("status/awaiting-review"),
  );

  return (
    <>
      <header className="flex flex-col gap-2">
        <p className="text-caption text-muted-strong uppercase tracking-wider">
          Preview
        </p>
        <h2 className="font-display text-display-sm text-ink">
          See it before it&rsquo;s live
        </h2>
        <p className="text-body-sm text-ink-soft max-w-2xl">
          Every request is built on a temporary preview URL first. Tap a
          card, click around, then approve to push it to{" "}
          <span className="font-mono">{client.domain}</span>.
        </p>
      </header>

      {!tier.features.previewLinks ? (
        <Card emphasis="warning">
          <p className="font-medium text-ink">Preview is on Growth and Scale.</p>
          <p className="text-body-sm text-ink-soft mt-1">{tier.upsellCopy}</p>
        </Card>
      ) : null}

      <Section
        eyebrow="Ready to test"
        title={`${ready.length} ${ready.length === 1 ? "preview" : "previews"} waiting`}
        description="Each link opens the live preview build for that request."
      >
        {ready.length === 0 ? (
          <EmptyState
            title="Nothing waiting."
            description="When a request is ready for your test, it'll appear here automatically."
          />
        ) : (
          <ul className="grid gap-3 lg:grid-cols-2">
            {ready.map((issue) => {
              const previewUrl = issue.pullRequest?.htmlUrl ?? null;
              return (
                <li key={issue.number}>
                  <Card as="article" className="flex flex-col gap-3">
                    <header>
                      <h3 className="font-display text-lg text-ink">
                        {issue.title}
                      </h3>
                      <p className="text-caption text-muted-strong mt-1">
                        Updated {relativeTime(issue.updatedAt)}
                      </p>
                    </header>
                    <p className="text-body-sm text-ink-soft">
                      Open the preview link, click around, and approve to
                      deploy.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {previewUrl ? (
                        <a
                          href={previewUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-h-[40px] items-center justify-center rounded-md bg-ink px-4 text-body-sm font-medium text-canvas hover:bg-accent hover:text-ink"
                        >
                          Open preview ↗
                        </a>
                      ) : (
                        <span className="inline-flex min-h-[40px] items-center justify-center rounded-md border border-border-subtle bg-canvas px-4 text-body-sm font-medium text-ink-soft">
                          Building preview…
                        </span>
                      )}
                      <Link
                        href={`/admin/client/${slug}/request/${issue.number}`}
                        className="inline-flex min-h-[40px] items-center justify-center rounded-md border border-border-subtle bg-canvas px-4 text-body-sm font-medium text-ink hover:bg-parchment"
                      >
                        Details
                      </Link>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </Section>
    </>
  );
}
