#!/usr/bin/env bash
# Bootstrap the Issues + Projects Kanban.
#
# Prereqs (see docs/BACKLOG.md):
#   1. gh CLI installed and authenticated (`gh auth login`) with scopes
#      including `project` (run `gh auth refresh -s project,read:project` if needed).
#   2. Run from the repo root.
#
# What this script does:
#   - Creates the Kanban label set (priority/complexity/area/status/gating).
#   - Migrates the 3 Inbox items from the old Feedback.md into GitHub Issues.
#   - Prints the next-step checklist (Project v2 creation, PR token rotation).
#
# It's idempotent: re-running won't create duplicate labels or re-post issues
# (it checks for existing issue titles first).

set -euo pipefail

REPO_SLUG="palimkarakshay/lumivara-site"

echo "→ Verifying gh auth"
gh auth status >/dev/null 2>&1 || {
  echo "FAIL: run 'gh auth login' first." >&2
  exit 1
}

create_label() {
  local name="$1" color="$2" desc="$3"
  if gh label list --repo "$REPO_SLUG" --limit 200 | awk -F'\t' '{print $1}' | grep -Fxq "$name"; then
    echo "  · label exists: $name"
  else
    gh label create "$name" --repo "$REPO_SLUG" --color "$color" --description "$desc" >/dev/null
    echo "  + label: $name"
  fi
}

echo "→ Creating labels"
# Priority
create_label "priority/P1"          "B60205" "Urgent — work next auto-run"
create_label "priority/P2"          "D93F0B" "Soon — within a week"
create_label "priority/P3"          "FBCA04" "Whenever — nice-to-have"
# Complexity
create_label "complexity/trivial"   "C2E0C6" "Typo / one-line change"
create_label "complexity/easy"      "86D680" "< 30 min, single file"
create_label "complexity/medium"    "FEF2C0" "1–3 hours, a few files"
create_label "complexity/complex"   "F9D0C4" "> 3 hours or architectural"
# Area
create_label "area/site"            "1D76DB" "Next.js app code"
create_label "area/content"         "0E8A16" "Copy, MDX, content files"
create_label "area/infra"           "5319E7" "Workflows, tooling, deploy"
create_label "area/copy"            "0E8A16" "Copy / tone edits"
create_label "area/design"          "B60275" "Visual design / UI tokens"
create_label "area/seo"             "5319E7" "SEO / metadata / OG"
create_label "area/a11y"            "006B75" "Accessibility"
create_label "area/perf"            "F9D0C4" "Performance / bundle size"
# Status
create_label "status/needs-triage"  "EDEDED" "Default on new issues"
create_label "status/planned"       "BFD4F2" "Accepted, not started"
create_label "status/in-progress"   "0052CC" "Auto-routine or human is on it"
create_label "status/blocked"       "E99695" "Waiting on something — see comments"
create_label "status/needs-clarification" "FBCA04" "Bot asked a question on the issue"
# Gating
create_label "auto-routine"         "0E8A16" "Eligible for automated execute.yml runs"
create_label "human-only"           "E99695" "Skip auto-routine — human-only"
create_label "infra-allowed"        "B60205" "Issue authorises infra/workflow edits by agent"
create_label "needs-vercel-mirror"  "FFA500" "Operator must mirror changes in Vercel dashboard"

create_issue() {
  local title="$1" body="$2" labels="$3"
  # skip if an open or closed issue with the same title already exists
  if gh issue list --repo "$REPO_SLUG" --state all --search "in:title \"$title\"" --json title --jq '.[].title' | grep -Fxq "$title"; then
    echo "  · issue exists: $title"
    return
  fi
  gh issue create --repo "$REPO_SLUG" --title "$title" --body "$body" --label "$labels" >/dev/null
  echo "  + issue: $title"
}

echo "→ Migrating 3 open Feedback.md items to Issues"

create_issue \
  "Continue site polish — follow up on paused r0 work" \
  $'Context from the previous build session (prior to feedback-automation setup):\n\nResume site polish work that was paused when the Claude session hit its limit. The full prior transcript is at:\n\n    C:\\\\Users\\\\palimkara\\\\.claude\\\\projects\\\\c--Lumivara\\\\9120ffab-c839-4eef-833c-c5b63f92cc74.jsonl\n\nSpecific threads likely still open (infer from the transcript + git log `7530dba..4d5371c`):\n- Insights MDX seeding (at least 3 starter articles)\n- Accessibility audit (keyboard traversal, ARIA, contrast)\n- Performance pass (Lighthouse ≥90 on all categories)\n- Deploy target configuration (Vercel)\n- OG image visual QA\n\nRecommend: open this issue, read the transcript, and split into discrete per-thread issues so the auto-routine can pick them up independently.' \
  "priority/P1,complexity/complex,area/site,status/planned,human-only"

create_issue \
  "Auto-routine budget + usage monitoring" \
  $'Track Claude Code Action usage against Pro session quota. Once triage.yml and execute.yml have been live for a week, review:\n- How many Actions runs fired\n- Rough token spend per run\n- Whether the automation starved the interactive Pro budget\n\nIf usage is too hot, reduce cadence (execute from 3x/day → 1x/day) or raise the bar for what becomes P1.\n\nThis issue is a reminder to revisit — not a coding task.' \
  "priority/P2,complexity/trivial,area/infra,status/planned,human-only"

create_issue \
  "LLM-based triage refinement (upgrade path)" \
  $'Current triage.yml uses Claude with a fixed rubric to label new issues. Candidate upgrades once the baseline works:\n- Clustering similar issues into one\n- Rejecting duplicate / out-of-scope items with a comment\n- Suggesting dependencies between issues\n\nDefer until the baseline triage has been observed for a couple of weeks.' \
  "priority/P3,complexity/medium,area/infra,status/planned,human-only"

echo
echo "Bootstrap complete."
echo
echo "Next steps (manual, in order):"
echo "  1. Generate the OAuth token:"
echo "       claude setup-token"
echo "     Copy the output, then:"
echo "       GitHub → Settings → Secrets and variables → Actions → New repo secret"
echo "       Name: CLAUDE_CODE_OAUTH_TOKEN"
echo "       Value: <paste>"
echo
echo "  2. Create the Project v2 in the web UI (faster than scripting):"
echo "       GitHub → your profile → Projects → New project → Board"
echo "       Name: Lumivara Backlog"
echo "       Columns: Inbox, Triaged, In Progress, Review, Done"
echo "     Then: Project → ⋯ → Workflows → 'Auto-add to project' → enable for this repo."
echo
echo "  3. Update the phone capture path per docs/BACKLOG.md (the historical PHONE_SETUP.md notice now lives at docs/_deprecated/PHONE_SETUP.md)."
echo
echo "  4. First test run:"
echo "       gh workflow run triage.yml --repo $REPO_SLUG"
echo "       gh workflow run execute.yml --repo $REPO_SLUG"
