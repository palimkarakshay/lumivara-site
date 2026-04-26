import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "canvas" | "ink" | "parchment" | "elevated";

type SectionShellProps = {
  children: ReactNode;
  variant?: Variant;
  id?: string;
  className?: string;
  innerClassName?: string;
  as?: "section" | "div" | "article";
  width?: "wide" | "content" | "prose";
};

const variantStyles: Record<Variant, string> = {
  canvas: "bg-canvas text-ink-soft",
  ink: "bg-ink text-canvas",
  parchment: "bg-parchment text-ink-soft",
  elevated: "bg-canvas-elevated text-ink-soft",
};

const widthStyles = {
  wide: "max-w-[1280px]",
  content: "max-w-[960px]",
  prose: "max-w-[720px]",
} as const;

export function SectionShell({
  children,
  variant = "canvas",
  id,
  className,
  innerClassName,
  as: Tag = "section",
  width = "wide",
}: SectionShellProps) {
  return (
    <Tag
      id={id}
      className={cn(
        "w-full py-10 sm:py-14 md:py-20 px-6 sm:px-8",
        variantStyles[variant],
        className
      )}
    >
      <div className={cn("mx-auto", widthStyles[width], innerClassName)}>
        {children}
      </div>
    </Tag>
  );
}
