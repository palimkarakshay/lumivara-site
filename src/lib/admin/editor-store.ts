/**
 * In-process draft buffer for the `/admin/editor` MVP.
 *
 * v1 storage is a module-scoped `Map` keyed by `${email}:${slug}`. This is
 * intentional and documented in `docs/decks/adr-001-visual-editor.md`:
 *
 *   - Single-operator audience accepts the limitation that drafts die on
 *     Vercel cold starts and aren't shared across serverless functions.
 *   - The next step (Phase 2) is to swap this implementation for Vercel KV
 *     / Upstash; the auth adapter already uses Upstash so the dep is local.
 *
 * The exported surface is intentionally small so the swap is mechanical:
 * `getDraft`, `setDraft`, `clearDraft`, plus a typed `DraftRecord`.
 */

import type { InsightFrontmatter } from "@/lib/mdx";

export type DraftRecord = {
  /** MDX body without frontmatter. */
  body: string;
  /** Frontmatter values the editor exposes as form fields. */
  frontmatter: InsightFrontmatter;
  /** ISO-8601 timestamp of the most recent `setDraft` call. */
  updatedAt: string;
};

const drafts = new Map<string, DraftRecord>();

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function keyFor(email: string, slug: string): string {
  return `${normalizeEmail(email)}:${slug}`;
}

export function getDraft(email: string, slug: string): DraftRecord | null {
  if (!email || !slug) return null;
  return drafts.get(keyFor(email, slug)) ?? null;
}

export function setDraft(
  email: string,
  slug: string,
  record: Omit<DraftRecord, "updatedAt">,
): DraftRecord {
  const next: DraftRecord = { ...record, updatedAt: new Date().toISOString() };
  drafts.set(keyFor(email, slug), next);
  return next;
}

export function clearDraft(email: string, slug: string): void {
  drafts.delete(keyFor(email, slug));
}

/** Test-only: drop every draft. Not exported through the package surface. */
export function __resetDraftStoreForTests(): void {
  drafts.clear();
}
