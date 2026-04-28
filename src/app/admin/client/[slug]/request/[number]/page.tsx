import Link from "next/link";
import { notFound } from "next/navigation";

import { AutoRefresh } from "@/components/admin/AutoRefresh";
import { Card } from "@/components/admin/Card";
import { ClientInputBanner } from "@/components/admin/ClientInputBanner";
import { DeployControls } from "@/components/admin/DeployControls";
import { Section } from "@/components/admin/Section";
import { StatusPill } from "@/components/admin/StatusPill";
import { findClient } from "@/lib/admin/clients";
import { parseLatestAsk } from "@/lib/admin/ask-parser";
import { formatUtc, relativeTime } from "@/lib/admin/format";
import {
  findLinkedPrNumber,
  getIssue,
  getPullRequest,
  listIssueComments,
} from "@/lib/admin/github";
import {
  clientSlugFromLabels,
  statusFromLabels,
} from "@/lib/admin/status-map";
import { TIERS } from "@/lib/admin/tiers";
import { findPreviewByCommit } from "@/lib/admin/vercel";

export const dynamic = "force-dynamic";

/**
 * Strip our hidden HTML comment metadata (set by the n8n intake workflows)
 * before showing the body to the client. We don't want them seeing the
 * source-channel + reply-to that lives there.
 */
function cleanBody(body: string): string {
  return body.replace(/<!--[\s\S]*?-->/g, "").trim();
}

export default async function ClientRequestDetailPage({
  params,
}: {
  params: Promise<{ slug: string; number: string }>;
}) {
  const { slug, number } = await params;
  const client = findClient(slug);
  if (!client) notFound();

  const numericId = Number.parseInt(number, 10);
  if (!Number.isFinite(numericId) || numericId <= 0) notFound();

  const [issueResult, commentsResult] = await Promise.all([
    getIssue(numericId),
    listIssueComments(numericId, 20),
  ]);

  if (!issueResult.ok) {
    return (
      <Card emphasis="warning">
        <p className="font-medium text-ink">Couldn&rsquo;t load this request.</p>
        <p className="text-body-sm text-ink-soft mt-1">{issueResult.error}</p>
      </Card>
    );
  }
  const issue = issueResult.item;

  // Belt-and-suspenders: middleware already enforced canAccessClient on the
  // layout, but the issue itself might belong to a different slug. Hide it.
  if (clientSlugFromLabels(issue.labels) !== slug) notFound();

  const status = statusFromLabels(issue.labels);
  const cleaned = cleanBody(issue.body);
  const needsInput = issue.labels.some(
    (l) => l === "needs-client-input" || l === "status/needs-clarification",
  );
  const ask =
    needsInput && commentsResult.ok
      ? parseLatestAsk(commentsResult.items)
      : null;

  const tier = TIERS[client.tier];
  const showDeploySection =
    issue.labels.includes("status/awaiting-review") ||
    issue.labels.includes("status/done");

  // Pull the linked PR + Vercel preview only when we'll render the section.
  let prHeadSha: string | null = null;
  let prBranch: string | null = null;
  let previewUrl: string | null = null;

  if (showDeploySection) {
    const prNumber = findLinkedPrNumber(issue);
    if (prNumber != null) {
      const pr = await getPullRequest(prNumber);
      if (pr.ok) {
        prHeadSha = pr.item.headSha;
        prBranch = pr.item.headBranch;
        const preview = await findPreviewByCommit(prHeadSha, prBranch);
        if (preview.ok && preview.preview && preview.preview.state === "READY") {
          previewUrl = preview.preview.url;
        }
      }
    }
  }

  const deployState: "idle" | "deploying" | "live" | "failed" =
    issue.labels.includes("status/done")
      ? "live"
      : issue.labels.includes("status/awaiting-review")
        ? "idle"
        : "idle";

  return (
    <>
      <AutoRefresh />
      <header className="flex flex-col gap-3">
        <Link
          href={`/admin/client/${slug}`}
          className="text-caption text-ink-soft hover:text-ink underline w-fit"
        >
          ← Back to all requests
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h2 className="font-display text-2xl text-ink leading-tight max-w-2xl">
            {issue.title}
          </h2>
          <StatusPill status={status} />
        </div>
        <p className="text-caption text-muted-strong">
          Created {formatUtc(issue.createdAt)} UTC ·{" "}
          last updated {relativeTime(issue.updatedAt)}
        </p>
      </header>

      {ask ? (
        <ClientInputBanner slug={slug} issueNumber={numericId} ask={ask} />
      ) : null}

      {showDeploySection ? (
        <Section
          eyebrow="Test &amp; deploy"
          title={
            deployState === "live"
              ? "Live"
              : "Ready for your test"
          }
          description={
            deployState === "live"
              ? `This is now running on ${client.domain}.`
              : "Open the preview, click around, then approve to push it live."
          }
        >
          <Card>
            <DeployControls
              slug={slug}
              issueNumber={numericId}
              prHeadSha={prHeadSha}
              previewUrl={previewUrl}
              initialState={deployState}
              approvalEnabled={tier.features.deployApproval}
              disabledReason={
                tier.features.deployApproval
                  ? prHeadSha == null
                    ? "Linked PR not available yet — preview build hasn't started."
                    : undefined
                  : "Confirm Deploy is on Growth and Scale plans. The operator will approve this deploy for you."
              }
            />
          </Card>
        </Section>
      ) : null}

      <Section eyebrow="Status" title={status?.label ?? "Unsorted"}>
        <Card>
          <p className="text-body text-ink">
            {status?.copy ?? "We're still classifying this request."}
          </p>
        </Card>
      </Section>

      <Section eyebrow="Original request" title="What you sent us">
        <Card>
          {cleaned.length === 0 ? (
            <p className="text-body-sm text-ink-soft italic">
              (no details captured)
            </p>
          ) : (
            <pre className="whitespace-pre-wrap break-words font-body text-body-sm text-ink">
              {cleaned}
            </pre>
          )}
        </Card>
      </Section>
    </>
  );
}
