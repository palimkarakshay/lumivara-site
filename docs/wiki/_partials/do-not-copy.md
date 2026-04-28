<!-- do-not-copy:v1 -->
# Do-not-copy admonition (re-usable snippet)

Any wiki page badged **🛠 Operator** must include the admonition block below in its title region. GitHub-flavoured Markdown has no real `include` directive, so this is a copy-paste pattern: paste the block verbatim, and keep the `<!-- do-not-copy:v1 -->` marker so a future bulk-edit can `grep` every occurrence and update them in one pass.

---

## The block to paste

```markdown
> <!-- do-not-copy:v1 -->
> **🛠 Do not copy to client repos.** This page describes operator-side machinery that
> lives on the mothership repo or on the `operator/main` overlay branch of a client
> repo. A client cloning their `main` will never see this content. If you are the
> operator scaffolding a new client repo, **omit this page from the per-client wiki**.
```

## Why a marker comment?

The `<!-- do-not-copy:v1 -->` comment is invisible in rendered Markdown but greppable in source. It lets a future agent run, e.g.:

```
rg -n 'do-not-copy:v1' docs/wiki/
```

…to enumerate every operator-lane page and confirm the admonition is present. If we ever need to revise the wording, bump the version (`v2`) and bulk-replace.

## Where to paste it

Immediately after the page's H1 and the lane badge stamp, before any other prose. Example:

```markdown
# Bot Workflow 🛠

> <!-- do-not-copy:v1 -->
> **🛠 Do not copy to client repos.** …

The day-to-day operation of …
```

## When *not* to paste it

On 🌐 (Client) or ⚪ (Both) pages. Those pages are safe to ship to a client repo unchanged; pasting the block on them would confuse the reader.
