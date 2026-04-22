import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { fractionalHrContent } from "@/content/fractional-hr";
import { PageHero } from "@/components/primitives/PageHero";
import { SectionShell } from "@/components/primitives/SectionShell";
import { NumberedSection } from "@/components/primitives/NumberedSection";
import { GlassCard } from "@/components/primitives/GlassCard";
import { CTABlock } from "@/components/primitives/CTABlock";
import { FAQSection } from "@/components/sections/FAQSection";
import { Reveal } from "@/components/primitives/Reveal";

export const metadata: Metadata = {
  title: "Fractional HR",
  description:
    "Senior HR strategy, embedded at the cadence your organization needs — without the cost of a full-time CHRO.",
};

export default function FractionalHRPage() {
  const { hero, fitCheck, howItWorks, engagementTiers, delivers, faqs, finalCta } =
    fractionalHrContent;

  return (
    <>
      <PageHero
        monoLabel={hero.monoLabel}
        headline={hero.headline}
        subhead={hero.subhead}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={hero.primaryCta.href}
            className="group inline-flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-3.5 font-medium text-ink transition-colors hover:bg-accent-soft"
          >
            <span>{hero.primaryCta.label}</span>
            <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href={hero.secondaryCta.href}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border-subtle bg-canvas-elevated px-6 py-3.5 font-medium text-ink transition-colors hover:border-accent"
          >
            {hero.secondaryCta.label}
          </Link>
        </div>
      </PageHero>

      {/* Fit checklist */}
      <SectionShell variant="parchment" width="content">
        <NumberedSection number="—" label={fitCheck.monoLabel} />
        <h2 className="text-display-lg text-ink mt-6 mb-10">{fitCheck.heading}</h2>
        <ul className="flex flex-col gap-3">
          {fitCheck.signals.map((signal) => (
            <li
              key={signal}
              className="flex items-start gap-3 rounded-md border border-border-subtle bg-canvas-elevated px-5 py-4"
            >
              <Check size={18} aria-hidden className="mt-0.5 shrink-0 text-accent" />
              <span className="text-body text-ink-soft leading-relaxed">{signal}</span>
            </li>
          ))}
        </ul>
      </SectionShell>

      {/* How it works */}
      <SectionShell variant="canvas" id="how-it-works">
        <NumberedSection number="—" label={howItWorks.monoLabel} />
        <h2 className="text-display-lg text-ink mt-6 mb-10 max-w-[760px]">
          {howItWorks.heading}
        </h2>
        <ol className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {howItWorks.steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 70}>
              <li className="flex h-full flex-col gap-3 rounded-lg border border-border-subtle bg-canvas-elevated p-6">
                <span className="font-display text-3xl text-accent leading-none">
                  {step.number}
                </span>
                <h3 className="font-display text-xl text-ink leading-tight mt-2">
                  {step.title}
                </h3>
                <p className="text-body-sm text-ink-soft leading-relaxed">
                  {step.body}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </SectionShell>

      {/* Engagement tiers */}
      <SectionShell variant="parchment" id="engagement-tiers">
        <NumberedSection number="—" label={engagementTiers.monoLabel} />
        <h2 className="text-display-lg text-ink mt-6 mb-10 max-w-[760px]">
          {engagementTiers.heading}
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {engagementTiers.tiers.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 70}>
              <GlassCard className="h-full">
                <span className="text-label text-accent-deep">{tier.cadence}</span>
                <h3 className="font-display text-2xl text-ink mt-4 leading-tight">
                  {tier.name}
                </h3>
                <p className="text-body text-ink-soft mt-4 leading-relaxed">
                  {tier.body}
                </p>
                <p className="text-caption text-muted-strong mt-5 italic border-t border-border-subtle pt-4">
                  Ideal for: {tier.ideal}
                </p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      {/* What we deliver */}
      <SectionShell variant="canvas">
        <NumberedSection number="—" label={delivers.monoLabel} />
        <h2 className="text-display-lg text-ink mt-6 mb-10 max-w-[760px]">
          {delivers.heading}
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {delivers.items.map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-border-subtle bg-canvas-elevated p-6"
            >
              <h3 className="font-display text-xl text-ink leading-tight">
                {item.title}
              </h3>
              <p className="text-body-sm text-ink-soft mt-3 leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </SectionShell>

      <FAQSection
        monoNumber="—"
        monoLabel="Fractional HR FAQ"
        heading="Common questions from founders and leadership teams."
        items={faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))}
      />

      <CTABlock
        headline={finalCta.headline}
        subhead={finalCta.subhead}
        ctaLabel={finalCta.cta.label}
        ctaHref={finalCta.cta.href}
      />
    </>
  );
}
