#!/usr/bin/env python3
"""
OpenAI-Codex-based triage fallback.

Drop-in replacement for `gemini-triage.py` when the operator picks Codex as
the triage engine, or when both Claude and Gemini are unavailable. Uses
gpt-4o-mini (configurable via CODEX_TRIAGE_MODEL env var) — cheap and
fast — and emits the same JSON classification shape, applies the same
labels, and posts the same rationale comment so downstream tooling
(routing.py, plan-issues.yml, execute.yml) doesn't have to know which
engine ran.

Triggered from triage.yml when `engine == 'codex'`, or as a final
fallback when both Claude and Gemini failed.
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
OPENAI_MODEL = os.environ.get("CODEX_TRIAGE_MODEL", "gpt-4o-mini")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "").strip()
MAX_ISSUES = 10

# Reuse the rubric from gemini-triage.py — single source of truth lives there.
# We re-import so a single edit propagates to both engines.
try:
    from gemini_triage import RUBRIC  # type: ignore
except ImportError:
    # gemini-triage.py uses a hyphen, not an underscore — load it manually.
    import importlib.util
    spec = importlib.util.spec_from_file_location(
        "gemini_triage", str(Path(__file__).parent / "gemini-triage.py")
    )
    mod = importlib.util.module_from_spec(spec)  # type: ignore
    spec.loader.exec_module(mod)  # type: ignore
    RUBRIC = mod.RUBRIC


def codex_classify(title: str, body: str) -> dict:
    if not OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY not set in env")

    prompt = f"{RUBRIC}\n\nISSUE TITLE: {title}\nISSUE BODY: {body or '(empty)'}"
    req = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=json.dumps({
            "model": OPENAI_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.1,
            "response_format": {"type": "json_object"},
        }).encode(),
        headers={"Authorization": f"Bearer {OPENAI_API_KEY}",
                 "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            resp = json.loads(r.read())
    except urllib.error.HTTPError as e:
        body_text = e.read().decode()[:300]
        raise RuntimeError(f"OpenAI API {e.code}: {body_text}")
    return json.loads(resp["choices"][0]["message"]["content"])


def apply_labels(issue_num: int, classification: dict) -> None:
    labels_to_add = []
    labels_to_remove = ["status/needs-triage"]

    if classification.get("needs_clarification"):
        labels_to_add.append("status/needs-clarification")
        labels_to_remove = []
    else:
        labels_to_add.extend([
            f"priority/{classification['priority']}",
            f"complexity/{classification['complexity']}",
            f"area/{classification['area']}",
            f"type/{classification['type']}",
            "status/planned",
        ])
        complexity = classification["complexity"]
        if complexity in ("trivial", "easy"):
            labels_to_add.append("model/haiku")
        elif complexity == "medium":
            labels_to_add.append("model/sonnet")
        else:
            labels_to_add.extend(["model/opus", "manual-only"])

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

    new_title = classification.get("title_rewrite")
    if new_title and new_title.strip() and new_title != "null":
        subprocess.run(
            ["gh", "issue", "edit", str(issue_num), "--repo", REPO,
             "--title", new_title],
            check=True, capture_output=True,
        )

    if classification.get("needs_clarification"):
        questions = "\n".join(f"- {q}" for q in classification.get("clarification_questions", []))
        comment = f"**Triaged by Codex (fallback) — needs clarification**\n\n{questions}"
    else:
        decision = decide_from_classification(classification)
        routing_line = f"{decision.provider} ({decision.model})"
        if decision.downgraded_from:
            routing_line += f" — downgraded from {decision.downgraded_from}"
        comment = (
            f"**Triaged by Codex ({OPENAI_MODEL}) fallback**\n"
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


def main() -> int:
    if not OPENAI_API_KEY:
        print("Codex triage skipped: OPENAI_API_KEY not set.")
        return 0  # not an error — Codex is optional

    result = subprocess.run(
        ["gh", "issue", "list", "--repo", REPO, "--state", "open",
         "--label", "status/needs-triage", "--json", "number,title,body",
         "--limit", str(MAX_ISSUES)],
        check=True, capture_output=True, text=True,
    )
    issues = json.loads(result.stdout)
    if not issues:
        print("Codex triage: no needs-triage issues remain.")
        return 0

    print(f"Codex triage ({OPENAI_MODEL}): triaging {len(issues)} issue(s).")
    success = 0
    for i in issues:
        try:
            cls = codex_classify(i["title"], i.get("body") or "")
            apply_labels(i["number"], cls)
            print(f"  #{i['number']} → {cls.get('priority')}/{cls.get('complexity')} "
                  f"({cls.get('rationale','')[:60]})")
            success += 1
        except Exception as e:
            print(f"  #{i['number']} FAILED: {e}", file=sys.stderr)
    print(f"\nTriaged {success}/{len(issues)} via Codex.")
    return 0 if success > 0 else 1


if __name__ == "__main__":
    sys.exit(main())
