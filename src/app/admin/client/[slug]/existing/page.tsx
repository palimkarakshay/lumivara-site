import Link from "next/link";
import { notFound } from "next/navigation";

import { AutoRefresh } from "@/components/admin/AutoRefresh";
import { Card } from "@/components/admin/Card";
import { Section } from "@/components/admin/Section";
import { findClient } from "@/lib/admin/clients";
import { relativeTime } from "@/lib/admin/format";
import { isVercelConfigured, latestProductionDeployment } from "@/lib/admin/vercel";

export const dynamic = "force-dynamic";

export default async function ClientExistingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = findClient(slug);
  if (!client) notFound();

  const liveUrl = `https://${client.domain}`;

  let liveSince: string | null = null;
  if (isVercelConfigured()) {
    const prod = await latestProductionDeployment();
    if (prod.ok && prod.deployment && prod.deployment.state === "READY") {
      liveSince = prod.deployment.createdAt;
    }
  }

  return (
    <>
      <AutoRefresh />
      <header className="flex flex-col gap-2">
        <p className="text-caption text-muted-strong uppercase tracking-wider">
          Existing
        </p>
        <h2 className="font-display text-display-sm text-ink">
          Your live site
        </h2>
        <p className="text-body-sm text-ink-soft max-w-2xl">
          What&rsquo;s serving traffic right now at{" "}
          <span className="font-mono">{client.domain}</span>. The embed
          below mirrors production; if your site blocks framing, use{" "}
          <a
            href={liveUrl}
            target="_blank"
            rel="noreferrer"
            className="underline text-accent-deep hover:text-accent"
          >
            Open live site ↗
          </a>{" "}
          instead.
        </p>
      </header>

      <Section
        eyebrow="Production"
        title={client.name}
        description={
          liveSince
            ? `Live since ${relativeTime(liveSince)} — last successful deploy.`
            : "Live snapshot. Deploy details appear once Vercel is connected."
        }
        action={
          <a
            href={liveUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[40px] items-center justify-center rounded-md bg-ink px-4 text-body-sm font-medium text-canvas hover:bg-accent hover:text-ink"
          >
            Open live site ↗
          </a>
        }
      >
        <Card className="flex flex-col gap-3 p-0 overflow-hidden">
          <div className="aspect-[4/3] w-full bg-canvas">
            <iframe
              title={`${client.name} live preview`}
              src={liveUrl}
              sandbox="allow-scripts allow-same-origin"
              referrerPolicy="no-referrer"
              loading="lazy"
              className="h-full w-full border-0"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 px-5 pb-5">
            <p className="text-caption text-ink-soft">
              Some sites refuse to embed — that&rsquo;s a security feature,
              not a bug. The button on the right always works.
            </p>
            <Link
              href={`/admin/client/${slug}/deployed`}
              className="text-caption underline text-ink-soft hover:text-ink"
            >
              See deploy details →
            </Link>
          </div>
        </Card>
      </Section>
    </>
  );
}
