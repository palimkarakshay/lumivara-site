/**
 * Lumivara Forge — landing page copy.
 *
 * Brand locked 2026-04-28 to "Lumivara Forge" per
 * docs/mothership/15-terminology-and-brand.md §4 (the prior "Infotech"
 * working name is retired). Owned by Akshay Palimkar. Lives under the
 * Lumivara umbrella but is distinct from Lumivara People Advisory.
 *
 * DUAL-LANE NOTE (2026-04-29): this page (Akshay's operator pitch) currently
 * lives on Beas's marketing-site repo, which is a Dual-Lane Repo violation per
 * docs/mothership/02b-dual-lane-architecture.md §6 / dual-lane-enforcement-
 * checklist.md C-MUST-1: operator brand should not occupy a site repo URL
 * tree. Tracked for relocation to the operator's own site at
 * lumivara-forge.com (pending domain registration, 15 §5) — the file,
 * export name, and route slug all stay "lumivara-infotech" until that
 * relocation happens, to avoid breaking incoming links and SEO.
 */

export const lumivaraInfotechContent = {
  hero: {
    monoLabel: "Lumivara Forge",
    headline: "Automated website creation, built and shipped for you.",
    subhead:
      "We design, build, and run modern marketing sites — powered by AI workflows that turn weeks of dev work into days. Pick a tier, share your brief, get a production-ready site.",
    primaryCta: {
      label: "Start your build",
      href: "/contact?service=infotech",
    },
    secondaryCta: { label: "See pricing", href: "#pricing" },
  },

  proof: {
    monoLabel: "Why teams choose us",
    heading: "Founder-built. AI-assisted. Production-grade.",
    points: [
      {
        title: "Days, not months.",
        body: "Our automation pipeline turns a brief into a deployed site in days. You review previews; we ship to production.",
      },
      {
        title: "Real engineering under the hood.",
        body: "Next.js, Tailwind, and a typed component system. No drag-and-drop lock-in — you own the code on day one.",
      },
      {
        title: "Built to grow with you.",
        body: "Every site is structured for content scale: MDX articles, CMS hooks, and clean SEO foundations from launch.",
      },
    ],
  },

  pricing: {
    monoLabel: "Pricing",
    heading: "Three tiers. Transparent scope.",
    subhead:
      "Each tier is a fixed-scope engagement with a fixed price. Need something custom? Start with the closest tier and we'll scope from there.",
    tiers: [
      {
        name: "Launchpad",
        price: "CA$1,500",
        cadence: "one-time",
        summary: "A single-page site that gets you live this week.",
        features: [
          "1-page responsive marketing site",
          "Custom branding from your logo and palette",
          "Contact form with email forwarding",
          "Basic on-page SEO and OpenGraph setup",
          "Deployed to Vercel with a custom domain",
          "1 round of revisions",
        ],
        cta: { label: "Start with Launchpad", href: "/contact?service=infotech&tier=launchpad" },
        highlighted: false,
      },
      {
        name: "Growth",
        price: "CA$4,500",
        cadence: "one-time",
        summary: "A multi-page site with a blog and AI-assisted content workflows.",
        features: [
          "Up to 6 pages (home, services, about, contact, etc.)",
          "MDX-powered blog or insights section",
          "AI-assisted draft generation for initial content",
          "Newsletter signup integration (Resend / Mailchimp)",
          "Analytics, sitemap, robots.txt, and structured data",
          "Lighthouse score ≥ 95 across the board",
          "2 rounds of revisions",
        ],
        cta: { label: "Start with Growth", href: "/contact?service=infotech&tier=growth" },
        highlighted: true,
      },
      {
        name: "Bespoke",
        price: "From CA$9,500",
        cadence: "scoped per project",
        summary: "Custom builds with integrations, automation, and ongoing support.",
        features: [
          "Unlimited pages and custom layouts",
          "Headless CMS or commerce integration (Sanity, Stripe, Shopify, etc.)",
          "AI agent or chatbot integration",
          "Bespoke design system tuned to your brand",
          "GitHub Actions automation for content updates",
          "30 days of post-launch support included",
          "Optional ongoing retainer for iteration",
        ],
        cta: { label: "Discuss a Bespoke build", href: "/contact?service=infotech&tier=bespoke" },
        highlighted: false,
      },
    ],
  },

  process: {
    monoLabel: "How it works",
    heading: "From brief to live site in four steps.",
    steps: [
      {
        number: "01",
        title: "Discovery call.",
        body: "A 30-minute call to understand your business, audience, and goals. We confirm the right tier and lock the scope.",
      },
      {
        number: "02",
        title: "Brief & assets.",
        body: "You share copy, logo, and any existing brand assets. We can also draft initial copy with you using AI workflows.",
      },
      {
        number: "03",
        title: "Build & preview.",
        body: "We generate the site through our automation pipeline, push to a Vercel preview, and iterate on revisions in-thread.",
      },
      {
        number: "04",
        title: "Launch & handoff.",
        body: "We deploy to your domain, hand over the GitHub repo, and walk you through how to edit content yourself.",
      },
    ],
  },

  faqs: [
    {
      id: "ownership",
      question: "Do I own the code and content?",
      answer:
        "Yes. On launch, the GitHub repository transfers to you (or stays in your org from day one). You own the code, the content, and the deployment — there's no platform lock-in.",
    },
    {
      id: "tech-stack",
      question: "What's the tech stack?",
      answer:
        "Next.js 16 with the App Router, Tailwind CSS, and TypeScript — the same stack used to build Lumivara's own site. Hosting is on Vercel by default, but the code runs anywhere Next.js does.",
    },
    {
      id: "timeline",
      question: "How long does a build actually take?",
      answer:
        "Launchpad sites typically go live in 5–7 business days from kickoff. Growth tier runs 2–3 weeks. Bespoke builds are scoped per project — usually 4–8 weeks depending on integrations.",
    },
    {
      id: "ai-content",
      question: "What does \"AI-assisted\" actually mean?",
      answer:
        "We use Claude and similar models to accelerate drafts — initial copy, alt text, schema markup, and internal QA passes. A human (us) reviews and edits everything before you see it. Your brand voice, your facts, your final say.",
    },
    {
      id: "ongoing",
      question: "Can you maintain the site after launch?",
      answer:
        "Yes — Bespoke includes 30 days of post-launch support. Beyond that, we offer monthly retainers for content updates, new sections, and iteration. Launchpad and Growth clients can also book ad-hoc updates as needed.",
    },
    {
      id: "payment",
      question: "How does payment work?",
      answer:
        "We invoice 50% on kickoff and 50% on launch (Bespoke uses a milestone schedule). Payment by Interac e-Transfer, wire, or major card. All prices are in CAD and exclude applicable taxes.",
    },
  ],

  finalCta: {
    headline: "Ready to ship?",
    subhead:
      "Tell us about your project and we'll get back within one business day with a recommended tier and next steps.",
    cta: { label: "Start your build", href: "/contact?service=infotech" },
  },

  owner: {
    monoLabel: "Who's behind this",
    heading: "Built by Akshay Palimkar.",
    body:
      "Lumivara Forge is led by Akshay Palimkar — engineer, builder, and operator. Akshay designs the automation pipeline, runs the builds end-to-end, and is the single point of contact on every project.",
  },
} as const;
