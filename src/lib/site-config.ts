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
  calLink: process.env.NEXT_PUBLIC_CAL_LINK || "https://cal.com/lumivara/discovery",
  nav: [
    { label: "How We Work", href: "/how-we-work" },
    { label: "What We Do", href: "/what-we-do" },
    { label: "Fractional HR", href: "/fractional-hr" },
    { label: "About", href: "/about" },
    { label: "Insights", href: "/insights" },
  ] as const,
  credentials: ["MBA", "CHRL", "PROSCI", "B.Eng", "10+ Years"] as const,
  engagementModes: ["Project-Based", "Advisory Retainer", "Fractional HR"] as const,
} as const;

export type SiteConfig = typeof siteConfig;
