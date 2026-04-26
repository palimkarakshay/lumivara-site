import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { homeContent } from "@/content/home";
import { siteConfig } from "@/lib/site-config";
import { SectionShell } from "@/components/primitives/SectionShell";
import { NumberedSection } from "@/components/primitives/NumberedSection";
import { FounderPortrait } from "@/components/sections/FounderPortrait";

export function FounderModule() {
  const { founder } = homeContent;
  return (
    <SectionShell variant="canvas">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-14">
        <div className="md:col-span-5">
          <FounderPortrait />
        </div>
        <div className="md:col-span-7 md:pt-8">
          <NumberedSection number="—" label={founder.monoLabel} />
          <h2 className="text-display-md text-ink mt-5 mb-1">{founder.name}</h2>
          <p className="text-label text-muted-strong mb-8">{founder.subtitle}</p>
          <div className="flex flex-col gap-5 text-body text-ink-soft leading-relaxed">
            {founder.bioParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <ul className="text-label text-muted-strong mt-8 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {founder.credentials.map((c, i) => (
              <li key={c} className="flex items-center gap-3">
                <span>{c}</span>
                {i < founder.credentials.length - 1 && (
                  <span aria-hidden className="text-accent">·</span>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link
              href={founder.cta.href}
              className="group inline-flex items-center gap-2 text-label text-ink transition-colors hover:text-accent"
            >
              {founder.cta.label}
              <ArrowRight
                size={14}
                aria-hidden
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <a
              href={siteConfig.founderLinkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-label text-muted-strong hover:text-ink transition-colors"
            >
              LinkedIn →
              <span className="sr-only">(opens in new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
