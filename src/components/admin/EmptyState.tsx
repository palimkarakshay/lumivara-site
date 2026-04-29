import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, action, className }: Props) {
  return (
    <div
      className={cn(
        "rounded-lg border border-dashed border-border-subtle bg-canvas-elevated p-8 text-center",
        className,
      )}
    >
      <p className="font-display text-lg text-ink">{title}</p>
      {description ? (
        <p className="text-body-sm text-ink-soft mt-2 max-w-prose mx-auto">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}
