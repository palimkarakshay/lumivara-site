"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  DEFAULT_PALETTE,
  PALETTE_STORAGE_KEY,
  isPalette,
  type Palette,
} from "@/lib/themes";

const PALETTE_EVENT = "lumivara-palette-change";

function applyPalette(palette: Palette) {
  if (palette === DEFAULT_PALETTE) {
    delete document.documentElement.dataset.palette;
  } else {
    document.documentElement.dataset.palette = palette;
  }
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(PALETTE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(PALETTE_EVENT, callback);
  };
}

function getSnapshot(): Palette {
  try {
    const stored = localStorage.getItem(PALETTE_STORAGE_KEY);
    return isPalette(stored) ? stored : DEFAULT_PALETTE;
  } catch {
    return DEFAULT_PALETTE;
  }
}

function getServerSnapshot(): Palette {
  return DEFAULT_PALETTE;
}

function subscribeMounted(callback: () => void) {
  callback();
  return () => {};
}

const getMountedSnapshot = () => true;
const getMountedServerSnapshot = () => false;

export function usePalette() {
  const palette = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const mounted = useSyncExternalStore(
    subscribeMounted,
    getMountedSnapshot,
    getMountedServerSnapshot
  );

  const setPalette = useCallback((next: Palette) => {
    try {
      if (next === DEFAULT_PALETTE) {
        localStorage.removeItem(PALETTE_STORAGE_KEY);
      } else {
        localStorage.setItem(PALETTE_STORAGE_KEY, next);
      }
    } catch {}
    applyPalette(next);
    window.dispatchEvent(new Event(PALETTE_EVENT));
  }, []);

  return { palette, setPalette, mounted };
}
