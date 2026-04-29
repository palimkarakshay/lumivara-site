import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Brain, Loader2, RotateCcw, Zap } from "lucide-react";
import clsx from "clsx";
import type { Octokit } from "@octokit/rest";
import {
  clearNextRunOverride,
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

export function ModelSwitcher({ octo, onSuccess, onError }: Props) {
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
      qc.setQueryData(["var", "default"], { name: "DEFAULT_AI_MODEL", value, updated_at: new Date().toISOString() });
      return { prev };
    },
    onError: (err, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["var", "default"], ctx.prev);
      onError(`Default model: ${explainError(err)}`);
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
      onError(`Next-run override: ${explainError(err)}`);
    },
    onSuccess: (_d, value) =>
      onSuccess(value ? `Next run → ${value}` : "Next-run override cleared"),
    onSettled: () => qc.invalidateQueries({ queryKey: ["var", "override"] }),
  });

  // DELETE the variable (vs. setting "") so workflows that gate on
  // `vars.NEXT_RUN_MODEL_OVERRIDE != ''` stop seeing it entirely.
  const clearOverride = useMutation({
    mutationFn: () => clearNextRunOverride(octo),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ["var", "override"] });
      const prev = qc.getQueryData(["var", "override"]);
      qc.setQueryData(["var", "override"], null);
      return { prev };
    },
    onError: (err, _v, ctx) => {
      if (ctx?.prev !== undefined)
        qc.setQueryData(["var", "override"], ctx.prev);
      onError(`Clear override: ${explainError(err)}`);
    },
    onSuccess: () => onSuccess("Next-run override cleared"),
    onSettled: () => qc.invalidateQueries({ queryKey: ["var", "override"] }),
  });

  return (
    <section className="space-y-3 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
      <header className="flex items-center gap-2">
        <Brain className="h-4 w-4 text-violet-400" />
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
          Brain Controller
        </h2>
      </header>

      <Field
        label="Default model"
        help="Persists. Read by execute/triage on every run."
        loading={defaultQ.isLoading}
        saving={setDefault.isPending}
      >
        <ModelGrid
          value={(defaultQ.data?.value as ModelOption) ?? null}
          disabled={setDefault.isPending}
          onChange={(v) => setDefault.mutate(v)}
        />
      </Field>

      <NextRunOverride
        currentValue={overrideQ.data?.value ?? ""}
        loading={overrideQ.isLoading}
        saving={setOverride.isPending || clearOverride.isPending}
        clearing={clearOverride.isPending}
        onSet={(v) => setOverride.mutate(v)}
        onClear={() => clearOverride.mutate()}
      />
    </section>
  );
}

function Field({
  label,
  help,
  loading,
  saving,
  children,
}: {
  label: string;
  help: string;
  loading: boolean;
  saving: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-300">{label}</span>
        {(loading || saving) && (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-neutral-400" />
        )}
      </div>
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
  loading,
  saving,
  clearing,
  onSet,
  onClear,
}: {
  currentValue: string;
  loading: boolean;
  saving: boolean;
  clearing: boolean;
  onSet: (v: string) => void;
  onClear: () => void;
}) {
  const [draft, setDraft] = useState<string>(currentValue);
  useEffect(() => setDraft(currentValue), [currentValue]);

  return (
    <Field
      label="Next-run override"
      help="One-shot. The next CI run reads it, then clears it."
      loading={loading}
      saving={saving}
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
      </div>
      {currentValue && (
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] text-amber-400">
            Currently armed: <span className="font-mono">{currentValue}</span>
          </p>
          <button
            type="button"
            onClick={onClear}
            disabled={saving}
            className="inline-flex items-center gap-1 rounded-md border border-neutral-800 bg-neutral-950 px-2 py-1 text-[11px] text-neutral-300 hover:border-neutral-700 disabled:opacity-50"
          >
            {clearing ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <RotateCcw className="h-3 w-3" />
            )}
            Clear
          </button>
        </div>
      )}
    </Field>
  );
}
