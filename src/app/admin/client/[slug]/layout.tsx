import { notFound } from "next/navigation";

import { ClientTabs } from "@/components/admin/ClientTabs";
import { clientNav } from "@/components/admin/nav-config";
import { findClient } from "@/lib/admin/clients";
import { TIERS, quotaLabel } from "@/lib/admin/tiers";

export default async function ClientAdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = findClient(slug);
  if (!client) notFound();

  const tier = TIERS[client.tier];
  const nav = clientNav(slug);

  return (
    <div className="flex flex-col gap-6">
      <header className="rounded-lg border border-border-subtle bg-canvas-elevated p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-caption text-muted-strong uppercase tracking-wider">
              {tier.name} tier · ${tier.priceMonthlyUsd}/mo ·{" "}
              {quotaLabel(tier.features.monthlyIdeaQuota)} requests
            </p>
            <h1 className="font-display text-2xl text-ink mt-1">
              {client.name}
            </h1>
            <p className="text-caption text-ink-soft mt-1 font-mono">
              {client.domain}
            </p>
          </div>
          <a
            href="/admin/clients"
            className="text-caption underline text-ink-soft hover:text-ink"
          >
            ← All clients
          </a>
        </div>
        <nav aria-label="Client sections" className="mt-4">
          <ClientTabs items={nav} />
        </nav>
      </header>

      <div className="flex flex-col gap-8">{children}</div>
    </div>
  );
}
