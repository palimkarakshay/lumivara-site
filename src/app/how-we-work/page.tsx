import type { Metadata } from "next";
import { howWeWorkContent } from "@/content/how-we-work";
import { PageHero } from "@/components/primitives/PageHero";
import { SectionShell } from "@/components/primitives/SectionShell";
import { NumberedSection } from "@/components/primitives/NumberedSection";
import { GlassCard } from "@/components/primitives/GlassCard";
import { CTABlock } from "@/components/primitives/CTABlock";
import { Reveal } from "@/components/primitives/Reveal";
import { PartnershipTimeline } from "@/components/sections/PartnershipTimeline";
import { FAQSection } from "@/components/sections/FAQSection";

export const metadata: Metadata = {
  title: "How We Work",
  description:
    "Lumivara's approach to people strategy: built on strategy, delivered through capability, measured by impact. Explore our engagement lifecycle and models.",
};

export default function HowWeWorkPage() {
  const { hero, principles, engagementModels, modelsNote, kpiMatrix, finalCta } =
    howWeWorkContent;
  return (
    <>
      <PageHero
        monoLabel={hero.monoLabel}
        headline={hero.headline}
        subhead={hero.subhead}
      />

      {/* Three principles — expanded panels, alternating */}
      {principles.map((p, idx) => (
        <SectionShell
          key={p.number}
          variant={idx % 2 === 0 ? "canvas" : "parchment"}
          className="py-16 sm:py-20 md:py-24"
        >
          <Reveal>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
              <div className="md:col-span-4">
                <span className="font-display text-[80px] leading-none text-accent sm:text-[96px]">
                  {p.number}
                </span>
                <h2 className="text-display-md text-ink mt-6 leading-tight">
                  {p.title}
                </h2>
              </div>
              <div className="flex flex-col gap-5 md:col-span-7 md:col-start-6 md:pt-10">
                <p className="text-body-lg text-ink-soft leading-relaxed">
                  {p.bodyFirst}
                </p>
                <p className="text-body text-ink-soft leading-relaxed">
                  {p.bodySecond}
                </p>
              </div>
            </div>
          </Reveal>
        </SectionShell>
      ))}

      <PartnershipTimeline />

      {/* Engagement Models */}
      <SectionShell variant="parchment" id="engagement-models">
        <NumberedSection number="04" label="Engagement Models" />
        <h2 className="text-display-lg text-ink mt-6 mb-3 max-w-[760px]">
          Three shapes of engagement.
        </h2>
        <p className="text-body-lg text-ink-soft mb-10 max-w-[680px]">
          Every engagement is scoped to your situation. These are the typical
          shapes they take.
        </p>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {engagementModels.map((m, i) => (
            <Reveal key={m.title} delay={i * 60}>
              <GlassCard className="h-full">
                <span className="text-label text-accent-deep">{m.duration}</span>
                <h3 className="font-display text-2xl text-ink mt-4 mb-4 leading-tight">
                  {m.title}
                </h3>
                <p className="text-body text-ink-soft leading-relaxed">{m.body}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
        <p className="text-caption text-muted-strong mt-10 italic">{modelsNote}</p>
      </SectionShell>

      {/* KPI Matrix */}
      <SectionShell variant="canvas" id="impact">
        <NumberedSection number="05" label="How We Measure Impact" />
        <h2 className="text-display-lg text-ink mt-6 mb-3 max-w-[760px]">
          What gets measured — by practice.
        </h2>
        <p className="text-body-lg text-ink-soft mb-10 max-w-[720px]">
          Outcomes are defined at the start of the engagement. Here's what we
          typically track across the six practices.
        </p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {kpiMatrix.map((row) => (
            <div
              key={row.service}
              className="rounded-lg border border-border-subtle bg-canvas-elevated p-6"
            >
              <h3 className="font-display text-xl text-ink leading-tight">
                {row.service}
              </h3>
              <ul className="mt-4 flex flex-col gap-2">
                {row.kpis.map((kpi) => (
                  <li
                    key={kpi}
                    className="text-body-sm text-ink-soft flex items-start gap-2 leading-snug"
                  >
                    <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {kpi}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionShell>

      <FAQSection
        monoNumber="06"
        monoLabel="FAQ"
        heading="Answers to what leaders usually ask first."
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
