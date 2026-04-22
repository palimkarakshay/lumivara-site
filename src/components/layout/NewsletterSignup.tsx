"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type NewsletterSignupProps = {
  className?: string;
  pitch?: string;
  placeholder?: string;
  variant?: "light" | "dark";
};

export function NewsletterSignup({
  className,
  pitch = "Field notes on people strategy — monthly.",
  placeholder = "your@email.com",
  variant = "light",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const isDark = variant === "dark";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "newsletter", email }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div
        className={cn(
          "flex items-start gap-3 rounded-md border p-4",
          isDark
            ? "border-canvas/15 bg-canvas/[0.04] text-canvas"
            : "border-border-subtle bg-canvas-elevated text-ink",
          className
        )}
      >
        <Check size={18} className="mt-0.5 text-accent" aria-hidden />
        <div>
          <p className="text-body-sm font-medium">You're on the list.</p>
          <p
            className={cn(
              "text-caption mt-1",
              isDark ? "text-canvas/70" : "text-muted-strong"
            )}
          >
            First field note ships soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("flex flex-col gap-3", className)}>
      <p
        className={cn(
          "text-body-sm",
          isDark ? "text-canvas/75" : "text-ink-soft"
        )}
      >
        {pitch}
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            required
            className={cn(
              "w-full rounded-md border px-3 py-2.5 text-body-sm outline-none transition-colors focus:border-accent",
              isDark
                ? "border-canvas/20 bg-canvas/[0.04] text-canvas placeholder:text-canvas/40"
                : "border-border-subtle bg-canvas-elevated text-ink placeholder:text-muted-strong"
            )}
          />
        </label>
        <button
          type="submit"
          disabled={status === "loading"}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-60",
            isDark
              ? "bg-accent text-ink hover:bg-accent-soft"
              : "bg-ink text-canvas hover:bg-accent hover:text-ink"
          )}
        >
          {status === "loading" ? "…" : "Subscribe"}
          <ArrowRight size={14} aria-hidden />
        </button>
      </div>
      {status === "error" && (
        <p className="text-caption text-error">
          Something went wrong. Try again or email us directly.
        </p>
      )}
    </form>
  );
}
