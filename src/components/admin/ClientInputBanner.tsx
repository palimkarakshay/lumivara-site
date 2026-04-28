"use client";

import { useState, useTransition } from "react";

import { cn } from "@/lib/utils";
import type { AskQuestion } from "@/lib/admin/ask-parser";

import {
  submitClientDecision,
  type DecisionInput,
} from "@/app/admin/client/[slug]/request/[number]/actions";

type Status =
  | { kind: "idle" }
  | { kind: "ok" }
  | { kind: "error"; text: string };

type Props = {
  slug: string;
  issueNumber: number;
  ask: AskQuestion;
};

export function ClientInputBanner({ slug, issueNumber, ask }: Props) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [pending, startTransition] = useTransition();
  const [textDraft, setTextDraft] = useState("");

  function send(input: DecisionInput) {
    setStatus({ kind: "idle" });
    startTransition(async () => {
      const result = await submitClientDecision(slug, issueNumber, input);
      if (result.ok) {
        setStatus({ kind: "ok" });
        setTextDraft("");
      } else {
        setStatus({ kind: "error", text: result.error });
      }
    });
  }

  return (
    <section
      role="region"
      aria-label="Action needed"
      className="rounded-lg border-2 border-[color:var(--error)]/40 bg-[color:var(--error)]/5 p-5"
    >
      <p className="text-caption text-[color:var(--error)] uppercase tracking-wider font-semibold">
        Action needed
      </p>
      <h3 className="font-display text-lg text-ink mt-2">{ask.question}</h3>

      {ask.options.length > 0 ? (
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {ask.options.map((opt) => (
            <li key={opt.id}>
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  send({
                    kind: "option",
                    optionId: opt.id,
                    optionLabel: opt.label,
                  })
                }
                className={cn(
                  "min-h-[44px] w-full rounded-md border bg-canvas px-4 text-left text-base font-medium text-ink",
                  "border-border-subtle hover:border-accent hover:bg-parchment",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                )}
              >
                <span className="font-mono text-muted-strong mr-2">
                  {opt.id})
                </span>
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <form
          action={() => {
            const text = textDraft;
            send({ kind: "free", text });
          }}
          className="mt-4 flex flex-col gap-2"
        >
          <textarea
            value={textDraft}
            onChange={(e) => setTextDraft(e.target.value)}
            required
            minLength={2}
            maxLength={2000}
            rows={4}
            disabled={pending}
            placeholder="Type your answer here…"
            className="rounded-md border border-border-subtle bg-canvas px-3 py-2 text-base text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
          <button
            type="submit"
            disabled={pending || textDraft.trim().length < 2}
            className="min-h-[44px] rounded-md bg-ink px-4 text-base font-medium text-canvas hover:bg-accent hover:text-ink disabled:opacity-60"
          >
            {pending ? "Sending…" : "Send answer"}
          </button>
        </form>
      )}

      {status.kind === "ok" ? (
        <p
          role="status"
          className="mt-4 rounded-md border border-[color:var(--success)]/30 bg-[color:var(--success)]/10 p-3 text-body-sm text-[color:var(--success)]"
        >
          Got it. We&rsquo;ll keep going.
        </p>
      ) : null}
      {status.kind === "error" ? (
        <p
          role="alert"
          className="mt-4 rounded-md border border-[color:var(--error)]/30 bg-[color:var(--error)]/10 p-3 text-body-sm text-[color:var(--error)]"
        >
          {status.text}
        </p>
      ) : null}
    </section>
  );
}
