## Goal
The /insights page currently has 3 articles. Add 3 more covering Lumivara's other core service areas to demonstrate content depth and improve SEO.

## Articles to create

### Article 1: Succession Planning
**File**: `src/content/insights/the-succession-gap-most-organizations-ignore.mdx`

Frontmatter:
- title: "The Succession Gap Most Organizations Ignore"
- excerpt: "Most succession plans identify who's next. The best ones build the conditions for anyone to be ready."
- category: "perspective"
- date: "2026-03-15"
- readingTime: 4

Body: Write a 700-word advisory piece on the three real conditions that predict succession success (psychological safety to stretch, cross-functional exposure before it's needed, sponsor relationships not just mentors). End with a diagnostic question. Lumivara sign-off: "Lumivara works with leadership teams to design succession frameworks that build organizational capability, not just fill org chart boxes."

### Article 2: Fractional HR
**File**: `src/content/insights/when-fractional-hr-makes-more-sense-than-a-hire.mdx`

Frontmatter:
- title: "When Fractional HR Makes More Sense Than a Hire"
- excerpt: "The question isn't whether you need HR — it's whether you need it full-time, all year long."
- category: "advisory"
- date: "2026-02-20"
- readingTime: 5

Body: Write a 700-word piece contrasting the under-hire/over-hire failure modes at 50–200 person organizations, explaining when fractional HR is the right model (specific initiative, defined scope, pre-hire clarity), and ending with a diagnostic question framework. Lumivara sign-off: "Lumivara offers fractional HR engagements structured around specific outcomes, not open-ended retainers."

### Article 3: Compensation Transparency
**File**: `src/content/insights/the-compensation-conversation-most-managers-avoid.mdx`

Frontmatter:
- title: "The Compensation Conversation Most Managers Avoid"
- excerpt: "Pay transparency isn't just a compliance trend — it's a trust signal. How you handle it says more than the number itself."
- category: "perspective"
- date: "2026-01-10"
- readingTime: 4

Body: Write a 700-word piece on Ontario pay transparency legislation, framing the real challenge as manager readiness (not just compliance), covering the three real questions employees ask when they see salary ranges, and a manager conversation framework. Lumivara sign-off: "Lumivara supports organizations navigating compensation transparency with frameworks that equip managers for real conversations — not just compliant ones."

## Definition of done
- [ ] All 3 MDX files created with correct frontmatter matching the existing schema
- [ ] Check `src/content/insights/clarity-is-the-first-hiring-problem.mdx` for the exact frontmatter shape
- [ ] Articles appear on /insights
- [ ] Each article renders without errors at /insights/[slug]
- [ ] Reading time and date display correctly
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes
