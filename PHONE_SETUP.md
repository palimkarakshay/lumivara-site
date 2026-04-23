# Phone → Feedback.md

Send feedback from Android (or anywhere) straight into this repo's `Feedback.md` Inbox by POSTing to GitHub's `repository_dispatch` endpoint. The **Append Feedback** workflow catches the event and commits the row.

## 1. Create a fine-grained PAT

Broad `repo`-scope tokens are overkill and dangerous on a phone. Create a token that can only do what the workflow needs:

1. GitHub → Settings → Developer settings → **Personal access tokens** → **Fine-grained tokens** → *Generate new token*.
2. **Resource owner**: `palimkarakshay` (your account).
3. **Repository access**: *Only select repositories* → `lumivara-site`.
4. **Permissions** → Repository permissions:
   - *Contents*: **Read and write** (required — the workflow commits Feedback.md)
   - *Metadata*: Read-only (GitHub forces this on)
   - Everything else: No access.
5. **Expiration**: 90 days. Set a calendar reminder to rotate.
6. Copy the token once; you will not see it again.

If a classic PAT is easier to manage, the minimum scope is `repo` — but note that classic PATs give access to **all** your repos, so only use one if you trust the device.

## 2. Install HTTP Shortcuts (Android)

[HTTP Shortcuts](https://play.google.com/store/apps/details?id=ch.rmy.android.http_shortcuts) is a small open-source app that makes authenticated HTTP requests and can be triggered from the home screen, share sheet, or Tasker.

After install:

1. **Variables** → *Add variable*:
   - `GITHUB_TOKEN` — type *Constant*, value = the PAT you just created. Mark *Protected* so it hides in exports.
   - `FEEDBACK_TEXT` — type *Text input*, label *"What's the feedback?"*, *Multi-line*.
   - `FEEDBACK_TAGS` — type *Text input*, label *"Tags (optional)"*, prefill `[P2][medium]`.

2. **Create Shortcut** → *HTTP Request*:
   - **Name**: `Feedback → Lumivara`
   - **Method**: `POST`
   - **URL**: `https://api.github.com/repos/palimkarakshay/lumivara-site/dispatches`
   - **Request Body** → *Custom text*, content type `application/json`:
     ```json
     {
       "event_type": "append_feedback",
       "client_payload": {
         "text": "{{FEEDBACK_TEXT}}",
         "tags": "{{FEEDBACK_TAGS}}",
         "source": "Phone"
       }
     }
     ```
   - **Request Headers**:
     - `Authorization`: `Bearer {{GITHUB_TOKEN}}`
     - `Accept`: `application/vnd.github+json`
     - `X-GitHub-Api-Version`: `2022-11-28`
   - **Response Handling**: *Display response on failure*. Success returns HTTP 204 with empty body.

3. **Trigger options**:
   - *Add to home screen* → one-tap launcher.
   - *Share target* → pops the variable prompts with selected text pre-filled as `FEEDBACK_TEXT`. Now "Share → Feedback → Lumivara" works from any app (Gmail, Chrome, Notes).

## 3. Smoke test

Tap the shortcut, type `test from phone`, leave tags blank, submit.

- Expected: HTTP 204.
- GitHub Actions tab → **Append Feedback** run starts within ~5s.
- Feedback.md picks up a new row in the Inbox table, committed by `feedback-bot`.

If the request comes back 401/403, the PAT scope is wrong. 404 means the repo slug in the URL is wrong. 422 usually means the JSON body is malformed (check escaping).

## 4. Running triage

Triage is manual — one button, any time:

1. GitHub → Actions → **Triage Feedback** → *Run workflow* → *Run*.
2. Rows tagged `[P1]/[P2]/[P3]` move to the matching Phase table. Rows marked `Done`/`Dropped` move to the Archive.
3. If nothing has changed, the workflow commits nothing.

You can also trigger it from the phone with a second HTTP Shortcuts entry:

- **URL**: `https://api.github.com/repos/palimkarakshay/lumivara-site/actions/workflows/triage_feedback.yml/dispatches`
- **Body**: `{"ref": "main"}`
- Same headers.

## Security notes

- The PAT lives on the phone. If the phone is lost, **revoke the token** from GitHub settings — don't just change device passwords.
- The workflow runs on GitHub's runners with the repo's own `GITHUB_TOKEN`, not your PAT. Your PAT is only used to *trigger* the workflow. So even if the workflow file is edited maliciously later, your PAT blast radius is limited to "able to dispatch events."
- The append step passes payload text via `env:` variables (not shell interpolation) so a crafted payload can't run commands on the runner.
