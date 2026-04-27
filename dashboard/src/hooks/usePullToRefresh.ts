import { useEffect, useRef, useState } from "react";

const TRIGGER_PX = 80;
const MAX_PX = 120;

// Pull-down-to-refresh, only fires when the page is already scrolled to
// the top. Returns the current pull distance (for the indicator) and a
// `refreshing` flag during the async callback.
export function usePullToRefresh(
  scrollContainer: HTMLElement | Window | null,
  onRefresh: () => Promise<unknown>,
) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef<number | null>(null);

  useEffect(() => {
    const target = scrollContainer ?? window;
    if (!target) return;

    const getScrollTop = () =>
      target === window
        ? window.scrollY
        : (target as HTMLElement).scrollTop;

    function onTouchStart(e: TouchEvent) {
      if (getScrollTop() > 0) return;
      startY.current = e.touches[0].clientY;
    }
    function onTouchMove(e: TouchEvent) {
      if (startY.current === null) return;
      const dy = e.touches[0].clientY - startY.current;
      if (dy <= 0) {
        setPull(0);
        return;
      }
      // Rubber-band: scale dy non-linearly so the indicator never
      // matches finger movement 1:1, hinting at resistance.
      const scaled = Math.min(MAX_PX, dy * 0.6);
      setPull(scaled);
    }
    async function onTouchEnd() {
      const dy = pullRef.current;
      startY.current = null;
      if (dy >= TRIGGER_PX && !refreshingRef.current) {
        refreshingRef.current = true;
        setRefreshing(true);
        try {
          await onRefresh();
        } finally {
          refreshingRef.current = false;
          setRefreshing(false);
          setPull(0);
        }
      } else {
        setPull(0);
      }
    }

    target.addEventListener("touchstart", onTouchStart as EventListener, {
      passive: true,
    });
    target.addEventListener("touchmove", onTouchMove as EventListener, {
      passive: true,
    });
    target.addEventListener("touchend", onTouchEnd as EventListener);
    return () => {
      target.removeEventListener("touchstart", onTouchStart as EventListener);
      target.removeEventListener("touchmove", onTouchMove as EventListener);
      target.removeEventListener("touchend", onTouchEnd as EventListener);
    };
    // onRefresh deliberately omitted — we capture by ref to avoid
    // re-binding listeners on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollContainer]);

  // Mirror state into refs so the touchend handler reads fresh values
  // without forcing the effect to re-attach.
  const pullRef = useRef(0);
  const refreshingRef = useRef(false);
  pullRef.current = pull;
  refreshingRef.current = refreshing;

  return { pull, refreshing, triggerThreshold: TRIGGER_PX };
}
