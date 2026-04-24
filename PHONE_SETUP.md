# Phone → GitHub Issue

Capture a backlog item from Android (or anywhere) by POSTing to the GitHub Issues API. The **Triage backlog** Action picks it up on its next run and classifies it; the **Execute backlog item** Action picks up the top-ranked result a few hours later and opens a PR.

For the full lifecycle map, see [docs/BACKLOG.md](docs/BACKLOG.md).

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

## Security notes

- The PAT lives on the phone. If the phone is lost, **revoke the token** from GitHub settings — don't just change device passwords. Because the token only has `issues:write`, the blast radius is "can create/edit issues in this one repo."
- `CLAUDE_CODE_OAUTH_TOKEN` never touches the phone. It lives only in GitHub Actions Secrets.
- Treat issue creation as *trusted* input to the triage/execute bots. If someone gets your phone PAT, they can create issues that eventually become PRs. PRs still need your merge — so the worst case is noise, not unauthorized deploys. Still, rotate on loss.
