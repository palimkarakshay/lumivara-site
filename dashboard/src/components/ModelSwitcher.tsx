import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Brain,
  ChevronDown,
  ChevronUp,
  Loader2,
  X,
  Zap,
} from "lucide-react";
import clsx from "clsx";
import type { Octokit } from "@octokit/rest";
import {
  getDefaultModel,
  getNextRunOverride,
  setDefaultModel,
  setNextRunOverride,
  explainError,
} from "../lib/github";
import { MODEL_OPTIONS, type ModelOption } from "../lib/config";

type Props = {
  octo: Octokit;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
};

const STORAGE_KEY_OPEN = "lumivara.ops.brain.open";

export function ModelSwitcher({ octo, onSuccess, onError }: Props) {
  const [open, setOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_OPEN) === "1";
    } catch {
      return false;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_OPEN, open ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [open]);

  const qc = useQueryClient();

  const defaultQ = useQuery({
    queryKey: ["var", "default"],
    queryFn: () => getDefaultModel(octo),
  });
  const overrideQ = useQuery({
    queryKey: ["var", "override"],
    queryFn: () => getNextRunOverride(octo),
  });

  const setDefault = useMutation({
    mutationFn: (value: string) => setDefaultModel(octo, value),
    onMutate: async (value) => {
      await qc.cancelQueries({ queryKey: ["var", "default"] });
      const prev = qc.getQueryData(["var", "default"]);
      qc.setQueryData(["var", "default"], {
        name: "DEFAULT_AI_MODEL",
        value,
        updated_at: new Date().toISOString(),
      });
      return { prev };
    },
    onError: (err, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["var", "default"], ctx.prev);
      onError(`Default model: ${explainError(err, "variables-write")}`);
    },
    onSuccess: (_d, value) => onSuccess(`Default model → ${value}`),
    onSettled: () => qc.invalidateQueries({ queryKey: ["var", "default"] }),
  });

  const setOverride = useMutation({
    mutationFn: (value: string) => setNextRunOverride(octo, value),
    onMutate: async (value) => {
      await qc.cancelQueries({ queryKey: ["var", "override"] });
      const prev = qc.getQueryData(["var", "override"]);
      qc.setQueryData(["var", "override"], {
        name: "NEXT_RUN_MODEL_OVERRIDE",
        value,
        updated_at: new Date().toISOString(),
      });
      return { prev };
    },
    onError: (err, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["var", "override"], ctx.prev);
      onError(`Next-run override: ${explainError(err, "variables-write")}`);
    },
    onSuccess: (_d, value) =>
      onSuccess(value ? `Next run → ${value}` : "Next-run override cleared"),
    onSettled: () => qc.invalidateQueries({ queryKey: ["var", "override"] }),
  });

  const currentDefault = defaultQ.data?.value ?? "—";
  const currentOverride = overrideQ.data?.value ?? "";
  const reading = defaultQ.isLoading || overrideQ.isLoading;
  const writing = setDefault.isPending || setOverride.isPending;

  return (
    <section
      className={clsx(
        "rounded-2xl border border-neutral-800 bg-neutral-900/60",
        open ? "p-3" : "px-3 py-2",
      )}
    >
      {/* Compact header — always visible. Tap to toggle. */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Brain className="h-4 w-4 shrink-0 text-violet-400" />
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-300">
            Brain
          </span>
          <span
            className={clsx(
              "truncate rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-[11px]",
              currentDefault === "—" ? "text-neutral-500" : "text-violet-200",
            )}
          >
            {currentDefault}
          </span>
          {currentOverride && (
            <span className="truncate rounded bg-amber-950/60 px-1.5 py-0.5 font-mono text-[11px] text-amber-300">
              ⚡ {currentOverride}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {(reading || writing) && (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-neutral-400" />
          )}
          {open ? (
            <ChevronUp className="h-4 w-4 text-neutral-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-neutral-400" />
          )}
        </div>
      </button>

      {open && (
        <div className="mt-3 space-y-3 border-t border-neutral-800 pt-3">
          <Field label="Default model" help="Persistent. Read by execute on every run.">
            <ModelGrid
              value={(defaultQ.data?.value as ModelOption) ?? null}
              disabled={setDefault.isPending}
              onChange={(v) => setDefault.mutate(v)}
            />
          </Field>
          <NextRunOverride
            currentValue={currentOverride}
            saving={setOverride.isPending}
            onSet={(v) => setOverride.mutate(v)}
          />
        </div>
      )}
    </section>
  );
}

function Field({
  label,
  help,
  children,
}: {
  label: string;
  help: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <span className="text-xs font-medium text-neutral-300">{label}</span>
      <p className="text-[11px] text-neutral-500">{help}</p>
      {children}
    </div>
  );
}

function ModelGrid({
  value,
  disabled,
  onChange,
}: {
  value: ModelOption | null;
  disabled: boolean;
  onChange: (v: ModelOption) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
      {MODEL_OPTIONS.map((m) => {
        const selected = value === m;
        return (
          <button
            key={m}
            type="button"
            disabled={disabled}
            onClick={() => onChange(m)}
            className={clsx(
              "rounded-lg border px-2 py-2 text-xs font-medium transition",
              selected
                ? "border-violet-500 bg-violet-600/20 text-violet-100"
                : "border-neutral-800 bg-neutral-950 text-neutral-300 hover:border-neutral-700",
              disabled && "opacity-60",
            )}
          >
            {m}
          </button>
        );
      })}
    </div>
  );
}

function NextRunOverride({
  currentValue,
  saving,
  onSet,
}: {
  currentValue: string;
  saving: boolean;
  onSet: (v: string) => void;
}) {
  const [draft, setDraft] = useState<string>(currentValue);
  useEffect(() => setDraft(currentValue), [currentValue]);

  return (
    <Field
      label="Next-run override"
      help="One-shot. The next CI run reads it. Clear it manually after."
    >
      <div className="flex items-center gap-2">
        <select
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={saving}
          className="flex-1 rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-2 text-sm text-neutral-100"
        >
          <option value="">— none —</option>
          {MODEL_OPTIONS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => onSet(draft)}
          disabled={saving || draft === currentValue}
          className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-2 text-xs font-medium text-amber-950 shadow hover:bg-amber-400 disabled:opacity-50"
        >
          <Zap className="h-3.5 w-3.5" />
          Apply
        </button>
        {currentValue && (
          <button
            type="button"
            onClick={() => onSet("")}
            disabled={saving}
            className="rounded-lg border border-neutral-700 px-2 py-2 text-xs text-neutral-300 hover:bg-neutral-800 disabled:opacity-50"
            aria-label="Clear override"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {currentValue && (
        <p className="text-[11px] text-amber-400">
          Currently armed: <span className="font-mono">{currentValue}</span>
        </p>
      )}
    </Field>
  );
}
