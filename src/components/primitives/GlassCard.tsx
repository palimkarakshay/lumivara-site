import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
  interactive?: boolean;
};

export function GlassCard({
  children,
  className,
  as: Tag = "div",
  interactive = false,
}: GlassCardProps) {
  return (
    <Tag
      className={cn(
        "rounded-lg border border-border-subtle bg-canvas-elevated/70 p-6 backdrop-blur-sm transition-all duration-300 sm:p-8",
        interactive &&
          "hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-lg",
        className
      )}
    >
      {children}
    </Tag>
  );
}
