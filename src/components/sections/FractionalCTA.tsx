import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { homeContent } from "@/content/home";
import { SectionShell } from "@/components/primitives/SectionShell";
import { NumberedSection } from "@/components/primitives/NumberedSection";

export function FractionalCTA() {
  const { fractionalCta } = homeContent;
  return (
    <SectionShell variant="parchment">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <NumberedSection number="—" label={fractionalCta.monoLabel} />
          <h2 className="text-display-md text-ink mt-5 mb-5">
            {fractionalCta.heading}
          </h2>
          <p className="text-body-lg text-ink-soft max-w-[580px]">
            {fractionalCta.body}
          </p>
          <ul className="text-label text-muted-strong mt-6 flex flex-wrap items-center gap-3">
            {fractionalCta.modes.map((m) => (
              <li
                key={m}
                className="rounded-sm border border-border-subtle bg-canvas-elevated px-3 py-1.5"
              >
                {m}
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-5 md:flex md:justify-end">
          <Link
            href={fractionalCta.cta.href}
            className="group inline-flex items-center gap-2 rounded-md bg-ink px-6 py-3.5 font-medium text-canvas transition-colors hover:bg-accent hover:text-ink"
          >
            <span>{fractionalCta.cta.label}</span>
            <ArrowRight
              size={16}
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </SectionShell>
  );
}
