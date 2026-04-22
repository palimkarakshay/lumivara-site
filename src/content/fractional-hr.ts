/**
 * Fractional HR page copy. Authored content — expands the "Fractional HR Advisory"
 * sub-service into a dedicated funnel page.
 */

export const fractionalHrContent = {
  hero: {
    monoLabel: "Fractional HR",
    headline: "A strategic HR partner, at the cadence you need.",
    subhead:
      "Growing organizations often reach a point where basic HR support isn't enough — but a full-time CHRO isn't the right fit yet. Fractional HR bridges that gap: senior-level people strategy, embedded, scaled to your stage.",
    primaryCta: {
      label: "Book a Fit Call",
      href: "/contact?service=hr-advisory",
    },
    secondaryCta: { label: "See how it works", href: "#how-it-works" },
  },

  fitCheck: {
    monoLabel: "Is this right for you",
    heading: "You might be a good fit if…",
    signals: [
      "You're scaling past 50 people with no senior HR leader.",
      "Your current HR support is transactional, not strategic.",
      "You're preparing for a funding round, M&A, or rapid growth.",
      "Your leadership team wants a people-strategy sounding board.",
      "You need policy, compliance, and talent systems built, not maintained.",
      "You want senior HR expertise without the cost of a full-time CHRO.",
    ],
  },

  howItWorks: {
    monoLabel: "How it works",
    heading: "From first call to embedded partner, in three steps.",
    steps: [
      {
        number: "01",
        title: "Fit conversation.",
        body: "A complimentary 30-minute call to understand where you are, where you're heading, and whether Fractional HR is the right shape for the work ahead.",
      },
      {
        number: "02",
        title: "Scoping & cadence proposal.",
        body: "We design a cadence — days per week or per month — and a written scope of what you'll get: programs, priorities, KPIs, and the leadership rhythm we'll plug into.",
      },
      {
        number: "03",
        title: "Embed & deliver.",
        body: "Weekly or biweekly presence, shared priorities with your leadership team, measurable outcomes. The engagement flexes as your business changes.",
      },
    ],
  },

  engagementTiers: {
    monoLabel: "Engagement Shapes",
    heading: "Three typical cadences.",
    tiers: [
      {
        name: "Advisor",
        cadence: "~1 day / month",
        body: "Strategic sounding board. Ideal for founders with basic HR ops in place who want senior thinking on specific decisions.",
        ideal: "Founder-led orgs, < 50 people",
      },
      {
        name: "Partner",
        cadence: "~1 day / week",
        body: "Embedded in key decisions. Designs systems alongside your team and shapes the direction of people programs.",
        ideal: "Scaling orgs, 50–200 people",
      },
      {
        name: "Embedded Leader",
        cadence: "2–3 days / week",
        body: "Acts as your interim People leader. Drives programs end-to-end, represents HR in exec forums, and builds the internal capability that will eventually replace the role.",
        ideal: "Growing orgs, 200–500 people",
      },
    ],
  },

  delivers: {
    monoLabel: "What we typically deliver",
    heading: "Concrete outputs, not just hours.",
    items: [
      {
        title: "People strategy roadmap",
        body: "A written, prioritized plan tying people investments to business outcomes.",
      },
      {
        title: "Compensation framework",
        body: "Simple, defensible pay bands and practices — ready for scrutiny and growth.",
      },
      {
        title: "Leadership development plan",
        body: "How your managers grow, who's next, and what gets built to support them.",
      },
      {
        title: "Policy foundation",
        body: "Employee handbook, hybrid/remote policy, compliance posture — built to scale.",
      },
      {
        title: "Hiring system design",
        body: "Structured interviews, scorecards, hiring manager enablement — consistent quality.",
      },
      {
        title: "Culture & engagement initiatives",
        body: "Survey design, action planning, and the experience moments that actually matter.",
      },
    ],
  },

  faqs: [
    {
      id: "pricing",
      question: "How is pricing structured?",
      answer:
        "Pricing is based on the agreed cadence and scope. All engagements are scoped collaboratively to ensure alignment on outcomes and level of support. Since we're a new boutique consulting firm, pricing is extremely competitive. No hourly billing surprises — everything is defined upfront.",
    },
    {
      id: "commitment",
      question: "What's the typical commitment length?",
      answer:
        "Most Fractional HR engagements run 6–12 months at a defined cadence, with a 3-month minimum so there's time for real work to land. Shorter project-based engagements are also possible when the need is bounded.",
    },
    {
      id: "scale",
      question: "Can we scale the cadence up or down?",
      answer:
        "Yes — that's a core reason organizations choose fractional. We revisit cadence quarterly, and it can move up (more presence during transformation) or down (lighter advisory as systems stabilize) based on what the business actually needs.",
    },
    {
      id: "confidentiality",
      question: "How is confidentiality handled?",
      answer:
        "All engagements are covered by a mutual NDA executed before discovery. We work with sensitive information regularly — compensation, org changes, individual performance — and treat it with the discretion you'd expect from a senior internal hire.",
    },
    {
      id: "coordination",
      question: "How do you coordinate with our existing team?",
      answer:
        "We meet weekly with whoever owns HR internally (if anyone), attend the leadership meetings where people decisions are made, and use your team's tools — we don't introduce new stacks unless they're solving a real problem. The goal is to strengthen the muscle you have, not replace it.",
    },
  ],

  finalCta: {
    headline: "Let's see if we're the right fit.",
    subhead:
      "A 30-minute fit call is the shortest path to knowing whether this shape of engagement will work for you. No pressure, no pitch deck.",
    cta: { label: "Book a Fit Call", href: "/contact?service=hr-advisory" },
  },
} as const;
