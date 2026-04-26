"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site-config";

function formatTorontoTime(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());
}

export function TorontoTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    // Deferred initial set avoids synchronous setState-in-effect lint rule.
    // time === null on SSR so hydration stays clean.
    const init = setTimeout(() => setTime(formatTorontoTime()), 0);
    const interval = setInterval(() => setTime(formatTorontoTime()), 60_000);
    return () => {
      clearTimeout(init);
      clearInterval(interval);
    };
  }, []);

  if (time === null) return <span>{siteConfig.location}</span>;

  return (
    <span>
      {siteConfig.location}
      <span aria-hidden className="mx-1 text-accent">
        ·
      </span>
      {time} ET
    </span>
  );
}
