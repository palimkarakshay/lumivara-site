import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type PrincipleCardProps = {
  number: string;
  title: string;
  body: string | ReactNode;
  className?: string;
  variant?: "light" | "dark";
};

export function PrincipleCard({
  number,
  title,
  body,
  className,
  variant = "light",
}: PrincipleCardProps) {
  const isDark = variant === "dark";
  return (
    <article
      className={cn(
        "flex h-full flex-col gap-3 rounded-lg border p-4 transition-all duration-300 md:gap-4 md:p-6",
        isDark
          ? "border-canvas/10 bg-canvas/[0.04] backdrop-blur-sm hover:border-accent/40 hover:bg-canvas/[0.06]"
          : "border-border-subtle bg-canvas-elevated hover:border-accent/50 hover:shadow-sm",
        className
      )}
    >
      <span
        className={cn(
          "text-label",
          isDark ? "text-accent" : "text-accent-deep"
        )}
      >
        {number}
      </span>
      <h3
        className={cn(
          "font-display text-2xl leading-tight tracking-tight",
          isDark ? "text-canvas" : "text-ink"
        )}
      >
        {title}
      </h3>
      <div
        className={cn(
          "text-body leading-relaxed",
          isDark ? "text-canvas/75" : "text-ink-soft"
        )}
      >
        {body}
      </div>
    </article>
  );
}
