import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { aboutContent } from "@/content/about";
import { siteConfig } from "@/lib/site-config";
import { PageHero } from "@/components/primitives/PageHero";
import { SectionShell } from "@/components/primitives/SectionShell";
import { NumberedSection } from "@/components/primitives/NumberedSection";
import { PrincipleCard } from "@/components/primitives/PrincipleCard";
import { CTABlock } from "@/components/primitives/CTABlock";
import { FounderPortrait } from "@/components/sections/FounderPortrait";

export const metadata: Metadata = {
  title: "About",
  description:
    "Lumivara People Advisory is led by Beas Banerjee — MBA, CHRL, PROSCI-certified, with 10+ years translating business strategy into practical people systems.",
};

export default function AboutPage() {
  const { hero, philosophy, expertise, approach, founder, aiPov, finalCta } =
    aboutContent;

  return (
    <>
      <PageHero
        monoLabel={hero.monoLabel}
        headline={hero.headline}
        subhead={hero.subhead}
      />

      {/* Philosophy */}
      <SectionShell variant="ink" id="philosophy">
        <NumberedSection
          number="—"
          label={philosophy.monoLabel}
          className="text-canvas/60"
        />
        <h2 className="text-display-lg text-canvas mt-6 mb-3 max-w-[900px]">
          {philosophy.heading}
        </h2>
        <p className="text-body-lg text-canvas/70 italic mb-12">
          {philosophy.caption}
        </p>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {philosophy.items.map((p) => (
            <PrincipleCard
              key={p.number}
              number={p.number}
              title={p.title}
              body={p.body}
              variant="dark"
            />
          ))}
        </div>
      </SectionShell>

      {/* Expertise */}
      <SectionShell variant="canvas" width="content">
        <NumberedSection number="—" label={expertise.monoLabel} />
        <h2 className="text-display-md text-ink mt-6 mb-6 max-w-[760px]">
          {expertise.heading}
        </h2>
        <p className="text-body-lg text-ink-soft max-w-[720px] leading-relaxed">
          {expertise.body}
        </p>
      </SectionShell>

      {/* Approach */}
      <SectionShell variant="parchment" width="content">
        <NumberedSection number="—" label={approach.monoLabel} />
        <h2 className="text-display-md text-ink mt-6 mb-8 max-w-[760px]">
          {approach.heading}
        </h2>
        <div className="flex flex-col gap-5 max-w-[720px]">
          {approach.paragraphs.map((p, i) => (
            <p key={i} className="text-body text-ink-soft leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </SectionShell>

      {/* Founder */}
      <SectionShell variant="canvas" id="founder">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <FounderPortrait />
            <ul className="text-label text-muted-strong mt-6 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              {founder.credentials.map((c, i) => (
                <li key={c} className="flex items-center gap-3">
                  <span>{c}</span>
                  {i < founder.credentials.length - 1 && (
                    <span aria-hidden className="text-accent">·</span>
                  )}
                </li>
              ))}
            </ul>
            <a
              href={siteConfig.founderLinkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-md border border-border-subtle bg-canvas-elevated px-4 py-2.5 text-body-sm text-ink transition-colors hover:border-accent"
            >
              Connect on LinkedIn
              <ArrowRight size={14} aria-hidden />
            </a>
          </div>
          <div className="md:col-span-7 md:pt-4">
            <NumberedSection number="—" label={founder.monoLabel} />
            <h2 className="text-display-lg text-ink mt-6">{founder.name}</h2>
            <p className="text-label text-muted-strong mt-2 mb-8">
              {founder.title}
            </p>
            <div className="flex flex-col gap-5">
              {founder.bio.map((p, i) => (
                <p
                  key={i}
                  className="text-body text-ink-soft leading-relaxed"
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </SectionShell>

      {/* AI POV */}
      <SectionShell variant="parchment" width="content" id="ai-pov">
        <NumberedSection number="—" label={aiPov.monoLabel} />
        <h2 className="text-display-md text-ink mt-6 mb-8 max-w-[760px]">
          {aiPov.heading}
        </h2>
        <div className="flex flex-col gap-5 max-w-[720px]">
          {aiPov.paragraphs.map((p, i) => (
            <p key={i} className="text-body text-ink-soft leading-relaxed">
              {p}
            </p>
          ))}
        </div>
        <Link
          href="/insights"
          className="group mt-8 inline-flex items-center gap-2 text-label text-ink transition-colors hover:text-accent"
        >
          Read more perspectives
          <ArrowRight
            size={14}
            aria-hidden
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </SectionShell>

      <CTABlock
        headline={finalCta.headline}
        subhead={finalCta.subhead}
        ctaLabel={finalCta.cta.label}
        ctaHref={finalCta.cta.href}
      />
    </>
  );
}
