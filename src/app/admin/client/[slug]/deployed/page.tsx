import { notFound } from "next/navigation";

import { AutoRefresh } from "@/components/admin/AutoRefresh";
import { Card } from "@/components/admin/Card";
import { MetricTile } from "@/components/admin/MetricTile";
import { Section } from "@/components/admin/Section";
import { findClient } from "@/lib/admin/clients";
import { relativeTime } from "@/lib/admin/format";
import { isGithubConfigured, repoSlug } from "@/lib/admin/github";
import { commitsAheadOfProduction } from "@/lib/admin/production-guard";
import { isVercelConfigured, latestProductionDeployment } from "@/lib/admin/vercel";

export const dynamic = "force-dynamic";

const STATE_TONE: Record<string, "success" | "warning" | "failure" | "default"> = {
  READY: "success",
  BUILDING: "warning",
  QUEUED: "warning",
  ERROR: "failure",
  CANCELED: "default",
};

export default async function ClientDeployedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = findClient(slug);
  if (!client) notFound();

  const liveUrl = `https://${client.domain}`;
  const vercelOn = isVercelConfigured();
  const githubOn = isGithubConfigured();
  const repo = repoSlug();

  const prod = vercelOn ? await latestProductionDeployment() : null;
  const drift = vercelOn && githubOn ? await commitsAheadOfProduction() : null;

  return (
    <>
      <AutoRefresh />
      <header className="flex flex-col gap-2">
        <p className="text-caption text-muted-strong uppercase tracking-wider">
          Deployed
        </p>
        <h2 className="font-display text-display-sm text-ink">
          What&rsquo;s live right now
        </h2>
        <p className="text-body-sm text-ink-soft max-w-2xl">
          Status, commit, and timestamp for the build serving traffic at{" "}
          <span className="font-mono">{client.domain}</span>.
        </p>
      </header>

      {!vercelOn ? (
        <Card emphasis="warning">
          <p className="font-medium text-ink">Deploy data is offline.</p>
          <p className="text-body-sm text-ink-soft mt-1">
            Connect Vercel to populate the production state and commit
            history. Until then, the site at{" "}
            <a
              href={liveUrl}
              target="_blank"
              rel="noreferrer"
              className="underline text-accent-deep hover:text-accent"
            >
              {client.domain} ↗
            </a>{" "}
            still serves the latest deployed build.
          </p>
        </Card>
      ) : !prod || !prod.ok ? (
        <Card emphasis="warning">
          <p className="font-medium text-ink">Couldn&rsquo;t reach Vercel.</p>
          <p className="text-body-sm text-ink-soft mt-1">
            {prod && !prod.ok ? prod.error : "No response."}
          </p>
        </Card>
      ) : !prod.deployment ? (
        <Card>
          <p className="font-medium text-ink">No production deploy yet.</p>
          <p className="text-body-sm text-ink-soft mt-1">
            Approve a preview from the Preview tab to push your first
            production build.
          </p>
        </Card>
      ) : (
        <>
          <section
            aria-label="Live deploy"
            className="grid gap-3 sm:grid-cols-3"
          >
            <MetricTile
              label="State"
              value={prod.deployment.state}
              tone={STATE_TONE[prod.deployment.state] ?? "default"}
            />
            <MetricTile
              label="Live since"
              value={relativeTime(prod.deployment.createdAt)}
              hint={
                prod.deployment.commitRef
                  ? `Branch ${prod.deployment.commitRef}`
                  : undefined
              }
            />
            <MetricTile
              label="Drift vs. main"
              value={drift == null ? "—" : `${drift} commit${drift === 1 ? "" : "s"}`}
              tone={drift && drift > 0 ? "warning" : "success"}
              hint={
                drift == null
                  ? "Connect GitHub to surface drift"
                  : drift === 0
                    ? "Production is up to date"
                    : "Pending changes on main not yet promoted"
              }
            />
          </section>

          <Section
            eyebrow="Build"
            title="Currently serving traffic"
            action={
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[40px] items-center justify-center rounded-md bg-ink px-4 text-body-sm font-medium text-canvas hover:bg-accent hover:text-ink"
              >
                Open live site ↗
              </a>
            }
          >
            <Card className="flex flex-col gap-2">
              <p className="text-body-sm text-ink-soft">Production URL</p>
              <p className="font-mono text-body-sm text-ink break-all">
                {prod.deployment.url}
              </p>
              {prod.deployment.commitSha ? (
                <>
                  <p className="text-body-sm text-ink-soft mt-3">Commit</p>
                  <p className="font-mono text-body-sm text-ink">
                    {repo && githubOn ? (
                      <a
                        href={`https://github.com/${repo}/commit/${prod.deployment.commitSha}`}
                        target="_blank"
                        rel="noreferrer"
                        className="underline text-accent-deep hover:text-accent"
                      >
                        {prod.deployment.commitSha.slice(0, 12)}
                      </a>
                    ) : (
                      prod.deployment.commitSha.slice(0, 12)
                    )}
                  </p>
                </>
              ) : null}
              {prod.deployment.inspectorUrl ? (
                <p className="mt-3">
                  <a
                    href={prod.deployment.inspectorUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-caption underline text-ink-soft hover:text-ink"
                  >
                    Inspect on Vercel →
                  </a>
                </p>
              ) : null}
            </Card>
          </Section>
        </>
      )}
    </>
  );
}
