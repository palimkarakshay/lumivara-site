<!-- lane-key:v1 -->
# Lane key

Every wiki page is stamped with one of three badges in its title region so a reader knows whether the content applies to the **mothership** (operator-internal) or to a **client repo** (the per-client Next.js site that ships the autopilot's product, never its source).

| Badge | Lane | Meaning |
|:---:|---|---|
| 🛠 | **Operator** (Forge mothership) | Operator-only machinery: `auto/issue-*` workflows, n8n, Claude OAuth, multi-AI router, dashboard, secrets posture, engagement playbooks. Lives on the mothership repo or on the `operator/main` overlay branch of a client repo. **Never visible to a client.** |
| 🌐 | **Client** (Pattern C site repo) | Content the client themself sees in their per-client repo. Site copy, MDX articles, design tokens, contact-form trust boundary, "how do I request a change" instructions. Safe to copy verbatim into a client repo. |
| ⚪ | **Both** | General development hygiene that applies on either repo: TypeScript strict mode, lint, tests, branch naming, the issue → PR loop. |

> **🛠 Do not copy operator-lane pages to client repos.** When scaffolding a per-client repo (see `06-operator-rebuild-prompt-v3.md`), include only the 🌐 and ⚪ pages in the client's wiki. The 🛠 pages belong to the mothership.

For the architectural model that motivates this split — `operator/main` overlay branch vs. client `main`, and the Pattern C two-branch design — see `docs/mothership/02-architecture.md §1`.
