"use client";

import { useState, useTransition } from "react";

import { cn } from "@/lib/utils";
import { MODEL_CHOICES } from "@/lib/dashboard/models";

import {
  clearNextRunOverrideAction,
  setNextRunOverrideAction,
  updateDefaultExecuteModel,
} from "../runs/actions";

type Status =
  | { kind: "idle" }
  | { kind: "ok"; text: string }
  | { kind: "error"; text: string };

type Props = {
  defaultModelId: string | null;
  overrideModelId: string | null;
  disabled: boolean;
  disabledReason?: string;
};

export function BrainForm({
  defaultModelId,
  overrideModelId,
  disabled,
  disabledReason,
}: Props) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <DefaultModelCard
        currentId={defaultModelId}
        disabled={disabled}
        disabledReason={disabledReason}
      />
      <OverrideCard
        currentId={overrideModelId}
        disabled={disabled}
        disabledReason={disabledReason}
      />
    </div>
  );
}

function DefaultModelCard({
  currentId,
  disabled,
  disabledReason,
}: {
  currentId: string | null;
  disabled: boolean;
  disabledReason?: string;
}) {
  const initial = currentId ?? MODEL_CHOICES[0].id;
  const [selected, setSelected] = useState(initial);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [pending, startTransition] = useTransition();
  const dirty = selected !== (currentId ?? "");

  return (
    <form
      action={(formData) => {
        setStatus({ kind: "idle" });
        startTransition(async () => {
          const result = await updateDefaultExecuteModel(formData);
          setStatus(
            result.ok
              ? { kind: "ok", text: "Saved. Active on the next run." }
              : { kind: "error", text: result.error },
          );
        });
      }}
      className="flex flex-col gap-3 rounded-lg border border-border-subtle bg-canvas-elevated p-5"
    >
      <div>
        <h3 className="font-display text-lg text-ink">Default model</h3>
        <p className="text-body-sm text-ink-soft mt-1">
          Persists. Read by every triage and execute run when no{" "}
          <code className="font-mono">model/*</code> label is set on the
          issue.
        </p>
      </div>
      <ModelGrid value={selected} onChange={setSelected} disabled={disabled || pending} />
      <button
        type="submit"
        name="model"
        value={selected}
        disabled={disabled || pending || !dirty}
        className={cn(
          "min-h-[44px] rounded-md bg-ink px-4 text-base font-medium text-canvas hover:bg-accent hover:text-ink",
          "disabled:cursor-not-allowed disabled:opacity-60",
        )}
      >
        {pending ? "Saving…" : dirty ? "Save default" : "Saved"}
      </button>
      <FormStatus status={status} />
      {disabled && disabledReason ? (
        <p className="text-caption text-muted-strong">{disabledReason}</p>
      ) : null}
    </form>
  );
}

function OverrideCard({
  currentId,
  disabled,
  disabledReason,
}: {
  currentId: string | null;
  disabled: boolean;
  disabledReason?: string;
}) {
  const [selected, setSelected] = useState(currentId ?? MODEL_CHOICES[0].id);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border-subtle bg-canvas-elevated p-5">
      <div>
        <h3 className="font-display text-lg text-ink">Next-run override</h3>
        <p className="text-body-sm text-ink-soft mt-1">
          One-shot. The next CI run reads this and clears it. Useful when you
          want a single execute to run on a stronger or cheaper tier without
          changing the default.
        </p>
      </div>
      <ModelGrid
        value={selected}
        onChange={setSelected}
        disabled={disabled || pending}
      />
      {currentId ? (
        <p className="text-caption text-accent-deep">
          Currently armed:{" "}
          <span className="font-mono">{currentId}</span>
        </p>
      ) : (
        <p className="text-caption text-muted-strong">No override armed.</p>
      )}
      <div className="flex flex-wrap gap-2">
        <form
          action={(formData) => {
            setStatus({ kind: "idle" });
            startTransition(async () => {
              const result = await setNextRunOverrideAction(formData);
              setStatus(
                result.ok
                  ? { kind: "ok", text: `Armed → ${selected}` }
                  : { kind: "error", text: result.error },
              );
            });
          }}
          className="contents"
        >
          <input type="hidden" name="model" value={selected} />
          <button
            type="submit"
            disabled={disabled || pending}
            className="min-h-[44px] rounded-md bg-accent px-4 text-base font-medium text-ink hover:bg-accent-deep hover:text-canvas disabled:opacity-60"
          >
            {pending ? "Working…" : "Arm override"}
          </button>
        </form>
        <form
          action={() => {
            setStatus({ kind: "idle" });
            startTransition(async () => {
              const result = await clearNextRunOverrideAction();
              setStatus(
                result.ok
                  ? { kind: "ok", text: "Override cleared." }
                  : { kind: "error", text: result.error },
              );
            });
          }}
          className="contents"
        >
          <button
            type="submit"
            disabled={disabled || pending || !currentId}
            className="min-h-[44px] rounded-md border border-border-subtle bg-canvas px-4 text-base font-medium text-ink hover:bg-parchment disabled:opacity-60"
          >
            Clear
          </button>
        </form>
      </div>
      <FormStatus status={status} />
      {disabled && disabledReason ? (
        <p className="text-caption text-muted-strong">{disabledReason}</p>
      ) : null}
    </div>
  );
}

function ModelGrid({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (id: string) => void;
  disabled: boolean;
}) {
  return (
    <fieldset className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {MODEL_CHOICES.map((m) => {
        const selected = value === m.id;
        return (
          <label
            key={m.id}
            className={cn(
              "flex cursor-pointer flex-col gap-1 rounded-md border px-3 py-2.5 text-left transition",
              selected
                ? "border-accent ring-2 ring-accent/30 bg-canvas"
                : "border-border-subtle bg-canvas hover:border-accent-soft",
              disabled && "opacity-60 cursor-not-allowed",
            )}
          >
            <input
              type="radio"
              name={`model-${m.provider}`}
              value={m.id}
              checked={selected}
              disabled={disabled}
              onChange={() => onChange(m.id)}
              className="sr-only"
            />
            <span className="text-body-sm font-medium text-ink">{m.label}</span>
            <span className="text-caption text-ink-soft">{m.description}</span>
          </label>
        );
      })}
    </fieldset>
  );
}

function FormStatus({ status }: { status: Status }) {
  if (status.kind === "idle") return null;
  return (
    <p
      role="status"
      className={cn(
        "text-caption",
        status.kind === "ok" ? "text-[color:var(--success)]" : "text-[color:var(--error)]",
      )}
    >
      {status.text}
    </p>
  );
}
