/**
 * About page copy.
 *   - Hero subhead, "Our Expertise", "Our Approach", founder bio paragraphs: VERBATIM from lumivara.ca
 *   - Philosophy triad: VERBATIM
 *   - AI POV: authored — lightly expands the "technology and AI" sentence from the live bio
 */

export const aboutContent = {
  hero: {
    monoLabel: "About Lumivara",
    headline:
      "Whatever you're building, we're here to help you take the first step with confidence.",
    subhead:
      "Lumivara is a people strategy and capability consulting firm focused on helping organizations solve complex business challenges through better talent, leadership, and workforce systems.",
  },

  philosophy: {
    monoLabel: "The Philosophy",
    heading: "Built on strategy. Delivered through capability. Measured by impact.",
    caption: "Designed for organizations that want more than standard solutions.",
    items: [
      {
        number: "01",
        title: "Built on strategy.",
        body: "Rooted in business context — not off-the-shelf frameworks. Every engagement starts by understanding the business before proposing anything.",
      },
      {
        number: "02",
        title: "Delivered through capability.",
        body: "Solutions are designed specifically for your organization's stage, culture, and maturity — then built so they continue to work after we leave.",
      },
      {
        number: "03",
        title: "Measured by impact.",
        body: "Outcomes are defined upfront in terms leadership cares about — hiring quality, leadership bench, engagement, adoption, business performance.",
      },
    ],
  },

  expertise: {
    monoLabel: "Our Expertise",
    heading: "From fragmented initiatives to integrated people systems.",
    body: "We partner with organizations to move beyond fragmented HR initiatives and build integrated, scalable people strategies that drive performance, strengthen leadership capability, and enable sustainable growth.",
  },

  approach: {
    monoLabel: "Our Approach",
    heading: "Clarity first. Then design.",
    paragraphs: [
      "We believe most organizations don't have a talent problem — they have a clarity, capability, or execution gap. Addressing these gaps requires more than applying standard frameworks. Lumivara focuses on identifying root causes, understanding the unique dynamics of the organization, and designing targeted solutions that are specific to its needs.",
      "Every engagement is grounded in the belief that no two organizations are the same. Lumivara designs solutions that are fully tailored to each client's context, challenges, and priorities — ensuring that what is built is not only well-designed, but relevant, practical, and effective in real-world application.",
    ],
  },

  founder: {
    monoLabel: "Founder",
    name: "Beas Banerjee",
    title: "Founder & Principal Consultant",
    bio: [
      "Beas is a people strategy and organizational development expert with over 10 years of experience. She works with organizations to translate business priorities into structured, high-impact people strategies — strengthening leadership capability, improving talent decisions, and enabling scalable growth.",
      "Her approach blends data-driven thinking with a people-first perspective, shaped by an MBA in Human Resources, a CHRL designation, an engineering background, and certification in PROSCI Change Management.",
      "Beas is known for her strategic thinking, high-drive, and ability to influence and mobilize change. She thrives in ambiguity, partnering with leaders to solve complex challenges and deliver meaningful, sustained outcomes.",
      "She brings an activator mindset to her work — pushing beyond conventional approaches, challenging assumptions, and helping organizations move past comfort zones to achieve what others may consider out of reach.",
      "She is particularly interested in how technology and AI can elevate leadership, learning, and organizational effectiveness, and integrates these perspectives into her advisory work.",
    ],
    credentials: ["MBA", "CHRL", "PROSCI", "B.Eng", "10+ Years"],
    caption: "Portrait — coming soon",
  },

  aiPov: {
    monoLabel: "On AI & the Future of Work",
    heading: "AI is not the strategy. It's a lever.",
    paragraphs: [
      "We think AI belongs in people strategy the same way any good system belongs — in the places where it solves a real problem for a real person. That's coaching-at-scale, personalized development plans, better talent signals, faster workforce decisions. It's not one-size-fits-all rollout of every new tool.",
      "The hard parts of people work — feedback, trust, values, inclusion, leadership presence — remain human. Our role is to keep those in the centre of the design, and use AI to remove friction from everything around them.",
    ],
  },

  finalCta: {
    headline: "Let's have a conversation.",
    subhead:
      "Every engagement starts with a 30-minute discovery call — complimentary, no pitch, focused on you.",
    cta: { label: "Book a Discovery Call", href: "/contact" },
  },
} as const;
