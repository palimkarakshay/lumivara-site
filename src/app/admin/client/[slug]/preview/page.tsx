import Link from "next/link";
import { notFound } from "next/navigation";

import { Card } from "@/components/admin/Card";
import { EmptyState } from "@/components/admin/EmptyState";
import { Section } from "@/components/admin/Section";
import { findClient } from "@/lib/admin/clients";
import { relativeTime } from "@/lib/admin/format";
import {
  findLinkedPrNumber,
  getIssue,
  getPullRequest,
  listOpenIssues,
} from "@/lib/admin/github";
import { TIERS } from "@/lib/admin/tiers";
import { findPreviewByCommit } from "@/lib/admin/vercel";

export const dynamic = "force-dynamic";

type Row = {
  number: number;
  title: string;
  updatedAt: string;
  prHeadSha: string | null;
  previewUrl: string | null;
};

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

  // For each ready issue, follow the linked PR + Vercel preview lookup.
  // We do this serially to keep API pressure modest; v1 typically has < 10
  // ready issues per client at a time.
  const rows: Row[] = [];
  for (const issue of ready) {
    const detail = await getIssue(issue.number);
    if (!detail.ok) continue;
    const prNumber = findLinkedPrNumber(detail.item);
    let prHeadSha: string | null = null;
    let previewUrl: string | null = null;
    if (prNumber != null) {
      const pr = await getPullRequest(prNumber);
      if (pr.ok) {
        prHeadSha = pr.item.headSha;
        const preview = await findPreviewByCommit(
          prHeadSha,
          pr.item.headBranch,
        );
        if (preview.ok && preview.preview && preview.preview.state === "READY") {
          previewUrl = preview.preview.url;
        }
      }
    }
    rows.push({
      number: issue.number,
      title: issue.title,
      updatedAt: issue.updatedAt,
      prHeadSha,
      previewUrl,
    });
  }

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
          card&rsquo;s &ldquo;Open&rdquo; to test, then approve to push it
          to <span className="font-mono">{client.domain}</span>.
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
        title={`${rows.length} ${rows.length === 1 ? "preview" : "previews"} waiting`}
        description="Each link opens the live preview build for that request."
      >
        {rows.length === 0 ? (
          <EmptyState
            title="Nothing waiting."
            description="When a request is ready for your test, it'll appear here automatically."
          />
        ) : (
          <ul className="grid gap-3 lg:grid-cols-2">
            {rows.map((row) => (
              <li key={row.number}>
                <Card as="article" className="flex flex-col gap-3">
                  <header>
                    <h3 className="font-display text-lg text-ink">
                      {row.title}
                    </h3>
                    <p className="text-caption text-muted-strong mt-1">
                      Updated {relativeTime(row.updatedAt)}
                    </p>
                  </header>
                  <p className="text-body-sm text-ink-soft">
                    {row.previewUrl
                      ? "Tap to open in a new tab and click through."
                      : "Preview is still building — check back in a minute."}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {row.previewUrl ? (
                      <a
                        href={row.previewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-[40px] items-center justify-center rounded-md bg-ink px-4 text-body-sm font-medium text-canvas hover:bg-accent hover:text-ink"
                      >
                        Open preview ↗
                      </a>
                    ) : (
                      <span className="inline-flex min-h-[40px] items-center justify-center rounded-md border border-border-subtle bg-canvas px-4 text-body-sm font-medium text-muted-strong">
                        Building…
                      </span>
                    )}
                    <Link
                      href={`/admin/client/${slug}/request/${row.number}`}
                      className="inline-flex min-h-[40px] items-center justify-center rounded-md border border-border-subtle bg-canvas px-4 text-body-sm font-medium text-ink hover:bg-parchment"
                    >
                      Approve / details
                    </Link>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
