// WORKFLOW_PAUSE_SCHEDULE encoding.
//
// We park "pause until" instructions in a single repo variable rather
// than one variable per workflow because the variable count is a
// per-repo limit and the operator may pause many things at once.
//
// Wire format (pipe-separated entries):
//   "until=<ISO-8601>;path=<workflow-path>"
//   "runs=<N>;path=<workflow-path>"
//
// Example:
//   "until=2026-04-28T08:00:00Z;path=.github/workflows/triage.yml | runs=3;path=.github/workflows/execute.yml"
//
// The auto-resume.yml workflow parses this on a 15-minute schedule and
// re-enables any workflow whose deadline has passed.

import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Octokit } from "@octokit/rest";
import {
  getRepoVariable,
  upsertRepoVariable,
} from "./github";
import { VARIABLE_NAMES } from "./config";

export type PauseEntry =
  | { kind: "until"; path: string; until: Date }
  | { kind: "runs"; path: string; runs: number; until?: undefined };

export function parsePauseSchedule(raw: string | null | undefined): PauseEntry[] {
  if (!raw) return [];
  return raw
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
    .map(parseEntry)
    .filter((e): e is PauseEntry => e !== null);
}

function parseEntry(s: string): PauseEntry | null {
  const fields = Object.fromEntries(
    s
      .split(";")
      .map((kv) => kv.trim().split("="))
      .filter((p) => p.length === 2)
      .map(([k, v]) => [k.trim(), v.trim()]),
  ) as Record<string, string>;
  const path = fields.path;
  if (!path) return null;
  if (fields.until) {
    const d = new Date(fields.until);
    if (Number.isNaN(d.getTime())) return null;
    return { kind: "until", path, until: d };
  }
  if (fields.runs) {
    const n = parseInt(fields.runs, 10);
    if (!Number.isFinite(n) || n <= 0) return null;
    return { kind: "runs", path, runs: n };
  }
  return null;
}

export function encodePauseSchedule(entries: PauseEntry[]): string {
  return entries
    .map((e) =>
      e.kind === "until"
        ? `until=${e.until.toISOString()};path=${e.path}`
        : `runs=${e.runs};path=${e.path}`,
    )
    .join(" | ");
}

export async function addPause(
  octo: Octokit,
  raw: string,
  entry: PauseEntry,
): Promise<void> {
  const existing = parsePauseSchedule(raw).filter((e) => e.path !== entry.path);
  const next = [...existing, entry];
  await upsertRepoVariable(
    octo,
    VARIABLE_NAMES.pauseSchedule,
    encodePauseSchedule(next),
  );
}

export async function removePause(
  octo: Octokit,
  raw: string,
  path: string,
): Promise<void> {
  const next = parsePauseSchedule(raw).filter((e) => e.path !== path);
  await upsertRepoVariable(
    octo,
    VARIABLE_NAMES.pauseSchedule,
    encodePauseSchedule(next),
  );
}

// Hook: returns the current pause schedule indexed by workflow path,
// the raw string (for atomic edits), and an invalidator.
export function usePauseSchedule(octo: Octokit) {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["var", "pauseSchedule"],
    queryFn: async () =>
      (await getRepoVariable(octo, VARIABLE_NAMES.pauseSchedule))?.value ?? "",
  });
  const raw = q.data ?? "";
  const entries = parsePauseSchedule(raw);
  const byPath = new Map<string, PauseEntry>();
  entries.forEach((e) => byPath.set(e.path, e));
  return {
    raw,
    entries,
    byPath,
    invalidate: () =>
      qc.invalidateQueries({ queryKey: ["var", "pauseSchedule"] }),
  };
}
