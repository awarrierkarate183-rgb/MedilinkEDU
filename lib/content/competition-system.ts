export type EventFormat = "SOLO_ONLY" | "TEAM_ONLY" | "SOLO_OR_TEAM";
export type EventTier = "NORMAL" | "LEGACY";

export type CatalogEvent = {
  id: string;
  number: number;
  name: string;
  tier: EventTier;
  format: EventFormat;
  minTeamSize: number;
  maxTeamSize: number;
  formatLabel: string;
  summary: string;
  description: string;
};

export const NORMAL_EVENT_CAP = 6;
export const LEGACY_ROSTER_SIZE = 8;
export const LEGACY_GROUP_SIZE = 4;
export const INVITATIONAL_NOMINATIONS_PER_CHAPTER = 2;

export const LEGACY_POINTS = {
  REGIONAL: { 1: 12, 2: 10, 3: 8, 4: 6, 5: 4 },
  STATE: { 1: 20, 2: 16, 3: 13, 4: 10, 5: 8 },
  NATIONAL: { 1: 35, 2: 28, 3: 22 },
} as const;

export const NORMAL_CHAPTER_POINTS = {
  REGIONAL: { 1: 6, 2: 5, 3: 4, 4: 3, 5: 2, competed: 1 },
  STATE: { 1: 12, 2: 10, 3: 8, competed: 2 },
  NATIONAL: { 1: 20, 2: 14, 3: 10 },
} as const;

export const RANKING_WEIGHTS = {
  legacy: 0.65,
  normal: 0.25,
  membership: 0.1,
} as const;

export const normalEvents: CatalogEvent[] = [
  {
    id: "triage-protocol",
    number: 1,
    name: "Triage Protocol",
    tier: "NORMAL",
    format: "SOLO_OR_TEAM",
    minTeamSize: 1,
    maxTeamSize: 5,
    formatLabel: "Solo or team, up to 5",
    summary: "On-site clinical reasoning under uncertainty.",
    description:
      "On-site clinical-reasoning case. Students prioritize a fictional patient and sequence safe actions when information is incomplete. Scoring favors what to do first, not only naming a likely condition. All cases are fictional. This is not medical training or permission to treat anyone.",
  },
  {
    id: "the-chart-room",
    number: 2,
    name: "The Chart Room",
    tier: "NORMAL",
    format: "SOLO_ONLY",
    minTeamSize: 1,
    maxTeamSize: 1,
    formatLabel: "Solo-only",
    summary: "Find a planted error in a fictional chart.",
    description:
      "Timed solo event. Find a planted documentation error in a fictional patient chart before it causes harm or a billing issue.",
  },
  {
    id: "system-failure",
    number: 3,
    name: "System Failure",
    tier: "NORMAL",
    format: "SOLO_OR_TEAM",
    minTeamSize: 1,
    maxTeamSize: 5,
    formatLabel: "Solo or team, up to 5",
    summary: "Trace a breakdown through clinic and cost.",
    description:
      "Trace a physiological system breakdown through its clinical and financial cascade.",
  },
  {
    id: "patient-zero",
    number: 4,
    name: "Patient Zero",
    tier: "NORMAL",
    format: "SOLO_OR_TEAM",
    minTeamSize: 1,
    maxTeamSize: 5,
    formatLabel: "Solo or team, up to 5",
    summary: "Investigate a fictional outbreak.",
    description:
      "Investigate a fictional outbreak using case data and exposure patterns to find the source and recommend a response.",
  },
  {
    id: "under-review",
    number: 5,
    name: "Under Review",
    tier: "NORMAL",
    format: "TEAM_ONLY",
    minTeamSize: 2,
    maxTeamSize: 5,
    formatLabel: "Team-only, 2 to 5",
    summary: "Rule on a flawed fictional study.",
    description:
      "Evaluate a fictional study with a planted methodological or ethical flaw and rule on its conclusion.",
  },
  {
    id: "the-gray-area",
    number: 6,
    name: "The Gray Area",
    tier: "NORMAL",
    format: "SOLO_OR_TEAM",
    minTeamSize: 1,
    maxTeamSize: 5,
    formatLabel: "Solo or team, up to 5",
    summary: "Defend one recommendation on a hard ethical case.",
    description:
      "Work a genuinely hard ethical dilemma and defend one actual recommendation.",
  },
  {
    id: "the-floor",
    number: 7,
    name: "The Floor",
    tier: "NORMAL",
    format: "TEAM_ONLY",
    minTeamSize: 2,
    maxTeamSize: 5,
    formatLabel: "Team-only, 2 to 5",
    summary: "Argue both sides of a policy proposal.",
    description:
      "Argue opposite sides of a healthcare policy proposal before a judged panel.",
  },
  {
    id: "pitch-day",
    number: 8,
    name: "Pitch Day",
    tier: "NORMAL",
    format: "SOLO_OR_TEAM",
    minTeamSize: 1,
    maxTeamSize: 5,
    formatLabel: "Solo or team, up to 5",
    summary: "Pitch a healthcare solution live.",
    description:
      "Pitch a healthcare solution and defend need, implementation, and financial viability live.",
  },
  {
    id: "the-ledger",
    number: 9,
    name: "The Ledger",
    tier: "NORMAL",
    format: "SOLO_ONLY",
    minTeamSize: 1,
    maxTeamSize: 1,
    formatLabel: "Solo-only",
    summary: "Healthcare money decisions, solo.",
    description:
      "Individual financial-literacy event built around real healthcare money decisions.",
  },
  {
    id: "market-call",
    number: 10,
    name: "Market Call",
    tier: "NORMAL",
    format: "SOLO_OR_TEAM",
    minTeamSize: 1,
    maxTeamSize: 5,
    formatLabel: "Solo or team, up to 5",
    summary: "Build and defend a market position.",
    description:
      "Read real market information, build a position, and defend it under live questioning.",
  },
  {
    id: "the-term-sheet",
    number: 11,
    name: "The Term Sheet",
    tier: "NORMAL",
    format: "TEAM_ONLY",
    minTeamSize: 2,
    maxTeamSize: 5,
    formatLabel: "Team-only, 2 to 5",
    summary: "Negotiate a funding recommendation.",
    description:
      "Analyze a company's financials and negotiate a funding recommendation.",
  },
  {
    id: "scarcity",
    number: 12,
    name: "Scarcity",
    tier: "NORMAL",
    format: "SOLO_OR_TEAM",
    minTeamSize: 1,
    maxTeamSize: 5,
    formatLabel: "Solo or team, up to 5",
    summary: "Price, supply, insurance, and access.",
    description:
      "Work through how price, supply, insurance, and regulation shape access to care.",
  },
  {
    id: "operating-margin",
    number: 13,
    name: "Operating Margin",
    tier: "NORMAL",
    format: "TEAM_ONLY",
    minTeamSize: 2,
    maxTeamSize: 5,
    formatLabel: "Team-only, 2 to 5",
    summary: "Solve an operations problem on a budget.",
    description:
      "Solve a real operational problem for a fictional hospital or clinic under budget constraints.",
  },
  {
    id: "the-pipeline",
    number: 14,
    name: "The Pipeline",
    tier: "NORMAL",
    format: "SOLO_OR_TEAM",
    minTeamSize: 1,
    maxTeamSize: 5,
    formatLabel: "Solo or team, up to 5",
    summary: "Evaluate a biotech or pharmaceutical bet.",
    description:
      "Evaluate how trials, patents, manufacturing, and pricing shape a biotech or pharmaceutical bet.",
  },
  {
    id: "claim-denied",
    number: 15,
    name: "Claim Denied",
    tier: "NORMAL",
    format: "SOLO_OR_TEAM",
    minTeamSize: 1,
    maxTeamSize: 5,
    formatLabel: "Solo or team, up to 5",
    summary: "Work a denied claim from both sides.",
    description:
      "Work a denied insurance claim from both sides toward a fair, defensible resolution.",
  },
  {
    id: "the-turnaround",
    number: 16,
    name: "The Turnaround",
    tier: "NORMAL",
    format: "TEAM_ONLY",
    minTeamSize: 2,
    maxTeamSize: 5,
    formatLabel: "Team-only, 2 to 5",
    summary: "Run a struggling organization through a crisis.",
    description:
      "Run a struggling fictional healthcare organization through an operational crisis.",
  },
  {
    id: "signal-vs-noise",
    number: 17,
    name: "Signal vs. Noise",
    tier: "NORMAL",
    format: "SOLO_OR_TEAM",
    minTeamSize: 1,
    maxTeamSize: 5,
    formatLabel: "Solo or team, up to 5",
    summary: "Judge an AI or digital health tool.",
    description:
      "Evaluate a proposed AI or digital health tool on safety, bias, adoption, and business case.",
  },
  {
    id: "seed-round",
    number: 18,
    name: "Seed Round",
    tier: "NORMAL",
    format: "SOLO_OR_TEAM",
    minTeamSize: 1,
    maxTeamSize: 5,
    formatLabel: "Solo or team, up to 5",
    summary: "Build a venture an investor could fund.",
    description:
      "Build a healthcare venture concept and pitch it as something an investor could fund.",
  },
  {
    id: "borders-and-budgets",
    number: 19,
    name: "Borders & Budgets",
    tier: "NORMAL",
    format: "SOLO_OR_TEAM",
    minTeamSize: 1,
    maxTeamSize: 5,
    formatLabel: "Solo or team, up to 5",
    summary: "A regional health challenge with real limits.",
    description:
      "Take on a specific under-resourced region's health challenge within real budget and infrastructure limits.",
  },
  {
    id: "on-record",
    number: 20,
    name: "On Record",
    tier: "NORMAL",
    format: "TEAM_ONLY",
    minTeamSize: 2,
    maxTeamSize: 5,
    formatLabel: "Team-only, 2 to 5",
    summary: "Respond to a public-trust crisis.",
    description:
      "Respond to a health misinformation or public-trust crisis with a real communication strategy under deadline.",
  },
];

export const legacyEvents: CatalogEvent[] = [
  {
    id: "the-atlas-docket",
    number: 1,
    name: "The Atlas Docket",
    tier: "LEGACY",
    format: "TEAM_ONLY",
    minTeamSize: 2,
    maxTeamSize: 4,
    formatLabel: "Mock appellate regulatory hearing. One group of 2 to 4.",
    summary: "Hospital AI counsel argues whether Atlas may stay in use.",
    description:
      "A fictional health system deployed Atlas, an emergency-department acuity and routing tool. Teams serve as hospital AI governance counsel before a regulatory panel deciding whether it may remain in use, under what conditions, and with what safeguards.",
  },
  {
    id: "the-covenant-table",
    number: 2,
    name: "The Covenant Table",
    tier: "LEGACY",
    format: "TEAM_ONLY",
    minTeamSize: 2,
    maxTeamSize: 4,
    formatLabel: "Five-year capital-allocation summit. One group of 2 to 4.",
    summary: "Allocate scarce capital without treating people as spreadsheet entries.",
    description:
      "Teams become a health-system capital allocation council. They decide what to fund, phase, partner, defer, protect, or close over five years, then rebalance after The Red Ledger shock.",
  },
  {
    id: "black-box-protocol",
    number: 3,
    name: "Black Box Protocol",
    tier: "LEGACY",
    format: "TEAM_ONLY",
    minTeamSize: 2,
    maxTeamSize: 4,
    formatLabel: "Clinical technology deployment simulation. One group of 2 to 4.",
    summary: "Decide whether a high-stakes clinical tool may deploy.",
    description:
      "An independent technology review board audits a high-stakes clinical product, then faces a Kill Switch incident that forces pause, modify, disclose, audit, continue, or terminate.",
  },
  {
    id: "the-last-mile-accord",
    number: 4,
    name: "The Last Mile Accord",
    tier: "LEGACY",
    format: "TEAM_ONLY",
    minTeamSize: 2,
    maxTeamSize: 4,
    formatLabel: "Value-based payment negotiation and arbitration. One group of 2 to 4.",
    summary: "Design a durable chronic-care payment accord.",
    description:
      "A payer, physician network, safety-net hospital, and patient coalition dispute a value-based chronic-disease contract. Teams negotiate, then defend the accord in public arbitration after The Corridor update.",
  },
  {
    id: "nightfall-command",
    number: 5,
    name: "Nightfall Command",
    tier: "LEGACY",
    format: "TEAM_ONLY",
    minTeamSize: 2,
    maxTeamSize: 4,
    formatLabel: "Four-round hospital crisis command. One group of 2 to 4.",
    summary: "Keep a hospital safe through escalating crisis injects.",
    description:
      "Teams serve as the incident-command executive group through stabilize, escalate, scrutiny, and recover rounds on The Nightfall Clock.",
  },
];

export const catalogEvents = [...normalEvents, ...legacyEvents];

export function getCatalogEvent(id: string) {
  return catalogEvents.find((event) => event.id === id);
}

export const competitionPillars = [
  {
    id: "normal",
    name: "Normal Events",
    kicker: "Twenty events",
    summary: "High-school, in-person. Up to six events per student per season.",
    prestige: 1,
  },
  {
    id: "legacy",
    name: "Legacy Events",
    kicker: "Five events",
    summary: "Eight students per chapter, two groups of four, locked for the season.",
    prestige: 2,
  },
  {
    id: "rankings",
    name: "Chapter Rankings",
    kicker: "Annual",
    summary: "Top 10 nationally and per state. 65 percent Legacy, 25 percent Normal, 10 percent membership.",
    prestige: 1,
  },
  {
    id: "apex",
    name: "MediLink Apex",
    kicker: "Biennial chapter summit",
    summary: "Chapter qualification from a 2-year cumulative 65 / 25 / 10 total. Networking and a gala.",
    prestige: 3,
  },
];
