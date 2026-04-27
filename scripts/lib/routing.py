"""
Shared multi-model routing decisions for triage + execute.

Single source of truth for: given an issue's labels (or a triage classification),
which AI model/provider should run the work, and *why*. Designed so the same
function answers in both contexts:

  decide(labels, classification=None) -> Decision

The Decision dataclass carries the chosen provider/model AND a human-readable
audit trail so workflows can print the reasoning into the GitHub Actions log.

Provider taxonomy (matches `model/*` labels emitted by triage):
  - model/haiku        -> Claude Haiku       (triage, trivial edits)
  - model/sonnet       -> Claude Sonnet      (default code implementation)
  - model/opus         -> Claude Opus        (planning pass for complex work)
  - model/gemini-pro   -> Gemini 2.5 Pro     (deep research, long-form content,
                                              full-codebase audits — large ctx)
  - model/codex        -> OpenAI Codex       (code review, second-opinion diff
                                              analysis on PRs)
  - model/cline        -> (no CI integration; documented + routed back to Sonnet)

`model/cline` is intentionally accepted by the rubric so operators can flag
"agentic-large-refactor" tasks, but the router downgrades it to Claude Sonnet
because Cline ships only as a VS Code extension — there's no headless CLI we
can drive in GitHub Actions today. The audit trail records the original intent
and the downgrade reason so it shows up in run summaries.
"""

from __future__ import annotations

from dataclasses import dataclass, field


# ── Label -> concrete model id ────────────────────────────────────────────────
CLAUDE_MODELS = {
    "model/haiku":  "claude-haiku-4-5-20251001",
    "model/sonnet": "claude-sonnet-4-6",
    "model/opus":   "claude-opus-4-7",
}
GEMINI_MODELS = {
    "model/gemini-pro":   "gemini-2.5-pro",
    "model/gemini-flash": "gemini-2.5-flash",
}
CODEX_MODELS = {
    "model/codex": "gpt-4o-mini",
}

# Fallback complexity -> claude model when no model/* label is present.
COMPLEXITY_TO_CLAUDE = {
    "complexity/trivial": "claude-haiku-4-5-20251001",
    "complexity/easy":    "claude-haiku-4-5-20251001",
    "complexity/medium":  "claude-sonnet-4-6",
    "complexity/complex": "claude-opus-4-7",
}

# Type/area hints that bias toward a non-Claude provider when the model/* label
# is absent. Triage SHOULD set the label; this is a safety net.
GEMINI_TYPE_HINTS = {
    "type/research",
    "type/content-bulk",
    "area/seo",   # full-tree metadata audits are Gemini-flavored
}
CODEX_TYPE_HINTS = {
    "type/code-review",
}


@dataclass
class Decision:
    """Result of a routing decision."""
    provider: str        # "claude" | "gemini" | "codex" | "cline-downgraded"
    model: str           # concrete model id passed to the CLI/action
    workflow: str        # which execute path runs this: "claude" | "gemini-research" | "codex-review"
    reasons: list[str] = field(default_factory=list)
    label_used: str | None = None
    downgraded_from: str | None = None

    def audit(self) -> str:
        """Multi-line human-readable rationale, suitable for stdout / step summary."""
        lines = [
            "── Routing decision ──",
            f"  provider : {self.provider}",
            f"  model    : {self.model}",
            f"  workflow : {self.workflow}",
            f"  label    : {self.label_used or '(none, derived from complexity/heuristic)'}",
        ]
        if self.downgraded_from:
            lines.append(f"  downgrade: {self.downgraded_from} -> {self.provider} ({self.model})")
        for r in self.reasons:
            lines.append(f"  • {r}")
        return "\n".join(lines)


def decide(labels: set[str]) -> Decision:
    """Route an issue to a provider/model based on its labels.

    Order of precedence (first match wins):
      1. Explicit `model/*` label set by triage.
      2. `type/*` or `area/*` hint that strongly implies a non-Claude path.
      3. `complexity/*` -> Claude tier mapping.
      4. Default: Claude Sonnet.
    """
    reasons: list[str] = []

    # 1. Explicit model label
    for lbl in CLAUDE_MODELS:
        if lbl in labels:
            reasons.append(f"`{lbl}` label present — routing to Claude.")
            return Decision(
                provider="claude",
                model=CLAUDE_MODELS[lbl],
                workflow="claude",
                reasons=reasons,
                label_used=lbl,
            )

    for lbl in GEMINI_MODELS:
        if lbl in labels:
            reasons.append(
                f"`{lbl}` label present — routing to Gemini for "
                "large-context / research / bulk-content task."
            )
            return Decision(
                provider="gemini",
                model=GEMINI_MODELS[lbl],
                workflow="gemini-research",
                reasons=reasons,
                label_used=lbl,
            )

    for lbl in CODEX_MODELS:
        if lbl in labels:
            reasons.append(
                f"`{lbl}` label present — routing to OpenAI Codex for "
                "code-review / second-opinion analysis."
            )
            return Decision(
                provider="codex",
                model=CODEX_MODELS[lbl],
                workflow="codex-review",
                reasons=reasons,
                label_used=lbl,
            )

    if "model/cline" in labels:
        # Documented downgrade: no headless Cline CLI available in CI.
        reasons.append(
            "`model/cline` label present, but Cline has no headless CLI for "
            "GitHub Actions — downgrading to Claude Sonnet (closest agentic match)."
        )
        return Decision(
            provider="cline-downgraded",
            model="claude-sonnet-4-6",
            workflow="claude",
            reasons=reasons,
            label_used="model/cline",
            downgraded_from="cline",
        )

    # 2. Heuristic hints
    if labels & GEMINI_TYPE_HINTS:
        hits = sorted(labels & GEMINI_TYPE_HINTS)
        reasons.append(
            f"No `model/*` label, but {hits} suggests a Gemini-suited task "
            "(deep research / bulk content / full-tree audit)."
        )
        return Decision(
            provider="gemini",
            model=GEMINI_MODELS["model/gemini-pro"],
            workflow="gemini-research",
            reasons=reasons,
            label_used=hits[0],
        )

    if labels & CODEX_TYPE_HINTS:
        hits = sorted(labels & CODEX_TYPE_HINTS)
        reasons.append(
            f"No `model/*` label, but {hits} suggests an OpenAI Codex review task."
        )
        return Decision(
            provider="codex",
            model=CODEX_MODELS["model/codex"],
            workflow="codex-review",
            reasons=reasons,
            label_used=hits[0],
        )

    # 3. Complexity fallback -> Claude tier
    for lbl, model in COMPLEXITY_TO_CLAUDE.items():
        if lbl in labels:
            reasons.append(
                f"No explicit model label; `{lbl}` -> {model} via complexity fallback."
            )
            return Decision(
                provider="claude",
                model=model,
                workflow="claude",
                reasons=reasons,
                label_used=lbl,
            )

    # 4. Default
    reasons.append("No routing labels found — defaulting to Claude Sonnet.")
    return Decision(
        provider="claude",
        model="claude-sonnet-4-6",
        workflow="claude",
        reasons=reasons,
    )


def decide_from_classification(cls: dict) -> Decision:
    """Translate a Gemini-triage classification dict into a routing decision.

    Used by `scripts/gemini-triage.py` after the JSON-mode call so it can pick
    the same provider label the rubric would have picked.
    """
    labels: set[str] = set()
    if cls.get("complexity"):
        labels.add(f"complexity/{cls['complexity']}")
    if cls.get("type"):
        labels.add(f"type/{cls['type']}")
    if cls.get("area"):
        labels.add(f"area/{cls['area']}")
    routing = (cls.get("routing") or "").strip()
    if routing:
        labels.add(routing)  # e.g. "model/gemini-pro"
    return decide(labels)
