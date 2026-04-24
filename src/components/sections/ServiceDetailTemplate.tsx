import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { services, type Service } from "@/content/services";
import { SectionShell } from "@/components/primitives/SectionShell";
import { NumberedSection } from "@/components/primitives/NumberedSection";
import { ServiceCard } from "@/components/primitives/ServiceCard";
import { CTABlock } from "@/components/primitives/CTABlock";

type ServiceDetailTemplateProps = {
  service: Service;
};

export function ServiceDetailTemplate({ service }: ServiceDetailTemplateProps) {
  const related = service.relatedSlugs
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is Service => Boolean(s));

  return (
    <>
      {/* Hero */}
      <section className="w-full bg-canvas px-6 pt-28 pb-16 sm:px-8 sm:pt-36 sm:pb-20">
        <div className="mx-auto max-w-[1280px]">
          <div className="text-label text-muted-strong mb-2">
            <Link href="/what-we-do" className="transition-colors hover:text-ink">
              What We Do
            </Link>
            <span className="mx-2 text-accent">/</span>
            <span>{service.shortTitle}</span>
          </div>
          <NumberedSection
            number={service.number}
            label={`Service ${service.number} / 06`}
          />
          <h1 className="text-display-xl text-ink mt-6 max-w-[960px] leading-tight">
            {service.title}
          </h1>
          <p className="font-display text-2xl italic text-ink-soft mt-7 max-w-[760px] leading-snug sm:text-3xl">
            {service.tagline}
          </p>
        </div>
      </section>

      {/* Diagnostic question */}
      <SectionShell variant="parchment">
        <p className="text-label text-muted-strong">
          The question we help you answer
        </p>
        <h2 className="font-display text-3xl italic text-ink mt-5 max-w-[840px] leading-snug sm:text-4xl">
          {service.diagnosticQuestion}
        </h2>
        <p className="text-body-lg text-ink-soft mt-7 max-w-[720px] leading-relaxed">
          {service.shortDescription}
        </p>
      </SectionShell>

      {/* Signals */}
      <SectionShell variant="canvas" width="content">
        <NumberedSection number="—" label="Signals you might need this" />
        <h2 className="text-display-md text-ink mt-6 mb-8">
          If any of these sound familiar.
        </h2>
        <ul className="flex flex-col gap-3">
          {service.signals.map((signal) => (
            <li
              key={signal}
              className="flex items-start gap-3 rounded-md border border-border-subtle bg-canvas-elevated px-5 py-4"
            >
              <Check
                size={18}
                aria-hidden
                className="mt-0.5 shrink-0 text-accent"
              />
              <span className="text-body text-ink-soft leading-relaxed">
                {signal}
              </span>
            </li>
          ))}
        </ul>
      </SectionShell>

      {/* Sub-services / What we deliver */}
      <SectionShell variant="canvas" width="content" id="what-we-deliver">
        <NumberedSection number="—" label="What we deliver" />
        <h2 className="text-display-md text-ink mt-6 mb-10">
          Capabilities we build with you.
        </h2>
        <div className="flex flex-col gap-12">
          {service.subServices.map((sub) => (
            <article
              key={sub.title}
              className="border-l-2 border-accent pl-6 sm:pl-8"
            >
              <h3 className="font-display text-2xl text-ink leading-tight sm:text-[28px]">
                {sub.title}
              </h3>
              <p className="text-body-lg text-ink mt-3 font-medium leading-snug">
                {sub.tagline}
              </p>
              <p className="text-body text-ink-soft mt-4 leading-relaxed">
                {sub.description}
              </p>
              <ul className="mt-6 flex flex-col gap-2">
                {sub.items.map((item) => (
                  <li
                    key={item}
                    className="text-body-sm text-ink-soft flex items-start gap-3 leading-snug"
                  >
                    <span
                      aria-hidden
                      className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-accent"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </SectionShell>

      {/* Diagnose → Design → Measure */}
      <SectionShell variant="parchment" width="content">
        <NumberedSection number="—" label="How we approach it" />
        <h2 className="text-display-md text-ink mt-6 mb-8">
          Three phases, every engagement.
        </h2>
        <p className="text-body text-ink-soft mb-10 max-w-[680px] leading-relaxed">
          {service.approach}
        </p>
        <ol className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { step: "Diagnose", body: "Stakeholders, data, surrounding context — find the real challenge." },
            { step: "Design", body: "Approach tailored to your strategy, culture, and maturity." },
            { step: "Measure", body: "Outcome-linked KPIs, defined upfront, tracked through delivery." },
          ].map((p, i) => (
            <li
              key={p.step}
              className="rounded-md border border-border-subtle bg-canvas-elevated p-5"
            >
              <span className="text-label text-accent-deep">0{i + 1}</span>
              <p className="font-display text-xl text-ink mt-3 leading-tight">
                {p.step}
              </p>
              <p className="text-body-sm text-ink-soft mt-2 leading-snug">
                {p.body}
              </p>
            </li>
          ))}
        </ol>
      </SectionShell>

      {/* KPIs */}
      <SectionShell variant="canvas" width="content">
        <NumberedSection number="—" label="How we measure impact" />
        <h2 className="text-display-md text-ink mt-6 mb-8">
          Outcomes we typically track.
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {service.kpis.map((kpi) => (
            <div
              key={kpi}
              className="rounded-md border border-border-subtle bg-canvas-elevated px-4 py-4 text-center"
            >
              <span className="text-body-sm text-ink font-medium">{kpi}</span>
            </div>
          ))}
        </div>
      </SectionShell>

      {/* Related */}
      {related.length > 0 && (
        <SectionShell variant="canvas">
          <NumberedSection number="—" label="Related practices" />
          <h2 className="text-display-md text-ink mt-6 mb-8 max-w-[680px]">
            Other places this work touches.
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {related.map((s) => (
              <ServiceCard
                key={s.slug}
                number={s.number}
                title={s.shortTitle}
                tagline={s.tagline}
                href={`/what-we-do/${s.slug}`}
              />
            ))}
          </div>
        </SectionShell>
      )}

      <CTABlock
        headline={`Start with a scoping call for ${service.shortTitle}.`}
        subhead="Every engagement begins with a 30-minute discovery conversation — complimentary and focused on you."
        ctaLabel="Book a Discovery Call"
        ctaHref={`/contact?service=${service.slug}`}
      />
    </>
  );
}

// Helper export for ArrowRight rendering in Related cards (kept here to avoid an extra import elsewhere).
export { ArrowRight };
