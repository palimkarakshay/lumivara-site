/**
 * Site-wide copy (tagline, description, default hero words).
 * For structural settings like nav, contact info, Cal.com link,
 * see `src/lib/site-config.ts`.
 */
export const siteCopy = {
  tagline: "Bring clarity to complex people challenges.",
  description:
    "We design customized talent, leadership, and people systems that address real business challenges — and deliver measurable results.",
  heroMonoLabel: "Lumivara People Advisory",
  heroHeadline: "Bring clarity to complex people challenges.",
  heroSubhead:
    "At Lumivara, we bring the light of clarity, structure, and direction to complex people challenges. We design customized talent, leadership, and people systems that address real business challenges — and build the capability needed to deliver results.",
  heroPrimaryCta: { label: "Book a Discovery Call", href: "/contact" },
  heroSecondaryCta: { label: "See how we work", href: "/how-we-work" },
  credentialsStrip: [
    "MBA",
    "CHRL",
    "PROSCI",
    "B.Eng",
    "10+ Years",
    "Based in Toronto",
  ],
  newsletterPitch: "Field notes on people strategy — monthly.",
  footerTagline:
    "Strategy, capability, and measurable impact — for organizations building stronger people systems.",
} as const;
