import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, X } from "lucide-react";
import type { Octokit } from "@octokit/rest";
import { extractThinking, getRunLogs, explainError } from "../lib/github";

type Props = {
  octo: Octokit;
  runId: number;
  runTitle: string;
  onClose: () => void;
};

export function LogViewer({ octo, runId, runTitle, onClose }: Props) {
  const q = useQuery({
    queryKey: ["thinking", runId],
    queryFn: async () => {
      const text = await getRunLogs(octo, runId);
      return extractThinking(text);
    },
    staleTime: 60_000,
  });

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/70 sm:items-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-[85vh] w-full max-w-2xl flex-col rounded-t-2xl border border-neutral-800 bg-neutral-950 shadow-2xl sm:h-[80vh] sm:rounded-2xl"
      >
        <header className="flex items-start justify-between gap-2 border-b border-neutral-800 p-3">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wide text-neutral-500">
              Thinking · run #{runId}
            </p>
            <h3 className="truncate text-sm font-semibold text-neutral-200">
              {runTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-3">
          {q.isLoading && (
            <div className="flex items-center gap-2 text-sm text-neutral-400">
              <Loader2 className="h-4 w-4 animate-spin" /> Fetching logs…
            </div>
          )}
          {q.isError && (
            <p className="text-sm text-rose-400">{explainError(q.error)}</p>
          )}
          {q.data && q.data.length === 0 && (
            <p className="text-sm text-neutral-500">
              No <code className="font-mono">&gt;&gt;&gt; THINKING</code>{" "}
              blocks found in this run's logs.
            </p>
          )}
          {q.data?.map((block, i) => (
            <article
              key={i}
              className="mb-4 rounded-lg border border-neutral-800 bg-neutral-900 p-3"
            >
              <p className="mb-1 text-[10px] uppercase tracking-wide text-neutral-500">
                Block {i + 1} of {q.data!.length}
              </p>
              <pre className="whitespace-pre-wrap break-words font-mono text-[12px] leading-relaxed text-neutral-200">
                {block}
              </pre>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
