"use client";

import { useState, useTransition } from "react";

import { cn } from "@/lib/utils";

import { submitIdea, type SubmitResult } from "./actions";

type Status =
  | { kind: "idle" }
  | { kind: "ok" }
  | { kind: "error"; text: string };

type Props = {
  slug: string;
  /** Hide channels the client's tier doesn't include — copy-only nudge. */
  hasEmailChannel: boolean;
  hasSmsChannel: boolean;
};

export function IntakeForm({ slug, hasEmailChannel, hasSmsChannel }: Props) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        setStatus({ kind: "idle" });
        startTransition(async () => {
          const result: SubmitResult = await submitIdea(slug, formData);
          if (result.ok) {
            setStatus({ kind: "ok" });
            const form = document.querySelector<HTMLFormElement>("#intake-form");
            form?.reset();
          } else {
            setStatus({ kind: "error", text: result.error });
          }
        });
      }}
      id="intake-form"
      className="flex flex-col gap-4"
    >
      <label className="flex flex-col gap-1">
        <span className="text-label text-muted-strong">Title</span>
        <input
          name="title"
          required
          minLength={4}
          maxLength={120}
          placeholder="e.g. Add the Crisp chat widget to the homepage"
          className="min-h-[44px] rounded-md border border-border-subtle bg-canvas px-3 text-base text-ink placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-label text-muted-strong">What should we do</span>
        <textarea
          name="body"
          required
          minLength={10}
          maxLength={4000}
          rows={6}
          placeholder="Be as specific as you like. We'll come back with questions if anything is ambiguous."
          className="rounded-md border border-border-subtle bg-canvas px-3 py-2 text-base text-ink placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className={cn(
          "min-h-[44px] rounded-md bg-ink px-4 text-base font-medium text-canvas",
          "hover:bg-accent hover:text-ink disabled:opacity-60",
        )}
      >
        {pending ? "Sending…" : "Send request"}
      </button>

      {status.kind === "ok" ? (
        <p
          role="status"
          className="rounded-md border border-[color:var(--success)]/30 bg-[color:var(--success)]/10 p-3 text-body-sm text-[color:var(--success)]"
        >
          Got it. We&rsquo;ll review and update the Requests tab within a few
          minutes.
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

      {(hasEmailChannel || hasSmsChannel) && (
        <p className="text-caption text-ink-soft mt-2">
          You can also{" "}
          {hasEmailChannel ? (
            <>
              email{" "}
              <a
                href="mailto:requests@lumivara.ca"
                className="underline text-accent-deep"
              >
                requests@lumivara.ca
              </a>
            </>
          ) : null}
          {hasEmailChannel && hasSmsChannel ? " or " : ""}
          {hasSmsChannel ? "text our intake number" : ""}
          {" "}— same queue, same status.
        </p>
      )}
    </form>
  );
}
