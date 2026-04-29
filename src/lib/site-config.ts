export const siteConfig = {
  name: "Lumivara People Advisory",
  shortName: "Lumivara",
  tagline: "Bring clarity to complex people problems.",
  description:
    "We design customized talent, leadership, and people systems that solve real business problems — and deliver measurable results.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: "hello@lumivara.ca",
  phone: "(647) 572-0249",
  location: "Toronto, Canada",
  linkedin: "https://www.linkedin.com/company/lumivara-people-advisory/",
  founderLinkedin: "https://www.linkedin.com/in/beasbanerjee/",
  calLink: process.env.NEXT_PUBLIC_CAL_LINK || "https://cal.com/akshaypalimkar",
  nav: [
    { label: "Our Approach", href: "/how-we-work" },
    { label: "Services", href: "/what-we-do" },
    { label: "Fractional HR", href: "/fractional-hr" },
    { label: "About", href: "/about" },
    { label: "Insights", href: "/insights" },
  ] as const,
  credentials: ["MBA", "CHRL", "PROSCI", "B.Eng", "10+ Years"] as const,
  engagementModes: ["Project-Based", "Advisory Retainer", "Fractional HR"] as const,
  newsletterCta: {
    headline: "Field notes on people strategy",
    subhead: "Practical HR insights for leaders — monthly. No filler.",
    button: "Subscribe",
    success: "You're in — look out for the next issue.",
  } as const,
  builder: {
    // Brand locked 2026-04-28: "Lumivara Forge" per docs/mothership/15-terminology-and-brand.md §4.
    // URL: lumivara-forge.com is pending domain registration (15 §5); until it
    // resolves, this points at lumivara.ca (the Client #1 domain, where the
    // footer is rendered) so the link is not broken in production. Swap to
    // https://lumivara-forge.com — or to the interim Vercel demo URL the
    // operator stands up under palimkarakshays-projects — in the same PR
    // that registers the domain.
    name: "Lumivara Forge",
    url: "https://lumivara.ca",
    cta: "Want a site like this? Get started.",
  } as const,
} as const;

export type SiteConfig = typeof siteConfig;
