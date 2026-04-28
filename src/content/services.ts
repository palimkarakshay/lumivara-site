/**
 * The six Lumivara services — single source of truth for hub, detail pages,
 * service cards on home, and the diagnostic MCQ on /what-we-do.
 *
 * CONTENT RULES:
 *   - `title`, `tagline`, `shortDescription` — VERBATIM from lumivara.ca
 *   - `subServices[].title`, `.description`, `.items` — VERBATIM from lumivara.ca
 *   - `diagnosticQuestion`, `signals`, `approach`, `kpis`, `relatedSlugs` — authored
 *     for the rebuild (do not exist on the current site)
 *
 * When in doubt, preserve verbatim copy and edit only the authored fields.
 */

export type SubService = {
  title: string;
  tagline: string;
  description: string;
  items: string[];
};

export type Service = {
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  tagline: string;
  shortDescription: string;
  diagnosticQuestion: string;
  signals: string[];
  approach: string;
  subServices: SubService[];
  kpis: string[];
  relatedSlugs: [string, string];
};

export const services: Service[] = [
  {
    slug: "talent-acquisition",
    number: "01",
    title: "Talent Acquisition Process Excellence",
    shortTitle: "Talent Acquisition",
    tagline:
      "Build hiring systems that consistently identify and secure the right talent.",
    shortDescription:
      "Move beyond reactive hiring by designing structured, scalable recruitment systems that improve decision quality, reduce bias, and strengthen long-term talent outcomes. From interview design to employer brand positioning, the focus is on enabling consistent, high-quality hiring across the organization.",
    diagnosticQuestion: "Is your hiring producing consistently strong outcomes — or just filling seats?",
    signals: [
      "New hires are looking strong on paper but underperforming in role",
      "Different interviewers walk out of the same interview with different impressions",
      "Hiring decisions rely on gut feel rather than evidence",
      "Candidates disengage mid-process or accept competing offers",
      "Employer brand is not showing up where target talent is looking",
    ],
    approach:
      "We diagnose your current hiring system end-to-end — role definitions, sourcing channels, interview rigor, decision points, compliance posture, employer brand — then design and implement the targeted improvements that will move quality, speed, and candidate experience.",
    subServices: [
      {
        title: "Hiring System Design",
        tagline: "Structure, rigor, and evidence in every hiring decision.",
        description:
          "Design of competency-based interview frameworks and scorecards that make hiring consistent, defensible, and predictive of on-the-job performance.",
        items: [
          "Competency-based interview frameworks aligned to role success profiles",
          "Structured interview guides and hiring scorecards",
          "Hiring manager capability development and interview training programs",
          "Compliance advisory for hiring practices (Ontario and Canada), including evolving legislative requirements",
          "Employer branding and Employee Value Proposition (EVP) development",
        ],
      },
    ],
    kpis: ["Time-to-fill", "Quality-of-hire", "1-year retention", "Hiring manager NPS"],
    relatedSlugs: ["talent-management", "culture-experience"],
  },
  {
    slug: "learning-leadership",
    number: "02",
    title: "Learning, Leadership & Capability Development",
    shortTitle: "Learning & Leadership",
    tagline:
      "Build leadership capability and workforce skills that translate into measurable business impact.",
    shortDescription:
      "We design end-to-end learning and development programs that are grounded in real business needs and deliver sustained performance outcomes. From onboarding through leadership development, the focus is on building capability that lasts — not one-time training.",
    diagnosticQuestion: "Are your managers developing at the pace the business is growing?",
    signals: [
      "First-time managers are struggling with the transition from individual contributor",
      "Leadership bench doesn't yet exist for your next level of scale",
      "Training programs are running but behavior on the job isn't changing",
      "High-potentials don't have a clear development journey",
      "Onboarding ends at week one, and new hires take 6+ months to hit stride",
    ],
    approach:
      "We anchor learning to measurable business outcomes, diagnose where real capability gaps sit, then build programs — leadership cohorts, manager academies, onboarding journeys, sustainment practices — that are delivered through whichever modalities fit your scale and culture.",
    subServices: [
      {
        title: "Leadership Development & High-Potential Programs",
        tagline:
          "Develop leaders and high-potential talent who can drive the organization forward.",
        description:
          "Design and delivery of structured leadership development experiences that strengthen capability across all levels — from first-time managers to high-potential talent — with a focus on building strong leadership pipelines and long-term organizational capability.",
        items: [
          "Leadership development programs aligned to business priorities",
          "First-time manager transition and capability programs",
          "High-potential (HiPo) identification and development journeys",
          "Leadership academies and cohort-based development programs",
          "Coaching and mentoring program design",
          "Peer learning and leadership cohort models",
          "Social learning approaches to embed leadership capability on the job",
        ],
      },
      {
        title: "Workforce Upskilling, Learning Strategy & Capability Building",
        tagline:
          "Design learning systems that address real business challenges and drive sustained performance.",
        description:
          "End-to-end learning strategy and program design focused on building critical workforce capabilities — aligned to business priorities, enabled through modern learning approaches, and reinforced through sustainment and measurement.",
        items: [
          "Learning needs analysis (LNA) to identify capability gaps linked to business outcomes",
          "End-to-end curriculum and program design aligned to real performance challenges",
          "Workforce upskilling and reskilling initiatives",
          "Certification-linked learning programs and internal academies (university-style structures)",
          "Multimodal learning design, including instructor-led, e-learning, cohort-based, and gamified experiences",
          "Integration of learning technologies and platforms to support scalable delivery",
          "Social and blended learning approaches to enable continuous, on-the-job capability building",
          "Sustainment strategies to reinforce learning beyond initial training (reinforcement, practice, application)",
          "Learning effectiveness measurement and reporting, including ROI and business impact",
        ],
      },
      {
        title: "Onboarding & Early Capability Development",
        tagline: "Accelerate new hire readiness and enable faster time to performance.",
        description:
          "Design of structured onboarding experiences that equip employees with the knowledge, skills, and support needed to succeed in their roles within the first 6–9 months. The focus is on building confidence, accelerating capability, and improving early performance outcomes.",
        items: [
          "End-to-end onboarding program design (role-based and enterprise-wide)",
          "Structured 30-60-90 day and extended onboarding journeys (up to 6–9 months)",
          "Role-specific capability development and training pathways",
          "Manager enablement for onboarding and early development",
          "Integration of social learning and peer support into onboarding experiences",
          "Onboarding measurement and effectiveness tracking",
        ],
      },
    ],
    kpis: [
      "Program NPS",
      "Behavior change at 90 days",
      "Leadership bench strength",
      "Promotion readiness",
    ],
    relatedSlugs: ["talent-management", "future-of-work"],
  },
  {
    slug: "talent-management",
    number: "03",
    title: "Talent Management & Career Pathing",
    shortTitle: "Talent Management",
    tagline:
      "Design integrated talent systems that drive growth, mobility, and long-term capability.",
    shortDescription:
      "We help organizations build structured talent architectures that connect how people are assessed, developed, and progressed. The focus is on creating clear pathways for growth, strengthening internal mobility, and enabling better talent decisions through well-defined frameworks.",
    diagnosticQuestion: "Can you answer: who moves next, and why?",
    signals: [
      "Succession plans exist on paper but don't hold up under scrutiny",
      "High-performers are leaving because they don't see a path",
      "Talent reviews generate discussion but not decisions",
      "Career ladders are unclear or inconsistent across functions",
      "Internal mobility is lower than you'd expect for your size",
    ],
    approach:
      "We design talent architectures that actually get used — competency frameworks that fit real work, career pathways that are transparent, succession processes that produce decisions, and diagnostics that tell you where your bench stands.",
    subServices: [
      {
        title: "Talent Management & Career Architecture",
        tagline: "Create clear pathways for growth and enable smarter talent decisions.",
        description:
          "Design of integrated talent and career systems that align how employees are evaluated, developed, and advanced — supporting both individual growth and organizational capability.",
        items: [
          "Talent review frameworks and high-potential (HiPo) identification",
          "Succession planning systems and leadership pipeline development",
          "Career pathing frameworks across roles and functions",
          "Job family architecture and role structuring",
          "Internal mobility strategies to support career movement",
          "Skill-based career progression models",
          "Job description creation and role documentation aligned to capability frameworks",
        ],
      },
      {
        title: "Competency Mapping & Talent Diagnostics",
        tagline: "Define what success looks like — and build systems to assess and develop it.",
        description:
          "Design of competency frameworks and diagnostic tools that provide a consistent foundation for hiring, development, and talent decisions across the organization.",
        items: [
          "Competency frameworks and capability models aligned to business needs",
          "Competency dictionaries across roles and levels",
          "Talent diagnostic frameworks to assess current capability gaps",
          "Design and integration of 360° feedback programs",
          "Advisory on external assessment tools and platforms",
        ],
      },
    ],
    kpis: ["Internal mobility rate", "Succession coverage", "9-box movement", "Retention of top talent"],
    relatedSlugs: ["learning-leadership", "hr-advisory"],
  },
  {
    slug: "culture-experience",
    number: "04",
    title: "Culture, Employee Experience & HR Policy Design",
    shortTitle: "Culture & Experience",
    tagline:
      "Build strong HR foundations and meaningful employee experiences that drive engagement and retention.",
    shortDescription:
      "We help organizations design people practices that shape both the employee experience and the underlying HR infrastructure. From engagement and recognition to inclusive culture and clear, compliant policies, the focus is on creating environments where employees can perform, grow, and stay.",
    diagnosticQuestion: "Are people staying — and is it for the reasons you want?",
    signals: [
      "Engagement scores are flat or drifting down, and you're not sure why",
      "Exit themes repeat quarter over quarter",
      "Policies have accumulated over time but no longer reflect how work gets done",
      "Inclusion work has good intent but little measurable traction",
      "Recognition feels inconsistent across teams",
    ],
    approach:
      "We connect the experience employees actually have with the policies, rituals, and leadership behaviors that shape it — then redesign the pieces that are drifting while keeping what's working.",
    subServices: [
      {
        title: "Employee Experience & Recognition",
        tagline: "Design experiences that strengthen engagement, connection, and culture.",
        description:
          "Development of employee experience strategies and recognition programs that enhance how employees interact with the organization — from day-to-day engagement to key moments that matter.",
        items: [
          "Employee experience strategy and journey mapping",
          "Employee engagement strategies aligned to organizational priorities",
          "Engagement survey design, analysis, and action planning",
          "Employee recognition program design (non-compensation-based)",
          "Leadership communication strategy, including town halls and key messaging frameworks",
          "Experience design across critical employee lifecycle moments",
        ],
      },
      {
        title: "Culture & Inclusion",
        tagline: "Build inclusive cultures where diverse talent can thrive and contribute.",
        description:
          "Design and implementation of culture and inclusion initiatives that move beyond intent to action — embedding inclusive practices into everyday ways of working, leadership behaviors, and organizational systems.",
        items: [
          "Diversity, equity, and inclusion (DEI) strategy development aligned to business priorities",
          "Culture diagnostics and inclusion assessments",
          "Design of inclusive leadership capability programs",
          "Integration of inclusion into talent, learning, and people processes",
          "Employee listening strategies to understand diverse experiences",
          "Development of inclusive policies, practices, and communication approaches",
        ],
      },
      {
        title: "HR Policies & Organizational Foundations",
        tagline:
          "Create clear, compliant, and scalable HR frameworks that support consistency and growth.",
        description:
          "Design and development of HR policies and documentation that provide clarity, ensure compliance, and support consistent people practices across the organization.",
        items: [
          "Employee handbook development and policy structuring",
          "Workplace policy design aligned to organizational needs",
          "Hybrid and remote work policy design",
          "Policy audits and updates aligned to Ontario and Canadian legislation",
          "Documentation frameworks to support consistent HR practices",
        ],
      },
    ],
    kpis: ["Engagement score", "eNPS", "Retention by cohort", "Exit theme reduction"],
    relatedSlugs: ["talent-management", "hr-advisory"],
  },
  {
    slug: "future-of-work",
    number: "05",
    title: "Technology, Future of Work & AI Leveraged HR Transformations",
    shortTitle: "Future of Work",
    tagline: "Prepare your workforce for a digital, AI-enabled future of work.",
    shortDescription:
      "We help organizations identify emerging capability needs, design future-ready workforce strategies, and implement technology-enabled systems that support learning, talent development, and decision-making. The focus is on building practical, scalable approaches that connect technology investments to real business outcomes.",
    diagnosticQuestion: "Is your workforce ready for what AI is about to change in your industry?",
    signals: [
      "AI and automation are moving faster than your capability planning",
      "Learning and talent technology investments aren't delivering adoption",
      "Workforce planning is still a once-a-year exercise",
      "There's no shared view of which skills will matter in 24 months",
      "HR data lives in silos and decisions still rely on gut",
    ],
    approach:
      "We cut the hype and focus on the practical: which capabilities the business actually needs, which technologies support them, how adoption will be driven, and how outcomes will be measured.",
    subServices: [
      {
        title: "AI, Workforce Transformations & Capability Strategy",
        tagline: "Define the skills, structures, and systems needed for the future of work.",
        description:
          "Design of workforce strategies that align evolving business needs with future skills, enabling organizations to adapt, reskill, and remain competitive in an AI-enabled environment.",
        items: [
          "AI workforce capability frameworks and future skills identification",
          "Workforce reskilling and upskilling strategies aligned to business priorities",
          "Workforce transformation roadmaps and capability planning",
          "Integration of learning and talent strategies with future-of-work priorities",
        ],
      },
      {
        title: "HR Technology, Learning Systems & Digital Enablement",
        tagline: "Design and implement technology ecosystems that enable scalable capability building.",
        description:
          "Advisory and design of integrated learning and talent technology systems that support development, improve visibility into capability, and enable data-driven decision-making.",
        items: [
          "LMS selection, implementation support, and optimization",
          "Digital learning ecosystem design (LMS, LXP, content, and integrations)",
          "HR technology strategy aligned to talent and learning priorities",
          "Learning effectiveness measurement and reporting frameworks",
          "Design of learning and talent dashboards for data-driven insights",
        ],
      },
    ],
    kpis: ["Adoption rate", "Time-to-value", "User satisfaction", "Decision velocity"],
    relatedSlugs: ["learning-leadership", "hr-advisory"],
  },
  {
    slug: "hr-advisory",
    number: "06",
    title: "General HR Advisory & Strategic Support",
    shortTitle: "HR Advisory",
    tagline: "Diagnose the real challenge — and design the right people strategy to address it.",
    shortDescription:
      "We work with leadership teams to assess underlying organizational challenges, identify root causes, and provide targeted HR and people strategy advisory. The focus is on moving beyond surface-level approaches to address the real drivers of performance, capability, and organizational effectiveness. We also partner with organizations to provide support as a fractional HR consultant.",
    diagnosticQuestion: "What if the challenge you're addressing isn't the real challenge?",
    signals: [
      "The same people issues keep resurfacing under different labels",
      "Leadership disagrees on the root cause",
      "A major initiative is about to launch and you want a senior HR lens",
      "There's no in-house People leader and decisions are getting complex",
      "You need help scoping what a real HR function should look like",
    ],
    approach:
      "We start with structured diagnostics — stakeholder input, data, surrounding context — before proposing anything. Once the real challenge is clear, we either design the approach with you or act as your embedded senior HR partner while you run it.",
    subServices: [
      {
        title: "Diagnostics & Talent Needs Assessment",
        tagline: "Identify what's really driving outcomes — and act on it.",
        description:
          "Structured diagnostics and advisory support to help organizations understand gaps in capability, leadership, processes, or culture, and design practical approaches aligned to business priorities.",
        items: [
          "Organizational diagnostics and root cause analysis",
          "HR and people strategy advisory aligned to business goals",
          "HR capability assessments and maturity evaluations",
          "Leadership advisory on people, structure, and organizational effectiveness",
          "Challenge definition and approach design for complex people challenges",
        ],
      },
      {
        title: "Change Management & Enablement",
        tagline: "Ensure that change is adopted, embedded, and delivers results.",
        description:
          "Change management and enablement support integrated into broader initiatives to ensure new programs, systems, and ways of working are effectively adopted, risks are mitigated, and intended outcomes are achieved.",
        items: [
          "Stakeholder mapping and impact analysis",
          "Identification of bottlenecks and risk areas affecting adoption",
          "Change communication planning and messaging",
          "Adoption strategies for new HR programs, systems, and initiatives",
          "Leadership enablement to support change",
          "Reinforcement strategies to sustain change over time",
        ],
      },
      {
        title: "Fractional HR Advisory",
        tagline: "Embedded senior HR expertise at the cadence you need.",
        description:
          "Ongoing strategic HR partnership for organizations that need senior-level people thinking without the cost of a full-time CHRO.",
        items: [
          "Fractional HR advisory (ongoing strategic support)",
          "Project-based HR and people strategy consulting",
          "Short-term advisory for specific business challenges",
        ],
      },
    ],
    kpis: [
      "Challenge-to-approach clarity",
      "Stakeholder alignment",
      "Execution velocity",
      "Capability lift post-engagement",
    ],
    relatedSlugs: ["talent-management", "culture-experience"],
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}
