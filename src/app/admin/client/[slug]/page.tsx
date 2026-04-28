import { notFound } from "next/navigation";
import Link from "next/link";

import { Card } from "@/components/admin/Card";
import { EmptyState } from "@/components/admin/EmptyState";
import { IssueCard } from "@/components/admin/IssueCard";
import { MetricTile } from "@/components/admin/MetricTile";
import { Section } from "@/components/admin/Section";
import { findClient } from "@/lib/admin/clients";
import { isGithubConfigured, listOpenIssues } from "@/lib/admin/github";
import { statusFromLabels } from "@/lib/admin/status-map";
import { TIERS } from "@/lib/admin/tiers";

export const dynamic = "force-dynamic";

export default async function ClientRequestsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = findClient(slug);
  if (!client) notFound();

  const tier = TIERS[client.tier];
  const configured = isGithubConfigured();
  const result = await listOpenIssues({ clientSlug: slug, perPage: 50 });
  const issues = result.ok ? result.items : [];

  // Filter out issues with internal-only status from the client's view.
  const visible = issues.filter((it) => {
    const status = statusFromLabels(it.labels);
    return status === null || !status.internal;
  });

  const inProgress = visible.filter((it) =>
    it.labels.includes("status/in-progress"),
  ).length;
  const review = visible.filter((it) =>
    it.labels.includes("status/awaiting-review"),
  ).length;
  const blocked = visible.filter((it) =>
    it.labels.some(
      (l) => l === "status/needs-clarification" || l === "needs-client-input",
    ),
  ).length;

  return (
    <>
      <header className="flex flex-col gap-2">
        <p className="text-caption text-muted-strong uppercase tracking-wider">
          Your requests
        </p>
        <h2 className="font-display text-display-sm text-ink">
          What we&rsquo;re working on
        </h2>
        <p className="text-body-sm text-ink-soft max-w-2xl">
          Live status for every change you&rsquo;ve sent us. Tap a card for
          details. New idea?{" "}
          <Link
            href={`/admin/client/${slug}/new`}
            className="underline text-accent-deep hover:text-accent"
          >
            Send it here
          </Link>
          .
        </p>
      </header>

      {!configured ? (
        <Card emphasis="warning">
          <p className="font-medium text-ink">Live data is offline.</p>
          <p className="text-body-sm text-ink-soft mt-1">
            We&rsquo;re still wiring up your account. You can already send
            requests through the New tab; they&rsquo;ll appear here as soon
            as we sync.
          </p>
        </Card>
      ) : null}

      <section
        aria-label="At a glance"
        className="grid gap-3 sm:grid-cols-3"
      >
        <MetricTile
          label="In progress"
          value={inProgress}
          tone={inProgress > 0 ? "warning" : "default"}
        />
        <MetricTile
          label="Ready to test"
          value={review}
          tone={review > 0 ? "warning" : "default"}
          hint={tier.features.previewLinks ? "Preview links in the Preview tab" : undefined}
        />
        <MetricTile
          label="Waiting on you"
          value={blocked}
          tone={blocked > 0 ? "failure" : "success"}
          hint="We have a question"
        />
      </section>

      <Section
        eyebrow="Backlog"
        title={`${visible.length} open ${visible.length === 1 ? "request" : "requests"}`}
        description="Most recently updated first."
      >
        {visible.length === 0 ? (
          <EmptyState
            title="No requests yet."
            description="Send us your first idea and we'll get to work."
            action={
              <Link
                href={`/admin/client/${slug}/new`}
                className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-ink px-4 text-base font-medium text-canvas hover:bg-accent hover:text-ink"
              >
                Send a request
              </Link>
            }
          />
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {visible.map((issue) => (
              <IssueCard
                key={issue.number}
                issue={issue}
                audience="client"
                href={`/admin/client/${slug}/request/${issue.number}`}
              />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
