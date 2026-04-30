import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { homeContent } from "@/content/home";
import { NumberedSection } from "@/components/primitives/NumberedSection";

export function HomeHero() {
  const { hero } = homeContent;
  return (
    <section
      aria-label="Introduction"
      className="relative isolate flex min-h-[88vh] flex-col justify-center overflow-hidden px-6 py-24 sm:px-8 sm:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[620px] w-[620px] rounded-full opacity-60 blur-3xl animate-drift"
        style={{
          background:
            "radial-gradient(closest-side, rgba(200,145,46,0.28), rgba(200,145,46,0) 70%)",
        }}
      />
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="max-w-[880px]">
          <Link
            href={hero.forgeBadge.href}
            aria-label={hero.forgeBadge.ariaLabel}
            className="mb-6 inline-flex min-h-[44px] items-center rounded-full border border-border-subtle bg-canvas-elevated px-3 text-label text-ink-soft transition-colors hover:border-accent hover:text-ink sm:mb-5 sm:min-h-0 sm:px-2.5 sm:py-1"
          >
            {hero.forgeBadge.label}
          </Link>
          <NumberedSection number="—" label={hero.monoLabel} />
          <h1 className="text-display-xl text-ink mt-6 mb-8">
            {hero.headline}
          </h1>
          <p className="text-body-lg text-ink-soft max-w-[640px]">
            {hero.subhead}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={hero.primaryCta.href}
              className="group inline-flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-3.5 font-medium text-ink transition-colors hover:bg-accent-soft"
            >
              <span>{hero.primaryCta.label}</span>
              <ArrowRight
                size={16}
                aria-hidden
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href={hero.secondaryCta.href}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border-subtle bg-canvas-elevated px-6 py-3.5 font-medium text-ink transition-colors hover:border-accent"
            >
              {hero.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-label text-muted-strong md:flex motion-reduce:hidden"
      >
        <ArrowDown size={12} className="animate-bounce" />
        <span>Scroll</span>
      </div>
    </section>
  );
}
