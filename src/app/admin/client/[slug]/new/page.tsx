import { notFound } from "next/navigation";

import { Card } from "@/components/admin/Card";
import { Section } from "@/components/admin/Section";
import { findClient } from "@/lib/admin/clients";
import { TIERS, quotaLabel } from "@/lib/admin/tiers";
import { readWebhookConfig } from "@/lib/admin/webhooks";

import { IntakeForm } from "./intake-form";

export default async function NewRequestPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = findClient(slug);
  if (!client) notFound();

  const tier = TIERS[client.tier];
  const webhook = readWebhookConfig();
  const ready = !!(webhook.url && webhook.secret);

  return (
    <>
      <header className="flex flex-col gap-2">
        <p className="text-caption text-muted-strong uppercase tracking-wider">
          New request
        </p>
        <h2 className="font-display text-display-sm text-ink">
          What would you like us to do?
        </h2>
        <p className="text-body-sm text-ink-soft max-w-2xl">
          Send us anything: a copy tweak, a new section, a bug. We turn it
          into a tracked request automatically and reply with a magic link
          back to this page.
        </p>
      </header>

      {!ready ? (
        <Card emphasis="warning">
          <p className="font-medium text-ink">Intake is offline.</p>
          <p className="text-body-sm text-ink-soft mt-1">
            We&rsquo;re still wiring up your account. Try again in a few
            minutes — or email{" "}
            <a
              href="mailto:hello@lumivara.ca"
              className="underline text-accent-deep"
            >
              hello@lumivara.ca
            </a>
            .
          </p>
        </Card>
      ) : null}

      <Section
        eyebrow={`${tier.name} tier`}
        title="Submit"
        description={`Quota: ${quotaLabel(tier.features.monthlyIdeaQuota)}. ${tier.upsellCopy}`}
      >
        <Card>
          <IntakeForm
            slug={slug}
            hasEmailChannel={tier.features.intakeEmail}
            hasSmsChannel={tier.features.intakeSms}
          />
        </Card>
      </Section>
    </>
  );
}
