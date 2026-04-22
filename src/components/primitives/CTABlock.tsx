import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionShell } from "./SectionShell";

type CTABlockProps = {
  headline: string;
  subhead?: string;
  ctaLabel: string;
  ctaHref: string;
  variant?: "ink" | "canvas" | "parchment";
  className?: string;
};

export function CTABlock({
  headline,
  subhead,
  ctaLabel,
  ctaHref,
  variant = "ink",
  className,
}: CTABlockProps) {
  return (
    <SectionShell variant={variant} width="content" className={className}>
      <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-[560px]">
          <h2
            className={cn(
              "text-display-md mb-4",
              variant === "ink" ? "text-canvas" : "text-ink"
            )}
          >
            {headline}
          </h2>
          {subhead && (
            <p
              className={cn(
                "text-body-lg",
                variant === "ink" ? "text-canvas/80" : "text-ink-soft"
              )}
            >
              {subhead}
            </p>
          )}
        </div>
        <Link
          href={ctaHref}
          className={cn(
            "group inline-flex shrink-0 items-center gap-2 rounded-md px-6 py-3.5 font-medium transition-all",
            variant === "ink"
              ? "bg-accent text-ink hover:bg-accent-soft"
              : "bg-ink text-canvas hover:bg-ink-soft"
          )}
        >
          <span>{ctaLabel}</span>
          <ArrowRight
            size={18}
            className="transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </div>
    </SectionShell>
  );
}
