"use client";

import { Moon, Monitor, Sun } from "lucide-react";
import { useTheme, type Theme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
};

const options: { value: Theme; label: string; Icon: React.ElementType }[] = [
  { value: "light", label: "Light mode", Icon: Sun },
  { value: "system", label: "System preference", Icon: Monitor },
  { value: "dark", label: "Dark mode", Icon: Moon },
];

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div
        className={cn(
          "inline-flex h-9 rounded-md border border-border-subtle",
          className
        )}
        aria-hidden
      >
        {options.map(({ value }) => (
          <div key={value} className="w-9" />
        ))}
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="Color theme"
      className={cn(
        "inline-flex h-9 rounded-md border border-border-subtle",
        className
      )}
    >
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          aria-label={label}
          aria-pressed={theme === value}
          className={cn(
            "inline-flex w-9 items-center justify-center transition-colors first:rounded-l-md last:rounded-r-md",
            theme === value
              ? "bg-accent text-canvas"
              : "text-ink-soft hover:text-accent"
          )}
        >
          <Icon size={16} aria-hidden />
        </button>
      ))}
    </div>
  );
}
