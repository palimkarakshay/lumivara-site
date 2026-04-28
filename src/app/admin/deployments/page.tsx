import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Card } from "@/components/admin/Card";
import { DeploymentTimeline } from "@/components/admin/DeploymentTimeline";
import { EmptyState } from "@/components/admin/EmptyState";
import { PromoteTipButton } from "@/components/admin/PromoteTipButton";
import { Section } from "@/components/admin/Section";
import { isAdminEmail } from "@/lib/admin-allowlist";
import { CLIENT_REGISTRY } from "@/lib/admin/clients";
import { isDeployLogConfigured, readDeployLog } from "@/lib/admin/deploy-log";
import { formatUtc, relativeTime } from "@/lib/admin/format";
import {
  isGithubConfigured,
  repoSlug,
} from "@/lib/admin/github";
import { summariseDrift, walkMainSince } from "@/lib/admin/main-history";
import {
  isVercelConfigured,
  latestProductionDeployment,
} from "@/lib/admin/vercel";

export const dynamic = "force-dynamic";

export default async function DeploymentsPage() {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) {
    redirect("/admin/sign-in?from=/admin/deployments");
  }

  const ghOk = isGithubConfigured();
  const vercelOk = isVercelConfigured();
  const repo = repoSlug();

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <p className="text-caption text-muted-strong uppercase tracking-wider">
          Deployments
        </p>
        <h1 className="font-display text-display-sm text-ink">
          Production state &amp; drift
        </h1>
        <p className="text-body-sm text-ink-soft max-w-2xl">
          One screen for every client&apos;s live state, anything still in
          preview, and one-click promote to production with the
          forward-only guard. The mechanism is the same one client tiers
          with deploy approval can fire from their portal — you see the
          full picture.
        </p>
      </header>

      {!ghOk || !vercelOk ? (
        <Card emphasis="warning">
          <p className="font-medium text-ink">Not fully configured.</p>
          <ul className="text-body-sm text-ink-soft mt-2 list-disc pl-5">
            {!ghOk ? (
              <li>
                <code className="font-mono">GITHUB_REPO</code> /{" "}
                <code className="font-mono">GITHUB_TOKEN</code> required for
                main-history walks.
              </li>
            ) : null}
            {!vercelOk ? (
              <li>
                <code className="font-mono">VERCEL_API_TOKEN</code> required to
                read the live production state.
              </li>
            ) : null}
          </ul>
        </Card>
      ) : null}

      {CLIENT_REGISTRY.map((client) => (
        <ClientDeploymentBlock
          key={client.slug}
          slug={client.slug}
          name={client.name}
          domain={client.domain}
          repo={repo}
        />
      ))}
    </div>
  );
}

async function ClientDeploymentBlock({
  slug,
  name,
  domain,
  repo,
}: {
  slug: string;
  name: string;
  domain: string;
  repo: string | null;
}) {
  const prod = await latestProductionDeployment();
  const baseSha = prod.ok && prod.deployment?.commitSha
    ? prod.deployment.commitSha
    : null;
  const walk = baseSha
    ? await walkMainSince(baseSha)
    : await walkMainSince("HEAD~30", "main", { maxCommits: 30 });
  const drift = walk.ok ? summariseDrift(walk.commits) : null;
  const log = await readDeployLog(slug, 10);

  const candidateSha = drift?.headSha ?? null;
  const candidateLabel = candidateSha
    ? `${candidateSha.slice(0, 7)}${
        drift?.deployableCommits[0]?.prTitle
          ? ` (${drift.deployableCommits[0].prTitle.slice(0, 60)})`
          : ""
      }`
    : "tip of main";

  const driftCount = drift?.deployableCommits.length ?? 0;
  const stage =
    !prod.ok || !prod.deployment
      ? "built"
      : driftCount === 0
        ? "live"
        : "preview";

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-ink">{name}</h2>
          <p className="text-caption text-muted-strong">
            <a
              href={`https://${domain}`}
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-ink"
            >
              {domain} ↗
            </a>
          </p>
        </div>
        <DeploymentTimeline current={stage} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="font-display text-lg text-ink">Live now</h3>
          {!prod.ok ? (
            <p className="text-body-sm text-[color:var(--error)] mt-2">
              {prod.error}
            </p>
          ) : !prod.deployment ? (
            <p className="text-body-sm text-ink-soft mt-2 italic">
              No production deployment yet.
            </p>
          ) : (
            <dl className="mt-3 grid grid-cols-1 gap-3 text-body-sm">
              <div>
                <dt className="text-label text-muted-strong">State</dt>
                <dd className="text-ink mt-1">
                  <span
                    className={
                      prod.deployment.state === "READY"
                        ? "text-[color:var(--success)] font-medium"
                        : "text-ink-soft"
                    }
                  >
                    {prod.deployment.state}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-label text-muted-strong">SHA</dt>
                <dd className="text-ink mt-1 font-mono">
                  {prod.deployment.commitSha
                    ? prod.deployment.commitSha.slice(0, 12)
                    : "—"}{" "}
                  {prod.deployment.commitRef ? (
                    <span className="text-muted-strong">
                      ({prod.deployment.commitRef})
                    </span>
                  ) : null}
                </dd>
              </div>
              <div>
                <dt className="text-label text-muted-strong">Live since</dt>
                <dd className="text-ink mt-1">
                  {formatUtc(prod.deployment.createdAt)} UTC ·{" "}
                  {relativeTime(prod.deployment.createdAt)}
                </dd>
              </div>
              {prod.deployment.inspectorUrl ? (
                <div>
                  <a
                    href={prod.deployment.inspectorUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-caption underline w-fit"
                  >
                    Vercel inspector ↗
                  </a>
                </div>
              ) : null}
            </dl>
          )}
        </Card>

        <Card emphasis={driftCount > 0 ? "warning" : undefined}>
          <h3 className="font-display text-lg text-ink">
            {driftCount === 0
              ? "No drift"
              : `${driftCount} change${driftCount === 1 ? "" : "s"} pending`}
          </h3>
          <p className="text-body-sm text-ink-soft mt-1">
            {driftCount === 0
              ? "Production is up to date with the latest tip of main."
              : "These deployable commits are on main but not yet promoted."}
          </p>

          {!walk.ok ? (
            <p className="text-body-sm text-[color:var(--error)] mt-2">
              {walk.error}
            </p>
          ) : driftCount === 0 ? null : (
            <ul className="mt-3 flex flex-col gap-2">
              {drift!.deployableCommits.slice(0, 8).map((c) => (
                <li
                  key={c.sha}
                  className="rounded-md border border-border-subtle bg-canvas-elevated px-3 py-2 text-body-sm"
                >
                  <p className="font-medium text-ink">
                    {c.prNumber ? `#${c.prNumber} ` : ""}
                    {c.prTitle ?? c.subject}
                  </p>
                  <p className="text-caption text-muted-strong font-mono">
                    {c.shortSha} · {relativeTime(c.authoredAt)}
                    {c.linkedIssueNumber
                      ? ` · closes #${c.linkedIssueNumber}`
                      : ""}
                  </p>
                </li>
              ))}
              {drift!.deployableCommits.length > 8 ? (
                <li className="text-caption text-muted-strong">
                  …and {drift!.deployableCommits.length - 8} more.
                </li>
              ) : null}
            </ul>
          )}

          <div className="mt-4">
            <PromoteTipButton
              clientSlug={slug}
              candidateSha={candidateSha}
              candidateLabel={candidateLabel}
              disabled={driftCount === 0 || candidateSha == null}
              disabledReason={
                candidateSha == null
                  ? "Couldn't determine the tip of main."
                  : driftCount === 0
                    ? "No deployable changes pending — already live."
                    : undefined
              }
            />
          </div>
        </Card>
      </div>

      <Section
        eyebrow="Audit log"
        title="Recent promote attempts"
        description="Who clicked what, what the guard returned, whether it dispatched."
      >
        {!log.configured ? (
          <Card emphasis="warning">
            <p className="text-body-sm text-ink-soft">
              <code className="font-mono">KV_REST_API_URL</code> /{" "}
              <code className="font-mono">KV_REST_API_TOKEN</code> not set.
              Promote attempts are not being recorded — set them so the
              resume protocol works.
            </p>
          </Card>
        ) : !log.ok ? (
          <Card>
            <p className="text-body-sm text-[color:var(--error)]">
              {log.error}
            </p>
          </Card>
        ) : log.entries.length === 0 ? (
          <EmptyState title="No attempts yet." />
        ) : (
          <Card>
            <ul className="flex flex-col">
              {log.entries.map((e, idx) => (
                <li
                  key={`${e.recordedAt}-${idx}`}
                  className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border-subtle py-3 last:border-b-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-body-sm font-medium text-ink">
                      <OutcomePill outcome={e.outcome} />{" "}
                      <span className="font-mono">
                        {e.candidateSha.slice(0, 7)}
                      </span>
                      {e.issueNumber ? (
                        <span className="text-muted-strong">
                          {" "}
                          · #{e.issueNumber}
                        </span>
                      ) : null}
                    </p>
                    {e.message ? (
                      <p className="text-caption text-ink-soft">{e.message}</p>
                    ) : null}
                    <p className="text-caption text-muted-strong">
                      {e.actorEmail ?? "system"} · {relativeTime(e.recordedAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </Section>

      {repo ? (
        <p className="text-caption text-muted-strong">
          Detection regex:{" "}
          <code className="font-mono">
            ^(src/|public/|package.json|next.config|tailwind.config|postcss.config)
          </code>{" "}
          · matches{" "}
          <Link href={`https://github.com/${repo}/blob/main/vercel.json`} className="underline">
            vercel.json
          </Link>
          .
        </p>
      ) : null}
    </section>
  );
}

function OutcomePill({ outcome }: { outcome: string }) {
  const tone =
    outcome === "dispatched"
      ? "bg-accent/15 text-accent-deep"
      : outcome === "noop"
        ? "bg-parchment text-ink-soft"
        : outcome === "rejected"
          ? "bg-[color:var(--error)]/15 text-[color:var(--error)]"
          : "bg-[color:var(--error)]/15 text-[color:var(--error)]";
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-caption font-mono ${tone}`}
    >
      {outcome}
    </span>
  );
}
