"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

type PulseOption = {
  label: string;
  href: string;
};

type PulseQuestionProps = {
  question: string;
  options: readonly PulseOption[];
  className?: string;
  variant?: "light" | "parchment";
};

export function PulseQuestion({
  question,
  options,
  className,
  variant = "parchment",
}: PulseQuestionProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <aside
      aria-label="Quick guidance question"
      className={cn(
        "relative flex flex-col gap-4 rounded-lg border border-border-subtle p-6 sm:p-7",
        variant === "parchment" ? "bg-parchment" : "bg-canvas-elevated",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-strong transition-colors hover:bg-canvas-elevated hover:text-ink"
      >
        <X size={14} aria-hidden />
      </button>
      <div>
        <p className="text-label text-muted-strong mb-2">Quick question</p>
        <p className="font-display text-xl leading-snug text-ink sm:text-2xl">
          {question}
        </p>
      </div>
      <ul className="flex flex-col gap-2">
        {options.map((opt) => (
          <li key={opt.href}>
            <Link
              href={opt.href}
              className="group flex items-center justify-between rounded-md border border-border-subtle bg-canvas-elevated px-4 py-3 text-body-sm text-ink-soft transition-all hover:border-accent hover:text-ink"
            >
              <span>{opt.label}</span>
              <ArrowRight
                size={14}
                aria-hidden
                className="text-muted-strong transition-all group-hover:translate-x-0.5 group-hover:text-accent"
              />
            </Link>
          </li>
        ))}
      </ul>
      <p className="text-caption text-muted-strong">
        Anonymous — nothing is saved or shared.
      </p>
    </aside>
  );
}
