import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  showWordmark?: boolean;
};

export function Logo({ className, showWordmark = true }: LogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-2 font-display text-ink transition-colors",
        className
      )}
      aria-label="Lumivara"
    >
      <span className="text-accent text-xl leading-none" aria-hidden>
        ●
      </span>
      {showWordmark && (
        <span className="text-xl font-medium tracking-[-0.02em] lowercase leading-none sm:text-2xl">
          lumivara
        </span>
      )}
    </span>
  );
}
