import { promises as fs } from "node:fs";
import path from "node:path";

import { nextRun, parseCron, type ParsedCron } from "./cron";

// Pull cron lines straight from the workflow YAML so the dashboard can never
// disagree with what's actually scheduled. Tiny scanner — no full YAML parse
// needed for our 1-2 cron entries per file.
async function readCrons(workflowPath: string): Promise<string[]> {
  const text = await fs.readFile(workflowPath, "utf8");
  const lines = text.split("\n");
  const crons: string[] = [];
  for (const line of lines) {
    const m = line.match(/^\s*-\s*cron:\s*['"]([^'"]+)['"]/);
    if (m) crons.push(m[1]);
  }
  return crons;
}

export type WorkflowSchedule = {
  workflow: string;
  file: string;
  crons: string[];
  parsed: ParsedCron[];
  nextRun: Date | null;
};

const REPO_ROOT = path.join(process.cwd());

const WORKFLOWS = [
  { workflow: "Triage", file: ".github/workflows/triage.yml" },
  { workflow: "Execute", file: ".github/workflows/execute.yml" },
] as const;

export async function loadWorkflowSchedules(
  now: Date = new Date(),
): Promise<WorkflowSchedule[]> {
  return Promise.all(
    WORKFLOWS.map(async ({ workflow, file }) => {
      const abs = path.join(REPO_ROOT, file);
      const crons = await readCrons(abs);
      const parsed = crons.map((c) => parseCron(c));
      const candidates = parsed.map((p) => nextRun(p, now));
      candidates.sort((a, b) => a.getTime() - b.getTime());
      return {
        workflow,
        file,
        crons,
        parsed,
        nextRun: candidates[0] ?? null,
      };
    }),
  );
}
