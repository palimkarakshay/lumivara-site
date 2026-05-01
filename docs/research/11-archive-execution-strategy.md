<!-- OPERATOR-ONLY. Detailed archive execution strategy: mechanism,
     sequence, commands, and impact for each archive bucket from 09 §5. -->

# 11 — Archive Execution Strategy

> _Lane: 🛠 Pipeline — operator-scope tactical archive plan. Companion
> to [`09-pivot-plan-and-archive-list.md`](./09-pivot-plan-and-archive-list.md)
> (which catalogues **what** to archive) and
> [`10-pivot-execution-playbooks.md`](./10-pivot-execution-playbooks.md)
> (which sequences **what** to execute). This file is **how** to
> archive: mechanism, order of operations, exact commands, verification
> gates, rollback path, and impact analysis per bucket._
>
> _Audience: the operator on archive day. Read once before any rm or
> git mv runs. Do not paraphrase outside this repo._

---

## How to read this document

`09 §5` enumerates ~70,000 lines across eight archive buckets. This
file goes one level deeper: for each bucket, the **mechanism**
(git mv vs delete vs disable-then-archive), **order of operations**
(what must be disabled before what is moved), exact **commands**, a
**verification gate**, a **rollback path**, and a **4-row impact
summary** (lines removed / cron load removed / vendor cost saved /
risk introduced).

Structure:

1. **Pre-archive flight check** — six items every bucket assumes are
   complete before the first `git mv` runs.
2. **Common mechanism patterns** — three patterns that recur across
   buckets (move + README, disable-then-move, hard delete).
3. **Bucket-by-bucket plans** — one section per bucket A-DECKS,
   A-PLATFORM-OVER, A-DASHBOARD, A-OPS, A-RESEARCH-PRO, A-WORKFLOWS,
   A-N8N, A-MIGRATIONS, plus the contamination resolution
   (`src/app/lumivara-infotech/`) and the dual-lane infrastructure
   teardown.
4. **Cross-bucket impact summary** — single-glance table.
5. **Verification gate** — the exact 5-command audit that confirms
   the archive landed cleanly.
6. **Rollback paths** — how to recover each bucket if the operator
   changes their mind, by archive day.
7. **Common pitfalls** — six failure patterns operators trip on.
8. **Bibliography** — internal references.

Each bucket plan ends with a **Day-of action** — the first 30-minute
action the operator should take when they pick that bucket as the
first to archive.

---

*Scaffolding committed 2026-05-01. Bucket-by-bucket plans fill in over
the next commits.*
