/**
 * Diagnostic MCQ on /what-we-do — 4 questions that route to recommended services.
 * Authored content (does not exist on lumivara.ca).
 */

export type DiagnosticOption = {
  value: string;
  label: string;
  /** Optional: which service slug this option points to */
  primarySlug?: string;
};

export type DiagnosticQuestion = {
  id: string;
  prompt: string;
  options: DiagnosticOption[];
};

export const diagnosticQuestions: DiagnosticQuestion[] = [
  {
    id: "priority",
    prompt: "What's the most pressing people challenge right now?",
    options: [
      {
        value: "hiring",
        label: "Hiring outcomes — too many wrong hires or vacancies dragging on.",
        primarySlug: "talent-acquisition",
      },
      {
        value: "leaders",
        label: "Leadership capability — managers aren't keeping up with the business.",
        primarySlug: "learning-leadership",
      },
      {
        value: "mobility",
        label: "Career paths and succession — losing strong people or unclear ladders.",
        primarySlug: "talent-management",
      },
      {
        value: "experience",
        label: "Engagement and culture — eNPS, retention, or experience is drifting.",
        primarySlug: "culture-experience",
      },
      {
        value: "future",
        label: "AI and future-of-work readiness — workforce isn't ready for what's next.",
        primarySlug: "future-of-work",
      },
      {
        value: "unclear",
        label: "Honestly not sure — the same issues keep resurfacing.",
        primarySlug: "hr-advisory",
      },
    ],
  },
  {
    id: "size",
    prompt: "How big is the organization?",
    options: [
      { value: "lt50", label: "Under 50 people — founder-led" },
      { value: "50to200", label: "50 to 200 — scaling" },
      { value: "200to500", label: "200 to 500 — mid-sized" },
      { value: "500to2000", label: "500 to 2,000 — mature" },
      { value: "gt2000", label: "Over 2,000 — enterprise" },
    ],
  },
  {
    id: "timeline",
    prompt: "When does this need to be addressed?",
    options: [
      { value: "exploring", label: "Exploring — next 6 months" },
      { value: "soon", label: "Soon — next quarter" },
      { value: "now", label: "Now — this quarter" },
      { value: "ongoing", label: "Ongoing — no specific deadline" },
    ],
  },
  {
    id: "hr-coverage",
    prompt: "What does your current HR coverage look like?",
    options: [
      { value: "chro", label: "Full-time CHRO or VP People in place" },
      { value: "transactional", label: "HR exists but is mostly transactional" },
      { value: "none", label: "No senior HR — leadership team handles it" },
      { value: "scoping", label: "Currently scoping or hiring the role" },
    ],
  },
];

export type DiagnosticAnswers = Record<string, string>;

export type DiagnosticResult = {
  primarySlug: string;
  alsoRecommend: string[];
  urgencyNote: string;
  callToAction: string;
};

function getLabel(questionId: string, value: string): string {
  const question = diagnosticQuestions.find((q) => q.id === questionId);
  return question?.options.find((o) => o.value === value)?.label ?? value;
}

export function buildDiagnosticSummary(
  answers: DiagnosticAnswers,
  primaryServiceTitle: string
): string {
  const lines = [
    `I completed the service diagnostic on your website. Here are my answers:`,
    ``,
    `Priority: ${getLabel("priority", answers["priority"] ?? "")}`,
    `Organisation size: ${getLabel("size", answers["size"] ?? "")}`,
    `Timeline: ${getLabel("timeline", answers["timeline"] ?? "")}`,
    `HR coverage: ${getLabel("hr-coverage", answers["hr-coverage"] ?? "")}`,
    ``,
    `Recommended starting point: ${primaryServiceTitle}`,
  ];
  return lines.join("\n");
}

export function scoreDiagnostic(
  answers: DiagnosticAnswers
): DiagnosticResult {
  const priorityOpt = diagnosticQuestions[0].options.find(
    (o) => o.value === answers["priority"]
  );
  const primarySlug = priorityOpt?.primarySlug ?? "hr-advisory";

  const alsoRecommend: string[] = [];
  const sizeNeedsFractional =
    answers["size"] === "50to200" || answers["size"] === "200to500";
  const noSeniorHr =
    answers["hr-coverage"] === "none" || answers["hr-coverage"] === "scoping";
  if (sizeNeedsFractional && noSeniorHr && primarySlug !== "hr-advisory") {
    alsoRecommend.push("hr-advisory");
  }

  const urgencyNote =
    answers["timeline"] === "now"
      ? "We can typically begin within two weeks."
      : answers["timeline"] === "soon"
        ? "Most engagements scope in 1–2 weeks once aligned."
        : "We're happy to start with a low-pressure conversation.";

  const callToAction =
    answers["timeline"] === "now"
      ? "Book a discovery call this week."
      : "Book a discovery call when you're ready.";

  return { primarySlug, alsoRecommend, urgencyNote, callToAction };
}
