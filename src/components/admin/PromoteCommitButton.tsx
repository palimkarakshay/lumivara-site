"use client";

import { useState, useTransition } from "react";

import { promoteSelectedCommit } from "@/app/admin/deployments/actions";
import { cn } from "@/lib/utils";

type Status =
  | { kind: "idle" }
  | { kind: "rejected"; message: string }
  | { kind: "dispatched" }
  | { kind: "noop" }
  | { kind: "error"; message: string };

/**
 * Per-drift-row promote button on /admin/deployments. The "promote tip of
 * main" button bundles every pending change; this one promotes a single
 * specific commit (typically the squash-merge for one completed issue) so
 * the operator can ship one issue at a time.
 *
 * Forward-only invariant is enforced server-side via assertSafePromotion;
 * picking a SHA older than current production is refused with the standard
 * `would_overwrite_newer` message.
 */
export function PromoteCommitButton({
  clientSlug,
  candidateSha,
  issueNumber,
  commitSubject,
}: {
  clientSlug: string;
  candidateSha: string;
  issueNumber: number | null;
  commitSubject: string;
}) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [pending, startTransition] = useTransition();

  const shortSha = candidateSha.slice(0, 7);
  const issueLabel = issueNumber ? `#${issueNumber}` : null;
  const buttonLabel = pending
    ? "Promoting…"
    : `Promote ${issueLabel ?? shortSha} → production`;

  function fire() {
    const subjectPreview = commitSubject.slice(0, 80);
    const ok = window.confirm(
      `Promote ${shortSha}${issueLabel ? ` (${issueLabel} — ${subjectPreview})` : ` (${subjectPreview})`} to production for "${clientSlug}"?\n\nThe forward-only guard runs first; an older SHA will be refused. Click cancel if unsure.`,
    );
    if (!ok) return;
    setStatus({ kind: "idle" });
    startTransition(async () => {
      const res = await promoteSelectedCommit(
        clientSlug,
        candidateSha,
        issueNumber ?? 0,
      );
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
        disabled={pending}
        onClick={fire}
        className={cn(
          "inline-flex min-h-[36px] w-fit items-center justify-center rounded-md px-3 text-caption font-medium",
          "border border-border-subtle bg-canvas text-ink hover:bg-ink hover:text-canvas",
          "disabled:opacity-50 disabled:cursor-not-allowed",
        )}
      >
        {buttonLabel}
      </button>

      {status.kind === "dispatched" ? (
        <p
          role="status"
          className="rounded-md border border-accent/40 bg-accent/10 p-2 text-caption text-accent-deep"
        >
          Production deploy dispatched for {shortSha}. The live badge flips when Vercel finishes building (typically 60–120 s).
        </p>
      ) : null}
      {status.kind === "noop" ? (
        <p
          role="status"
          className="rounded-md border border-border-subtle bg-canvas-elevated p-2 text-caption text-ink-soft"
        >
          That SHA is already serving production — nothing to do.
        </p>
      ) : null}
      {status.kind === "rejected" ? (
        <p
          role="alert"
          className="rounded-md border border-[color:var(--error)]/30 bg-[color:var(--error)]/10 p-2 text-caption text-[color:var(--error)]"
        >
          {status.message}
        </p>
      ) : null}
      {status.kind === "error" ? (
        <p
          role="alert"
          className="rounded-md border border-[color:var(--error)]/30 bg-[color:var(--error)]/10 p-2 text-caption text-[color:var(--error)]"
        >
          {status.message}
        </p>
      ) : null}
    </div>
  );
}
