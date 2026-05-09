/**
 * How We Work page copy. Expanded principle bodies + engagement models + KPI mapping.
 *
 * CONTENT RULES:
 *   - hero.headline, principles[].title, principles[].bodyFirst — treat as VERBATIM from lumivara.ca
 *   - hero.subhead, principles[].bodySecond, engagementModels, kpiMatrix, finalCta — authored
 */

export const howWeWorkContent = {
  hero: {
    monoLabel: "Our Approach",
    headline:
      "Most organizations don't have a talent challenge. They have a clarity gap.",
    subhead:
      "Addressing real performance gaps requires more than applying standard frameworks. We identify root causes, understand the unique dynamics of the organization, and design targeted approaches specific to its needs.",
  },

  principles: [
    {
      number: "01",
      title: "Built on strategy.",
      bodyFirst:
        "Every engagement begins with stakeholder input, data analysis, and where relevant, market and competitive context — to find the root cause, not just symptoms.",
      bodySecond:
        "This means we start by understanding the business — its goals, pressures, growth stage, and decision-making culture — before proposing anything. No cookie-cutter diagnostics, no generic maturity assessments. Every discovery is tailored to what actually matters for you.",
    },
    {
      number: "02",
      title: "Delivered through capability.",
      bodyFirst:
        "Approaches are designed specifically for the organization — aligned to strategy, culture, and maturity — rather than applying standard or pre-defined models.",
      bodySecond:
        "Good strategy without capability is just a document. We design the supporting systems — competency frameworks, manager enablement, talent architecture, policy foundations — that make the strategy real and repeatable after we leave.",
    },
    {
      number: "03",
      title: "Measured by impact.",
      bodyFirst:
        "Effectiveness is measured by linking people initiatives to business performance and outcomes — hiring quality, leadership capability, employee performance, engagement, or adoption.",
      bodySecond:
        "We define what success looks like upfront, in measurable terms. That might be time-to-fill, internal mobility rate, leadership pipeline depth, engagement scores, or program adoption — whatever matters for the work at hand.",
    },
  ],

  engagementModels: [
    {
      title: "Project-Based",
      duration: "6–16 weeks",
      body: "Defined scope, defined timeline. Ideal for specific initiatives: a leadership program design, a hiring system overhaul, a competency framework build.",
    },
    {
      title: "Advisory Retainer",
      duration: "Monthly commitment",
      body: "Ongoing strategic partnership at a set cadence. Ideal for leaders who want a sounding board and consistent capacity.",
    },
    {
      title: "Fractional HR",
      duration: "1–3 days/week",
      body: "Embedded senior HR leadership without a full-time hire. Ideal for growing organizations without an in-house CHRO or People leader.",
    },
  ],

  modelsNote:
    "All engagements scoped collaboratively. Pricing aligned to outcomes, not timesheets.",

  kpiMatrix: [
    {
      service: "Talent Acquisition",
      kpis: ["Time-to-fill", "Quality-of-hire", "1-year retention", "Hiring manager NPS"],
    },
    {
      service: "Learning & Leadership",
      kpis: [
        "Program NPS",
        "Behavior change at 90 days",
        "Leadership bench strength",
        "Promotion readiness",
      ],
    },
    {
      service: "Talent Management",
      kpis: [
        "Internal mobility rate",
        "Succession coverage",
        "9-box movement",
        "Retention of top talent",
      ],
    },
    {
      service: "Employee Experience",
      kpis: ["Engagement score", "eNPS", "Retention by cohort", "Exit theme reduction"],
    },
    {
      service: "Technology & AI",
      kpis: ["Adoption rate", "Time-to-value", "User satisfaction", "Decision velocity"],
    },
    {
      service: "HR Advisory",
      kpis: [
        "Challenge-to-approach clarity",
        "Stakeholder alignment",
        "Execution velocity",
      ],
    },
  ],

  finalCta: {
    headline: "Ready to find the real challenge?",
    subhead:
      "Every engagement starts with a 30-minute discovery conversation — complimentary and focused on you.",
    cta: { label: "Book a Discovery Call", href: "/contact" },
  },
} as const;
