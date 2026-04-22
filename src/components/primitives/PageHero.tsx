import { type ReactNode } from "react";
import { NumberedSection } from "./NumberedSection";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  monoLabel: string;
  monoNumber?: string;
  headline: string;
  subhead?: string | ReactNode;
  children?: ReactNode;
  className?: string;
  variant?: "canvas" | "parchment" | "ink";
};

const variantStyles = {
  canvas: "bg-canvas",
  parchment: "bg-parchment",
  ink: "bg-ink",
} as const;

export function PageHero({
  monoLabel,
  monoNumber = "—",
  headline,
  subhead,
  children,
  className,
  variant = "canvas",
}: PageHeroProps) {
  const onInk = variant === "ink";
  return (
    <section
      className={cn(
        "relative w-full px-6 pt-28 pb-20 sm:px-8 sm:pt-36 sm:pb-28",
        variantStyles[variant],
        className
      )}
    >
      <div className="mx-auto max-w-[1280px]">
        <NumberedSection
          number={monoNumber}
          label={monoLabel}
          className={onInk ? "text-canvas/60" : undefined}
        />
        <h1
          className={cn(
            "text-display-xl mt-6 max-w-[960px]",
            onInk ? "text-canvas" : "text-ink"
          )}
        >
          {headline}
        </h1>
        {subhead && (
          <div
            className={cn(
              "text-body-lg mt-7 max-w-[680px]",
              onInk ? "text-canvas/80" : "text-ink-soft"
            )}
          >
            {typeof subhead === "string" ? <p>{subhead}</p> : subhead}
          </div>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
