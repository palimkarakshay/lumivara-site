# 05 — Template Hardening Notes (later work)

A running list of changes to make `docs/TEMPLATE_REBUILD_PROMPT.md` and the surrounding system **harder to repackage and resell** without your operator account. None of these are urgent on day one — but they all become important once you have paying clients on retainers.

The principle: the *site* is theirs to own. The *automation pipeline* is yours to license.

---

## Changes to make to the rebuild template

| # | Change | Why |
|---|---|---|
| 1 | Move the verbatim prompt body out of `docs/TEMPLATE_REBUILD_PROMPT.md` and into a private gist or password-protected location. Replace the doc with a "this template is licensed per engagement" stub. | Right now anyone with repo access can copy-paste the whole thing. |
| 2 | Add a license header to the prompt: *"Licensed for use in projects operated by [your business name]. Not for redistribution. Each operator-led deployment counts as one engagement."* | Makes the contractual position explicit. |
| 3 | Tier the prompt itself. Make the bottom 30% (the multi-AI fallback wiring, the budget charter, the auto-merge workflow) only available to clients on Tier 2 or above. The basic site scaffold can be common; the operator system is the moat. | The cheap tier shouldn't get the full system for the cheap price. |
| 4 | Strip the `bootstrap-kanban.sh` script from any client-handed-over repo. Run it from your operator machine once, then delete from the client tree. | Stops a client from running it themselves on a fork. |
| 5 | Gate the multi-AI fallback (`scripts/gemini-triage.py`) behind your operator account secrets. The client's repo never holds the Gemini key — the workflow uses an organisation-level secret you control. | If they leave, the fallback breaks; that's the value of your service. |

---

## Changes to make to the per-client repo

| # | Change | Why |
|---|---|---|
| 1 | Add a "vendor account" PAT separate from the client's own PAT. The auto-bot runs as the vendor account. The client's PAT is only for phone-edit issue creation. | Decouples your operator access from the client's owner access. |
| 2 | Put the `CLAUDE_CODE_OAUTH_TOKEN` secret under your GitHub *organisation* (`your-business-org`), then add the client's repo as a member. The token never lives in the client's account. | If they leave, they lose the bot — they keep the site, they don't keep the autopilot. |
| 3 | Watermark the system: a footer credit on the site reading *"Forged by Lumivara"* with a link to your services page. Removable on Tier 3 / Tier 4 only. | Gives every client site a passive marketing surface for you. |
| 4 | Document a "graceful exit" procedure that explicitly disables the autopilot and hands the client a "vanilla" repo. Include this in every contract. | When a client leaves, the wind-down is friendly and predictable, not a cliff. |

---

## Changes to make to the contract / proposal

| # | Change | Why |
|---|---|---|
| 1 | Define "the system" vs. "the site" explicitly. The client owns the site. The system (workflows, prompts, scripts, automation logic) is licensed per engagement and reverts on termination. | Without this distinction, a smart client could argue everything was "work for hire." |
| 2 | Non-redistribution clause: the client may not share the system, the prompts, or the workflow files with any third party including their own developers. | Most contractually savvy clients will accept this; it's standard for licensed software. |
| 3 | Include a "we'll happily rebuild your site on a fully owned, automation-free repo at any time" clause. | Pre-empts the "I feel locked in" concern at the contract stage. |

---

## What to do *now* (before any of the above)

1. **Don't commit the unlicensed prompt.** It's in `docs/TEMPLATE_REBUILD_PROMPT.md` already (a copy was uploaded to the conversation). For now keep it where it is — but mark this folder (`docs/storefront/`) and the template doc as *internal* in your README.
2. **Don't share the live repo URL with prospects.** Show the live *site* (`lumivara-forge.com`) and the public-facing slide deck only. The architecture under the hood is your competitive secret until you've decided how to license it.
3. **Track every potential client touchpoint** in a single CRM (HubSpot free tier, or a Notion table) so you have a record of who's seen what level of detail. Useful if a leakage ever traces back to one prospect.

---

## Long-term: should this become a SaaS?

Open question. The natural evolution of this offering is:

- **Stage 1 (now):** services + retainer. You're the operator. ~30 clients max before you need help.
- **Stage 2 (12–24 months):** managed-services agency. You hire 1–2 operators. Scale to ~80 clients. Margins compress slightly.
- **Stage 3 (24+ months):** productise the operator side. Self-serve onboarding, customer-managed billing, you become a SaaS founder. Margins recover; ceiling is uncapped.

Stage 3 is a different business with different risks (real engineering work, real on-call, real product-market-fit pressure). Don't pre-build for it. Stay in stage 1 until you've genuinely outgrown it.
