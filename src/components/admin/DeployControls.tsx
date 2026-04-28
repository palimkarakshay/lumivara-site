"use client";

import { useState, useTransition } from "react";

import { cn } from "@/lib/utils";

import { confirmDeploy } from "@/app/admin/client/[slug]/request/[number]/actions";

type DeployState = "idle" | "deploying" | "live" | "failed";

type Status =
  | { kind: "idle" }
  | { kind: "deploying" }
  | { kind: "already" }
  | { kind: "error"; text: string };

type Props = {
  slug: string;
  issueNumber: number;
  prHeadSha: string | null;
  previewUrl: string | null;
  /** Initial state from the issue's labels — drives badge colour. */
  initialState: DeployState;
  /** False when the tier doesn't include client-side deploy approval. */
  approvalEnabled: boolean;
  /** Copy explaining why the button is disabled (tier upsell or missing PR). */
  disabledReason?: string;
};

export function DeployControls({
  slug,
  issueNumber,
  prHeadSha,
  previewUrl,
  initialState,
  approvalEnabled,
  disabledReason,
}: Props) {
  const [status, setStatus] = useState<Status>(
    initialState === "deploying" ? { kind: "deploying" } : { kind: "idle" },
  );
  const [pending, startTransition] = useTransition();

  function fire() {
    if (!prHeadSha) return;
    setStatus({ kind: "idle" });
    startTransition(async () => {
      const result = await confirmDeploy(slug, issueNumber, prHeadSha);
      if (result.ok) {
        setStatus(
          result.alreadyInFlight ? { kind: "already" } : { kind: "deploying" },
        );
      } else {
        setStatus({ kind: "error", text: result.error });
      }
    });
  }

  const showBadge =
    initialState === "live" ||
    initialState === "failed" ||
    status.kind === "deploying";

  return (
    <div className="flex flex-col gap-3">
      {showBadge ? <DeployBadge state={effectiveState(initialState, status)} /> : null}

      <div className="flex flex-wrap gap-2">
        {previewUrl ? (
          <a
            href={previewUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-border-subtle bg-canvas px-4 text-base font-medium text-ink hover:bg-parchment"
          >
            View test build ↗
          </a>
        ) : (
          <span className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-border-subtle bg-canvas-elevated px-4 text-base font-medium text-muted-strong">
            Preview building…
          </span>
        )}

        <button
          type="button"
          disabled={
            !approvalEnabled || !prHeadSha || pending || initialState === "live"
          }
          onClick={fire}
          className={cn(
            "inline-flex min-h-[44px] items-center justify-center rounded-md px-4 text-base font-medium",
            approvalEnabled
              ? "bg-ink text-canvas hover:bg-accent hover:text-ink"
              : "border border-border-subtle bg-canvas text-ink-soft cursor-not-allowed",
            "disabled:opacity-60",
          )}
          title={!approvalEnabled ? disabledReason : undefined}
        >
          {pending
            ? "Working…"
            : initialState === "live"
              ? "Deployed"
              : status.kind === "deploying"
                ? "Deploying…"
                : "Confirm deploy"}
        </button>
      </div>

      {!approvalEnabled && disabledReason ? (
        <p className="text-caption text-muted-strong">{disabledReason}</p>
      ) : null}

      {status.kind === "already" ? (
        <p
          role="status"
          className="rounded-md border border-accent/40 bg-accent/10 p-3 text-body-sm text-accent-deep"
        >
          Already deploying this build — give it a minute.
        </p>
      ) : null}
      {status.kind === "error" ? (
        <p
          role="alert"
          className="rounded-md border border-[color:var(--error)]/30 bg-[color:var(--error)]/10 p-3 text-body-sm text-[color:var(--error)]"
        >
          {status.text}
        </p>
      ) : null}
    </div>
  );
}

function effectiveState(initial: DeployState, status: Status): DeployState {
  if (status.kind === "deploying") return "deploying";
  return initial;
}

function DeployBadge({ state }: { state: DeployState }) {
  if (state === "live") {
    return (
      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[color:var(--success)]/15 px-3 py-1 text-caption font-medium text-[color:var(--success)]">
        <span aria-hidden className="h-2 w-2 rounded-full bg-[color:var(--success)]" />
        Live
      </span>
    );
  }
  if (state === "failed") {
    return (
      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[color:var(--error)]/15 px-3 py-1 text-caption font-medium text-[color:var(--error)]">
        <span aria-hidden className="h-2 w-2 rounded-full bg-[color:var(--error)]" />
        Deploy failed — team notified
      </span>
    );
  }
  if (state === "deploying") {
    return (
      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-accent-soft/30 px-3 py-1 text-caption font-medium text-accent-deep">
        <span
          aria-hidden
          className="h-2 w-2 animate-pulse rounded-full bg-accent"
        />
        Deploying now…
      </span>
    );
  }
  return null;
}
