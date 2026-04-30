<!-- OPERATOR-ONLY. Research seed for the future PIPEDA compliance checklist (`docs/mothership/08-future-work.md §1`). -->

# 07 — PIPEDA Breach-Notification Windows (and Provincial Overlays)

> **Status.** Seed research, **not legal advice**. Every load-bearing claim below cites a live primary source (OPC, federal statute, provincial statute, or provincial commissioner). Facts that could not be sourced are omitted, not paraphrased.
>
> **Why this exists.** Filed per [`docs/migrations/01-poc-perfection-plan.md §3`](../migrations/01-poc-perfection-plan.md) as the **D-6** seed for the `deep-research.yml` cron path on Phase 1's green-streak counter (#195). Also de-risks the future PIPEDA checklist called for in [`docs/mothership/08-future-work.md §1`](../mothership/08-future-work.md). When the operator builds that checklist, this page is the source pack.
>
> **Last assembled.** 2026-04-30.

---

## 1. PIPEDA — federal baseline

### 1.1 The trigger: "real risk of significant harm" (RROSH)

PIPEDA s.10.1(1) requires an organisation to report a "breach of security safeguards involving personal information under its control" to the Privacy Commissioner of Canada **if it is reasonable in the circumstances to believe that the breach creates a real risk of significant harm to an individual** ([PIPEDA s.10.1](https://laws-lois.justice.gc.ca/eng/acts/P-8.6/section-10.1.html)).

s.10.1(7) defines **"significant harm"** to include: bodily harm, humiliation, damage to reputation or relationships, loss of employment, business or professional opportunities, financial loss, identity theft, negative effects on the credit record, and damage to or loss of property ([PIPEDA s.10.1(7)](https://laws-lois.justice.gc.ca/eng/acts/P-8.6/section-10.1.html)).

s.10.1(8) lists the **factors** for assessing "real risk": sensitivity of the personal information, probability that it has been or will be misused, and any other prescribed factor ([PIPEDA s.10.1(8)](https://laws-lois.justice.gc.ca/eng/acts/P-8.6/section-10.1.html)). The OPC's guidance restates this two-part test (sensitivity × probability of misuse) as the operative question ([OPC — *What you need to know about mandatory reporting of breaches of security safeguards*](https://www.priv.gc.ca/en/privacy-topics/business-privacy/safeguards-and-breaches/privacy-breaches/respond-to-a-privacy-breach-at-your-business/gd_pb_201810/)).

### 1.2 The notification window: "as soon as feasible"

PIPEDA s.10.1(2)–(3) requires the report to the Commissioner and the notification to affected individuals **"as soon as feasible after the organisation determines that the breach has occurred"** ([PIPEDA s.10.1](https://laws-lois.justice.gc.ca/eng/acts/P-8.6/section-10.1.html)). PIPEDA does **not** prescribe a fixed clock (e.g., 72 hours like the GDPR); the OPC's published guidance is that the determination triggers the obligation and any delay must be defensible ([OPC guidance, *Timing*](https://www.priv.gc.ca/en/privacy-topics/business-privacy/safeguards-and-breaches/privacy-breaches/respond-to-a-privacy-breach-at-your-business/gd_pb_201810/)).

The **form** of the report and notification is fixed by the *Breach of Security Safeguards Regulations*, SOR/2018-64 (in force 2018-11-01): the report to the OPC must be in writing and contain the items listed in s.2 of the Regulations (circumstances, day or period of the breach, nature of personal information, number of affected individuals, steps taken, contact for the OPC) ([Breach of Security Safeguards Regulations, s.2](https://laws-lois.justice.gc.ca/eng/regulations/SOR-2018-64/page-1.html)).

Notification to affected individuals must be **direct** unless one of the conditions for indirect notification in s.3 of the Regulations applies (direct would cause further harm, would cause undue hardship, or contact information is unknown) ([Regulations, s.3](https://laws-lois.justice.gc.ca/eng/regulations/SOR-2018-64/page-1.html)).

### 1.3 Record-keeping: 24 months, even sub-threshold

PIPEDA s.10.3 requires organisations to **keep and maintain a record of every breach of security safeguards involving personal information under their control** — not just the reportable ones ([PIPEDA s.10.3](https://laws-lois.justice.gc.ca/eng/acts/P-8.6/section-10.3.html)). The Regulations fix the retention period: **the record must be retained for 24 months after the day on which the organisation determined that the breach occurred** ([Breach of Security Safeguards Regulations, s.6(1)](https://laws-lois.justice.gc.ca/eng/regulations/SOR-2018-64/page-1.html)). The Commissioner may request access to those records at any time (PIPEDA s.10.3(2)).

### 1.4 Statutory anchor: Bill S-4 (Digital Privacy Act)

The breach-notification regime in ss.10.1–10.3 was added to PIPEDA by the *Digital Privacy Act* (Bill S-4), which received royal assent on **2015-06-18** but only came into force for breach reporting on **2018-11-01**, the same day SOR/2018-64 took effect ([*Digital Privacy Act*, S.C. 2015, c.32](https://laws-lois.justice.gc.ca/eng/AnnualStatutes/2015_32/)).

---

## 2. Ontario — PHIPA overlay (HR-relevant)

The *Personal Health Information Protection Act, 2004* (PHIPA) governs personal **health** information held by health-information custodians in Ontario; it is the relevant overlay any time a Lumivara client engages with employee health information (benefits, accommodation files, return-to-work) on behalf of an Ontario employer.

### 2.1 Notify the individual at the first reasonable opportunity

PHIPA s.12(2) requires a custodian to **notify the individual at the first reasonable opportunity** if personal health information is "stolen or lost or if it is used or disclosed without authority" ([PHIPA s.12(2)](https://www.ontario.ca/laws/statute/04p03#BK16)).

### 2.2 Notify the IPC when the statutory triggers fire

PHIPA s.12(3) (added by S.O. 2016, c.6, in force 2017-10-01) requires the custodian to **notify the Information and Privacy Commissioner of Ontario** when the breach falls within prescribed circumstances. Those circumstances are set out in O.Reg. 329/04, s.6.3, and include: use or disclosure without authority, stolen information, further unauthorised use after a first incident, a pattern of similar breaches, disciplinary action against an agent, and significant breaches by volume or sensitivity ([O.Reg. 329/04, s.6.3](https://www.ontario.ca/laws/regulation/040329#BK10)). The IPC publishes a reporting form and threshold guide ([IPC Ontario — *Reporting a Privacy Breach to the IPC*](https://www.ipc.on.ca/health/reporting-a-privacy-breach-to-the-ipc/)).

### 2.3 Annual statistical report

Custodians must also **provide the IPC with an annual report** of the number of breaches in the prior calendar year (PHIPA s.12.3, in force 2018-01-01; first reports were due 2019-03-01) ([IPC Ontario — *Annual Statistical Report*](https://www.ipc.on.ca/health/health-privacy-breach-statistics/)).

---

## 3. Quebec — Law 25 overlay (any French-language intake)

*An Act to modernize legislative provisions as regards the protection of personal information* (S.Q. 2021, c.25, formerly Bill 64; commonly "Law 25") amended Quebec's private-sector privacy statute (the *Act respecting the protection of personal information in the private sector*, "ARPPIPS") in three waves: **2022-09-22, 2023-09-22, and 2024-09-22** ([Loi 25 — *Légis Québec*, ARPPIPS in force version](https://www.legisquebec.gouv.qc.ca/en/document/cs/p-39.1)).

### 3.1 The trigger: "confidentiality incident" with risk of "serious injury"

ARPPIPS s.3.5 (in force 2022-09-22) requires an enterprise that has cause to believe a **confidentiality incident** has occurred to take reasonable measures to reduce the risk and prevent recurrence, and — **where the incident presents a risk of serious injury** — to notify both the *Commission d'accès à l'information* (CAI) and each affected person promptly ([ARPPIPS s.3.5–3.7](https://www.legisquebec.gouv.qc.ca/en/document/cs/p-39.1#se:3_5)).

A "confidentiality incident" is defined in ARPPIPS s.3.6 as: access not authorised by law, use not authorised by law, communication not authorised by law, or loss of personal information or any other breach of the protection of such information ([ARPPIPS s.3.6](https://www.legisquebec.gouv.qc.ca/en/document/cs/p-39.1#se:3_6)).

### 3.2 The "serious injury" factors

ARPPIPS s.3.7 lists the factors for assessing "risk of serious injury": **sensitivity** of the information, anticipated **consequences** of its use, and the **likelihood** that it will be used for an injurious purpose ([ARPPIPS s.3.7](https://www.legisquebec.gouv.qc.ca/en/document/cs/p-39.1#se:3_7)). The CAI's published guide reads this as a parallel test to PIPEDA's RROSH but explicitly requires the additional "consequences" leg ([CAI — *Incidents de confidentialité*](https://www.cai.gouv.qc.ca/entreprises/obligations-loi-modernisant-dispositions-legislatives-protection-renseignements-personnels/)).

### 3.3 Register of incidents (Quebec's analogue to PIPEDA s.10.3)

ARPPIPS s.3.8 requires every enterprise to **keep a register of confidentiality incidents** in the form prescribed by regulation. The Regulation respecting confidentiality incidents (in force 2022-12-29) sets out the record contents and a **minimum five-year retention** measured from the date the enterprise became aware of the incident — i.e., the Quebec retention floor is **substantially longer than PIPEDA's 24 months** ([Regulation respecting confidentiality incidents, ss.1–3](https://www.legisquebec.gouv.qc.ca/en/document/rc/P-39.1,%20r.%202.1)).

### 3.4 French-language notification

Per the *Charter of the French Language* (s.51) and the s.55-and-following provisions amended by Law 96 (S.Q. 2022, c.14), notifications to affected individuals in Quebec must be available in **French**; English-only notification is non-compliant for any enterprise carrying on business in Quebec ([*Charter of the French Language*, s.51](https://www.legisquebec.gouv.qc.ca/en/document/cs/c-11)).

---

## 4. One-page operator cheat-sheet

| Regime         | Trigger                                                                                                                                | Notify whom                                                       | Window                                                          | Record-keeping                              |
|----------------|----------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------|-----------------------------------------------------------------|---------------------------------------------|
| **PIPEDA**     | Real risk of significant harm (sensitivity × probability of misuse) — s.10.1                                                           | OPC + affected individuals + any third party that can reduce risk | "As soon as feasible" after determining the breach (no fixed h) | 24 months (s.10.3 + Reg. s.6) — **all** breaches, reportable or not |
| **PHIPA (ON)** | PHI stolen / lost / used or disclosed without authority — s.12(2); IPC notification when O.Reg. 329/04 s.6.3 conditions trigger        | Affected individual + IPC Ontario when triggered                  | "First reasonable opportunity"; annual statistical report due 2026-03-01 cycle | Per-breach record + annual stats report     |
| **Law 25 (QC)**| Confidentiality incident with risk of serious injury (sensitivity × consequences × likelihood) — ARPPIPS s.3.5–3.7                     | CAI + each affected person; communication in French               | "Promptly"                                                      | Register of all incidents, **min. 5 years** |

> **Operator note (not in the regulation).** Because the federal and Quebec retention windows differ (24 months vs. 5 years), a single client-side breach register that holds **all** entries for **5 years** satisfies both. The PHIPA per-breach record can be the same row, tagged.

---

## 5. What this seed does NOT do (out of scope)

- **No PIPEDA compliance checklist for client footers.** That is the next step in [`docs/mothership/08-future-work.md §1`](../mothership/08-future-work.md) item 2.
- **No `/subprocessors` page draft.** Same backlog item, separate issue.
- **No advice on whether a given Lumivara client incident triggers any of the above.** That is a legal call; this page is a research seed.

---

## 6. Verification posture

Per the research-pack discipline in [`docs/research/00-INDEX.md`](./00-INDEX.md), every claim above is anchored against a primary source URL. Citations were assembled from:

- **OPC** — [priv.gc.ca breach guidance](https://www.priv.gc.ca/en/privacy-topics/business-privacy/safeguards-and-breaches/privacy-breaches/respond-to-a-privacy-breach-at-your-business/gd_pb_201810/)
- **PIPEDA** — [laws-lois.justice.gc.ca](https://laws-lois.justice.gc.ca/eng/acts/P-8.6/) (ss.10.1, 10.3)
- **Breach of Security Safeguards Regulations, SOR/2018-64** — [laws-lois.justice.gc.ca](https://laws-lois.justice.gc.ca/eng/regulations/SOR-2018-64/)
- **Digital Privacy Act, S.C. 2015, c.32** — [laws-lois.justice.gc.ca](https://laws-lois.justice.gc.ca/eng/AnnualStatutes/2015_32/)
- **PHIPA (Ontario)** — [ontario.ca/laws/statute/04p03](https://www.ontario.ca/laws/statute/04p03)
- **PHIPA Regulation 329/04** — [ontario.ca/laws/regulation/040329](https://www.ontario.ca/laws/regulation/040329)
- **IPC Ontario** — [ipc.on.ca/health](https://www.ipc.on.ca/health/)
- **Law 25 / ARPPIPS** — [legisquebec.gouv.qc.ca cs/p-39.1](https://www.legisquebec.gouv.qc.ca/en/document/cs/p-39.1)
- **Regulation respecting confidentiality incidents** — [legisquebec rc/P-39.1, r.2.1](https://www.legisquebec.gouv.qc.ca/en/document/rc/P-39.1,%20r.%202.1)
- **CAI** — [cai.gouv.qc.ca](https://www.cai.gouv.qc.ca/entreprises/obligations-loi-modernisant-dispositions-legislatives-protection-renseignements-personnels/)
- **Charter of the French Language** — [legisquebec.gouv.qc.ca cs/c-11](https://www.legisquebec.gouv.qc.ca/en/document/cs/c-11)

When the future PIPEDA-checklist work begins, this page should be re-verified for currency: statutes change, the OPC reissues guidance, and Law 25's three-wave roll-out completed only on 2024-09-22 (the data-portability provisions were the last to come into force).

*Last verified: 2026-04-30.*
