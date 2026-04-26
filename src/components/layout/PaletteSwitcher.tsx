"use client";

import { usePalette } from "@/hooks/use-palette";
import { palettes } from "@/lib/themes";
import { cn } from "@/lib/utils";

type PaletteSwitcherProps = {
  className?: string;
};

export function PaletteSwitcher({ className }: PaletteSwitcherProps) {
  const { palette, setPalette, mounted } = usePalette();

  if (!mounted) {
    return (
      <div
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-md border border-border-subtle px-2",
          className
        )}
        aria-hidden
      >
        {palettes.map((p) => (
          <div key={p.id} className="h-5 w-5" />
        ))}
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="Color palette"
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-md border border-border-subtle px-2",
        className
      )}
    >
      {palettes.map((p) => {
        const active = palette === p.id;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => setPalette(p.id)}
            aria-label={`Switch to ${p.label} palette`}
            aria-pressed={active}
            title={p.label}
            className={cn(
              "h-5 w-5 rounded-full border border-border-subtle transition-transform",
              active
                ? "ring-2 ring-accent ring-offset-2 ring-offset-canvas"
                : "hover:scale-110"
            )}
            style={{ backgroundColor: p.swatch }}
          />
        );
      })}
    </div>
  );
}
