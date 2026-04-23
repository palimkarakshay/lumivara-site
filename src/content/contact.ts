export const contactContent = {
  hero: {
    monoLabel: "Start a Conversation",
    headline: "Let's find the real problem.",
    subhead:
      "Every engagement starts with a 30-minute discovery conversation — complimentary and focused on you. We'll review your message and get back to you within 48 hours.",
  },

  booking: {
    label: "Book a Discovery Call",
    body: "Pick a time that works. Thirty minutes, focused on the problem you're trying to solve. No pitch deck.",
  },

  inquiry: {
    label: "Or send a detailed inquiry",
    body: "If you'd rather share the shape of the work in writing, this gets you to the same place.",
    fields: {
      name: { label: "Name", required: true },
      email: { label: "Work email", required: true },
      organization: { label: "Organization", required: false },
      size: {
        label: "Organization size",
        options: [
          "Under 50",
          "50–200",
          "200–500",
          "500–2,000",
          "2,000+",
        ],
      },
      interests: {
        label: "Area of interest (select any that apply)",
        options: [
          { value: "talent-acquisition", label: "Talent Acquisition" },
          { value: "learning-leadership", label: "Learning & Leadership" },
          { value: "talent-management", label: "Talent Management" },
          { value: "culture-experience", label: "Culture & Experience" },
          { value: "future-of-work", label: "Future of Work / AI" },
          { value: "hr-advisory", label: "HR Advisory" },
          { value: "fractional-hr", label: "Fractional HR" },
          { value: "unsure", label: "Not sure yet" },
        ],
      },
      timeline: {
        label: "Timeline",
        options: [
          "Exploring",
          "Next 3 months",
          "Next quarter",
          "This year",
        ],
      },
      message: {
        label: "What's the situation?",
        placeholder:
          "What's keeping you up at night? Or describe the situation you're trying to work through.",
        required: true,
      },
      consent: {
        label:
          "I consent to Lumivara collecting and using this information to respond to my inquiry, in line with its privacy policy.",
        required: true,
      },
    },
    submit: "Send Inquiry",
    success: {
      heading: "Thanks. I personally respond within 48 hours.",
      body: "Your message is with me. Expect a reply soon — from a person, not a bot.",
      signoff: "— Beas",
    },
  },

  directContact: {
    label: "Or reach out directly",
    reassurance: "Every inquiry is read and responded to personally.",
  },
} as const;
