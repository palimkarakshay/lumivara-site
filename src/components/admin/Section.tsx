import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Inline action — e.g. "View on GitHub" link. */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** Section header + content wrapper, used by every admin page. */
export function Section({
  eyebrow,
  title,
  description,
  action,
  children,
  className,
}: Props) {
  return (
    <section className={cn("flex flex-col gap-4", className)}>
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-caption text-muted-strong uppercase tracking-wider">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="font-display text-2xl text-ink mt-1">{title}</h2>
          {description ? (
            <p className="text-body-sm text-ink-soft mt-1 max-w-prose">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>
      {children}
    </section>
  );
}
