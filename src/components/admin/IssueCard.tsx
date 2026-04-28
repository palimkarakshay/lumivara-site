import Link from "next/link";

import { Card } from "./Card";
import { StatusPill } from "./StatusPill";
import { relativeTime } from "@/lib/admin/format";
import type { IssueSummary } from "@/lib/admin/github";
import {
  clientSlugFromLabels,
  statusFromLabels,
} from "@/lib/admin/status-map";

type Props = {
  issue: IssueSummary;
  /** "client" hides operator-only labels and the GitHub deep link. */
  audience: "operator" | "client";
  href?: string;
};

export function IssueCard({ issue, audience, href }: Props) {
  const status = statusFromLabels(issue.labels);
  const clientSlug = clientSlugFromLabels(issue.labels);
  const showInternal = audience === "operator";
  // Operator cards default-link to the in-app detail page; clients always
  // get a slug-scoped detail. External href wins when explicitly passed.
  const target =
    href ??
    (showInternal
      ? `/admin/issues/${issue.number}`
      : clientSlug
        ? `/admin/client/${clientSlug}/request/${issue.number}`
        : issue.htmlUrl);
  const isExternal = target.startsWith("http");

  const needsInput = issue.labels.some(
    (l) => l === "needs-client-input" || l === "status/needs-clarification",
  );

  const tags = issue.labels.filter((l) => {
    if (l.startsWith("client/")) return false;
    if (!showInternal && l.startsWith("status/")) return false;
    if (
      !showInternal &&
      (l === "auto-routine" || l === "manual-only" || l === "human-only")
    ) {
      return false;
    }
    if (!showInternal && l.startsWith("model/")) return false;
    return true;
  });

  const Inner = (
    <Card
      as="article"
      emphasis={needsInput ? "warning" : "default"}
      className="flex flex-col gap-3"
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {showInternal && clientSlug ? (
            <p className="text-caption text-muted-strong uppercase tracking-wider">
              client / {clientSlug}
            </p>
          ) : null}
          <h3 className="font-display text-lg text-ink leading-snug">
            {needsInput ? (
              <span
                aria-label="Action needed"
                title="We need your input"
                className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-[color:var(--error)] align-middle"
              />
            ) : null}
            {showInternal ? `#${issue.number} ` : ""}
            {issue.title}
          </h3>
          <p className="text-caption text-muted-strong mt-1">
            updated {relativeTime(issue.updatedAt)}
          </p>
        </div>
        <StatusPill status={status} />
      </header>

      {tags.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5">
          {tags.slice(0, 6).map((label) => (
            <li
              key={label}
              className="rounded-full bg-parchment px-2 py-0.5 text-caption font-mono text-ink-soft"
            >
              {label}
            </li>
          ))}
        </ul>
      ) : null}

      {status?.copy ? (
        <p className="text-body-sm text-ink-soft">{status.copy}</p>
      ) : null}
    </Card>
  );

  if (isExternal) {
    return (
      <a
        href={target}
        target="_blank"
        rel="noreferrer"
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
      >
        {Inner}
      </a>
    );
  }
  return (
    <Link
      href={target}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
    >
      {Inner}
    </Link>
  );
}
