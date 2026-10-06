import type { HandbookRubricRow, ReleaseClass } from "@/lib/content/normal-event-handbook";
import { resolveCatalogEventId } from "@/lib/content/competition-system";

export type LegacyAct = {
  title: string;
  body: string;
  output: string;
};

export type LegacyHandbookEntry = {
  id: string;
  number: number;
  name: string;
  domain: string;
  formatLabel: string;
  releaseClass: ReleaseClass;
  releaseLabel: string;
  role: string;
  action: string;
  mechanic: string;
  overview: string;
  whyLegacy: string;
  decisionLayers: string[];
  roles: string[];
  acts: LegacyAct[];
  constraints: string[];
  routes: string[];
  packet: string[];
  preparation: string;
  experience: string;
  workProduct: string;
  rubric: HandbookRubricRow[];
  success: string;
  extraRules?: string[];
  judgeStandard: string;
  annualExpansion: string;
  escalation: Array<{ round: string; design: string }>;
};

export const LEGACY_HANDBOOK_PDF = "/docs/legacy-championship-handbook.pdf";

export const legacyPurpose =
  "The Legacy Triad is one school, four delegates, and three arenas. A reputation is earned under pressure. Teams cannot win by delivering one polished presentation. Their work must survive execution, cross-examination, and changing facts.";

export const legacyIdentity =
  "Three flagship events: The Sovereign Ledger, Nightfall: Code Meridian, and The Janus Protocol. Regionals unfold in one competition day. State scheduling can expand the experience, but duration is not the event's identity.";

export const legacyDelegationRules = [
  "Each school chapter registers exactly one team of four high-school members. Those four are the chapter's entire Legacy delegation for the season. No second group, extra specialist, or alternating event roster.",
  "Teams may enter one, two, or all three Legacy events. Qualification is separate for each event. A chapter may qualify in several or none.",
  "The roster locks before Regionals. A nationally approved replacement is permitted only for documented withdrawal or serious unavailability before a later round, not to acquire a specialist. No mid-event substitution.",
  "Each student owns a functional role and must understand cross-role decisions. Rotate leadership between phases if useful, but log ownership changes.",
  "Legacy delegates may participate in Normal Events under Normal Event rules. Legacy scheduling must not assume the four students can compete in simultaneous events.",
];

export const legacyAdvancementNotes = [
  "Regionals: the top three eligible teams from each regional pool, separately in each event, advance to States. Ranking uses Regional raw score out of 1,000.",
  "A pool with fewer than three eligible teams advances its eligible teams. No artificial empty qualifiers.",
  "States: all qualifying regional teams within the state compete. The single highest cumulative Regional-State score in each event advances to Nationals.",
  "State standing equals 35 percent Regional raw score plus 65 percent State raw score. Calculate on unrounded values. Display one decimal.",
  "Nationals: state champions compete for one national title in each event. Proposed National standing equals 15 percent Regional, 25 percent State, and 60 percent National. Publish or replace that national formula before registration.",
  "State ties: higher State raw score, then the State safety or clinical criterion, then live-adaptation, then a common 15-minute tie case. National ties use National raw score followed by the equivalent criteria.",
];

export const legacyIntegrityRules = [
  "During controlled phases, only supplied materials and authorized tools are allowed. No open internet, generative AI, personal messaging, or outside coaches unless a specific rule authorizes a tool.",
  "The complete fictional case releases only at monitored check-in. Recommended advance release is a broad topic, skills blueprint, sample templates, formula sheet, and allowed-tool list eight weeks before Regionals.",
  "Each exhibit carries an ID, timestamp, units, and reliability status. Distinguish confirmed facts, estimates, allegations, and binding constraints. A contradictory actor statement is not automatically true.",
  "Lock each decision before the next release. Later revisions must identify the changed fact, the old assumption, the new action, and its owner. Correcting an error earns adaptation credit. It does not erase the earlier error from the evidence trail.",
  "Rival encounters test negotiation, evidence, and composure. Teams earn points for defensible decisions, not simply for beating a weaker opponent. An uncooperative rival cannot deny a team all transaction points.",
  "All cases are fictional. No patient care, medication administration, real clinical records, unapproved human testing, legal representation, or actual investment solicitation.",
];

export const legacyScoring =
  "Every Legacy event uses a 1,000-point rubric. For each criterion, a judge awards a 0 to 4 anchor. Awarded points equal the criterion maximum times the level divided by 4. Half-levels need a written rationale. Three judges rate independently, then scores are averaged. Each criterion is scored once over the full evidence trail.";

export const legacyEliteNote =
  "Level 4 is accurate, complete, case-specific, and feasible. Level 3 is a sound core strategy with minor gaps. Level 2 is developing. Level 1 is weak or generic. Level 0 is absent, fabricated, or incompatible with binding constraints.";

const sharedEscalation = [
  {
    round: "Regionals",
    design:
      "One-day five-act case with a concise evidence packet, one principal rival encounter, and common core injects.",
  },
  {
    round: "States",
    design:
      "Richer data, tighter constraints, deeper stakeholder conflict, and more developed encounter cycles. Expanded logistics appear in the event notice.",
  },
  {
    round: "Nationals",
    design:
      "System-level dependencies and harder uncertainty, with the same published criterion weights. Scheduling is approved separately.",
  },
];

const sharedWhy =
  "A sequence of locked actions creates consequences. Rival encounters test judgment. Technical and clinical evidence must survive execution. The final hearing examines both what the team chose and how it revised. No slide deck can replace the work history.";

const sharedLock =
  "Lock the decision before the next release. Later revisions must identify the changed fact, the old assumption, the new action, and its owner.";

export const legacyEventHandbook: LegacyHandbookEntry[] = [
  {
    id: "the-sovereign-ledger",
    number: 1,
    name: "The Sovereign Ledger",
    domain: "Medicine and finance",
    formatLabel: "One four-student chapter team. Five-act live championship.",
    releaseClass: "ADVANCED_RELEASE",
    releaseLabel: "Full case at monitored check-in",
    role: "Capital strategy delegation for Asterion Health Alliance",
    action: "Allocate",
    mechanic: "Five locked acts, a rival exchange, and a consequence engine",
    overview:
      "Asterion Health Alliance serves a metropolitan center and three community hospitals. Its unrestricted capital envelope is $48 million, with a $6 million minimum reserve. Competing investments exceed available funds. A rival provider is capturing profitable outpatient demand, a maternity pathway needs safer transfer capacity, and a cyber infrastructure replacement cannot be delayed indefinitely. A lender wants stability. Clinicians want equipment. Communities want access. The team decides what deserves capital and what it will refuse.",
    whyLegacy: sharedWhy,
    decisionLayers: [
      "Finance: sources and uses, debt, cash flow, and downside cases.",
      "Clinical access: safety floors, service continuity, equity, and transfer feasibility.",
      "Investment and risk: sensitivities, workforce dependencies, and implementation.",
      "Negotiation: partner terms, concessions, public defense, and accountability.",
    ],
    roles: [
      "Finance strategist: sources and uses, debt, cash flow, and downside cases.",
      "Clinical access officer: safety floors, service continuity, equity, and transfer feasibility.",
      "Investment and risk analyst: sensitivities, workforce dependencies, and implementation.",
      "Negotiation and board lead: partner terms, concessions, public defense, and accountability.",
    ],
    packet: [
      "Income statement, balance sheet, cash forecast, and debt covenant schedule.",
      "Service-line volume, margin, staffing, payer mix, quality, and travel-time maps.",
      "Eight project dossiers with cost, recurring expense, capacity dependencies, and clinical impact.",
      "Partner bids, financing choices, acquisition restrictions, and minimum safety obligations.",
      "A quantified no-investment baseline and an assumptions worksheet.",
    ],
    acts: [
      {
        title: "Act I. The Opening Ledger",
        body: "Lock a five-year portfolio, reserve policy, and clinical-access floor. Explain rejected investments. Do not claim every project will pay for itself.",
        output: "Capital allocation sheet, cash schedule, evidence index, and assumptions register.",
      },
      {
        title: "Act II. The Exchange",
        body: "Negotiate a shared-service agreement with a rival hospital team. A bounded sealed-bid procurement exercise allocates fictional vendor capacity. Safety-critical care itself is never auctioned.",
        output: "Signed term sheet or justified walk-away, risk allocation, and alternative plan.",
      },
      {
        title: "Act III. The Covenant Breach",
        body: "A common payer update lowers expected receipts. The consequence engine applies previously stated liquidity and covenant relationships. High leverage is not automatically wrong, but it becomes costly.",
        output: "Revised cash forecast, covenant test, project sequencing, and access mitigation.",
      },
      {
        title: "Act IV. The Benefactor's Clause",
        body: "A donation appears with restrictive service commitments. A second exhibit reveals that the favored growth project creates a staffing bottleneck. Accept, counteroffer, or reject with evidence.",
        output: "Donation decision, revised staffing and capital plan, and downside comparison.",
      },
      {
        title: "Act V. The Sovereign Board",
        body: "Clinician, lender, labor, and community actors challenge the final portfolio. A rival files one exhibit-based challenge. Close with first-100-day execution and accountability.",
        output: "Final board book, three-scenario model, ownership milestones, and public explanation.",
      },
    ],
    constraints: [
      "Capital available after reserve is $42 million. Reserved cash cannot also fund projects.",
      "Recurring operating expense must be financed separately from one-time capital.",
      "Every signed deal has an owner, funding source, and contingency.",
      "A donation is evaluated for long-term obligations, not its headline amount.",
    ],
    routes: [
      "Phased expansion with liquidity preserved.",
      "Shared infrastructure instead of duplicate purchases.",
      "A lower-margin portfolio justified by essential access and credible financing.",
      "Partnerships with explicit service-quality and exit conditions.",
    ],
    preparation:
      "Study capital budgeting, hospital finance, access and equity, negotiation, and board defense. Eight weeks out, expect a topic, skills blueprint, templates, formula sheet, and allowed-tool list. The complete fictional case releases only at monitored check-in.",
    experience:
      "Regional day: 08:00 full case release, 10:00 opening lock, 10:45 first execution and rival encounter, 12:30 consequence inject, 13:30 major reversal, 14:30 final hearing and individual questioning, 15:30 artifact lock. States may split analysis and reversal across two controlled days. No overnight homework or midnight injects.",
    workProduct:
      "Locked act packets, an assumptions register, numbered evidence citations, a rival term sheet or walk-away, and a final board book that a real organization could follow.",
    rubric: [
      { criterion: "Financial integrity and capital allocation", points: 220 },
      { criterion: "Clinical access, safety, and equity", points: 200 },
      { criterion: "Evidence and sensitivity analysis", points: 150 },
      { criterion: "Transactions and negotiation", points: 120 },
      { criterion: "Adaptation and strategic coherence", points: 160 },
      { criterion: "Implementation and board defense", points: 100 },
      { criterion: "Individual mastery", points: 50 },
    ],
    success:
      "A standout team names what it will not fund, keeps the reserve honest, and can explain every locked act after a reversal. Novelty is not automatically superior.",
    extraRules: [
      sharedLock,
      "Safety-critical care is never auctioned.",
      "A team can win without accepting a deal or expanding services if its alternative meets constraints and withstands challenge.",
    ],
    judgeStandard: legacyScoring,
    annualExpansion:
      "The annual health-system type and project set can change. The Sovereign Ledger identity stays: scarce capital, essential care, and public accountability.",
    escalation: sharedEscalation,
  },
  {
    id: "nightfall-code-meridian",
    number: 2,
    name: "Nightfall: Code Meridian",
    domain: "Medicine and management",
    formatLabel: "One four-student chapter team. Five-act live championship.",
    releaseClass: "ADVANCED_RELEASE",
    releaseLabel: "Full case at monitored check-in",
    role: "Incident-command executive team for Meridian Regional",
    action: "Command",
    mechanic: "Five locked acts, mutual aid, and a cascade engine",
    overview:
      "Meridian Regional is a fictional 320-bed referral hospital. An electronic-record outage coincides with a storm that limits transport and staff arrivals. Emergency demand rises while neighboring hospitals strain. Oxygen, blood, and qualified coverage are finite. Elective procedures support cash flow but compete for capacity. The team must hold the organization together without making unsafe promises.",
    whyLegacy: sharedWhy,
    decisionLayers: [
      "Incident command: authority, objectives, decision cadence, and logs.",
      "Clinical continuity: service priorities, handoffs, escalation, and transfer safety.",
      "Workforce and logistics: staffed beds, credentials, rest limits, inventory, and transport.",
      "Finance and public trust: spending authority, cash exposure, accurate messages, and board oversight.",
    ],
    roles: [
      "Incident commander: authority, objectives, decision cadence, and logs.",
      "Clinical continuity lead: service priorities, handoffs, escalation, and transfer safety.",
      "Workforce and logistics chief: staffed beds, credentials, rest limits, inventory, and transport.",
      "Finance and public trust lead: spending authority, cash exposure, accurate messages, and board oversight.",
    ],
    packet: [
      "Census, acuity bands, staffed-bed map, procedure schedule, and transfer capacities.",
      "Staff credentials, coverage minima, absence forecast, and fatigue constraints.",
      "Inventory, lead times, oxygen and blood limits, and downtime workflow options.",
      "Cash buffer, emergency authority, interruption costs, and revenue assumptions.",
      "Stakeholder messages and an explicit command authority matrix.",
    ],
    acts: [
      {
        title: "Act I. The First Thirty Minutes",
        body: "Establish command and immediate priorities. Define what can continue safely, what must change, and who can authorize action.",
        output: "Command chart, first-30-minute actions, and service-priority matrix.",
      },
      {
        title: "Act II. The Mutual Aid Table",
        body: "Negotiate with teams representing neighboring hospitals. Transfer capacity, staff assistance, and supply support require safe handoffs and realistic timing.",
        output: "Mutual-aid agreement, transfer log, balanced resource board, and fallback.",
      },
      {
        title: "Act III. The Cascade",
        body: "A road closure interrupts resupply. A medication-reconciliation warning exposes a weakness in downtime processes. Prior decisions affect queues through disclosed relationships.",
        output: "Revised resource and staff plan, verification checkpoint, and internal and public update.",
      },
      {
        title: "Act IV. The False All-Clear",
        body: "Some systems return, but records remain inconsistent. Staff fatigue worsens while a public report incorrectly claims full restoration. Reopening needs verification, not optimism.",
        output: "Restore or hold decision, verification criteria, rest plan, and correction statement.",
      },
      {
        title: "Act V. The Meridian Inquiry",
        body: "Board, regulator, staff representative, and patient actors demand explanation. A rival challenges one allocation. Show restoration criteria, financial mitigation, and lessons.",
        output: "24-hour and 72-hour plans, exposure report, recovery thresholds, and after-action reforms.",
      },
    ],
    constraints: [
      "An empty bed is not a staffed bed.",
      "Transport time and receiving-site acceptance must be confirmed in the fictional record.",
      "Supplies and staff cannot serve two places simultaneously.",
      "Restoration requires technical and clinical verification.",
    ],
    routes: [
      "Staged service restoration with verification gates.",
      "Distributed stabilization partnerships and explicit handoffs.",
      "Conservative capacity decisions paired with credible mutual aid.",
      "Controlled downtime processes that lower workload without weakening safety.",
    ],
    preparation:
      "Study incident command, hospital operations, staffing, logistics, downtime workflows, and public communication. The complete incident packet releases at monitored check-in.",
    experience:
      "The same one-day five-act Regional clock as the rest of the Triad. Mutual aid is a scored encounter, not a courtesy scene. Restoration without verification fails the relevant criterion.",
    workProduct:
      "Command chart, service-priority matrix, mutual-aid record, verification criteria, rest plan, and after-action reforms.",
    rubric: [
      { criterion: "Patient safety and continuity", points: 250 },
      { criterion: "Command and decision discipline", points: 150 },
      { criterion: "Resource and workforce execution", points: 180 },
      { criterion: "Adaptation and restoration", points: 170 },
      { criterion: "Financial resilience", points: 100 },
      { criterion: "Trust and stakeholder communication", points: 100 },
      { criterion: "Individual command mastery", points: 50 },
    ],
    success:
      "A standout team keeps contemporaneous logs, refuses fictitious capacity, and corrects a false all-clear in public. Cooperation may be a winning strategy.",
    extraRules: [
      sharedLock,
      "Do not punish appropriate medical mutual aid.",
      "Unsafe proposals affect the safety criterion. An honest analytical mistake is not automatic disqualification.",
    ],
    judgeStandard: legacyScoring,
    annualExpansion:
      "The annual hazard can change. Nightfall: Code Meridian stays a command event about cascading failure, finite resources, and public trust.",
    escalation: sharedEscalation,
  },
  {
    id: "the-janus-protocol",
    number: 3,
    name: "The Janus Protocol",
    domain: "Medicine and technology",
    formatLabel: "One four-student chapter team. Five-act live championship.",
    releaseClass: "ADVANCED_RELEASE",
    releaseLabel: "Full case at monitored check-in",
    role: "Clinical technology review and procurement delegation",
    action: "Validate",
    mechanic: "Five locked acts, a red-team arena, and a kill-switch hearing",
    overview:
      "A fictional hospital consortium is considering JANUS, an AI deterioration-prediction and care-routing platform. Aggregate performance looks compelling and projected savings are large. Local data are fragmented. Subgroup estimates are uncertain. The contract restricts audit access. A competing product offers less automation but better integration. The team must distinguish an impressive demo from an accountable clinical system.",
    whyLegacy: sharedWhy,
    decisionLayers: [
      "Clinical validation: outcome relevance, error consequences, and the safety case.",
      "Data and technical audit: denominators, missingness, leakage, calibration, and local validity.",
      "Governance and security: privacy, audit access, incident ownership, and shutdown authority.",
      "Implementation and finance: workflow, total cost, procurement, staffing, and alternatives.",
    ],
    roles: [
      "Clinical validation lead: outcome relevance, error consequences, and the safety case.",
      "Data and technical lead: denominators, missingness, leakage, calibration, and local validity.",
      "Governance and security lead: privacy, audit access, incident ownership, and shutdown authority.",
      "Implementation and finance lead: workflow, total cost, procurement, staffing, and alternatives.",
    ],
    packet: [
      "Cohort tables, confusion matrices, prevalence, subgroup counts, and uncertainty information.",
      "Data dictionary, provenance, missingness, train and test separation, and local pilot results.",
      "Interface and workflow maps, clinician feedback, alert burden, and fallback options.",
      "Vendor contracts, interoperability and data rights, total-cost assumptions, and competing solutions.",
      "Incident log, acceptance-threshold form, and deployment restriction template.",
    ],
    acts: [
      {
        title: "Act I. The Evidence Gate",
        body: "Audit validation and lock initial approve, pilot, restrict, defer, or reject conditions. Identify populations, endpoints, and stop rules.",
        output: "Evidence audit, calculation sheet, thresholds, and deployment map.",
      },
      {
        title: "Act II. The Procurement Arena",
        body: "Actors present competing vendor offers. Rivals file evidence-based red-team questions. Negotiate audit rights, exit, portability, and implementation commitments.",
        output: "Procurement memo, contract terms, total-cost comparison, and response to challenge.",
      },
      {
        title: "Act III. The Mirror Test",
        body: "Local performance differs from vendor results. Distinguish prevalence effects, data shift, and workflow failure using supplied evidence.",
        output: "Recomputed metrics, uncertainty statement, and deployment revision.",
      },
      {
        title: "Act IV. The Janus Reversal",
        body: "A safety incident coincides with a product update and apparent subgroup disparity. A media allegation is partly wrong. Another mechanism better fits the record.",
        output: "Incident reconstruction, pause, continue, or rollback decision, and correction.",
      },
      {
        title: "Act V. The Kill-Switch Hearing",
        body: "Clinicians, patient, security, vendor, and finance actors interrogate the final system. A rival offers a red-team exhibit. Defend deployment, redesign, staged pilot, or rejection.",
        output: "Safety case, governance charter, fallback plan, and monitoring dashboard.",
      },
    ],
    constraints: [
      "Overall accuracy alone cannot establish clinical usefulness.",
      "Predictive value can change with prevalence.",
      "Small subgroup samples require explicit uncertainty.",
      "Human in the loop needs a named decision owner and a feasible workflow.",
    ],
    routes: [
      "Restricted pilot with prespecified stopping rules.",
      "Reject the product and improve workflow without AI.",
      "Require independent audit access before purchasing.",
      "Separate predictive performance from a measured clinical benefit.",
    ],
    preparation:
      "Study clinical validation, diagnostic-performance concepts, bias, privacy, procurement, and workflow design. The complete JANUS dossier releases at monitored check-in.",
    experience:
      "The same one-day five-act Regional clock. Rejection can score at the highest level if the record supports it. A red-team challenge is scored independently. No point stealing.",
    workProduct:
      "Evidence audit, procurement memo, recomputed metrics, incident reconstruction, and a kill-switch safety case.",
    rubric: [
      { criterion: "Clinical validity and safety", points: 220 },
      { criterion: "Technical and statistical evidence audit", points: 200 },
      { criterion: "Governance, security, privacy, and equity", points: 160 },
      { criterion: "Workflow, procurement, and finance", points: 140 },
      { criterion: "Incident response and adaptation", points: 160 },
      { criterion: "Red-team and stakeholder defense", points: 70 },
      { criterion: "Individual technical mastery", points: 50 },
    ],
    success:
      "A standout team treats accuracy as insufficient, names uncertainty, and can shut the system down with a real owner. Marketing is not evidence.",
    extraRules: [
      sharedLock,
      "A recommendation to reject technology can score at the highest level if the case evidence supports it.",
      "Judges reward teams that recognize when workforce or process redesign is better than automation.",
    ],
    judgeStandard: legacyScoring,
    annualExpansion:
      "The annual product class can change. The Janus Protocol stays an accountable-innovation event: validate, contract, reverse, and defend a kill switch.",
    escalation: sharedEscalation,
  },
];

export function getLegacyHandbook(id: string) {
  const resolved = resolveCatalogEventId(id);
  return legacyEventHandbook.find((event) => event.id === resolved) || null;
}

export function legacyHandbookInstructionsBody(event: LegacyHandbookEntry) {
  return [
    `Student role: ${event.role}`,
    `Primary action: ${event.action}`,
    `Signature mechanic: ${event.mechanic}`,
    `Class: ${event.releaseLabel}`,
    `Format: ${event.formatLabel}`,
    "",
    event.overview,
    "",
    "Why this event is Legacy-level",
    event.whyLegacy,
    "",
    "Four-person operating model",
    ...event.roles.map((role) => `- ${role}`),
    "",
    "Secured case packet",
    ...event.packet.map((item) => `- ${item}`),
    "",
    "Five-act storyline",
    ...event.acts.flatMap((act) => [act.title, act.body, `Required output: ${act.output}`, ""]),
    "",
    "Hard constraint checks",
    ...event.constraints.map((item) => `- ${item}`),
    "",
    "Legitimate routes to victory",
    ...event.routes.map((item) => `- ${item}`),
    "",
    "Preparation before competition",
    event.preparation,
    "",
    "Competition process",
    event.experience,
    "",
    "Required deliverables",
    event.workProduct,
    "",
    "Student success standard",
    event.success,
    "",
    "Rules and boundaries",
    ...legacyIntegrityRules.map((rule) => `- ${rule}`),
    ...(event.extraRules || []).map((rule) => `- ${rule}`),
    "",
    "Round difficulty",
    ...event.escalation.map((row) => `${row.round}: ${row.design}`),
  ].join("\n");
}

export function legacyHandbookRubricBody(event: LegacyHandbookEntry) {
  const rows = event.rubric.map((row) => `${row.criterion}: ${row.points} points`).join("\n");
  return [
    "Championship rubric. 1,000 points.",
    event.judgeStandard,
    "",
    legacyEliteNote,
    "",
    rows,
    "",
    "Individual defense: ask every student two equivalent short questions, one on work they owned and one on a cross-role dependency. Individual mastery contributes only its listed points.",
    "",
    event.annualExpansion,
  ].join("\n");
}

export function getAnyHandbook(id: string) {
  return getLegacyHandbook(id);
}
