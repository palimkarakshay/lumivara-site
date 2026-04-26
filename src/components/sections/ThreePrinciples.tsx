import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { homeContent } from "@/content/home";
import { SectionShell } from "@/components/primitives/SectionShell";
import { NumberedSection } from "@/components/primitives/NumberedSection";
import { PrincipleCard } from "@/components/primitives/PrincipleCard";
import { Reveal } from "@/components/primitives/Reveal";

export function ThreePrinciples() {
  const { principles } = homeContent;
  return (
    <SectionShell variant="ink">
      <NumberedSection number="—" label={principles.monoLabel} className="text-canvas/60" />
      <h2 className="text-display-lg text-canvas mt-6 mb-8 max-w-[880px]">
        {principles.heading}
      </h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
        {principles.items.map((p, i) => (
          <Reveal key={p.number} delay={i * 80}>
            <PrincipleCard
              number={p.number}
              title={p.title}
              body={p.body}
              variant="dark"
              className="h-full"
            />
          </Reveal>
        ))}
      </div>
      <div className="mt-10">
        <Link
          href={principles.readMore.href}
          className="group inline-flex items-center gap-2 text-label text-accent transition-colors hover:text-accent-soft"
        >
          {principles.readMore.label}
          <ArrowRight
            size={14}
            aria-hidden
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    </SectionShell>
  );
}
