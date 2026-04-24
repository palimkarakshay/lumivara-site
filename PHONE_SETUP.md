# Phone → GitHub Issue

Capture a backlog item from your phone by POSTing to the GitHub Issues API. The **Triage backlog** Action picks it up on its next run and classifies it; the **Execute backlog item** Action picks up the top-ranked result a few hours later and opens a PR.

Two phones supported below — pick your section:

- [Android (HTTP Shortcuts)](#section-android--http-shortcuts) — sections 1–4
- [iPhone 16 Pro / any iOS (Apple Shortcuts)](#section-ios--apple-shortcuts) — section 5

For the full lifecycle map, see [docs/BACKLOG.md](docs/BACKLOG.md).

---

## Section: Android — HTTP Shortcuts

## 1. Create a fine-grained PAT

Scope it narrowly so a stolen phone doesn't have keys to the kingdom.

1. GitHub → Settings → Developer settings → **Personal access tokens** → **Fine-grained tokens** → *Generate new token*.
2. **Resource owner**: your account.
3. **Repository access**: *Only select repositories* → `lumivara-site`.
4. **Permissions** → Repository permissions:
   - *Issues*: **Read and write** — required for the capture shortcut (Section 2).
   - *Actions*: **Read and write** — required only if you also want the optional manual triage/execute shortcuts (Section 3). If you only need capture and are fine letting cron handle the rest, leave this at *No access*.
   - *Metadata*: Read-only (required by GitHub).
   - *Contents*: No access — the token doesn't need to write code.
   - Everything else: No access.
5. **Expiration**: 90 days. Calendar a rotation.
6. Copy the token. You won't see it again.

**Two-token alternative (smaller blast radius)**: mint two separate fine-grained PATs — one with *Issues:write only*, one with *Actions:write only*. Store as separate `GITHUB_TOKEN` and `GITHUB_ACTIONS_TOKEN` variables in HTTP Shortcuts. A leaked phone token can then only do one of the two things. Recommended if you carry the phone outside the house.

Note: this is a *different* token from `CLAUDE_CODE_OAUTH_TOKEN`. That one is for GitHub Actions → Claude; this one is for your phone → GitHub.

## 2. Install HTTP Shortcuts (Android)

[HTTP Shortcuts](https://play.google.com/store/apps/details?id=ch.rmy.android.http_shortcuts) is a small open-source app. Install it, then:

1. **Variables** → *Add variable*:
   - `GITHUB_TOKEN` — type *Constant*, value = the PAT above. Mark *Protected*.
   - `ISSUE_TITLE` — type *Text input*, label *"Title"*, single-line.
   - `ISSUE_BODY` — type *Text input*, label *"Detail"*, multi-line, optional.
   - `ISSUE_PRIORITY` — type *Selection*, options: `P1`, `P2`, `P3`, `unsure`. Default `unsure`.

2. **Create Shortcut** → *HTTP Request*:
   - **Name**: `Feedback → Lumivara`
   - **Method**: `POST`
   - **URL**: `https://api.github.com/repos/palimkarakshay/lumivara-site/issues`
   - **Request Body** → *Custom text*, content type `application/json`:
     ```json
     {
       "title": "{{ISSUE_PRIORITY}} — {{ISSUE_TITLE}}",
       "body": "{{ISSUE_BODY}}\n\n_Captured from phone._",
       "labels": ["status/needs-triage"]
     }
     ```
     (If `ISSUE_PRIORITY` is `unsure`, the bot decides. If it's `P1`/`P2`/`P3`, the title carries the hint and triage usually respects it.)
   - **Request Headers**:
     - `Authorization`: `Bearer {{GITHUB_TOKEN}}`
     - `Accept`: `application/vnd.github+json`
     - `X-GitHub-Api-Version`: `2022-11-28`
   - **Response Handling**: *Display response on failure*. Success returns HTTP 201 with the issue JSON.

3. **Trigger options**:
   - *Add to home screen* → one-tap launcher.
   - *Share target* → "Share → Feedback → Lumivara" works from any app (Gmail, Chrome, Notes). Shared text pre-fills `ISSUE_BODY`; fill in the title.

## 3. (Optional) A second shortcut to force-run the bot

If you want to trigger `triage.yml` or `execute.yml` from the phone without waiting for the cron:

- **URL**: `https://api.github.com/repos/palimkarakshay/lumivara-site/actions/workflows/triage.yml/dispatches`
  (or `execute.yml` for the execute run)
- **Method**: `POST`
- **Body**: `{"ref": "main"}`
- **Headers**: same as above.

Useful right after capturing a batch of items — saves up to 24h waiting for the daily triage.

## 4. Smoke test

Tap the shortcut, fill in:
- Priority: `P3`
- Title: `test from phone`
- Detail: leave blank

Expected:
- HTTP 201 response — the issue JSON.
- A new issue appears in the GitHub web UI immediately.
- Next triage run (manual `gh workflow run triage.yml` if you don't want to wait) labels it and comments.
- Because it's `P3 trivial`, `execute.yml` will pick it up eventually — delete or close it before that if you want to avoid a noise PR.

If the request comes back 401/403, the PAT scope is wrong. 404 means the repo slug in the URL is wrong. 422 usually means the JSON body is malformed (check escaping).

---

## Section: iOS — Apple Shortcuts

This uses the **Shortcuts** app that's pre-installed on iPhone (works on iPhone 16 Pro). Same PAT and JSON shape as Android.

### Step A — One-time prep

1. Mint a fine-grained PAT exactly as in [Section 1](#1-create-a-fine-grained-pat) above. Same scopes (`Issues: Read/Write` for capture; add `Actions: Read/Write` if you also want phone-triggered workflow runs).
2. Open **Notes** (or a password manager). Paste the PAT into a note titled `lumivara-pat` so you can reach it from the Shortcut. (We won't use a separate variable store; the Shortcut itself will hold the token in a Text action.)

### Step B — Create the "Capture" Shortcut

1. Open **Shortcuts** app → tap **+** (top right) to create a new shortcut.
2. Name it: tap the title at the top → "Lumivara — Capture issue".
3. Add the following actions in this order. Search by name in the bottom search bar.

   **Action 1 — Text** (this is the literal token):
   - Search "Text" → tap *Text*.
   - In the text box, paste your PAT (the long `github_pat_...` string).
   - Tap the variable chip that appears → rename to `Token`.

   **Action 2 — Ask for Input**:
   - Search "Ask for Input" → add it.
   - **Prompt**: `What's the issue title?`
   - **Input Type**: Text.
   - Tap the output variable → rename to `IssueTitle`.

   **Action 3 — Ask for Input**:
   - Add another *Ask for Input*.
   - **Prompt**: `Detail (optional)`
   - **Input Type**: Text.
   - **Default Answer**: leave blank.
   - Rename output to `IssueBody`.

   **Action 4 — Choose from Menu**:
   - Search "Choose from Menu" → add it.
   - **Prompt**: `Priority?`
   - **Items**: tap each and add: `P1`, `P2`, `P3`, `unsure`. (Four menu items.)

   For each menu branch, drag in the same final HTTP step (or — easier — add a *Set Variable* inside each branch to set a `Priority` variable, then close the menu and continue with one HTTP action below).

   Simpler: replace the menu with **Ask for Input** with input type *Text* and default answer `P3`. You type the priority manually (one or two characters). Less foolproof, fewer taps to set up.

   **Action 5 — Get Contents of URL**:
   - Search "Get Contents of URL" → add it.
   - **URL**: `https://api.github.com/repos/palimkarakshay/lumivara-site/issues`
   - Tap **Show More** to reveal options.
   - **Method**: `POST`
   - **Headers**: tap *Add new header* three times:
     - `Authorization` → value: tap the `+` to insert variable → pick `Token`. Then in front of it, type `Bearer ` (with trailing space). End result reads "Bearer [Token variable chip]".
     - `Accept` → value: `application/vnd.github+json`
     - `X-GitHub-Api-Version` → value: `2022-11-28`
   - **Request Body** → tap → choose **JSON**.
   - Build the JSON tree:
     - Add field `title` (Text) → tap `+` → insert variable → pick `Priority` → type ` — ` → insert variable `IssueTitle`.
     - Add field `body` (Text) → insert `IssueBody` variable → newline → newline → `_Captured from iPhone._`
     - Add field `labels` (Array) → add one item → set as Text → value: `status/needs-triage`.

   **Action 6 — Show Notification** (so you see the result):
   - Search "Show Notification" → add it.
   - **Title**: `Lumivara`
   - **Body**: `Issue captured.` (Or, more useful: tap `+` → "Get Dictionary Value" → paste the previous step's URL output to extract the issue number; this is fiddly — skip if you just want the basic version.)

4. Tap **Done** (top right).

### Step C — Add to home screen + share sheet

1. In the Shortcuts list, long-press the shortcut → **Details**.
2. **Add to Home Screen** → place the icon where you'll find it. Optionally set a custom icon/colour.
3. Toggle **Show in Share Sheet** ON → set Accepted Types to *Text*. Now any text you select in Notes/Mail/Safari can be sent into this shortcut as the issue body.

### Step D — Smoke test

1. Tap the home-screen icon.
2. Title: `test from iphone`. Detail: blank. Priority: `P3`.
3. Expected: a notification "Issue captured" within ~1 second; a new issue in the GitHub repo with `status/needs-triage` label; bot comments on it within ~5 minutes if you trigger triage manually.

### iOS gotchas

- **Token storage**: iOS Shortcuts has no separate "Variables" panel. The PAT lives inside the Shortcut as plain text. If you ever AirDrop or iCloud-share the shortcut, the token goes with it. Keep the shortcut local.
- **Errors aren't shown by default**: if the request fails, the *Show Notification* still says "captured". To see real errors, add a *Show Result* action after *Get Contents of URL* during testing — it'll display the GitHub API's error JSON.
- **Updating the token**: when the PAT expires (90 days if you followed the recommendation), edit the *Text* action at the top of the shortcut and paste the new token.

### Optional — phone trigger for triage / execute

Same pattern, separate Shortcut named `Lumivara — Trigger triage`:

- URL: `https://api.github.com/repos/palimkarakshay/lumivara-site/actions/workflows/triage.yml/dispatches`
- Method: `POST`
- Headers: same three as above.
- Body (JSON): `{ "ref": "main" }` — one field.

Duplicate for `execute.yml` and `execute-complex.yml` if you want push-button manual runs from your phone.

> **Note**: workflow-trigger Shortcuts need the PAT to also have `Actions: Read/Write`. See "Two-token alternative" in [Section 1](#1-create-a-fine-grained-pat) for the safer split.

---

## Security notes

- The PAT lives on the phone. If the phone is lost, **revoke the token** from GitHub settings — don't just change device passwords. Because the token only has `issues:write`, the blast radius is "can create/edit issues in this one repo."
- `CLAUDE_CODE_OAUTH_TOKEN` never touches the phone. It lives only in GitHub Actions Secrets.
- Treat issue creation as *trusted* input to the triage/execute bots. If someone gets your phone PAT, they can create issues that eventually become PRs. PRs still need your merge — so the worst case is noise, not unauthorized deploys. Still, rotate on loss.
