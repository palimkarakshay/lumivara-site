<!-- OPERATOR-ONLY. Pivot plan + archive list — the prescriptive companion
     to docs/research/08-self-maintaining-website-negative-study.md. -->

# 09 — Pivot Plan and Archive List

> _Lane: 🛠 Pipeline — operator-scope prescriptive plan. Companion to
> [`08-self-maintaining-website-negative-study.md`](./08-self-maintaining-website-negative-study.md)
> (the diagnosis). This file is the **prescription**: which pivot, how to
> sequence it, and which specific files / folders / workflows to archive
> vs. keep on the way through. Read 08 first._
>
> _Audience: the operator, on a Monday morning, after deciding to pivot.
> Read once. Do not share. Do not paraphrase outside this repo._

---

## How to read this document

`08` settled the question *"is the offer as positioned a business?"*
negatively. This file picks up the next question: *"given that, what
exactly do we do this week, this month, and this quarter?"*

Structure:

1. **Why this exists** — the one-paragraph framing.
2. **Pivot evaluation matrix** — nine candidate pivots scored on
   effort, 12-month revenue band, ergonomics fit, defensibility, and
   compatibility with the existing portfolio site.
3. **The recommended pivot** — the chosen path, defended.
4. **90-day plan** — week-by-week execution.
5. **Archive list** — file-by-file, folder-by-folder. What to delete,
   freeze, or move to `_deprecated/`.
6. **Keep list** — what survives unmodified into the pivot.
7. **Risks of the pivot itself** — what would make this plan wrong.
8. **Un-archive criteria** — under what specific conditions does the
   archived work become live again.
9. **§7 / §8.4 enhancements back to `08`** — the additional alternatives
   and stress-tests this work surfaces, fed back into the diagnosis.
10. **Bibliography and methodology** — the three parallel agent passes
    that informed this plan.

Each pivot in §2 ends with a **fit score** (1–10 where 10 = best fit
for the operator and the moment).

---

## §1 — Why this document exists

The diagnosis in `08` lands a 7.5–9.5 / 10 liability score across six
sections. The salvage path in `08 §7` is real but narrow: *"sell
one-time custom Next.js builds at CAD $4,500–$6,000 + optional
$79–$149/mo improvement-run."* That is **one** salvage path among
several plausible ones, and the 90-day cost of choosing the wrong
salvage path is roughly equivalent to the 90-day cost of running the
original thesis another quarter. So before the operator commits to
the §7 path, this document evaluates **eight more** that the original
critique under-considered, picks the highest-fit pivot, sequences it
across 12 weeks, and itemises which of the ~23,000 lines of operator
docs and 31 GitHub Actions workflows survive the pivot — and which do
not.

Three independent agents informed the work below: a comparable-pivot
case-study pass (productized-service operators who pivoted off similar
over-engineered theses), a repo-inventory pass (file-by-file archive
classification), and a §7 / §8.4 stress-test pass (alternative salvage
paths and black-swan reversal levers). Their findings are integrated
section-by-section and listed in §10.

---

## §2 — Pivot evaluation matrix

Nine candidate pivot directions. Scored on five axes, then a single
**fit score** (1–10 where 10 = best fit for this specific operator at
this specific moment). Operator profile assumed in the scoring: one
senior engineer in Toronto, 10+ yr enterprise software background,
strong Next.js + AI integration + GitHub Actions + DevOps depth, async
preference, dislikes meetings, has a real portfolio site already
shipping, does not yet have arms-length paying clients, has a Claude
Max 20x quota and the platform built around it.

### Axis definitions

- **Effort-to-start** (E): how much work to first dollar. Lower is
  better. Reported as weeks.
- **12-month revenue band** (R): defensible 12-month CAD revenue range
  if executed competently.
- **Ergonomics** (G): how well the offer maps to async, low-meeting,
  low-customer-management work.
- **Defensibility** (D): how well the offer survives the same 2026
  commoditisation wave that killed the original thesis.
- **Portfolio-compat** (P): how well the offer leverages the existing
  `lumivara-forge.com` portfolio site as a calling card.

### The matrix

| # | Pivot | E (wks) | R (CAD/yr) | G | D | P | **Fit / 10** |
|---|---|---:|---|---:|---:|---:|---:|
| **A** | Stage-1 freelance build practice (the `08 §7` baseline — one-time CAD $4,500–$6,000 builds + optional improvement-run subscription) | 2–3 | $40–$90k | 7 | 6 | 9 | **7.0** |
| **B** | Senior full-stack + AI-integration **freelance via Toptal / A.Team / Arc / direct** at day-rate (sell hours, not products) | 1–2 | $120–$240k | 8 | 8 | 5 | **8.5** |
| **C** | **AI-integration / AI-Ops consulting** for digital agencies, mid-market companies, and Canadian government / regulated sectors that want to ship AI features themselves but lack the engineering depth | 3–4 | $90–$220k | 9 | 9 | 6 | **8.5** |
| **D** | **Niche-vertical productized service** (one vertical only — dental OR legal OR real-estate OR accounting) at $1,500–$3,000 setup + $99–$199/mo, narrowed scope, sharp ICP | 6–10 | $30–$80k | 6 | 6 | 7 | **6.0** |
| **E** | **Improvement-as-a-Service for existing sites** — pure remediation work (AODA / WCAG, Core Web Vitals, performance, security headers, contact-form/spam hardening). No new builds. Sold per-engagement at CAD $1,500–$5,000 each. | 2 | $50–$130k | 8 | 7 | 6 | **7.5** |
| **F** | **Developer-targeted Next.js + AI-pipeline boilerplate** (a paid template à la shipfa.st / Makerkit / supastarter) sold for one-time USD $199–$499 to other developers / agencies, plus optional support contracts | 4–6 | $20–$80k | 8 | 5 | 4 | **5.5** |
| **G** | **Micro-SaaS spin-offs** of pieces that already work (admin-portal-as-a-service, llm-monitor as a tiny SaaS, the Marp / claude-design deck pipeline as a service, the doc-task-seeder, etc.) at $9–$49/mo each | 6–12 | $0–$30k yr-1 | 7 | 5 | 3 | **4.5** |
| **H** | **Fractional principal / staff engineer** at 1–2 SMBs or one mid-market company on a 1–2 day/week retainer (CAD $1,200–$2,500/day) | 3–4 | $80–$180k | 9 | 8 | 5 | **8.0** |
| **I** | **Full pause** — take a senior platform / staff engineering role at a Canadian or remote-friendly US company; restart ambition in 12–24 months | 4–8 (job hunt) | $180–$320k base + equity | 10 | 10 | 4 | **9.0** |
| **J** | **HR-services-for-Canadian-SMB partnership** — partner with a complementary services practitioner (HR consulting, employee-handbooks, Canadian-employment-law, payroll-implementation) who has the same SMB persona; operator delivers the digital surface, partner delivers the HR product, jointly retain on a per-client basis | 6–10 | $30–$120k yr-1 | 6 | 7 | 8 | **6.5** |
| **K** | **Hybrid: I + A** — primary income from a senior engineering role; small Stage-1 build practice on the side, deliberately rate-limited to 1 build / quarter | 6–10 (job hunt + tooling) | $200–$370k combined | 9 | 9 | 7 | **9.5** |

### Reading of the matrix

The two-column standouts are **K** (hybrid: day-job + side practice)
at 9.5, and **I** (full pause) at 9.0. Both move the operator off the
single-point-of-failure model in `08 §5.3` and **buy time** to test
whether any of B / C / E / J develops genuine traction without putting
the rent at risk. **B** and **C** at 8.5 are the strongest "pure
pivot" plays if the operator is unwilling to take a day job.

The original `08 §7` recommendation (path A) scores 7.0 — *real,
defensible, but **not** the best available option* once B/C/E/H/I/K
are properly scored. The diagnostic doc was right to flag A as
salvageable; this doc is more honest in noting that A is *the
operator's most familiar* option, not the best-fit one.

The pivots that score worst (F at 5.5, G at 4.5) are the ones that
**re-use the most platform code** — and that is the warning: the
desire to keep the platform alive correlates inversely with the
quality of the pivot. The platform investment is mostly sunk cost;
choosing a pivot to justify it is the documentation hobby's last
gambit.

---

*Sections §3–§10 fill in over the next commits as agent passes return.*
