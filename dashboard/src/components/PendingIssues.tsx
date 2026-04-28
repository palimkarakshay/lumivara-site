import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Loader2 } from "lucide-react";
import type { Octokit } from "@octokit/rest";
import { explainError, listPendingIssues } from "../lib/github";

type Props = {
  octo: Octokit;
};

export function PendingIssues({ octo }: Props) {
  const q = useQuery({
    queryKey: ["pending-issues"],
    queryFn: () => listPendingIssues(octo),
    refetchInterval: 30_000,
  });

  return (
    <section className="space-y-2 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
      <header className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
          Pending issues
        </h2>
        <span className="text-[11px] text-neutral-500">planned + blocked</span>
      </header>

      {q.isLoading && (
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      )}
      {q.isError && <p className="text-sm text-rose-400">{explainError(q.error)}</p>}
      {q.data?.length === 0 && (
        <p className="text-sm text-neutral-500">No unresolved backlog items.</p>
      )}

      <ul className="divide-y divide-neutral-800">
        {q.data?.map((issue) => (
          <li key={issue.number} className="py-2">
            <a
              href={issue.html_url}
              target="_blank"
              rel="noreferrer"
              className="group block"
            >
              <p className="truncate text-sm text-neutral-100 group-hover:text-white">
                #{issue.number} {issue.title}
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-[11px] text-neutral-500">
                {issue.labels.slice(0, 3).join(" · ")}
                <ExternalLink className="h-3 w-3" />
              </p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
