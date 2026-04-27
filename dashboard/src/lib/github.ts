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

export function makeClient(token: string): Octokit {
  return new Octokit({ auth: token, userAgent: "lumivara-ai-ops/0.1" });
}

// Surface a clean message instead of Octokit's RequestError shape.
// Maps 403s to the specific PAT scope the failing endpoint needs, since
// GitHub's "Resource not accessible by personal access token" body is
// the same regardless of which permission is missing.
export function explainError(
  err: unknown,
  scopeHint?: PermissionHint,
): string {
  if (typeof err === "object" && err && "status" in err) {
    const e = err as { status?: number; message?: string };
    if (e.status === 401) return "Token rejected (401). Rotate your PAT.";
    if (e.status === 403) {
      const hint = scopeHint
        ? `Your PAT likely needs ${describeHint(scopeHint)}.`
        : "Check the PAT scopes (most often Variables, Actions, or Pull requests at Read & write).";
      // GitHub also returns 403 for secondary rate limits; the body
      // mentions "abuse" / "rate limit" when that's the cause.
      const body = (e.message ?? "").toLowerCase();
      if (body.includes("rate limit") || body.includes("abuse")) {
        return "Rate limited (403). Wait a minute, then retry.";
      }
      return `Forbidden (403). ${hint}`;
    }
    if (e.status === 404)
      return "Not found (404). Token may lack access to this repo.";
    return e.message ?? `HTTP ${e.status}`;
  }
  return err instanceof Error ? err.message : String(err);
}

export type PermissionHint =
  | "variables-read"
  | "variables-write"
  | "actions-read"
  | "actions-write"
  | "pulls-write"
  | "contents-write";

function describeHint(h: PermissionHint): string {
  switch (h) {
    case "variables-read":
    case "variables-write":
      return "**Variables: Read & write**";
    case "actions-read":
      return "**Actions: Read**";
    case "actions-write":
      return "**Actions: Read & write**";
    case "pulls-write":
      return "**Pull requests: Read & write**";
    case "contents-write":
      return "**Contents: Read & write**";
  }
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

export const getDefaultModel = (octo: Octokit) =>
  getRepoVariable(octo, VARIABLE_NAMES.defaultModel);
export const getNextRunOverride = (octo: Octokit) =>
  getRepoVariable(octo, VARIABLE_NAMES.nextRunOverride);
export const setDefaultModel = (octo: Octokit, value: string) =>
  upsertRepoVariable(octo, VARIABLE_NAMES.defaultModel, value);
export const setNextRunOverride = (octo: Octokit, value: string) =>
  upsertRepoVariable(octo, VARIABLE_NAMES.nextRunOverride, value);

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

// ── Logs & Thinking extraction ─────────────────────────────────────────
// Run-level logs come back as a zip; job-level logs come back as plain
// text. We always use the job endpoint and concatenate, which avoids
// shipping a zip library to the browser.
//
// Fetched sequentially (not Promise.all): a long run has 5–10 jobs, and
// firing 10 parallel logs requests reliably trips GitHub's secondary
// rate limit and returns intermittent 403s.
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
  const chunks: string[] = [];
  for (const job of jobs) {
    try {
      const res = await octo.request(
        "GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs",
        { owner: OWNER, repo: REPO, job_id: job.id },
      );
      chunks.push(`\n===== job: ${job.name} =====\n${String(res.data)}`);
    } catch {
      chunks.push(`\n===== job: ${job.name} (logs unavailable) =====\n`);
    }
  }
  return chunks.join("\n");
}

// ── Workflow YAML (for cron parsing) ───────────────────────────────────
// Returns the workflow file's plaintext source. Used to extract `cron:`
// lines so the dashboard can show "next scheduled run" alongside the
// pause/resume toggle.
export async function getWorkflowFileContent(
  octo: Octokit,
  path: string,
): Promise<string> {
  const res = await octo.repos.getContent({
    owner: OWNER,
    repo: REPO,
    path,
  });
  if (Array.isArray(res.data) || res.data.type !== "file") {
    throw new Error(`Expected file at ${path}`);
  }
  // Browsers can decode base64 directly; no Buffer needed.
  const b64 = (res.data as { content?: string }).content ?? "";
  return atob(b64.replace(/\n/g, ""));
}

// Pulls all `cron: '<expr>'` lines from a workflow YAML. Returns the
// raw cron expressions in order; empty array means no schedule trigger.
export function extractCrons(yaml: string): string[] {
  const re = /^\s*-?\s*cron:\s*['"]?([^'"#\n]+?)['"]?\s*(?:#.*)?$/gm;
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(yaml)) !== null) {
    const expr = m[1].trim();
    if (expr) out.push(expr);
  }
  return out;
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
