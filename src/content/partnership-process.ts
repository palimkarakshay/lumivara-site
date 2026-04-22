/**
 * The 5-step Client Partnership Process — VERBATIM from lumivara.ca (Contact page).
 * Used on /how-we-work and /contact.
 */

export type PartnershipStep = {
  number: string;
  title: string;
  body: string;
};

export const partnershipProcess: PartnershipStep[] = [
  {
    number: "01",
    title: "Make the first move.",
    body: "Start your journey by reaching out through the contact form. Once submitted, you'll receive a short intake survey to help us understand your priorities, challenges, and context — and determine if we're the right fit to work together.",
  },
  {
    number: "02",
    title: "Discovery Conversation.",
    body: "If aligned, we'll schedule a complimentary discovery call. This session is focused on understanding your business, exploring your goals, and identifying where targeted people strategy can create the most impact.",
  },
  {
    number: "03",
    title: "Custom Blueprint.",
    body: "Following the discovery conversation, we develop a tailored proposal designed specifically for your organization. This outlines the approach, scope, pricing and priorities — setting a clear and structured foundation for the engagement.",
  },
  {
    number: "04",
    title: "Design & Build.",
    body: "Solutions are designed in close collaboration with your internal teams, subject matter experts, and stakeholders. The focus is on creating fully integrated, practical solutions that are tailored to your organization — not developed in isolation or based on generic models.",
  },
  {
    number: "05",
    title: "Enable, Measure & Sustain.",
    body: "Our work doesn't stop at design. We support implementation, adoption, and ongoing effectiveness through regular check-ins, continuous guidance, and measurement of impact — ensuring that solutions deliver sustained results over time.",
  },
];
