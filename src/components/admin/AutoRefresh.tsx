"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {
  /** Interval in ms. Default 30 s — matches the issue spec. */
  intervalMs?: number;
  /** Set false to pause without unmounting. */
  enabled?: boolean;
};

/**
 * Drop into a Server Component to poll fresh data without a full reload:
 * `router.refresh()` re-runs the parent server component tree without
 * losing client-side state (form drafts, scroll position). Pauses when
 * the tab is hidden so a backgrounded phone doesn't burn quota.
 */
export function AutoRefresh({ intervalMs = 30_000, enabled = true }: Props) {
  const router = useRouter();
  useEffect(() => {
    if (!enabled) return;
    let timer: ReturnType<typeof setInterval> | null = null;
    function tick() {
      if (typeof document !== "undefined" && document.hidden) return;
      router.refresh();
    }
    timer = setInterval(tick, intervalMs);
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [router, intervalMs, enabled]);
  return null;
}
