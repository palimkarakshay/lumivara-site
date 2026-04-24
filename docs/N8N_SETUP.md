# n8n Setup — Railway Free Tier

n8n is an open-source automation platform (like Zapier, but self-hosted and free). Use it to connect Cal.com, Crisp, Formbricks, Beehiiv, and GitHub Issues without third-party subscription costs.

## Step 1 — Sign up for Railway

1. Go to **railway.app** → Sign in with GitHub.
2. Railway's free "Hobby" plan gives $5 credit/month. n8n at low traffic uses ~$1–2/month. Effectively free.

## Step 2 — Deploy n8n on Railway

1. In Railway dashboard → **New Project** → **Deploy from Template**.
2. Search for **n8n** → select the official n8n template.
3. Click **Deploy**. Railway provisions a PostgreSQL database and an n8n instance automatically.
4. Wait ~2 minutes. Click the generated domain (e.g. `n8n-production-xxxx.railway.app`).

If the template isn't available, deploy manually:
1. New Project → **Empty Project** → Add Service → **Docker Image**.
2. Image: `n8nio/n8n:latest`
3. Add environment variables:
   ```
   N8N_BASIC_AUTH_ACTIVE=true
   N8N_BASIC_AUTH_USER=admin
   N8N_BASIC_AUTH_PASSWORD=yourpassword
   N8N_HOST=n8n-production-xxxx.railway.app
   N8N_PORT=5678
   N8N_PROTOCOL=https
   WEBHOOK_URL=https://n8n-production-xxxx.railway.app/
   DB_TYPE=postgresdb
   DB_POSTGRESDB_HOST=(Railway provides this from the Postgres plugin)
   DB_POSTGRESDB_DATABASE=railway
   DB_POSTGRESDB_USER=postgres
   DB_POSTGRESDB_PASSWORD=(Railway provides this)
   ```
4. Add a **PostgreSQL** service from the Railway plugin marketplace.
5. Deploy.

## Step 3 — First login

1. Visit your Railway domain (e.g. `https://n8n-production-xxxx.railway.app`).
2. Complete the n8n setup wizard: set your email + password for the n8n account (separate from Railway).
3. You're in the n8n editor.

## Step 4 — Set up credentials

In n8n, go to **Credentials** (left sidebar) → **Add Credential** for each:

### GitHub credential
- Type: **GitHub API**
- Access Token: your fine-grained PAT (Issues:Write + Actions:Read on lumivara-site)

### Cal.com credential
- Type: **HTTP Header Auth**
- Name: `Cal.com Webhook Secret`
- Value: the webhook secret you'll set in Cal.com (can be any strong string)

### Crisp credential
- Type: **HTTP Header Auth** (or Basic Auth with Crisp's API key + identifier)

## Step 5 — Create the Cal.com → GitHub Issue workflow

1. **New Workflow** → drag in a **Webhook** node.
2. Set Method: POST. Copy the webhook URL (e.g. `https://.../webhook/calcom-booking`).
3. Add a **Set** node — extract:
   - `attendeeName` = `{{ $json.body.payload.attendees[0].name }}`
   - `attendeeEmail` = `{{ $json.body.payload.attendees[0].email }}`
   - `eventTitle` = `{{ $json.body.payload.title }}`
   - `startTime` = `{{ $json.body.payload.startTime }}`
4. Add an **HTTP Request** node:
   - Method: POST
   - URL: `https://api.github.com/repos/palimkarakshay/lumivara-site/issues`
   - Authentication: your GitHub credential
   - Body (JSON):
     ```json
     {
       "title": "Discovery call booked — {{$node.Set.json.attendeeName}}",
       "body": "**Name**: {{$node.Set.json.attendeeName}}\n**Email**: {{$node.Set.json.attendeeEmail}}\n**Event**: {{$node.Set.json.eventTitle}}\n**Time**: {{$node.Set.json.startTime}}\n\n_Auto-captured from Cal.com._",
       "labels": ["type/business-lumivara", "priority/P2", "human-only", "status/needs-triage"]
     }
     ```
5. **Activate** the workflow.

## Step 6 — Register the webhook in Cal.com

1. Cal.com → **Settings** → **Developer** → **Webhooks** → **New Webhook**.
2. Payload URL: your n8n webhook URL from Step 5.
3. Events: check **Booking Created**.
4. Secret: the string you set in the n8n credential.
5. Save. Test by creating a test booking in Cal.com.

## Step 7 — Create the Crisp → GitHub Issue workflow

1. New Workflow → **Webhook** node (new URL, e.g. `/webhook/crisp-lead`).
2. Add **IF** node: `{{ $json.body.event === 'message:send' && $json.body.data.origin === 'chat' }}`
3. True branch → **HTTP Request** to GitHub Issues API (same pattern as Step 5).
4. Register in Crisp: Settings → Integrations → Webhooks → new webhook → paste URL → select `message:send`.

## Step 8 — Formbricks NPS alert workflow

1. New Workflow → **Webhook** node (`/webhook/formbricks-nps`).
2. **IF** node: `{{ $json.body.data.nps < 7 }}`
3. True branch → GitHub Issue with `priority/P1` label.
4. Register in Formbricks: Settings → Webhooks → add the URL → select "Response Created".

## Ongoing

- n8n auto-restarts on Railway if it crashes.
- View execution logs: n8n → **Executions** tab.
- Railway free tier sleeps idle services after 30 days of no deploys. Redeploy from Railway dashboard if n8n becomes unreachable.
- Back up workflows: n8n → Settings → **Export** → download JSON. Store in this repo at `docs/n8n-workflows/` (already gitignored from node_modules — safe to commit).
