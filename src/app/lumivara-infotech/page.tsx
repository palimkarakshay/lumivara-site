import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { lumivaraInfotechContent } from "@/content/lumivara-infotech";
import { PageHero } from "@/components/primitives/PageHero";
import { SectionShell } from "@/components/primitives/SectionShell";
import { NumberedSection } from "@/components/primitives/NumberedSection";
import { GlassCard } from "@/components/primitives/GlassCard";
import { CTABlock } from "@/components/primitives/CTABlock";
import { FAQSection } from "@/components/sections/FAQSection";
import { Reveal } from "@/components/primitives/Reveal";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Lumivara Infotech — Automated website creation",
  description:
    "Modern marketing sites, designed and shipped through an AI-assisted pipeline. Three transparent tiers from CA$1,500 — built by Akshay Palimkar.",
};

export default function LumivaraInfotechPage() {
  const { hero, proof, pricing, process, faqs, finalCta, owner } =
    lumivaraInfotechContent;

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

      {/* Proof / why us */}
      <SectionShell variant="parchment">
        <NumberedSection number="—" label={proof.monoLabel} />
        <h2 className="text-display-lg text-ink mt-6 mb-10 max-w-[760px]">
          {proof.heading}
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {proof.points.map((point, i) => (
            <Reveal key={point.title} delay={i * 70}>
              <div className="flex h-full flex-col gap-3 rounded-lg border border-border-subtle bg-canvas-elevated p-6">
                <h3 className="font-display text-xl text-ink leading-tight">
                  {point.title}
                </h3>
                <p className="text-body-sm text-ink-soft leading-relaxed">
                  {point.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      {/* Pricing tiers */}
      <SectionShell variant="canvas" id="pricing">
        <NumberedSection number="—" label={pricing.monoLabel} />
        <h2 className="text-display-lg text-ink mt-6 mb-5 max-w-[760px]">
          {pricing.heading}
        </h2>
        <p className="text-body-lg text-ink-soft mb-10 max-w-[680px]">
          {pricing.subhead}
        </p>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {pricing.tiers.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 70}>
              <GlassCard
                className={cn(
                  "flex h-full flex-col",
                  tier.highlighted && "border-accent/60 shadow-lg"
                )}
              >
                <span className="text-label text-accent-deep">{tier.cadence}</span>
                <h3 className="font-display text-2xl text-ink mt-4 leading-tight">
                  {tier.name}
                </h3>
                <p className="font-display text-3xl text-ink mt-3 leading-none">
                  {tier.price}
                </p>
                <p className="text-body text-ink-soft mt-4 leading-relaxed">
                  {tier.summary}
                </p>
                <ul className="mt-5 flex flex-col gap-2 border-t border-border-subtle pt-5">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-body-sm text-ink-soft leading-relaxed"
                    >
                      <Check size={16} aria-hidden className="mt-0.5 shrink-0 text-accent" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.cta.href}
                  className={cn(
                    "group mt-6 inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 font-medium transition-colors",
                    tier.highlighted
                      ? "bg-accent text-ink hover:bg-accent-soft"
                      : "border border-border-subtle bg-canvas-elevated text-ink hover:border-accent"
                  )}
                >
                  <span>{tier.cta.label}</span>
                  <ArrowRight size={14} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      {/* Process */}
      <SectionShell variant="parchment" id="process">
        <NumberedSection number="—" label={process.monoLabel} />
        <h2 className="text-display-lg text-ink mt-6 mb-10 max-w-[760px]">
          {process.heading}
        </h2>
        <ol className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {process.steps.map((step, i) => (
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

      {/* Owner */}
      <SectionShell variant="canvas" width="content">
        <NumberedSection number="—" label={owner.monoLabel} />
        <h2 className="text-display-md text-ink mt-6 mb-5">{owner.heading}</h2>
        <p className="text-body-lg text-ink-soft max-w-[680px] leading-relaxed">
          {owner.body}
        </p>
      </SectionShell>

      <FAQSection
        monoNumber="—"
        monoLabel="Infotech FAQ"
        heading="Common questions before you start a build."
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
