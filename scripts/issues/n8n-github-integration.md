## Goal
Wire n8n (self-hosted on Railway) to automatically create GitHub Issues from two sources:
1. Cal.com booking webhooks → issue labeled `type/business-lumivara priority/P2`
2. Crisp chat lead capture → issue labeled `type/business-lumivara priority/P2`

This keeps all incoming leads in the same GitHub Issues backlog as website work, with human-only labels so the bot doesn't try to "implement" them.

## This issue is human-only — it requires n8n access and webhook configuration
The workflow files and n8n JSON are defined here; actual webhook registration must be done by the operator.

## n8n workflow: Cal.com → GitHub Issue

Trigger: Webhook node (POST from Cal.com booking_created event)

Steps:
1. **Webhook** — URL: `https://your-n8n.railway.app/webhook/calcom-booking`
2. **Set** node — extract fields:
   - `attendee_name` = `{{ $json.payload.attendees[0].name }}`
   - `attendee_email` = `{{ $json.payload.attendees[0].email }}`
   - `event_type` = `{{ $json.payload.title }}`
   - `start_time` = `{{ $json.payload.startTime }}`
3. **HTTP Request** — POST to GitHub Issues API:
   ```
   URL: https://api.github.com/repos/palimkarakshay/lumivara-site/issues
   Headers:
     Authorization: Bearer {{ $env.GITHUB_PAT }}
     Accept: application/vnd.github+json
   Body:
   {
     "title": "Discovery call booked — {{ attendee_name }}",
     "body": "**Name**: {{ attendee_name }}\n**Email**: {{ attendee_email }}\n**Event**: {{ event_type }}\n**Time**: {{ start_time }}\n\n_Auto-captured from Cal.com booking._",
     "labels": ["type/business-lumivara", "priority/P2", "human-only", "status/needs-triage"]
   }
   ```

## n8n workflow: Crisp → GitHub Issue

Trigger: Webhook node (POST from Crisp `message:send` event, filtered to first message)

Steps:
1. **Webhook** — URL: `https://your-n8n.railway.app/webhook/crisp-lead`
2. **IF** node — only proceed if `{{ $json.data.type === 'text' && $json.event === 'message:send' && $json.data.origin === 'chat' }}`
3. **HTTP Request** — POST to GitHub Issues API:
   ```
   Body:
   {
     "title": "Chat lead — {{ $json.data.nickname }}",
     "body": "**Visitor**: {{ $json.data.nickname }}\n**Email**: {{ $json.data.email }}\n**Message**: {{ $json.data.content }}\n**Crisp session**: {{ $json.data.session_id }}\n\n_Auto-captured from Crisp chat._",
     "labels": ["type/business-lumivara", "priority/P2", "human-only", "status/needs-triage"]
   }
   ```

## n8n env vars to set in Railway
- `GITHUB_PAT` — fine-grained PAT with Issues:Write on lumivara-site

## Cal.com webhook setup
Cal.com → Settings → Developer → Webhooks → Add webhook:
- URL: `https://your-n8n.railway.app/webhook/calcom-booking`
- Events: `BOOKING_CREATED`
- Secret: (optional, verify in n8n Webhook node)

## Crisp webhook setup
Crisp → Settings → Integrations → Webhooks → Add webhook:
- URL: `https://your-n8n.railway.app/webhook/crisp-lead`
- Events: `message:send`

## Definition of done
- [ ] n8n workflows created and active on Railway
- [ ] Test Cal.com booking creates a GitHub Issue within 30 seconds
- [ ] Test Crisp message creates a GitHub Issue within 30 seconds
- [ ] Issues appear in project Inbox column
