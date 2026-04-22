import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { homeContent } from "@/content/home";
import { services } from "@/content/services";
import { SectionShell } from "@/components/primitives/SectionShell";
import { NumberedSection } from "@/components/primitives/NumberedSection";
import { ServiceCard } from "@/components/primitives/ServiceCard";
import { Reveal } from "@/components/primitives/Reveal";

export function ServicesGrid() {
  const { servicesGrid } = homeContent;
  const [num, label] = servicesGrid.monoLabel.split(" / ");
  return (
    <SectionShell variant="canvas" id="services">
      <NumberedSection number={num} label={label} />
      <h2 className="text-display-lg text-ink mt-6 mb-10 max-w-[880px]">
        {servicesGrid.heading}
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.slug} delay={i * 60}>
            <ServiceCard
              number={s.number}
              title={s.shortTitle}
              tagline={s.tagline}
              href={`/what-we-do/${s.slug}`}
              className="h-full"
            />
          </Reveal>
        ))}
      </div>
      <div className="mt-10">
        <Link
          href={servicesGrid.seeAll.href}
          className="group inline-flex items-center gap-2 rounded-md border border-border-subtle bg-canvas-elevated px-5 py-3 text-body-sm font-medium text-ink transition-colors hover:border-accent"
        >
          {servicesGrid.seeAll.label}
          <ArrowRight
            size={14}
            aria-hidden
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </SectionShell>
  );
}
