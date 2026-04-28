import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Card } from "@/components/admin/Card";
import { EmptyState } from "@/components/admin/EmptyState";
import { Section } from "@/components/admin/Section";
import { isAdminEmail } from "@/lib/admin-allowlist";
import { CLIENT_REGISTRY } from "@/lib/admin/clients";
import { listOpenIssues } from "@/lib/admin/github";
import { TIERS } from "@/lib/admin/tiers";

export const dynamic = "force-dynamic";

export default async function ClientsIndexPage() {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) {
    redirect("/admin/sign-in?from=/admin/clients");
  }

  const issuesResult = await listOpenIssues({ perPage: 100 });
  const issues = issuesResult.ok ? issuesResult.items : [];

  const counts = new Map<string, number>();
  for (const issue of issues) {
    for (const label of issue.labels) {
      if (label.startsWith("client/")) {
        const slug = label.slice("client/".length);
        counts.set(slug, (counts.get(slug) ?? 0) + 1);
      }
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <p className="text-caption text-muted-strong uppercase tracking-wider">
          Clients
        </p>
        <h1 className="font-display text-display-sm text-ink">
          Per-client view
        </h1>
        <p className="text-body-sm text-ink-soft max-w-2xl">
          The operator-only roll-up. Each card opens the client&rsquo;s subset
          admin view (the same surface that ships to{" "}
          <code className="font-mono">&lt;theirdomain&gt;/admin</code>) so you
          can see exactly what they see.
        </p>
      </header>

      <Section
        eyebrow="Registry"
        title="Active clients"
        description="Add new clients in src/lib/admin/clients.ts."
      >
        {CLIENT_REGISTRY.length === 0 ? (
          <EmptyState
            title="No clients yet."
            description="The mothership is alive but has no customers in the registry. Add one in src/lib/admin/clients.ts to populate this view."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CLIENT_REGISTRY.map((client) => {
              const tier = TIERS[client.tier];
              const openCount = counts.get(client.slug) ?? 0;
              return (
                <Link
                  key={client.slug}
                  href={`/admin/client/${client.slug}`}
                  className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
                >
                  <Card className="h-full">
                    <header className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-caption text-muted-strong uppercase tracking-wider">
                          {tier.name} · ${tier.priceMonthlyUsd}/mo
                        </p>
                        <h3 className="font-display text-lg text-ink mt-1 group-hover:text-accent-deep">
                          {client.name}
                        </h3>
                        <p className="text-caption text-ink-soft mt-1">
                          <span className="font-mono">{client.domain}</span>
                        </p>
                      </div>
                      <span className="rounded-full bg-parchment px-2 py-1 text-caption font-mono text-ink-soft">
                        {openCount} open
                      </span>
                    </header>
                    {client.blurb ? (
                      <p className="text-body-sm text-ink-soft mt-3">
                        {client.blurb}
                      </p>
                    ) : null}
                    <p className="text-caption text-accent-deep mt-4 group-hover:underline">
                      Open client view →
                    </p>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </Section>
    </div>
  );
}
