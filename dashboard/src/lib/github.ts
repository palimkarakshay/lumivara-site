import { Octokit } from "@octokit/rest";
import {
  OWNER,
  REPO,
  THINKING_END,
  THINKING_START,
  VARIABLE_NAMES,
} from "./config";

export type WorkflowRun = {
  id: number;
  name: string | null;
  display_title: string;
  event: string;
  status: string | null;
  conclusion: string | null;
  html_url: string;
  created_at: string;
  head_branch: string | null;
  workflow_id: number;
  pull_requests: { number: number; url: string }[];
};

export type Workflow = {
  id: number;
  name: string;
  path: string;
  state: "active" | "disabled_manually" | "disabled_inactivity" | string;
};

export type RepoVariable = {
  name: string;
  value: string;
  updated_at: string;
};

export type PendingIssue = {
  number: number;
  title: string;
  html_url: string;
  created_at: string;
  labels: string[];
};

export function makeClient(token: string): Octokit {
  return new Octokit({ auth: token, userAgent: "lumivara-ai-ops/0.1" });
}

// Surface a clean message instead of Octokit's RequestError shape.
export function explainError(err: unknown): string {
  if (typeof err === "object" && err && "status" in err) {
    const e = err as { status?: number; message?: string };
    if (e.status === 401) return "Token rejected (401). Rotate your PAT.";
    if (e.status === 403) return "Forbidden (403). Check token scopes.";
    if (e.status === 404)
      return "Not found (404). Token may lack repo access.";
    return e.message ?? `HTTP ${e.status}`;
  }
  return err instanceof Error ? err.message : String(err);
}

// ── Repo Variables ─────────────────────────────────────────────────────
export async function getRepoVariable(
  octo: Octokit,
  name: string,
): Promise<RepoVariable | null> {
  try {
    const res = await octo.request(
      "GET /repos/{owner}/{repo}/actions/variables/{name}",
      { owner: OWNER, repo: REPO, name },
    );
    return res.data as RepoVariable;
  } catch (err) {
    if ((err as { status?: number }).status === 404) return null;
    throw err;
  }
}

export async function upsertRepoVariable(
  octo: Octokit,
  name: string,
  value: string,
): Promise<void> {
  const existing = await getRepoVariable(octo, name);
  if (existing) {
    await octo.request(
      "PATCH /repos/{owner}/{repo}/actions/variables/{name}",
      { owner: OWNER, repo: REPO, name, value },
    );
  } else {
    await octo.request("POST /repos/{owner}/{repo}/actions/variables", {
      owner: OWNER,
      repo: REPO,
      name,
      value,
    });
  }
}

// DELETE the variable entirely. Used by the "Clear" button on the override
// panel — distinct from setting the value to "" so that a workflow's
// `if: vars.NEXT_RUN_MODEL_OVERRIDE != ''` guard sees an absent variable.
export async function deleteRepoVariable(
  octo: Octokit,
  name: string,
): Promise<void> {
  try {
    await octo.request(
      "DELETE /repos/{owner}/{repo}/actions/variables/{name}",
      { owner: OWNER, repo: REPO, name },
    );
  } catch (err) {
    if ((err as { status?: number }).status === 404) return;
    throw err;
  }
}

export const getDefaultModel = (octo: Octokit) =>
  getRepoVariable(octo, VARIABLE_NAMES.defaultModel);
export const getNextRunOverride = (octo: Octokit) =>
  getRepoVariable(octo, VARIABLE_NAMES.nextRunOverride);
export const setDefaultModel = (octo: Octokit, value: string) =>
  upsertRepoVariable(octo, VARIABLE_NAMES.defaultModel, value);
export const setNextRunOverride = (octo: Octokit, value: string) =>
  upsertRepoVariable(octo, VARIABLE_NAMES.nextRunOverride, value);
export const clearNextRunOverride = (octo: Octokit) =>
  deleteRepoVariable(octo, VARIABLE_NAMES.nextRunOverride);

// ── Workflows & Runs ───────────────────────────────────────────────────
export async function listWorkflows(octo: Octokit): Promise<Workflow[]> {
  const res = await octo.actions.listRepoWorkflows({
    owner: OWNER,
    repo: REPO,
    per_page: 100,
  });
  return res.data.workflows as Workflow[];
}

export async function listWorkflowRuns(
  octo: Octokit,
  perPage = 15,
): Promise<WorkflowRun[]> {
  const res = await octo.actions.listWorkflowRunsForRepo({
    owner: OWNER,
    repo: REPO,
    per_page: perPage,
  });
  return res.data.workflow_runs as unknown as WorkflowRun[];
}

export async function listPendingIssues(
  octo: Octokit,
  perPage = 100,
): Promise<PendingIssue[]> {
  const res = await octo.issues.listForRepo({
    owner: OWNER,
    repo: REPO,
    state: "open",
    per_page: perPage,
  });

  return res.data
    .filter((item) => !("pull_request" in item))
    .map((item) => {
      const labels = item.labels
        .map((label) => (typeof label === "string" ? label : label.name ?? ""))
        .filter(Boolean);
      return {
        number: item.number,
        title: item.title,
        html_url: item.html_url,
        created_at: item.created_at,
        labels,
      };
    })
    .filter((item) =>
      item.labels.some(
        (label) =>
          label === "status/planned" ||
          label === "status/in-progress" ||
          label === "status/needs-clarification" ||
          label === "needs-client-input",
      ),
    )
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
}

export async function triggerWorkflow(
  octo: Octokit,
  workflowId: number,
  ref = "main",
): Promise<void> {
  await octo.actions.createWorkflowDispatch({
    owner: OWNER,
    repo: REPO,
    workflow_id: workflowId,
    ref,
  });
}

export async function setWorkflowEnabled(
  octo: Octokit,
  workflowId: number,
  enabled: boolean,
): Promise<void> {
  if (enabled) {
    await octo.actions.enableWorkflow({
      owner: OWNER,
      repo: REPO,
      workflow_id: workflowId,
    });
  } else {
    await octo.actions.disableWorkflow({
      owner: OWNER,
      repo: REPO,
      workflow_id: workflowId,
    });
  }
}

// Cancel an in-flight run. Returns 202 on success; the run flips to
// `cancelled` once the runner notices.
export async function cancelRun(
  octo: Octokit,
  runId: number,
): Promise<void> {
  await octo.actions.cancelWorkflowRun({
    owner: OWNER,
    repo: REPO,
    run_id: runId,
  });
}

// Re-run a finished run (failed or successful). Mirrors the "Re-run all jobs"
// button on the GitHub Actions web UI.
export async function rerunRun(
  octo: Octokit,
  runId: number,
): Promise<void> {
  await octo.actions.reRunWorkflow({
    owner: OWNER,
    repo: REPO,
    run_id: runId,
  });
}

// ── Logs & Thinking extraction ─────────────────────────────────────────
// Run-level logs come back as a zip; job-level logs come back as plain
// text. We always use the job endpoint and concatenate, which avoids
// shipping a zip library to the browser.
export async function getRunLogs(
  octo: Octokit,
  runId: number,
): Promise<string> {
  const jobs = await octo.paginate(octo.actions.listJobsForWorkflowRun, {
    owner: OWNER,
    repo: REPO,
    run_id: runId,
    per_page: 100,
  });
  const chunks = await Promise.all(
    jobs.map(async (job) => {
      try {
        const res = await octo.request(
          "GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs",
          { owner: OWNER, repo: REPO, job_id: job.id },
        );
        return `\n===== job: ${job.name} =====\n${String(res.data)}`;
      } catch {
        return `\n===== job: ${job.name} (logs unavailable) =====\n`;
      }
    }),
  );
  return chunks.join("\n");
}

// Pulls the THINKING blocks out of the raw concatenated log text.
// Returns one string per block, in order. Multiple blocks are common
// (one per agent turn). Empty array means the run produced no monologue.
export function extractThinking(logText: string): string[] {
  const re = new RegExp(
    `${escapeRegex(THINKING_START)}([\\s\\S]*?)${escapeRegex(THINKING_END)}`,
    "g",
  );
  const blocks: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(logText)) !== null) {
    blocks.push(stripTimestamps(m[1]).trim());
  }
  return blocks;
}

// GitHub prefixes every log line with an ISO timestamp; strip it so the
// modal isn't 50% noise.
function stripTimestamps(s: string): string {
  return s.replace(/^\d{4}-\d{2}-\d{2}T[\d:.]+Z\s?/gm, "");
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ── Pull Requests ──────────────────────────────────────────────────────
export type PullSummary = {
  number: number;
  title: string;
  state: string;
  mergeable: boolean | null;
  html_url: string;
};

export async function getPull(
  octo: Octokit,
  number: number,
): Promise<PullSummary> {
  const res = await octo.pulls.get({
    owner: OWNER,
    repo: REPO,
    pull_number: number,
  });
  return {
    number: res.data.number,
    title: res.data.title,
    state: res.data.state,
    mergeable: res.data.mergeable,
    html_url: res.data.html_url,
  };
}

export async function squashMergePull(
  octo: Octokit,
  number: number,
): Promise<void> {
  await octo.pulls.merge({
    owner: OWNER,
    repo: REPO,
    pull_number: number,
    merge_method: "squash",
  });
}
