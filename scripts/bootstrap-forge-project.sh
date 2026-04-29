#!/usr/bin/env bash
# Bootstrap the Lumivara Forge operator-hub Project v2 fields.
#
# Reads the field/view spec from docs/ops/github-project-layout.md §3
# and creates each custom field on an existing user-level project via
# the GraphQL API (single-select fields with the option list from the
# spec, plus the two date fields).
#
# Prereqs:
#   1. gh CLI installed and authenticated:
#        gh auth login
#        gh auth refresh -s project,read:project
#   2. The project already exists. Default name: "Lumivara Backlog"
#      (created by scripts/bootstrap-kanban.sh step 2). Override with
#      the PROJECT_TITLE env var.
#   3. Run as the user who owns the project (user-level, not org-level).
#
# What this script does:
#   - Resolves the project's GraphQL node ID by title for the current user.
#   - For each field in the §3.1 spec, creates it if missing
#     (single-select with options, or date), idempotent on re-run.
#
# What this script does NOT do:
#   - Create saved views (the GraphQL API for ProjectV2 view creation is
#     undocumented as of the cutoff; views are still a manual §4.3 step).
#   - Bulk-classify items. See bulk-classify-forge-items.sh (separate
#     script, not yet committed) once the spec stabilises.

set -euo pipefail

PROJECT_TITLE="${PROJECT_TITLE:-Lumivara Backlog}"

echo "→ Verifying gh auth has the project scope"
if ! gh auth status 2>&1 | grep -q "project"; then
  echo "FAIL: missing 'project' scope. Run:" >&2
  echo "  gh auth refresh -s project,read:project" >&2
  exit 1
fi

OWNER_LOGIN=$(gh api user --jq .login)
echo "→ Owner: $OWNER_LOGIN"

echo "→ Resolving project node ID for: $PROJECT_TITLE"
PROJECT_ID=$(gh api graphql -f query='
  query($login: String!) {
    user(login: $login) {
      projectsV2(first: 50) { nodes { id title number } }
    }
  }' -f login="$OWNER_LOGIN" \
  --jq ".data.user.projectsV2.nodes[] | select(.title == \"$PROJECT_TITLE\") | .id")

if [[ -z "$PROJECT_ID" ]]; then
  echo "FAIL: no project found with title '$PROJECT_TITLE' for user $OWNER_LOGIN." >&2
  echo "      Create it in the web UI per docs/ops/github-project-layout.md §4.1" >&2
  echo "      or set PROJECT_TITLE to the existing one." >&2
  exit 1
fi
echo "  · project ID: $PROJECT_ID"

# Fetch existing fields once so we can skip creates for ones that exist.
EXISTING_FIELDS=$(gh api graphql -f query='
  query($id: ID!) {
    node(id: $id) {
      ... on ProjectV2 {
        fields(first: 50) { nodes { ... on ProjectV2FieldCommon { name } } }
      }
    }
  }' -f id="$PROJECT_ID" --jq '.data.node.fields.nodes[].name')

field_exists() {
  echo "$EXISTING_FIELDS" | grep -Fxq "$1"
}

create_single_select() {
  local name="$1"; shift
  if field_exists "$name"; then
    echo "  · field exists: $name"
    return
  fi
  # Inline the options array into the mutation literal — gh api -f only
  # supports string scalars, so [ProjectV2SingleSelectFieldOptionInput!]!
  # has to be expressed in GraphQL input-object syntax inside the query.
  local options=""
  for opt in "$@"; do
    [[ -n "$options" ]] && options+=","
    options+="{name:\"$opt\",color:GRAY,description:\"\"}"
  done

  gh api graphql -f query="
    mutation {
      createProjectV2Field(input: {
        projectId: \"$PROJECT_ID\",
        dataType: SINGLE_SELECT,
        name: \"$name\",
        singleSelectOptions: [$options]
      }) { projectV2Field { ... on ProjectV2FieldCommon { name } } }
    }" >/dev/null
  echo "  + field: $name (single-select, $# options)"
}

create_date() {
  local name="$1"
  if field_exists "$name"; then
    echo "  · field exists: $name"
    return
  fi
  gh api graphql -f query="
    mutation {
      createProjectV2Field(input: {
        projectId: \"$PROJECT_ID\",
        dataType: DATE,
        name: \"$name\"
      }) { projectV2Field { ... on ProjectV2FieldCommon { name } } }
    }" >/dev/null
  echo "  + field: $name (date)"
}

echo "→ Creating custom fields per docs/ops/github-project-layout.md §3.1"

create_single_select "Workstream" \
  "POC" "GTM" "Comms" "Operator-Manual" "Technical" "Functional" \
  "Research" "Advisory" "DummyClient" "ProspectClient" "Legal+Vault"

create_single_select "Phase" \
  "0-rename" "1-poc" "2-runs1" "3-platform" "4-spinout" \
  "5-greenfield" "6-clientops" "none"

create_single_select "Gate" \
  "section1-migration" "section6-demo" "section7-operator" "none"

create_single_select "Owner-Type" \
  "Operator" "Bot" "External"

create_single_select "Demo-Day Critical" \
  "yes" "no"

create_date "Drop-Dead Date"
create_date "Earliest-Sensible Date"

create_single_select "Repo-Destination-Post-Migration" \
  "platform" "advisory-site" "advisory-pipeline" \
  "demo-site" "stays-here" "archive" "obsolete"

create_single_select "Effort" \
  "xs" "s" "m" "l" "xl"

create_single_select "Confidence" \
  "high" "medium" "low" "unknown"

# Status is the built-in field — do NOT create.

echo
echo "Bootstrap complete."
echo
echo "Next steps (manual):"
echo "  1. Add the 12 saved views per docs/ops/github-project-layout.md §3.2"
echo "     (web UI only — views are not yet scriptable via GraphQL)."
echo "  2. Bulk-classify open issues against the new fields. The simplest"
echo "     path is the §4.5 web-UI tap-through. A scripted bulk-classifier"
echo "     will arrive once the field options have settled past their"
echo "     first iteration."
