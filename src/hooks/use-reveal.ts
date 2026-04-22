"use client";

import { useEffect, useRef, useState } from "react";

type Options = {
  /** Fire once and disconnect. Default true. */
  once?: boolean;
  /** IntersectionObserver rootMargin. Default "0px 0px -10% 0px". */
  rootMargin?: string;
  /** IntersectionObserver threshold. Default 0.15. */
  threshold?: number;
};

export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: Options = {}
) {
  const { once = true, rootMargin = "0px 0px -10% 0px", threshold = 0.15 } =
    options;
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setRevealed(false);
          }
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, rootMargin, threshold]);

  return { ref, revealed };
}
