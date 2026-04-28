# Making Changes ⚪

> **Lane:** ⚪ Both. The issue → PR loop is identical on the mothership and on every per-client repo. See [[_partials/lane-key]] for the badge legend.
>
> **Sidebar — who lands edits where.** On a **🌐 client repo**, the autopilot is the *only* thing that lands edits on `main` (the client has no write access until handover). On the **🛠 mothership**, both the bot and the operator commit. Either way, the issue → PR loop below is the same.

The simplest way to request a site change is to create a GitHub Issue. No coding required.

## From your phone

If you have the HTTP Shortcuts app set up (see [PHONE_SETUP.md](https://github.com/palimkarakshay/lumivara-site/blob/main/PHONE_SETUP.md)):
1. Tap the shortcut
2. Type what you want changed
3. Submit

The shortcut creates a GitHub Issue automatically with `status/needs-triage`.

## From a browser

1. Go to [Issues → New issue](https://github.com/palimkarakshay/lumivara-site/issues/new/choose)
2. Pick **Site change request**
3. Fill in the template
4. Submit

## What happens next

The triage bot classifies your issue within 24 h, and the execute bot ships it within 8 h of classification. You'll get a notification when a PR is ready for your review.

See [[Bot-Workflow]] for the full pipeline.

## Types of changes the bot handles well

- **Copy edits** — update text on any page
- **New insight articles** — add MDX file to `src/content/insights/`
- **Design tweaks** — adjust colors, spacing, typography
- **New pages** — stub out a new route
- **Feature additions** — add a component, section, or widget

## Types of changes that need human attention

- **Dependency upgrades** — label `human-only`
- **Workflow / automation changes** — label `human-only`, needs `infra-allowed` label for the bot
- **Contact form API changes** — always human review
- **Page deletions** — human sign-off required
- **Security-sensitive changes** — email hello@lumivara.ca

## Writing a good issue

The bot reads your issue and uses it as a spec. Better issues = better results.

**Good:**
> Change the tagline on the home page hero from "People strategy that scales." to "People-first strategy that scales."

**Less good:**
> Update the home page

Include:
- What specifically to change
- Where on the site (page name or URL)
- The new value or content (not just "make it better")
- Reference material if relevant (screenshots, competitor links)
