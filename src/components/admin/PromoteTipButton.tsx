"use client";

import { useState, useTransition } from "react";

import { promoteTipOfMain } from "@/app/admin/deployments/actions";
import { cn } from "@/lib/utils";

type Status =
  | { kind: "idle" }
  | { kind: "rejected"; message: string }
  | { kind: "dispatched" }
  | { kind: "noop" }
  | { kind: "error"; message: string };

/**
 * Operator-only single-action button for the global /admin/deployments
 * page. Confirms before firing, then delegates to the promoteTipOfMain
 * server action. Disabled when there's nothing to promote (drift = 0)
 * or when the button is wired but the user lacks permission.
 */
export function PromoteTipButton({
  clientSlug,
  candidateSha,
  candidateLabel,
  disabled,
  disabledReason,
}: {
  clientSlug: string;
  candidateSha: string | null;
  candidateLabel: string;
  disabled: boolean;
  disabledReason?: string;
}) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [pending, startTransition] = useTransition();

  function fire() {
    if (!candidateSha) return;
    const ok = window.confirm(
      `Promote ${candidateLabel} to production for "${clientSlug}"?\n\nThis will overwrite the live site with the latest tip of main. Click cancel if unsure.`,
    );
    if (!ok) return;
    setStatus({ kind: "idle" });
    startTransition(async () => {
      const res = await promoteTipOfMain(clientSlug, candidateSha);
      if (!res.ok) {
        setStatus({ kind: "error", message: res.error });
        return;
      }
      if (res.rejected) {
        setStatus({ kind: "rejected", message: res.rejected.message });
        return;
      }
      if (res.noop) {
        setStatus({ kind: "noop" });
        return;
      }
      setStatus({ kind: "dispatched" });
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        disabled={disabled || pending || candidateSha == null}
        onClick={fire}
        className={cn(
          "inline-flex min-h-[44px] items-center justify-center rounded-md px-4 text-base font-medium",
          "bg-ink text-canvas hover:bg-accent hover:text-ink",
          "disabled:opacity-50 disabled:cursor-not-allowed",
        )}
        title={disabled ? disabledReason : undefined}
      >
        {pending ? "Promoting…" : "Promote tip of main → production"}
      </button>

      {disabled && disabledReason ? (
        <p className="text-caption text-muted-strong">{disabledReason}</p>
      ) : null}

      {status.kind === "dispatched" ? (
        <p
          role="status"
          className="rounded-md border border-accent/40 bg-accent/10 p-3 text-body-sm text-accent-deep"
        >
          Production deploy dispatched. The live badge will flip when Vercel
          finishes building (typically 60–120 s).
        </p>
      ) : null}
      {status.kind === "noop" ? (
        <p
          role="status"
          className="rounded-md border border-border-subtle bg-canvas-elevated p-3 text-body-sm text-ink-soft"
        >
          That SHA is already serving production — nothing to do.
        </p>
      ) : null}
      {status.kind === "rejected" ? (
        <p
          role="alert"
          className="rounded-md border border-[color:var(--error)]/30 bg-[color:var(--error)]/10 p-3 text-body-sm text-[color:var(--error)]"
        >
          {status.message}
        </p>
      ) : null}
      {status.kind === "error" ? (
        <p
          role="alert"
          className="rounded-md border border-[color:var(--error)]/30 bg-[color:var(--error)]/10 p-3 text-body-sm text-[color:var(--error)]"
        >
          {status.message}
        </p>
      ) : null}
    </div>
  );
}
