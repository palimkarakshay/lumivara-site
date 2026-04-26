import type { Metadata } from "next";
import { PageHero } from "@/components/primitives/PageHero";
import { SectionShell } from "@/components/primitives/SectionShell";
import { NumberedSection } from "@/components/primitives/NumberedSection";
import { CTABlock } from "@/components/primitives/CTABlock";
import { DiagnosticQuiz } from "@/components/sections/DiagnosticQuiz";
import { ServicesIndex } from "@/components/sections/ServicesIndex";
import { TallyDiagnostic } from "@/components/sections/TallyDiagnostic";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Six focused practices — talent acquisition, learning & leadership, talent management, culture & experience, future of work, and HR advisory — built around one integrated approach.",
};

export default function WhatWeDoPage() {
  return (
    <>
      <PageHero
        monoLabel="Our Services"
        headline="Six focused practices. One integrated approach."
        subhead="Every service is grounded in the same three commitments: built on strategy, delivered through capability, measured by impact. Explore below — or if you're not sure where to start, the diagnostic below will point you in the right direction."
      />

      <SectionShell variant="parchment" width="content" id="diagnostic">
        <NumberedSection number="—" label="Find your starting point" />
        <h2 className="text-display-md text-ink mt-6 mb-3">
          Not sure which service fits?
        </h2>
        <p className="text-body-lg text-ink-soft mb-8 max-w-[640px]">
          Four short questions, no email required. We'll point you to the
          practice that matches the problem you're actually solving.
        </p>
        <DiagnosticQuiz />
      </SectionShell>

      <SectionShell variant="canvas" id="services">
        <ServicesIndex />
      </SectionShell>

      <SectionShell variant="parchment" width="content" id="hr-diagnostic">
        <NumberedSection number="—" label="Quick HR Diagnostic" />
        <h2 className="text-display-md text-ink mt-6 mb-3">
          Quick HR Diagnostic
        </h2>
        <p className="text-body-lg text-ink-soft mb-8 max-w-[640px]">
          5 questions. Instant clarity on your highest-leverage people priority.
        </p>
        <TallyDiagnostic formId={siteConfig.tallyDiagnosticFormId} />
      </SectionShell>

      <CTABlock
        headline="Not sure where to start?"
        subhead="If the diagnostic above didn't quite fit, that's exactly what a discovery call is for."
        ctaLabel="Book a Discovery Call"
        ctaHref="/contact"
      />
    </>
  );
}
