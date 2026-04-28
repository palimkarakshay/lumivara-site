import Link from "next/link";
import { notFound } from "next/navigation";

import { Card } from "@/components/admin/Card";
import { Section } from "@/components/admin/Section";
import { StatusPill } from "@/components/admin/StatusPill";
import { findClient } from "@/lib/admin/clients";
import { formatUtc, relativeTime } from "@/lib/admin/format";
import { listOpenIssues } from "@/lib/admin/github";
import {
  clientSlugFromLabels,
  statusFromLabels,
} from "@/lib/admin/status-map";

export const dynamic = "force-dynamic";

/**
 * Strip our hidden HTML comment metadata (set by the n8n intake workflows)
 * before showing the body to the client. We don't want them seeing the
 * source-channel + reply-to that lives there.
 */
function cleanBody(body: string): string {
  return body.replace(/<!--[\s\S]*?-->/g, "").trim();
}

export default async function ClientRequestDetailPage({
  params,
}: {
  params: Promise<{ slug: string; number: string }>;
}) {
  const { slug, number } = await params;
  const client = findClient(slug);
  if (!client) notFound();

  const result = await listOpenIssues({ clientSlug: slug, perPage: 100 });
  if (!result.ok) {
    return (
      <Card emphasis="warning">
        <p className="font-medium text-ink">Couldn&rsquo;t load this request.</p>
        <p className="text-body-sm text-ink-soft mt-1">{result.error}</p>
      </Card>
    );
  }

  const issue = result.items.find((it) => String(it.number) === number);
  if (!issue || clientSlugFromLabels(issue.labels) !== slug) notFound();

  const status = statusFromLabels(issue.labels);
  const cleaned = cleanBody(issue.body);

  return (
    <>
      <header className="flex flex-col gap-3">
        <Link
          href={`/admin/client/${slug}`}
          className="text-caption text-ink-soft hover:text-ink underline w-fit"
        >
          ← Back to all requests
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h2 className="font-display text-2xl text-ink leading-tight max-w-2xl">
            {issue.title}
          </h2>
          <StatusPill status={status} />
        </div>
        <p className="text-caption text-muted-strong">
          Created {formatUtc(issue.createdAt)} UTC ·{" "}
          last updated {relativeTime(issue.updatedAt)}
        </p>
      </header>

      <Section eyebrow="Status" title={status?.label ?? "Unsorted"}>
        <Card>
          <p className="text-body text-ink">
            {status?.copy ?? "We&rsquo;re still classifying this request."}
          </p>
        </Card>
      </Section>

      <Section eyebrow="Original request" title="What you sent us">
        <Card>
          {cleaned.length === 0 ? (
            <p className="text-body-sm text-ink-soft italic">
              (no details captured)
            </p>
          ) : (
            <pre className="whitespace-pre-wrap break-words font-body text-body-sm text-ink">
              {cleaned}
            </pre>
          )}
        </Card>
      </Section>
    </>
  );
}
