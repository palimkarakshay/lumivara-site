// Parses the `[ASK]` comments the triage agent leaves on issues that need
// the client to choose between options. Mirrors the spec from issue #94:
//
//   [ASK] Do you prefer layout A or B? Options: A) sidebar B) topnav
//
// becomes:
//
//   { question: "Do you prefer layout A or B?", options: [
//       { id: "A", label: "sidebar" },
//       { id: "B", label: "topnav" },
//   ] }
//
// Free-text questions (no `Options:` segment) come back with `options: []`,
// telling the UI to render a textarea instead of buttons.

export type AskQuestion = {
  question: string;
  options: AskOption[];
  /** Length-bounded raw line, so we don't surface accidental novellas. */
  raw: string;
};

export type AskOption = {
  /** Single uppercase letter (`A`, `B`, …). */
  id: string;
  label: string;
};

const ASK_PREFIX = "[ASK]";
const MAX_RAW = 2000;

/**
 * Find the most recent `[ASK]` comment from a list of newest-first
 * comments, parse it, and return the structured form. Returns null when
 * no ASK comment exists.
 */
export function parseLatestAsk(
  comments: ReadonlyArray<{ body: string; createdAt: string }>,
): AskQuestion | null {
  // GitHub returns comments oldest-first; we sort defensively.
  const sorted = [...comments].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  );
  for (const c of sorted) {
    const parsed = parseAsk(c.body);
    if (parsed) return parsed;
  }
  return null;
}

/** Parse a single comment body. Returns null if it isn't an `[ASK]`. */
export function parseAsk(body: string): AskQuestion | null {
  const trimmed = body.trim();
  if (!trimmed.toUpperCase().startsWith(ASK_PREFIX)) return null;
  const raw = trimmed.slice(0, MAX_RAW);
  const afterPrefix = raw.slice(ASK_PREFIX.length).trim();
  if (afterPrefix.length === 0) return null;

  const optionsIdx = findOptionsIndex(afterPrefix);
  if (optionsIdx === -1) {
    return { question: afterPrefix, options: [], raw };
  }

  const question = afterPrefix.slice(0, optionsIdx).trim();
  const optionsBlob = afterPrefix.slice(optionsIdx).replace(/^Options:/i, "");
  const options = extractOptions(optionsBlob);
  return { question: question || afterPrefix, options, raw };
}

/** Case-insensitive `Options:` index, only if it begins a token. */
function findOptionsIndex(text: string): number {
  const re = /(^|\s)Options:/i;
  const match = re.exec(text);
  if (!match) return -1;
  return match.index + (match[1] ? match[1].length : 0);
}

/** Pull `A) label` / `B) label` style choices out of the trailing blob. */
function extractOptions(blob: string): AskOption[] {
  const re = /\b([A-Z])\)\s*([^]+?)(?=\s+[A-Z]\)|$)/g;
  const opts: AskOption[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(blob)) !== null) {
    const id = m[1];
    const label = m[2].trim().replace(/[.,;]+$/, "");
    if (label.length === 0) continue;
    if (opts.some((o) => o.id === id)) continue;
    opts.push({ id, label });
    if (opts.length >= 6) break;
  }
  return opts;
}
