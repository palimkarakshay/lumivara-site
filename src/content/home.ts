/**
 * Home page copy. Hero + section headings + principle bodies + founder intro.
 * Service cards pull from services.ts. Insights cards pull from MDX frontmatter.
 *
 * CONTENT RULES:
 *   - hero, principles.items[].body, founder.bioParagraphs — treat as VERBATIM from lumivara.ca
 *   - fractionalCta, finalCta, pulse, servicesGrid labels, comingSoonProof — authored for the rebuild
 */

export const homeContent = {
  hero: {
    monoLabel: "Lumivara People Advisory",
    headline: "Bring clarity to complex people challenges.",
    subhead:
      "At Lumivara, we bring the light of clarity, structure, and direction to complex people challenges. We design customized talent, leadership, and people systems that address real business challenges — and build the capability needed to deliver results.",
    primaryCta: { label: "Book a Discovery Call", href: "/contact" },
    secondaryCta: { label: "See how we work", href: "/how-we-work" },
  },

  comingSoonProof: {
    label: "Trusted By",
    body: "Client engagements launching in 2026. Logos coming soon.",
  },

  principles: {
    monoLabel: "01 / Our Approach",
    heading: "A different kind of people strategy partner.",
    items: [
      {
        number: "01",
        title: "Built on strategy.",
        body: "Every engagement begins with stakeholder input, data analysis, and where relevant, market and competitive context — to find the root cause, not just symptoms.",
      },
      {
        number: "02",
        title: "Delivered through capability.",
        body: "Approaches are designed specifically for the organization — aligned to strategy, culture, and maturity — rather than applying standard or pre-defined models.",
      },
      {
        number: "03",
        title: "Measured by impact.",
        body: "Effectiveness is measured by linking people initiatives to business performance and outcomes — hiring quality, leadership capability, employee performance, engagement, or adoption.",
      },
    ],
    readMore: { label: "Read the full approach", href: "/how-we-work" },
  },

  servicesGrid: {
    monoLabel: "02 / What We Do",
    heading: "Six focused practices. One integrated approach.",
    seeAll: { label: "See all services", href: "/what-we-do" },
  },

  fractionalCta: {
    monoLabel: "Fractional HR",
    heading: "Need a strategic HR partner without a full-time hire?",
    body: "For growing organizations that need senior HR thinking on an ongoing basis — without the cost of a full-time CHRO. We embed as your strategic people partner, at whatever cadence fits.",
    modes: ["Monthly Retainer", "Project-Based"],
    cta: { label: "Explore Fractional HR", href: "/fractional-hr" },
  },

  founder: {
    monoLabel: "03 / Founder",
    subtitle: "Founder & Principal Consultant",
    name: "Beas Banerjee",
    bioParagraphs: [
      "Beas is a people strategy and organizational development expert with over 10 years of experience. She works with organizations to translate business priorities into structured, high-impact people strategies — strengthening leadership capability, improving talent decisions, and enabling scalable growth.",
      "Her approach blends data-driven thinking with a people-first perspective, shaped by an MBA in Human Resources, a CHRL designation, an engineering background, and certification in PROSCI Change Management.",
    ],
    credentials: ["MBA", "CHRL", "PROSCI", "B.Eng"],
    cta: { label: "Meet Beas", href: "/about" },
  },

  insights: {
    monoLabel: "04 / Latest Thinking",
    heading: "Perspectives on people strategy.",
    seeAll: { label: "See all insights", href: "/insights" },
  },

  pulse: {
    question: "What best describes your current priority?",
    options: [
      {
        label: "Hiring the right people, faster",
        href: "/what-we-do/talent-acquisition",
      },
      {
        label: "Building stronger managers and leaders",
        href: "/what-we-do/learning-leadership",
      },
      {
        label: "Figuring out where to even start",
        href: "/how-we-work",
      },
    ],
  },

  finalCta: {
    headline: "Let's find the real challenge.",
    subhead:
      "Every engagement starts with a 30-minute discovery conversation — complimentary and focused on you.",
    cta: { label: "Book a Discovery Call", href: "/contact" },
  },
} as const;
