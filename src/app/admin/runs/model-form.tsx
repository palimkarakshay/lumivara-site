"use client";

import { useState, useTransition } from "react";

import { MODEL_CHOICES } from "@/lib/dashboard/models";

import { updateDefaultExecuteModel } from "./actions";

type Props = {
  currentModelId: string | null;
  disabled?: boolean;
  disabledReason?: string;
};

export function ModelForm({ currentModelId, disabled, disabledReason }: Props) {
  const initial = currentModelId ?? MODEL_CHOICES[1].id;
  const [selected, setSelected] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<
    { kind: "ok" | "error"; text: string } | null
  >(null);

  const dirty = selected !== (currentModelId ?? "");

  return (
    <form
      action={(formData) => {
        setMessage(null);
        startTransition(async () => {
          const result = await updateDefaultExecuteModel(formData);
          if (result.ok) {
            setMessage({ kind: "ok", text: "Saved. Active on the next run." });
          } else {
            setMessage({ kind: "error", text: result.error });
          }
        });
      }}
      className="flex flex-col gap-3"
    >
      <label htmlFor="model" className="text-label text-muted-strong">
        Default model for next execute
      </label>
      <select
        id="model"
        name="model"
        value={selected}
        onChange={(event) => setSelected(event.target.value)}
        disabled={disabled || pending}
        className="min-h-[44px] w-full rounded-md border border-border-subtle bg-canvas px-3 text-base text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-60"
      >
        {MODEL_CHOICES.map((choice) => (
          <option key={choice.id} value={choice.id}>
            {choice.label} — {choice.description}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={disabled || pending || !dirty}
        className="min-h-[44px] w-full rounded-md bg-ink px-4 text-base font-medium text-canvas hover:bg-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving…" : dirty ? "Save default" : "Saved"}
      </button>
      {disabled && disabledReason ? (
        <p className="text-caption text-muted-strong">{disabledReason}</p>
      ) : null}
      {message ? (
        <p
          role="status"
          className={
            message.kind === "ok"
              ? "text-caption text-ink"
              : "text-caption text-red-700"
          }
        >
          {message.text}
        </p>
      ) : null}
    </form>
  );
}
