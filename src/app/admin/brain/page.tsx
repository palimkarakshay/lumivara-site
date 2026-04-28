import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Card } from "@/components/admin/Card";
import { Section } from "@/components/admin/Section";
import { isAdminEmail } from "@/lib/admin-allowlist";
import {
  fetchRepoVariable,
  isGithubConfigured,
} from "@/lib/dashboard/github-actions";
import {
  DEFAULT_EXECUTE_MODEL_VAR,
  MODEL_CHOICES,
  NEXT_RUN_OVERRIDE_VAR,
  modelLabel,
} from "@/lib/dashboard/models";

import { BrainForm } from "./brain-form";

export const dynamic = "force-dynamic";

export default async function BrainPage() {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) {
    redirect("/admin/sign-in?from=/admin/brain");
  }

  const configured = isGithubConfigured();
  const [defaultVar, overrideVar] = await Promise.all([
    fetchRepoVariable(DEFAULT_EXECUTE_MODEL_VAR),
    fetchRepoVariable(NEXT_RUN_OVERRIDE_VAR),
  ]);

  const defaultModelId = defaultVar.ok ? defaultVar.value : null;
  const overrideModelId = overrideVar.ok ? overrideVar.value : null;

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <p className="text-caption text-muted-strong uppercase tracking-wider">
          Brain
        </p>
        <h1 className="font-display text-display-sm text-ink">Model controller</h1>
        <p className="text-body-sm text-ink-soft max-w-2xl">
          Pick the brain that runs the autopilot. The default sets the long-run
          tier; the override is a one-shot for the very next CI run. Per-issue{" "}
          <code className="font-mono">model/*</code> labels still take
          precedence — these are the fallbacks.
        </p>
      </header>

      {!configured ? (
        <Card emphasis="warning">
          <p className="font-medium text-ink">GitHub API is not configured.</p>
          <p className="text-body-sm text-ink-soft mt-1">
            Set <code className="font-mono">GITHUB_REPO</code> and{" "}
            <code className="font-mono">GITHUB_TOKEN</code> with{" "}
            <code className="font-mono">variables: read+write</code> scope to
            enable saving.
          </p>
        </Card>
      ) : null}

      <Section
        eyebrow="Tiers in play"
        title="Available models"
        description="Kept in sync with scripts/lib/routing.py — adding a new tier there means adding it here."
      >
        <Card>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {MODEL_CHOICES.map((m) => (
              <li
                key={m.id}
                className="rounded-md border border-border-subtle bg-canvas p-3"
              >
                <p className="text-caption font-mono text-muted-strong uppercase tracking-wider">
                  {m.provider}
                </p>
                <p className="font-medium text-ink mt-1">{m.label}</p>
                <p className="text-caption text-ink-soft mt-0.5">
                  {m.description}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </Section>

      <Section
        eyebrow="Controls"
        title="Default + override"
        description={`Currently default: ${modelLabel(defaultModelId)}. Override: ${overrideModelId ?? "none"}.`}
      >
        <BrainForm
          defaultModelId={defaultModelId}
          overrideModelId={overrideModelId}
          disabled={!configured}
          disabledReason={
            configured
              ? undefined
              : "Configure GITHUB_REPO and GITHUB_TOKEN to enable editing."
          }
        />
      </Section>
    </div>
  );
}
