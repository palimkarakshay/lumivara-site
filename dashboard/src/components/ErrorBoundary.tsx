import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, FileText, RefreshCcw } from "lucide-react";
import { OWNER, REPO } from "../lib/config";

type State = { error: Error | null; info: ErrorInfo | null };

// Frontend errors get logged to localStorage and the operator can post
// them to a GitHub issue with one tap. The triage bot's `auto-routine`
// label picks these up and the executor schedules a fix on the next
// cron tick.
const STORAGE_KEY = "lumivara.ops.errorlog";
const MAX_ENTRIES = 25;

export type LoggedError = {
  ts: string;
  message: string;
  stack?: string;
  componentStack?: string;
  url: string;
  ua: string;
};

export function logError(err: unknown, componentStack?: string): void {
  try {
    const entry: LoggedError = {
      ts: new Date().toISOString(),
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      componentStack,
      url: location.href,
      ua: navigator.userAgent,
    };
    const existing = readErrorLog();
    const next = [entry, ...existing].slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* localStorage may be full or disabled; swallow */
  }
}

export function readErrorLog(): LoggedError[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function clearErrorLog(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

// Build a pre-filled issue URL — operator taps once on phone, the GitHub
// app opens with the body ready. The triage bot adds priority/complexity
// labels on its next cron run.
export function buildIssueUrl(entry: LoggedError): string {
  const title = `[dashboard] ${entry.message.slice(0, 80)}`;
  const body = [
    "_Auto-filed from the AI Ops dashboard error log._",
    "",
    `**When:** \`${entry.ts}\``,
    `**URL:** \`${entry.url}\``,
    `**UA:** \`${entry.ua}\``,
    "",
    "**Message**",
    "```",
    entry.message,
    "```",
    "",
    entry.stack
      ? "**Stack**\n```\n" + entry.stack + "\n```\n"
      : "",
    entry.componentStack
      ? "**Component stack**\n```\n" + entry.componentStack + "\n```\n"
      : "",
  ].join("\n");
  const params = new URLSearchParams({
    title,
    body,
    labels: "auto-routine,bug,area/dashboard,status/needs-triage",
  });
  return `https://github.com/${OWNER}/${REPO}/issues/new?${params.toString()}`;
}

// Window-level capture: catches uncaught errors and unhandled promise
// rejections that don't tear down a React tree (network errors, async
// failures inside event handlers).
if (typeof window !== "undefined") {
  window.addEventListener("error", (e) => logError(e.error ?? e.message));
  window.addEventListener("unhandledrejection", (e) =>
    logError(e.reason ?? "Unhandled promise rejection"),
  );
}

export class ErrorBoundary extends Component<
  { children: ReactNode },
  State
> {
  state: State = { error: null, info: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logError(error, info.componentStack ?? undefined);
    this.setState({ info });
  }

  reset = () => this.setState({ error: null, info: null });

  render() {
    if (!this.state.error) return this.props.children;
    const log = readErrorLog();
    const latest = log[0];
    return (
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="w-full max-w-md space-y-3 rounded-2xl border border-rose-800 bg-neutral-950 p-5 text-sm">
          <div className="flex items-center gap-2 text-rose-300">
            <AlertTriangle className="h-5 w-5" />
            <h2 className="font-semibold">Something broke</h2>
          </div>
          <p className="font-mono text-xs text-rose-200 break-words">
            {this.state.error.message}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={this.reset}
              className="inline-flex items-center gap-1 rounded-md border border-neutral-700 px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-900"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              Retry
            </button>
            {latest && (
              <a
                href={buildIssueUrl(latest)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-md bg-rose-600 px-3 py-2 text-xs font-medium text-white hover:bg-rose-500"
              >
                <FileText className="h-3.5 w-3.5" />
                Report to triage
              </a>
            )}
          </div>
          <p className="text-[11px] text-neutral-500">
            The triage bot will pick up the issue on its next cron run and
            either schedule a fix or ask for clarification.
          </p>
        </div>
      </div>
    );
  }
}
