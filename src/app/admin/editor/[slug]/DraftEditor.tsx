"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";

import {
  discardDraftAction,
  publishDraftAction,
  saveDraftAction,
} from "@/app/admin/editor/actions";
import type { InsightFrontmatter } from "@/lib/mdx";

type Props = {
  slug: string;
  initialBody: string;
  initialFrontmatter: InsightFrontmatter;
  hasDraft: boolean;
  draftUpdatedAt: string | null;
};

type SaveStatus =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved"; at: string }
  | { kind: "error"; message: string };

const SAVE_DEBOUNCE_MS = 800;

export function DraftEditor({
  slug,
  initialBody,
  initialFrontmatter,
  hasDraft,
  draftUpdatedAt,
}: Props) {
  const [body, setBody] = useState(initialBody);
  const [frontmatter, setFrontmatter] =
    useState<InsightFrontmatter>(initialFrontmatter);
  const [status, setStatus] = useState<SaveStatus>(
    hasDraft && draftUpdatedAt
      ? { kind: "saved", at: draftUpdatedAt }
      : { kind: "idle" },
  );
  const [publishMessage, setPublishMessage] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Skip the auto-save the very first render — that's just hydration.
  const skippedFirstSave = useRef(false);

  const triggerSave = useCallback(
    (nextBody: string, nextFm: InsightFrontmatter) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setStatus({ kind: "saving" });
        startTransition(async () => {
          const result = await saveDraftAction(slug, nextBody, nextFm);
          if (result.ok) {
            setStatus({ kind: "saved", at: result.data.updatedAt });
          } else {
            setStatus({ kind: "error", message: result.error });
          }
        });
      }, SAVE_DEBOUNCE_MS);
    },
    [slug],
  );

  useEffect(() => {
    if (!skippedFirstSave.current) {
      skippedFirstSave.current = true;
      return;
    }
    triggerSave(body, frontmatter);
  }, [body, frontmatter, triggerSave]);

  function updateFm<K extends keyof InsightFrontmatter>(
    key: K,
    value: InsightFrontmatter[K],
  ) {
    setFrontmatter((prev) => ({ ...prev, [key]: value }));
  }

  async function onDiscard() {
    setStatus({ kind: "saving" });
    const result = await discardDraftAction(slug);
    if (!result.ok) {
      setStatus({ kind: "error", message: result.error });
      return;
    }
    setBody(initialBody);
    setFrontmatter(initialFrontmatter);
    setStatus({ kind: "idle" });
    setPublishMessage(null);
  }

  async function onPublish() {
    setPublishMessage("Opening PR…");
    const result = await publishDraftAction(slug);
    if (result.ok) {
      setPublishMessage(
        `PR #${result.data.prNumber} opened — ${result.data.htmlUrl}`,
      );
    } else {
      setPublishMessage(`Publish failed: ${result.error}`);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label="Title"
          value={frontmatter.title}
          onChange={(v) => updateFm("title", v)}
        />
        <Field
          label="Category"
          value={frontmatter.category}
          onChange={(v) => updateFm("category", v)}
        />
        <Field
          label="Published date"
          value={frontmatter.publishedDate}
          onChange={(v) => updateFm("publishedDate", v)}
          placeholder="YYYY-MM-DD"
        />
        <Field
          label="Reading time"
          value={frontmatter.readingTime}
          onChange={(v) => updateFm("readingTime", v)}
          placeholder="3 min"
        />
        <Field
          label="Excerpt"
          value={frontmatter.excerpt}
          onChange={(v) => updateFm("excerpt", v)}
          fullWidth
        />
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-label text-muted-strong">Body (MDX)</span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={24}
          className="rounded-md border border-border-subtle bg-canvas px-3 py-2 font-mono text-body-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent"
          spellCheck={false}
        />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border-subtle bg-canvas-elevated px-3 py-2">
        <span className="text-caption text-muted-strong">
          {status.kind === "saving"
            ? "Saving draft…"
            : status.kind === "saved"
              ? `Draft saved · ${new Date(status.at).toLocaleString()}`
              : status.kind === "error"
                ? `Save error: ${status.message}`
                : "No changes yet — auto-save runs after you type."}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onDiscard}
            className="rounded-md border border-border-subtle bg-canvas px-3 py-2 text-body-sm font-medium text-ink-soft hover:bg-parchment hover:text-ink"
          >
            Discard draft
          </button>
          <button
            type="button"
            onClick={onPublish}
            className="rounded-md border border-accent bg-accent px-3 py-2 text-body-sm font-medium text-ink ring-1 ring-accent hover:bg-accent-deep hover:text-canvas"
          >
            Publish (open PR)
          </button>
        </div>
      </div>

      {publishMessage ? (
        <p className="text-caption text-ink-soft" role="status">
          {publishMessage}
        </p>
      ) : null}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  fullWidth,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  fullWidth?: boolean;
}) {
  return (
    <label className={fullWidth ? "flex flex-col gap-1 sm:col-span-2" : "flex flex-col gap-1"}>
      <span className="text-label text-muted-strong">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-md border border-border-subtle bg-canvas px-3 py-2 text-body-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent"
      />
    </label>
  );
}
