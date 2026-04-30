#!/usr/bin/env python3
"""
analyze.py — single Claude call: classify section + extract structured intel.

Reads a transcript markdown file (with `[hh:mm:ss]` timestamp anchors) and
asks Claude Opus to return a strict JSON document with:

    {
      "id":                "<filename stem>",
      "section":           one of {client-meetings, advisors, investors,
                                   competitors, musings, research},
      "section_confidence": 0.0..1.0,
      "summary":           one-paragraph factual summary, every claim anchored,
      "people":            [{"name": "...", "role": "..."}],
      "companies":         ["..."],
      "topics":            ["..."],
      "quotes":            [{"speaker": "...", "ts": "00:14:32",
                             "text": "..."}],   # VERBATIM, not paraphrased
      "action_items":      [{"text": "...",
                             "owner": "operator|other|unknown",
                             "ts": "00:14:32",
                             "requires_action": true|false,
                             "urgency": "low|medium|high"}],
      "self_automation_trigger": bool,   # see SYSTEM prompt for criteria
      "drift_check":       short audit string the analyser writes about itself
    }

Anti-drift discipline (the user's stated priority — "without AI drift"):
  * Every quote is VERBATIM. The system prompt forbids paraphrase in `quotes`.
  * Every claim must cite a `[hh:mm:ss]` anchor; un-anchored items are dropped.
  * Each run sees ONLY the immutable transcript, never a prior summary.
    No compounding-summary failure mode.
  * Output is strict JSON (no prose, no markdown fences). The orchestrator
    parses it; any drift breaks parsing and is loud, not silent.

Usage:
    python3 analyze.py --transcript <md> --source <orig> --mime <type> \
        --output <json> [--model claude-opus-4-7] [--dry-run]

Honours AGENTS.md's model-default table — Opus by default. Falls back to a
deterministic stub when ANTHROPIC_API_KEY is missing or --dry-run is set,
so the orchestrator can be exercised end-to-end without an API call.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

ANTHROPIC_URL = "https://api.anthropic.com/v1/messages"
ANTHROPIC_VERSION = "2023-06-01"
DEFAULT_MODEL = os.environ.get("RECORD_INGEST_MODEL", "claude-opus-4-7")
MAX_TOKENS = 8000

VALID_SECTIONS = {
    "client-meetings",
    "advisors",
    "investors",
    "competitors",
    "musings",
    "research",
}

SYSTEM = """You are the recording-ingest analyst for Lumivara Forge, an operator
framework. You classify and extract structured intelligence from a single
recording transcript with low hallucination.

HARD RULES:

1.  Every claim in `summary`, `quotes`, and `action_items` MUST be anchored to
    a [hh:mm:ss] timestamp from the input. Items you cannot anchor get
    dropped. Do not invent timestamps.

2.  `quotes` is VERBATIM. Copy text exactly as it appears in the transcript.
    Never paraphrase, smooth, summarise, or merge into the quotes field.
    If you change a single word, it does not belong in `quotes`.

3.  `section` is one of:
    - client-meetings: paid or prospective client engagement
    - advisors:        senior people giving the operator strategic input
                       (no investment relationship)
    - investors:       VCs, angels, anyone discussing capital
    - competitors:     rival product / service operators (publicly attended
                       events only — sales demos where the operator is
                       identified, conference talks, podcasts)
    - musings:         solo voice memos by the operator (no other speaker)
    - research:        third-party content being studied (talks, podcasts,
                       interviews not involving the operator)

4.  `self_automation_trigger` is `true` ONLY when AT LEAST ONE action_item has:
        owner == "operator"
        requires_action == true
        urgency in {"medium", "high"}
    Default to false. Be conservative — false positives waste operator time.

5.  Output STRICT JSON only. No prose, no markdown fences, no commentary.
    The first character of your output is `{` and the last is `}`.

6.  When the transcript carries a "(no audio transcript)" notice (image, PDF,
    text), still classify it from the source filename + any text content,
    set `quotes: []` and `action_items: []` unless the asset itself contains
    explicit, owner-attributed action text. Set `drift_check` to note the
    non-audio path."""


def _post(prompt: str, api_key: str, model: str) -> dict:
    payload = {
        "model": model,
        "max_tokens": MAX_TOKENS,
        "system": SYSTEM,
        "messages": [{"role": "user", "content": prompt}],
    }
    req = urllib.request.Request(
        ANTHROPIC_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "x-api-key": api_key,
            "anthropic-version": ANTHROPIC_VERSION,
            "content-type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=180) as resp:
        body = json.loads(resp.read())
    text = "".join(blk.get("text", "") for blk in body.get("content", []))
    text = text.strip()
    if text.startswith("```"):
        text = text.split("```", 2)[1]
        if text.startswith("json"):
            text = text[4:]
        text = text.strip()
        if text.endswith("```"):
            text = text[:-3].strip()
    return json.loads(text)


def _stub(transcript_path: Path) -> dict:
    return {
        "id": transcript_path.stem,
        "section": "musings",
        "section_confidence": 0.0,
        "summary": "(stub — no analysis run; ANTHROPIC_API_KEY unset or --dry-run)",
        "people": [],
        "companies": [],
        "topics": [],
        "quotes": [],
        "action_items": [],
        "self_automation_trigger": False,
        "drift_check": "stub-mode",
    }


def _validate(d: dict, transcript_path: Path) -> dict:
    """Strip anything Claude returned that does not satisfy the hard rules."""
    d.setdefault("id", transcript_path.stem)
    section = d.get("section", "musings")
    if section not in VALID_SECTIONS:
        d.setdefault("warnings", []).append(
            f"section '{section}' not in valid set; falling back to musings"
        )
        d["section"] = "musings"

    transcript = transcript_path.read_text()

    def _anchored(item: dict) -> bool:
        ts = item.get("ts")
        if not ts:
            return False
        # accept hh:mm:ss; the [ts] anchor must appear in the transcript
        return f"[{ts}]" in transcript

    def _verbatim(quote: dict) -> bool:
        text = quote.get("text", "").strip()
        return bool(text) and text in transcript

    quotes = [q for q in d.get("quotes", []) if _anchored(q) and _verbatim(q)]
    actions = [a for a in d.get("action_items", []) if _anchored(a)]

    dropped_quotes = len(d.get("quotes", [])) - len(quotes)
    dropped_actions = len(d.get("action_items", [])) - len(actions)
    if dropped_quotes or dropped_actions:
        d.setdefault("warnings", []).append(
            f"drift-guard dropped {dropped_quotes} unverbatim/unanchored "
            f"quotes and {dropped_actions} unanchored action items"
        )

    d["quotes"] = quotes
    d["action_items"] = actions

    operator_urgent = any(
        a.get("owner") == "operator"
        and a.get("requires_action") is True
        and a.get("urgency") in {"medium", "high"}
        for a in actions
    )
    d["self_automation_trigger"] = bool(operator_urgent)
    return d


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--transcript", required=True)
    ap.add_argument("--source", required=True)
    ap.add_argument("--mime", default="unknown")
    ap.add_argument("--output", required=True)
    ap.add_argument("--model", default=DEFAULT_MODEL)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    transcript_path = Path(args.transcript)
    transcript = transcript_path.read_text()

    if args.dry_run or not os.environ.get("ANTHROPIC_API_KEY"):
        out = _stub(transcript_path)
    else:
        prompt = (
            f"Source filename: {Path(args.source).name}\n"
            f"Source MIME:     {args.mime}\n"
            f"Transcript ID:   {transcript_path.stem}\n\n"
            f"--- TRANSCRIPT START ---\n{transcript}\n--- TRANSCRIPT END ---\n\n"
            "Return ONLY the JSON document defined in the system prompt."
        )
        try:
            out = _post(prompt, os.environ["ANTHROPIC_API_KEY"], args.model)
        except (urllib.error.URLError, json.JSONDecodeError, KeyError) as e:
            sys.stderr.write(f"!! analyze.py: Claude call failed: {e}\n")
            out = _stub(transcript_path)
            out["error"] = str(e)

    out["id"] = transcript_path.stem
    out = _validate(out, transcript_path)
    Path(args.output).write_text(json.dumps(out, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
