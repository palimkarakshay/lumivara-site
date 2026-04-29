#!/usr/bin/env python3
"""
Gemini-based triage fallback.

Runs when Claude triage either failed or left `status/needs-triage` items unhandled.
Uses GEMINI_API_KEY env var. Calls Gemini 2.5 Flash for classification (free tier:
500 req/day, plenty for our triage queue).

This script is a drop-in replacement for Haiku triage — same rubric, same labels.
"""
import json
import os
import subprocess
import sys
import urllib.request
import urllib.error
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from lib.routing import decide_from_classification  # noqa: E402

REPO = "palimkarakshay/lumivara-site"
# gemini-2.5-flash stays the triage default: 500 req/day free-tier headroom is
# perfect for high-frequency classification. Deep work uses gemini-2.5-pro via
# plan-issue.py / deep-research.yml.
GEMINI_MODEL = "gemini-2.5-flash"
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "").strip()
MAX_ISSUES = 25  # Quality-first phase: matches the bumped Claude triage cap

RUBRIC = """You are triaging a GitHub issue for the Lumivara People Advisory site
(an HR consulting site: Next.js + Tailwind + MDX). Classify and reformat the issue.

Return ONLY a JSON object, no prose, no markdown fences:
{
  "priority": "P1" | "P2" | "P3",
  "complexity": "trivial" | "easy" | "medium" | "complex",
  "area": "site" | "content" | "copy" | "design" | "infra" | "seo" | "a11y" | "perf",
  "type": "claude-config" | "github" | "project-mgmt" | "tech-site" | "tech-vercel" | "business-lumivara" | "business-hr" | "design-cosmetic" | "cleanup" | "a11y" | "research" | "content-bulk" | "code-review",
  "routing": "model/haiku" | "model/sonnet" | "model/opus" | "model/gemini-pro" | "model/codex" | "model/cline" | null,
  "auto_routine": true | false,
  "needs_clarification": true | false,
  "clarification_questions": ["question 1", "question 2"],
  "title_rewrite": "New title or null if current title is fine",
  "rationale": "One sentence explaining the classification"
}

Rubric:
- P1: customer-facing bug, broken flow, accessibility blocker, blocks a named date
- P2: visible improvement, polish, content, non-urgent
- P3: nice-to-have, speculative, experiment
- trivial/easy: Haiku-sized (typos, single-file changes <30min)
- medium: Sonnet-sized (handful of files, 1-3h)
- complex: Opus-planned + Sonnet-executed (many files, architectural, >3h)
- auto_routine=true if self-contained with enough info; false if human judgement required
- needs_clarification=true if the issue is ambiguous — list specific blocking questions

Routing (pick ONE; null means use the complexity-tier Claude default):
- model/gemini-pro: full-codebase audits, bulk MDX content generation, deep research
  with multi-source synthesis. Uses Gemini's 1M-token context.
- model/codex: code review / diff analysis / second-opinion on a PR.
- model/cline: agentic-large-refactor flag (router will downgrade to Sonnet — no
  headless Cline CLI exists). Use only if the operator's intent is clearly Cline-style.
- null (default): Claude path; complexity tier picks Haiku/Sonnet/Opus.

Title rules (if title_rewrite is non-null):
- Start with a verb ("Add", "Fix", "Rename", "Remove", "Replace", "Audit")
- No leading "- ", no "P1 —" prefix
- Max 80 chars
- Specific not generic
"""


def gemini_classify(title: str, body: str) -> dict:
    """Call Gemini REST API (free tier via GEMINI_API_KEY). Returns parsed JSON."""
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY not set in env")

    prompt = f"{RUBRIC}\n\nISSUE TITLE: {title}\nISSUE BODY: {body or '(empty)'}"
    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
    )
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.1,
            "responseMimeType": "application/json",
        },
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            resp = json.loads(r.read())
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"Gemini API {e.code}: {e.read().decode()[:300]}")

    text = resp["candidates"][0]["content"]["parts"][0]["text"]
    return json.loads(text)


def apply_labels(issue_num: int, classification: dict) -> None:
    labels_to_add = []
    labels_to_remove = ["status/needs-triage"]

    if classification.get("needs_clarification"):
        labels_to_add.append("status/needs-clarification")
        labels_to_remove = []  # keep needs-triage so it stays in Inbox
    else:
        labels_to_add.extend([
            f"priority/{classification['priority']}",
            f"complexity/{classification['complexity']}",
            f"area/{classification['area']}",
            f"type/{classification['type']}",
            "status/planned",
        ])
        # Quality-first phase: every complexity tier maps to model/opus by
        # default. Cost-optimisation phase will revert to per-tier mapping.
        complexity = classification["complexity"]
        labels_to_add.append("model/opus")
        if complexity == "complex":
            labels_to_add.append("manual-only")

        # Provider override (gemini-pro / codex / cline). When the rubric asks
        # for a non-Claude path, that label takes precedence over the
        # complexity-tier model label at routing time.
        routing = (classification.get("routing") or "").strip()
        if routing in {"model/gemini-pro", "model/codex", "model/cline"}:
            labels_to_add.append(routing)

        if classification.get("auto_routine"):
            labels_to_add.append("auto-routine")
        else:
            labels_to_add.append("human-only")

    args = ["gh", "issue", "edit", str(issue_num), "--repo", REPO]
    if labels_to_add:
        args += ["--add-label", ",".join(labels_to_add)]
    if labels_to_remove:
        args += ["--remove-label", ",".join(labels_to_remove)]

    subprocess.run(args, check=True, capture_output=True)

    # Retitle if Gemini suggested a rewrite
    new_title = classification.get("title_rewrite")
    if new_title and new_title.strip() and new_title != "null":
        subprocess.run(
            ["gh", "issue", "edit", str(issue_num), "--repo", REPO, "--title", new_title],
            check=True, capture_output=True,
        )

    # Comment rationale
    if classification.get("needs_clarification"):
        questions = "\n".join(f"- {q}" for q in classification.get("clarification_questions", []))
        comment = f"**Triaged by Gemini (fallback) — needs clarification**\n\n{questions}"
    else:
        decision = decide_from_classification(classification)
        routing_line = f"{decision.provider} ({decision.model})"
        if decision.downgraded_from:
            routing_line += f" — downgraded from {decision.downgraded_from}"
        comment = (
            f"**Triaged by Gemini (fallback)**\n"
            f"- Priority: {classification['priority']}\n"
            f"- Complexity: {classification['complexity']}\n"
            f"- Area: {classification['area']}\n"
            f"- Type: {classification['type']}\n"
            f"- Routing: {routing_line}\n"
            f"- Auto-routine: {'yes' if classification.get('auto_routine') else 'no (human-only)'}\n"
            f"- Rationale: {classification.get('rationale', '')}"
        )
    subprocess.run(
        ["gh", "issue", "comment", str(issue_num), "--repo", REPO, "--body", comment],
        check=True, capture_output=True,
    )


def main():
    # Fetch open issues still labeled needs-triage (those Claude missed)
    result = subprocess.run(
        ["gh", "issue", "list", "--repo", REPO, "--state", "open",
         "--label", "status/needs-triage", "--json", "number,title,body",
         "--limit", str(MAX_ISSUES)],
        check=True, capture_output=True, text=True,
    )
    issues = json.loads(result.stdout)
    if not issues:
        print("Gemini fallback: no needs-triage issues remain. Claude handled everything.")
        return 0

    print(f"Gemini fallback: triaging {len(issues)} remaining issue(s).")
    success = 0
    for i in issues:
        try:
            cls = gemini_classify(i["title"], i.get("body") or "")
            apply_labels(i["number"], cls)
            print(f"  #{i['number']} → {cls.get('priority')}/{cls.get('complexity')} ({cls.get('rationale','')[:60]})")
            success += 1
        except Exception as e:
            print(f"  #{i['number']} FAILED: {e}", file=sys.stderr)
    print(f"\nTriaged {success}/{len(issues)} via Gemini.")
    return 0 if success > 0 else 1


if __name__ == "__main__":
    sys.exit(main())
