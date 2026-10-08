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
export const LEGACY_ROSTER_SIZE = 4;
export const LEGACY_GROUP_SIZE = 4;
export const INVITATIONAL_NOMINATIONS_PER_CHAPTER = 2;

export const LEGACY_STANDING = {
  STATE: { regional: 0.35, state: 0.65 },
  NATIONAL: { regional: 0.15, state: 0.25, national: 0.6 },
} as const;

export const LEGACY_REGIONAL_ADVANCE = 3;
export const LEGACY_STATE_ADVANCE = 1;

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
    name: "Medical Triage",
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
    name: "Chart Audit",
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
    name: "Disease Pathway",
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
    name: "Outbreak Investigation",
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
    name: "Research Review",
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
    name: "Medical Ethics",
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
    name: "Health Policy Debate",
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
    name: "Solution Design",
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
    name: "Healthcare Budgeting",
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
    name: "Market Analysis",
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
    name: "Deal Negotiation",
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
    name: "Resource Allocation",
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
    name: "Clinic Operations",
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
    name: "Biotech Review",
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
    name: "Insurance Appeals",
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
    name: "Hospital Recovery",
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
    name: "Digital Health Review",
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
    name: "Healthcare Startup",
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
    name: "Global Health",
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
    name: "Crisis Communications",
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
    id: "the-sovereign-ledger",
    number: 1,
    name: "The Sovereign Ledger",
    tier: "LEGACY",
    format: "TEAM_ONLY",
    minTeamSize: 4,
    maxTeamSize: 4,
    formatLabel: "Medicine x finance. One four-student chapter team. Five-act live championship.",
    summary: "Disciplined capital strategy, financial nerve, and protection of essential care.",
    description:
      "Asterion Health Alliance has a $48 million unrestricted capital envelope and a $6 million reserve floor. The team decides what deserves capital, what it will refuse, and how the portfolio survives a payer shock, a restrictive gift, and a public board.",
  },
  {
    id: "nightfall-code-meridian",
    number: 2,
    name: "Nightfall: Code Meridian",
    tier: "LEGACY",
    format: "TEAM_ONLY",
    minTeamSize: 4,
    maxTeamSize: 4,
    formatLabel: "Medicine x management. One four-student chapter team. Five-act live championship.",
    summary: "Command discipline, safe logistics, and leadership during cascading failure.",
    description:
      "Meridian Regional is a fictional 320-bed referral hospital. An electronic-record outage meets a storm that limits transport and staff. The team holds the organization together without making unsafe promises.",
  },
  {
    id: "the-janus-protocol",
    number: 3,
    name: "The Janus Protocol",
    tier: "LEGACY",
    format: "TEAM_ONLY",
    minTeamSize: 4,
    maxTeamSize: 4,
    formatLabel: "Medicine x technology. One four-student chapter team. Five-act live championship.",
    summary: "Technical skepticism, clinical validation, and accountable innovation.",
    description:
      "A fictional hospital consortium is considering JANUS, an AI deterioration-prediction and care-routing platform. The team must separate an impressive demo from an accountable clinical system.",
  },
];

export const catalogEvents = [...normalEvents, ...legacyEvents];

export const LEGACY_ID_ALIASES: Record<string, string> = {
  "the-covenant-table": "the-sovereign-ledger",
  "the-atlas-docket": "the-janus-protocol",
  "black-box-protocol": "the-janus-protocol",
  "nightfall-command": "nightfall-code-meridian",
  "operation-containment": "nightfall-code-meridian",
  "the-meridian-hearing": "the-janus-protocol",
  "project-onconova": "the-janus-protocol",
  "the-rural-lifeline-case": "the-sovereign-ledger",
};

export function resolveCatalogEventId(id: string) {
  return LEGACY_ID_ALIASES[id] || id;
}

export function getCatalogEvent(id: string) {
  return catalogEvents.find((event) => event.id === resolveCatalogEventId(id));
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
    kicker: "Three events",
    summary: "One team of four. The Sovereign Ledger, Nightfall: Code Meridian, and The Janus Protocol.",
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
