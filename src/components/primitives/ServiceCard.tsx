import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ServiceCardProps = {
  number: string;
  title: string;
  tagline: string;
  description?: string;
  href: string;
  className?: string;
  variant?: "light" | "parchment";
};

export function ServiceCard({
  number,
  title,
  tagline,
  description,
  href,
  className,
  variant = "light",
}: ServiceCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex h-full flex-col gap-4 rounded-lg border border-border-subtle p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-sm sm:p-7",
        variant === "parchment" ? "bg-parchment" : "bg-canvas-elevated",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-label text-accent-deep">{number}</span>
        <ArrowRight
          size={18}
          aria-hidden
          className="text-muted-strong transition-all group-hover:text-accent group-hover:translate-x-1"
        />
      </div>
      <h3 className="font-display text-2xl leading-tight tracking-tight text-ink">
        {title}
      </h3>
      <p className="text-body-sm font-medium text-ink leading-snug">{tagline}</p>
      {description && (
        <p className="text-body-sm text-ink-soft leading-relaxed">{description}</p>
      )}
      <span className="text-label text-accent-deep mt-auto pt-3 opacity-0 transition-opacity group-hover:opacity-100">
        Learn more →
      </span>
    </Link>
  );
}
