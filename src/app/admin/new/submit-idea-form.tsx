"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import {
  submitIdea,
  type SubmitIdeaResult,
} from "@/app/admin/_actions/submit-idea";

type Card = {
  id: string;
  title: string;
  body: string;
  status: "sending" | "received" | "error";
  message?: string;
};

export function SubmitIdeaForm() {
  const [state, action, pending] = useActionState<SubmitIdeaResult | null, FormData>(
    submitIdea,
    null,
  );
  const [cards, setCards] = useState<Card[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const pendingIdRef = useRef<string | null>(null);
  const lastStateRef = useRef<SubmitIdeaResult | null>(null);

  useEffect(() => {
    if (state === lastStateRef.current) return;
    lastStateRef.current = state;
    const id = pendingIdRef.current;
    if (!state || !id) return;
    setCards((prev) =>
      prev.map((card) =>
        card.id === id
          ? state.ok
            ? { ...card, status: "received" }
            : { ...card, status: "error", message: state.error }
          : card,
      ),
    );
    if (state.ok) {
      pendingIdRef.current = null;
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="flex flex-col gap-6">
      <form
        ref={formRef}
        action={(formData) => {
          const title = String(formData.get("title") ?? "").trim();
          const body = String(formData.get("body") ?? "").trim();
          if (!title || !body) {
            action(formData);
            return;
          }
          const id =
            typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `card-${Date.now()}`;
          pendingIdRef.current = id;
          setCards((prev) => [
            { id, title, body, status: "sending" },
            ...prev,
          ]);
          action(formData);
        }}
        className="flex flex-col gap-4 rounded-lg border border-border-subtle bg-canvas-elevated p-5"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-label text-muted-strong">
            One-line summary
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            maxLength={200}
            placeholder="e.g. Add a contact form to the homepage"
            className="min-h-[44px] w-full rounded-md border border-border-subtle bg-canvas px-4 text-base text-ink placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="body" className="text-label text-muted-strong">
            What&rsquo;s the request?
          </label>
          <textarea
            id="body"
            name="body"
            required
            minLength={1}
            maxLength={4000}
            rows={6}
            placeholder="Anything you&rsquo;d tell a designer or developer over coffee. We&rsquo;ll keep your exact words on file."
            className="w-full rounded-md border border-border-subtle bg-canvas px-4 py-3 text-base text-ink placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="min-h-[44px] w-full rounded-md bg-ink px-4 text-base font-medium text-canvas hover:bg-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send request"}
        </button>

        {state && !state.ok && !pendingIdRef.current ? (
          <p role="alert" className="text-caption text-red-700">
            {state.error}
          </p>
        ) : null}
      </form>

      {cards.length > 0 ? (
        <section
          aria-label="Recent submissions"
          className="flex flex-col gap-3"
        >
          <h2 className="text-label text-muted-strong uppercase tracking-wider">
            This session
          </h2>
          <ul className="flex flex-col gap-3">
            {cards.map((card) => (
              <li
                key={card.id}
                className="rounded-lg border border-border-subtle bg-canvas-elevated p-4"
              >
                <p className="font-display text-base text-ink">{card.title}</p>
                <p className="text-body-sm text-ink-soft mt-1 whitespace-pre-wrap break-words">
                  {card.body}
                </p>
                <p
                  role="status"
                  className={
                    "text-caption mt-3 " +
                    (card.status === "error"
                      ? "text-red-700"
                      : card.status === "received"
                        ? "text-ink"
                        : "text-muted-strong")
                  }
                >
                  {statusCopy(card)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function statusCopy(card: Card): string {
  switch (card.status) {
    case "sending":
      return "Sending…";
    case "received":
      return "Reviewing your request";
    case "error":
      return card.message
        ? `Couldn’t send — ${card.message}`
        : "Couldn’t send. Please try again.";
  }
}
