export type CompetitionId =
  | "innovation"
  | "policy"
  | "research"
  | "nationals"
  | "apex";

export type CompetitionKind = "one-time" | "ladder" | "biennial";

export const competitions = [
  {
    id: "innovation" as const,
    name: "Innovation Challenge",
    kicker: "One annual event",
    summary: "Pitch a health technology product or digital health concept.",
    prestige: 1,
    kind: "one-time" as CompetitionKind,
    what: "An annual pitch competition for an app, device concept, or platform idea that could change access to care.",
    who: "Grades 9-12 in an active chapter. Individual or teams of up to 3.",
    format: "One annual deck and a live pitch. No regional or state qualifier.",
    how: "Name the user, the gap, and a path to pay for it. Feasibility, impact, and a basic business case matter. A finished product is not required. Coding background is not required.",
    create: "A pitch. A wireframe or workflow is honest. A fake finished app is not.",
    connects: "This event does not replace the technology lens on a Nationals case. Champions can be invited when Nationals is enlarged in an Apex year.",
    points: "One-time schedule: participation 10, top 10 20, top 3 35, win 50.",
    timeline: "Dates come from state chapter boards. This page is not a calendar.",
    resource: "/curriculum#track-4",
  },
  {
    id: "policy" as const,
    name: "Policy Cup",
    kicker: "One annual event",
    summary: "Write a policy brief and deliver a live presentation or debate.",
    prestige: 1,
    kind: "one-time" as CompetitionKind,
    what: "An annual brief and debate on a live health-system issue. Topics are selected annually by the state chapter board.",
    who: "Grades 9-12 in an active chapter. Individual or pairs.",
    format: "One annual brief plus live advocacy. No Policy Cup regionals ladder.",
    how: "Research a live issue, write a brief, and argue a concrete reform. Debate and presentation, not an exam. This site does not invent this year's topic.",
    create: "The issue, who is affected, the current rule or practice, and a reform you can actually argue. A slogan is not a brief.",
    connects: "Policy Cup does not replace the financial lens on a Nationals case. Champions can be invited to the Apex.",
    points: "One-time schedule: participation 10, top 10 20, top 3 35, win 50.",
    timeline: "Topics and dates come from the state chapter board. Ask your chapter leader.",
    resource: "/curriculum#track-4",
  },
  {
    id: "research" as const,
    name: "Research Symposium",
    kicker: "One annual event",
    summary: "Independent research as a poster and a short talk. Lowest barrier of the five.",
    prestige: 1,
    kind: "one-time" as CompetitionKind,
    what: "Independent research on health economics or health technology, presented as a poster and an oral.",
    who: "Grades 9-12 in an active chapter. A student can enter without assembling a Nationals case team.",
    format: "One annual poster plus an oral presentation. No symposium ladder.",
    how: "A poster that cannot name a question, a method, and a finding is not finished. Mentors should not promise publication. Promise a careful read.",
    create: "A real question, a method a high school student can actually run, and a finding the student can defend in a short talk.",
    connects: "A Nationals case restated as a poster does not belong here. Champions can still be invited to the Apex.",
    points: "One-time schedule: participation 10, top 10 20, top 3 35, win 50.",
    timeline: "Dates come from state chapter boards. This page is not a calendar.",
    resource: "/curriculum#track-4",
  },
  {
    id: "nationals" as const,
    name: "MediLink Nationals",
    kicker: "Yearly flagship",
    summary: "Teams of 3 to 4. Same Track 4 capstone. Regional, then State, then National.",
    prestige: 2,
    kind: "ladder" as CompetitionKind,
    what: "The yearly flagship. Every team works the same Track 4 capstone case for that year. Teams must cover clinical, financial, and technology. A Grand Prize still has to hold all three.",
    who: "Grades 9-12 in a Flagship-Eligible chapter, or a chapter on that path using the regional round. You compete through a chapter. This site does not take independent entries.",
    format: "Written brief and video pitch, live regionals, a national final, and an awards evening. The only event that climbs Regional to State to National.",
    how: "Phase 1: case release. Phase 2: regional rounds with judges from hospitals, finance, and health-tech. Phase 3: national final. Intended National home: Charlotte. Packets still use the internal names Care, Cost, Code.",
    create: "A Nationals case that holds clinic, money, and tech together. Awards: Best Clinical Insight, Best Financial Model, Best Tech Innovation, Grand Prize.",
    connects: "Curriculum and competition stay linked because the case comes from Track 4. In an Apex year this National round is enlarged. It is still Nationals.",
    points: "Nationals points add as a team advances. Maximum possible Nationals points in a single year: 230. There is no extra multiplier.",
    timeline: "The exact format, dates, and requirements can change annually. State chapter boards set dates. This page is the structure, not a calendar.",
    resource: "/curriculum#track-4",
    ladder: [
      {
        id: "ladder",
        level: "Regional",
        body: "First Nationals round, run at or near chapters. Participating here is part of the path to Flagship-Eligible.",
      },
      {
        id: "state",
        level: "State",
        body: "The state chapter board coordinates this round. North Carolina and Georgia are the states currently listed on the chapter map.",
      },
      {
        id: "national",
        level: "National",
        body: "State qualifiers compete nationally. In an Apex year, this level is the summit. Same case, enlarged year.",
      },
    ],
  },
  {
    id: "apex" as const,
    name: "MediLink Apex",
    kicker: "Biennial culmination",
    summary: "Champions of champions. Not a sixth case. Nationals stays the yearly flagship.",
    prestige: 3,
    kind: "biennial" as CompetitionKind,
    what: "Every two years the National round is enlarged. Top performers from Nationals plus champions from Innovation Challenge, Policy Cup, and Research Symposium are invited.",
    who: "Invited top performers from the two-year cycle. You still compete through a chapter.",
    format: "Championship round, sponsor networking fair, keynotes from medicine, finance, and health-tech, and a closing awards gala. Same Track 4 capstone case as that year's Nationals.",
    how: "A new two-year cycle starts at zero after each Apex. Qualification uses the Road to Apex ledger. The Apex is not a sixth prompt with its own case.",
    create: "Championship work across the four competitions of the cycle, plus the networking fair and gala around the National final.",
    connects: "Impact Partner and Visionary Sponsor can attend the fair in person. Keynotes and the gala sit on top of the usual National final. They do not replace it.",
    points: "Chapter cycle total: all points earned by all teams across all four competitions over the two-year Apex cycle.",
    timeline: "Occurs every two years. Cycle dates are stored as configuration, not as year-specific copy on this page.",
    resource: "/competitions#road-to-apex",
  },
];

export function getCompetition(id: CompetitionId) {
  return competitions.find((item) => item.id === id);
}
