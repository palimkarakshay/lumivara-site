import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { Card } from "@/components/admin/Card";
import { Section } from "@/components/admin/Section";
import { StatusPill } from "@/components/admin/StatusPill";
import { isAdminEmail } from "@/lib/admin-allowlist";
import { parseLatestAsk } from "@/lib/admin/ask-parser";
import { findClient } from "@/lib/admin/clients";
import { formatUtc, relativeTime } from "@/lib/admin/format";
import { getIssue, listIssueComments } from "@/lib/admin/github";
import {
  clientSlugFromLabels,
  statusFromLabels,
} from "@/lib/admin/status-map";

export const dynamic = "force-dynamic";

export default async function OperatorIssueDetailPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) {
    redirect(`/admin/sign-in?from=/admin/issues/${number}`);
  }

  const numericId = Number.parseInt(number, 10);
  if (!Number.isFinite(numericId) || numericId <= 0) notFound();

  const [issueResult, commentsResult] = await Promise.all([
    getIssue(numericId),
    listIssueComments(numericId, 30),
  ]);

  if (!issueResult.ok) {
    return (
      <Card emphasis="warning">
        <p className="font-medium text-ink">Couldn&rsquo;t load this issue.</p>
        <p className="text-body-sm text-ink-soft mt-1">{issueResult.error}</p>
      </Card>
    );
  }

  const issue = issueResult.item;
  const status = statusFromLabels(issue.labels);
  const slug = clientSlugFromLabels(issue.labels);
  const client = slug ? findClient(slug) : null;
  const ask = commentsResult.ok ? parseLatestAsk(commentsResult.items) : null;
  const needsInput = issue.labels.some(
    (l) => l === "needs-client-input" || l === "status/needs-clarification",
  );

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <Link
          href="/admin"
          className="text-caption text-ink-soft hover:text-ink underline w-fit"
        >
          ← Back to overview
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            {client ? (
              <Link
                href={`/admin/client/${client.slug}`}
                className="text-caption text-muted-strong uppercase tracking-wider hover:text-ink"
              >
                client / {client.slug}
              </Link>
            ) : (
              <p className="text-caption text-muted-strong uppercase tracking-wider">
                Unassigned
              </p>
            )}
            <h1 className="font-display text-display-sm text-ink mt-1">
              #{issue.number} {issue.title}
            </h1>
            <p className="text-caption text-muted-strong mt-1">
              Opened {formatUtc(issue.createdAt)} UTC ·{" "}
              updated {relativeTime(issue.updatedAt)} ·{" "}
              <a
                href={issue.htmlUrl}
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-ink"
              >
                view on GitHub ↗
              </a>
            </p>
          </div>
          <StatusPill status={status} />
        </div>
      </header>

      {needsInput && ask ? (
        <Card emphasis="warning">
          <p className="text-caption text-[color:var(--error)] uppercase tracking-wider font-semibold">
            Awaiting client input
          </p>
          <h3 className="font-display text-lg text-ink mt-2">{ask.question}</h3>
          {ask.options.length > 0 ? (
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {ask.options.map((opt) => (
                <li
                  key={opt.id}
                  className="rounded-md border border-border-subtle bg-canvas px-3 py-2 text-body-sm text-ink"
                >
                  <span className="font-mono text-muted-strong mr-2">
                    {opt.id})
                  </span>
                  {opt.label}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-body-sm text-ink-soft mt-2 italic">
              Free-text answer expected.
            </p>
          )}
          {client ? (
            <Link
              href={`/admin/client/${client.slug}/request/${issue.number}`}
              className="text-caption underline text-ink-soft hover:text-ink mt-3 block"
            >
              Open client view →
            </Link>
          ) : null}
        </Card>
      ) : null}

      <Section eyebrow="Labels" title={`${issue.labels.length} tags`}>
        <Card>
          <ul className="flex flex-wrap gap-1.5">
            {issue.labels.map((label) => (
              <li
                key={label}
                className="rounded-full bg-parchment px-2 py-0.5 text-caption font-mono text-ink-soft"
              >
                {label}
              </li>
            ))}
          </ul>
        </Card>
      </Section>

      <Section eyebrow="Body" title="What was reported">
        <Card>
          {issue.body.trim().length === 0 ? (
            <p className="text-body-sm text-ink-soft italic">(empty)</p>
          ) : (
            <pre className="whitespace-pre-wrap break-words font-body text-body-sm text-ink">
              {issue.body}
            </pre>
          )}
        </Card>
      </Section>

      <Section
        eyebrow="Conversation"
        title={`${commentsResult.ok ? commentsResult.items.length : 0} comments`}
      >
        {!commentsResult.ok ? (
          <Card>
            <p className="text-body-sm text-[color:var(--error)]">
              {commentsResult.error}
            </p>
          </Card>
        ) : commentsResult.items.length === 0 ? (
          <Card>
            <p className="text-body-sm text-ink-soft italic">(no comments)</p>
          </Card>
        ) : (
          <ul className="flex flex-col gap-3">
            {commentsResult.items.map((c) => (
              <li key={c.id}>
                <Card>
                  <p className="text-caption text-muted-strong">
                    <span className="font-mono">{c.authorLogin ?? "?"}</span> ·{" "}
                    {relativeTime(c.createdAt)}
                  </p>
                  <pre className="mt-2 whitespace-pre-wrap break-words font-body text-body-sm text-ink">
                    {c.body}
                  </pre>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
