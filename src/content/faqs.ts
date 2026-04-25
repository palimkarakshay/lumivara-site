/**
 * FAQs — answers VERBATIM from lumivara.ca.
 * Used on /how-we-work and referenced from /contact and /fractional-hr.
 */

export type FAQ = {
  id: string;
  question: string;
  answer: string;
  /** Optional routing: where the answer can lead next */
  relatedHref?: string;
  relatedLabel?: string;
};

export const faqs: FAQ[] = [
  {
    id: "services",
    question: "What services do you offer?",
    answer:
      "We offer a range of people advisory solutions designed to meet your needs—whether you're just getting started or scaling something bigger. Our services are fully customized to your HR strategic needs which may include tools, resources, policies, program design, training and more. See our Services page for a full list of our expertise.",
    relatedHref: "/what-we-do",
    relatedLabel: "See all services",
  },
  {
    id: "getting-started",
    question: "How do I get started?",
    answer:
      "Getting started is simple. Reach out through our contact form or send us an email or call us to book a free consultation. See our Client Partnership Process for more information on next steps.",
    relatedHref: "/contact",
    relatedLabel: "Start a conversation",
  },
  {
    id: "different-from-big-firms",
    question: "How is Lumivara different from larger consulting firms?",
    answer:
      "Lumivara operates as a boutique consulting partner, which allows for a more focused, hands-on approach. Unlike larger firms that often apply standardized frameworks, Lumivara designs solutions that are fully tailored to each organization's context, challenges, and goals. This means greater flexibility, deeper engagement, and solutions that are more practical, relevant, and effective in real-world implementation.",
  },
  {
    id: "pricing",
    question: "What's your pricing model?",
    answer:
      "Pricing depends on the scope, complexity, and duration of the engagement. This may include project-based pricing, advisory retainers, or short-term engagements for specific challenges. All engagements are scoped collaboratively to ensure alignment on outcomes, approach, and level of support required. Since we are a new boutique consulting firm, all our pricing will be extremely competitive.",
  },
  {
    id: "typical-clients",
    question: "What types of organizations do you typically work with?",
    answer:
      "Lumivara works with small to mid-sized organizations and growing enterprises looking to strengthen their people strategy, leadership capability, and talent systems. While the approach is industry-agnostic, engagements are particularly valuable for organizations experiencing growth, transformation, or capability gaps that require structured, tailored solutions.",
    relatedHref: "/what-we-do",
    relatedLabel: "Explore our services",
  },
  {
    id: "experience",
    question: "What kind of experience and qualifications do you bring?",
    answer:
      "Lumivara is led by a people strategy and organizational development professional with over 10 years of experience across learning, talent, and leadership development. Their background includes an MBA in Human Resources, CHRL designation, engineering training, and certification in Prosci Change Management — combining analytical rigor with practical, business-focused execution. See the About Us section for more information.",
    relatedHref: "/about",
    relatedLabel: "Meet the founder",
  },
  {
    id: "how-delivered",
    question: "How are solutions designed and delivered?",
    answer:
      "Every engagement begins with structured diagnostics to understand the root cause of the challenge. This includes stakeholder input, analysis of internal data, and where relevant, market and competitive context. Solutions are then designed specifically for the organization — aligned to its strategy, culture, and maturity. The focus is on creating practical, scalable approaches that fit the business, rather than applying standard or pre-defined models. Support can extend from design through implementation and enablement to ensure sustained impact.",
    relatedHref: "/how-we-work#process",
    relatedLabel: "See our engagement lifecycle",
  },
  {
    id: "predefined-packages",
    question: "Do you offer predefined packages or customized solutions?",
    answer:
      "While structured packages can be developed for specific needs, most engagements are highly customized. Each solution is designed based on the organization's context, priorities, and capability gaps. This ensures that the work is directly relevant, actionable, and aligned to business outcomes — rather than adapting the organization to fit a pre-built model.",
    relatedHref: "/how-we-work#engagement-models",
    relatedLabel: "See engagement models",
  },
  {
    id: "measuring-effectiveness",
    question: "How do you measure the effectiveness of your work?",
    answer:
      "Effectiveness is measured by linking people initiatives to business performance and outcomes. This may include improvements in hiring quality, leadership capability, employee performance, engagement, or adoption of new systems and programs. Where required, measurement frameworks, dashboards, and reporting mechanisms are designed to track progress, demonstrate impact, and provide visibility into return on investment.",
    relatedHref: "/how-we-work#impact",
    relatedLabel: "See how we measure impact",
  },
  {
    id: "when-to-engage",
    question: "At what stage should an organization consider engaging Lumivara?",
    answer:
      "Organizations typically engage Lumivara when they are scaling, undergoing change, or facing challenges related to leadership capability, talent systems, or workforce performance. Early engagement is particularly valuable to ensure the right problems are identified and addressed before investing in solutions.",
    relatedHref: "/contact",
    relatedLabel: "Book a discovery call",
  },
];
