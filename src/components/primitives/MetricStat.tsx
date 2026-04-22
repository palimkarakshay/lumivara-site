"use client";

import { useEffect, useState } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

type MetricStatProps = {
  /** The target value — either a number (will count up) or "—" / text (static). */
  value: string | number;
  /** Label shown under the number */
  label: string;
  /** Optional small description under the label */
  description?: string;
  /** Suffix appended to numeric values, e.g. "%", "+", "×" */
  suffix?: string;
  className?: string;
};

export function MetricStat({
  value,
  label,
  description,
  suffix,
  className,
}: MetricStatProps) {
  const { ref, revealed } = useReveal<HTMLDivElement>();
  const [display, setDisplay] = useState<string>(
    typeof value === "number" ? "0" : String(value)
  );

  useEffect(() => {
    if (!revealed || typeof value !== "number") {
      if (typeof value !== "number") setDisplay(String(value));
      return;
    }
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplay(String(value));
      return;
    }
    const start = performance.now();
    const duration = 1100;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(value * eased);
      setDisplay(String(current));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [revealed, value]);

  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-1", className)}
      role="group"
      aria-label={`${value}${suffix ?? ""} ${label}`}
    >
      <div className="font-display text-5xl leading-none text-ink sm:text-6xl">
        {display}
        {suffix && <span className="text-accent">{suffix}</span>}
      </div>
      <div className="text-label text-muted-strong mt-2">{label}</div>
      {description && (
        <p className="text-body-sm text-ink-soft mt-1">{description}</p>
      )}
    </div>
  );
}
