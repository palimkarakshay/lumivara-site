# Code of Conduct

> _Lane: ⚪ Both — applies to every contributor (human or AI agent) working in either lane of this repo._

## Our pledge

In the interest of fostering an open and welcoming environment, the maintainers of `palimkarakshay/lumivara-site` and any future Dual-Lane Repo spinout repos (`<slug>-site`, `<slug>-pipeline`, `<brand>-platform`) pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

## Our standards

Examples of behaviour that contributes to creating a positive environment:

- Using welcoming and inclusive language.
- Being respectful of differing viewpoints and experiences.
- Gracefully accepting constructive criticism — including from AI agents whose comments are explicitly marked as advisory in PR review.
- Focusing on what is best for the project and its users (operator, future co-operator, contractors, clients).
- Showing empathy towards other community members.

Examples of unacceptable behaviour:

- The use of sexualised language or imagery and unwelcome sexual attention or advances.
- Trolling, insulting/derogatory comments, and personal or political attacks.
- Public or private harassment.
- Publishing others' private information, such as a physical or electronic address, without explicit permission.
- Other conduct which could reasonably be considered inappropriate in a professional setting.
- Attempting to extract operator IP (autopilot prompts, runbooks, the storefront pack) by social-engineering routes outside Dual-Lane Repo's permission boundaries.

## Dual-Lane Repo-specific responsibilities

This project enforces a two-repo trust model (see [`docs/mothership/02b-dual-lane-architecture.md`](docs/mothership/02b-dual-lane-architecture.md)). Contributors and AI agents must respect the lane separation:

- Do not attempt to read, copy, or reference operator-only paths (`docs/mothership/`, `docs/storefront/`, `docs/decks/`, `docs/research/`, `dashboard/`, operator-only scripts) from a Site-lane PR.
- Do not paste verbatim copy from `docs/mothership/` or `docs/storefront/` into a client-shared chat, email, gist, or proposal — this is a stricter standard than copyright; it's the trade-secret protection per [`docs/mothership/21-ip-protection-strategy.md §2.3`](docs/mothership/21-ip-protection-strategy.md).
- The `> _Client example — see 15 §7._` callout pattern is the only place a real client's brand identifier may appear in operator-scope docs (per [`docs/mothership/15-terminology-and-brand.md §6`](docs/mothership/15-terminology-and-brand.md)). Comply with the policy in every PR.

## Our responsibilities

The repository maintainer (Akshay Palimkar, `@palimkarakshay`) is responsible for clarifying the standards of acceptable behaviour and is expected to take appropriate and fair corrective action in response to any instances of unacceptable behaviour.

The maintainer has the right and responsibility to remove, edit, or reject comments, commits, code, wiki edits, issues, and other contributions that are not aligned with this Code of Conduct, or to ban temporarily or permanently any contributor for behaviours that they deem inappropriate, threatening, offensive, or harmful.

For AI agents (Claude Code, Codex, Gemini): the maintainer's right to revert or reject extends to bot-authored PRs. The triage / execute / review pipeline is gated on operator approval; a flagged Code-of-Conduct violation in a bot-authored artefact terminates that PR and triggers a review of the prompt that produced it.

## Scope

This Code of Conduct applies both within project spaces and in public spaces when an individual is representing the project or its community. Examples include using an official project email address, posting via an official social-media account, or acting as an appointed representative at an online or offline event.

## Enforcement

Instances of abusive, harassing, or otherwise unacceptable behaviour may be reported by contacting the maintainer at **hello@lumivara.ca** (Client #1 contact during the pre-spinout period; the operator-brand contact at `hello@lumivara-forge.com` lands once the domain is registered per [`docs/mothership/15-terminology-and-brand.md §5`](docs/mothership/15-terminology-and-brand.md)).

All complaints will be reviewed and investigated and will result in a response that is deemed necessary and appropriate to the circumstances. The maintainer is obliged to maintain confidentiality with regard to the reporter of an incident.

For security-sensitive concerns, follow [`SECURITY.md`](.github/SECURITY.md) — do not file them as public Issues.

## Attribution

This Code of Conduct is adapted from the [Contributor Covenant](https://www.contributor-covenant.org/), version 2.1, available at <https://www.contributor-covenant.org/version/2/1/code_of_conduct.html>, with Dual-Lane Repo-specific additions for the two-repo trust model this project enforces.
