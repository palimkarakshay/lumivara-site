#!/usr/bin/env python3
"""
Claude-powered classifier for new llm-monitor records.

Takes a list of normalized records and asks Claude Opus to:

  * classify each as one of {bug, feature, best_practice, comparison,
    news, noise},
  * tag the model / SDK each is about (claude-opus-4-7,
    anthropic-sdk, claude-code, mcp, openai-gpt-5.5, gemini-2.5-pro,
    or "general"),
  * score severity 1-5 (only severity ≥ 4 reaches KNOWN_ISSUES.md),
  * score novelty 1-5 (helps surface genuinely new info vs.
    repetition of the same thread),
  * write a one-sentence summary the digest can quote verbatim,
  * suggest a one-line action_hint when severity ≥ 4 and the action
    is obvious (e.g. "pin SDK to 0.65.x").

Why one Claude call instead of one per record: batch classification
is far cheaper and gives Claude visibility across records, so it can
say "these three are the same thread" via the dedupe_group field.

Input: JSONL (one record per line) on stdin OR --input <file>.
Output: a single JSON document `{records: [...], summary: {...}}`
to stdout (or --output <file>).

Honours the AGENTS.md model-default table — Opus everywhere in this
phase. Skip with `--dry-run` to bypass the API and produce
classifier-shaped stub output (used by tests / when ANTHROPIC_API_KEY
is absent in local dev).
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from collections import Counter
from datetime import datetime, timezone

ANTHROPIC_URL = "https://api.anthropic.com/v1/messages"
ANTHROPIC_VERSION = "2023-06-01"
DEFAULT_MODEL = os.environ.get("LLM_MONITOR_MODEL", "claude-opus-4-7")
MAX_TOKENS = 8000
RECORDS_PER_BATCH = 25  # Keep prompt under ~50k input tokens

CLASSIFY_PROMPT = """You are the analyzer stage of an LLM-monitoring pipeline. The input is
a JSON array of social/news records about LLMs and SDKs. For EACH record,
emit one entry in your output JSON. Do NOT add fields, do NOT skip records.

Output ONLY a single JSON object of this shape, no preamble, no fences:

{
  "records": [
    {
      "id":          "<exact id from input>",
      "kind":        "bug" | "feature" | "best_practice" | "comparison" | "news" | "noise",
      "subject":     "claude-opus-4-7" | "claude-sonnet-4-6" | "claude-haiku-4-5" | "claude-code" | "anthropic-sdk" | "mcp" | "openai-gpt-5.5" | "openai-codex" | "gemini-2.5-pro" | "gemini-2.5-flash" | "general",
      "severity":    1-5,
      "novelty":     1-5,
      "summary":     "<one sentence, quotable>",
      "action_hint": "<one line if severity>=4 AND action is obvious, else empty string>",
      "dedupe_group": "<short slug; same slug = same underlying issue>"
    }
  ]
}

Severity rubric:
  5 = confirmed regression / outage in a model/SDK we use right now
  4 = likely regression or breaking change with multiple confirmations
  3 = useful best-practice or feature announcement worth knowing
  2 = mild signal — a single anecdote, opinion piece
  1 = noise — promo, off-topic, or already-handled issue

Novelty rubric:
  5 = first time this thread surfaces in our monitoring
  3 = a developing thread; new details on something already known
  1 = pure repetition of the same complaint as other records in batch

Be conservative on severity 5. If unsure, choose 4. The action_hint is
shown verbatim to engineers — keep it concrete (e.g. "pin
@anthropic-ai/sdk to 0.65.x", "switch model id to claude-opus-4-7", "add
retry on 529 overloaded_error"). If no clear action, leave empty.
"""


def _post_anthropic(prompt: str, records: list[dict], api_key: str, model: str) -> dict:
    payload = {
        "model": model,
        "max_tokens": MAX_TOKENS,
        "messages": [{
            "role": "user",
            "content": prompt + "\n\n## Records\n\n" + json.dumps(records, ensure_ascii=False),
        }],
    }
    req = urllib.request.Request(
        ANTHROPIC_URL,
        data=json.dumps(payload).encode(),
        headers={
            "x-api-key": api_key,
            "anthropic-version": ANTHROPIC_VERSION,
            "content-type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        resp = json.loads(r.read())
    text = resp["content"][0]["text"]
    # Defensive JSON extraction — Claude occasionally wraps in fences.
    text = text.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1].rsplit("```", 1)[0]
    return json.loads(text)


def _stub_classify(records: list[dict]) -> dict:
    """Offline classifier used by --dry-run. Heuristic only."""
    out = []
    for r in records:
        title = (r.get("title") or "").lower()
        body = (r.get("body") or "").lower()
        text = title + " " + body
        if any(w in text for w in ("bug", "broken", "regression", "outage", "error", "fail")):
            kind, sev = "bug", 4
        elif any(w in text for w in ("released", "release", "launch", "announc")):
            kind, sev = "news", 3
        elif any(w in text for w in ("vs ", "compared", "benchmark")):
            kind, sev = "comparison", 2
        elif any(w in text for w in ("how to", "tip", "best practice", "pattern")):
            kind, sev = "best_practice", 3
        else:
            kind, sev = "noise", 1
        subject = "general"
        for s in ("claude-opus-4-7", "claude-sonnet-4-6", "claude-code",
                  "anthropic-sdk", "mcp", "openai-gpt-5.5", "openai-codex",
                  "gemini-2.5-pro", "gemini-2.5-flash"):
            stem = s.split("-")[0]
            if stem in text or s in text:
                subject = s
                break
        out.append({
            "id": r["id"], "kind": kind, "subject": subject,
            "severity": sev, "novelty": 3,
            "summary": (r.get("title") or "")[:200],
            "action_hint": "",
            "dedupe_group": kind + "-" + subject,
        })
    return {"records": out}


def classify(records: list[dict], dry_run: bool = False) -> dict:
    if not records:
        return {"records": []}
    api_key = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    if dry_run or not api_key:
        if not dry_run:
            print("[analyzer] ANTHROPIC_API_KEY missing — using stub classifier",
                  file=sys.stderr)
        return summarize(_stub_classify(records), records)

    classified: list[dict] = []
    for i in range(0, len(records), RECORDS_PER_BATCH):
        batch = records[i:i + RECORDS_PER_BATCH]
        # Trim raw payloads — analyzer doesn't need them and they
        # bloat the prompt.
        slim = [{
            "id": r["id"],
            "source": r["source"],
            "title": r["title"],
            "body": r.get("body", "")[:1500],
            "score": r.get("score", 0),
            "url": r["url"],
        } for r in batch]
        try:
            result = _post_anthropic(CLASSIFY_PROMPT, slim, api_key, DEFAULT_MODEL)
            classified.extend(result.get("records", []))
        except (urllib.error.HTTPError, urllib.error.URLError, KeyError, ValueError) as e:
            print(f"[analyzer] batch {i}-{i+len(batch)} failed: {e}", file=sys.stderr)
            # Fall back to stub for this batch so the run completes.
            classified.extend(_stub_classify(batch)["records"])

    return summarize({"records": classified}, records)


def summarize(classified: dict, originals: list[dict]) -> dict:
    """Attach an aggregate `summary` block: counts by kind/subject/severity,
    plus a list of high-severity records ready for the feedback step."""
    by_id = {r["id"]: r for r in originals}
    kinds = Counter(c["kind"] for c in classified["records"])
    subjects = Counter(c["subject"] for c in classified["records"])
    sev_hist = Counter(c["severity"] for c in classified["records"])
    high = []
    for c in classified["records"]:
        if c["severity"] >= 4 and c["kind"] in ("bug", "feature", "best_practice"):
            orig = by_id.get(c["id"], {})
            high.append({**c, "url": orig.get("url"), "title": orig.get("title"),
                         "source": orig.get("source"), "ts": orig.get("ts")})
    return {
        "records": classified["records"],
        "originals_by_id": by_id,
        "summary": {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "model": DEFAULT_MODEL,
            "total": len(classified["records"]),
            "by_kind": dict(kinds),
            "by_subject": dict(subjects),
            "by_severity": {str(k): v for k, v in sev_hist.items()},
            "high_signal": high,
        },
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", help="JSONL file (default: stdin)")
    ap.add_argument("--output", help="JSON file (default: stdout)")
    ap.add_argument("--dry-run", action="store_true",
                    help="Skip Anthropic API; use heuristic classifier")
    args = ap.parse_args()

    src = open(args.input) if args.input else sys.stdin
    records = [json.loads(line) for line in src if line.strip()]
    if args.input:
        src.close()

    result = classify(records, dry_run=args.dry_run)
    out = json.dumps(result, ensure_ascii=False, indent=2)
    if args.output:
        with open(args.output, "w") as fh:
            fh.write(out)
    else:
        sys.stdout.write(out + "\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
