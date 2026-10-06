import type { HandbookRubricRow, ReleaseClass } from "@/lib/content/normal-event-handbook";

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
  "Legacy events are not harder Normal Events. They are selective, chapter-owned championship simulations that demand synthesis across medicine, finance, leadership, technology, policy, and communication. A Legacy team must make decisions under ambiguity, defend tradeoffs, absorb new facts, and keep a coherent strategy under pressure.";

export const legacyIdentity =
  "Each Legacy competition is a recognizable flagship experience with a permanent brand, an annual hyper-specific fact pattern, multi-layer decision-making, a live challenge, and a rubric that rewards substantive reasoning over presentation polish.";

export const legacyDelegationRules = [
  "Each school chapter selects a maximum of eight Legacy-eligible students for the season, organized as two groups of up to four students.",
  "For any one Legacy event, a chapter may enter only one of its two groups. The other group may not enter the same Legacy event.",
  "The selected eight form the chapter's season-long Legacy delegation. Except for narrowly documented, approved circumstances, substitutes may not be added after the season begins.",
  "Legacy delegates may also compete in Normal Events. Legacy performance primarily represents the chapter. Individual excellence may be recognized separately or considered for the biennial invitational.",
  "All Legacy rounds occur in person. Each event uses On-site: Advanced Release. The broad domain is announced earlier. The full confidential packet releases two hours before the judged simulation.",
];

export const legacyAdvancementNotes = [
  "Regionals eliminate all but the top five entries.",
  "States determine the top three cumulative standings that advance to Nationals.",
  "Nationals determines the champion by cumulative standing. There is no consolation bracket.",
  "At States, all five Regional qualifiers receive State placement points, but only the top three by cumulative score advance to Nationals.",
  "At Nationals, the team with the highest cumulative score after all three rounds is the Legacy National Champion.",
  "Ties are resolved by the later-round score, then technical-content score, then oral-defense score, then a designated tie-break challenge.",
];

export const legacyIntegrityRules = [
  "During the two-hour supervised preparation period, personal devices, outside communication, internet research, generative AI, and outside coaching are prohibited unless specifically authorized by the annual event guide.",
  "Teams may use only the supplied packet, allowed tools, official reference materials, and materials created during supervised preparation.",
  "Each team must submit its preparation notes and all required written materials before entering the judged phase.",
  "Judges may question any delegate about any part of the team's reasoning. A team cannot conceal nonparticipation behind a polished presentation.",
  "Each event includes case facts that may be incomplete or conflicting. Teams must distinguish facts, assumptions, and recommendations.",
  "All scenarios are fictional and educational. Competitors must not present themselves as licensed clinicians or give real-person medical or legal advice.",
];

export const legacyScoring =
  "Every Legacy event uses a 100-point rubric. Strong teams do not simply offer more ideas. They make disciplined choices, name what they will not do, disclose assumptions, protect against foreseeable harm, and present an implementation pathway that a real organization could follow. Judges score substance and reasoning over presentation polish.";

export const legacyEliteNote =
  "Elite performance uses the case record precisely, makes explicit tradeoffs, integrates medicine, finance, ethics, and operations where relevant, adapts decisively to new facts, and withstands direct questioning from multiple stakeholders.";

const sharedEscalation = [
  { round: "Regionals", design: "Core fact pattern. Teams must show a sound framework, technical competence, and an initial defensible strategy." },
  { round: "States", design: "More complex data, stronger stakeholder conflict, tighter resource constraints, and a consequential live update." },
  { round: "Nationals", design: "Full multi-layer simulation with advanced evidence, high-stakes tradeoffs, intense questioning, and a final change that tests whether the strategy truly holds." },
];

const sharedWhy =
  "This event requires teams to connect technical evidence with real organizational consequences. A winning solution must be defensible from multiple viewpoints, withstand new information, and show why its strategy remains safer, fairer, or more viable than competing approaches. The event intentionally has no single obvious solution.";

export const legacyEventHandbook: LegacyHandbookEntry[] = [
  {
    id: "the-atlas-docket",
    number: 1,
    name: "The Atlas Docket",
    domain: "Health law, clinical AI, equity, finance, and regulatory governance",
    formatLabel: "Team-only, 2 to 4 Legacy delegates",
    releaseClass: "ADVANCED_RELEASE",
    releaseLabel: "On-site: Advanced Release",
    role: "Hospital AI governance counsel",
    action: "Argue",
    mechanic: "The Bench: judicial questioning plus an evidence-objection round",
    overview:
      "A fictional regional health system has deployed Atlas, an AI-supported emergency-department acuity and routing platform. Atlas shortens waiting times, reduces avoidable admissions, and improves throughput, but an independent audit suggests it may under-prioritize patients from particular demographic groups and may have been trained on incomplete local data. After a serious alleged harm, a coalition challenges continued deployment. Teams serve as counsel before a specialized appellate-regulatory panel deciding whether Atlas may remain in use, under what conditions, and with what financial, clinical, and legal safeguards.",
    whyLegacy: sharedWhy,
    decisionLayers: [
      "The clinical question: does the tool improve actual patient care, or does its observed efficiency conceal unacceptable safety risk?",
      "The data question: what do sensitivity, calibration, subgroup performance, missing data, local validation, and workflow behavior actually establish?",
      "The governance question: who is accountable when clinicians, administrators, vendors, and algorithms share decision influence?",
      "The financial question: how should a hospital weigh savings, licensing costs, liability exposure, staffing pressure, and the cost of alternative safeguards?",
      "The remedy question: approve, restrict, redesign, suspend, independently audit, pilot, or terminate, and why?",
    ],
    preparation:
      "Study AI and clinical-decision-support concepts, evidence interpretation, algorithmic bias, privacy and data governance, hospital operations, liability and regulation, and persuasive hearing practice. The broad annual domain is published early. The full record, exhibits, witness summaries, contract excerpts, audit tables, and procedural question release two hours before the hearing in supervised preparation.",
    experience:
      "Two-hour supervised case review and role allocation. Teams submit a written appellate brief and exhibit index before entering the hearing room. Hearing sequence: opening argument, panel questioning, evidence and admissibility objection round, opposing-case rebuttal or respondent defense, remedy argument, closing. During the hearing, the Bench may disclose a new audit exhibit, vendor contract clause, patient testimony, or sentinel-event update.",
    workProduct:
      "Written appellate and regulatory brief. Exhibit and evidence theory map. Clinical-safety and equity analysis. Governance and remedy framework. Oral hearing performance and individual cross-questioning.",
    rubric: [
      { criterion: "Legal-regulatory theory and remedy design", points: 25 },
      { criterion: "Clinical validity, safety, and evidence analysis", points: 20 },
      { criterion: "Equity, data governance, and accountability", points: 20 },
      { criterion: "Financial and operational consequences", points: 15 },
      { criterion: "Advocacy, rebuttal, and response to the Bench", points: 15 },
      { criterion: "Individual mastery and team coordination", points: 5 },
    ],
    success:
      "A standout team inhabits hospital AI governance counsel, performs argue, and uses The Bench to prove the remedy holds when new evidence appears.",
    extraRules: [
      "This is a fictional educational hearing, not legal advice.",
      "Teams are scored on the strength and coherence of their analysis, not on personal views about AI.",
      "A strong team may argue for conditional use, suspension, redesign, or termination if the record supports it.",
    ],
    judgeStandard: legacyScoring,
    annualExpansion:
      "The annual technology, health system, claimed harm, and regulatory posture can change while the Atlas Docket identity remains.",
    escalation: sharedEscalation,
  },
  {
    id: "the-covenant-table",
    number: 2,
    name: "The Covenant Table",
    domain: "Medicine, capital finance, hospital strategy, access, and executive leadership",
    formatLabel: "Team-only, 2 to 4 Legacy delegates",
    releaseClass: "ADVANCED_RELEASE",
    releaseLabel: "On-site: Advanced Release",
    role: "Health-system capital allocation council",
    action: "Allocate",
    mechanic: "The Red Ledger: fixed capital tokens plus a late credit shock",
    overview:
      "Teams become the Capital Allocation Council for a fictional health system facing aging infrastructure, tight debt capacity, uneven access, workforce gaps, and competing clinical investments. They must decide what the system funds, phases, partners for, redesigns, defers, protects, or closes over five years. The challenge is not to fund everything. It is to make painful choices without treating patients, communities, or staff as spreadsheet entries.",
    whyLegacy: sharedWhy,
    decisionLayers: [
      "Review service-line margin, utilization, quality, workforce, payer, access, debt, and community data.",
      "Construct a five-year portfolio within a hard capital ceiling and financing limit.",
      "Choose among competing opportunities such as behavioral-health capacity, rural emergency stabilization, maternal transfer networks, imaging replacement, oncology expansion, cybersecurity, home-based chronic care, primary-care access, debt reduction, or strategic partnerships.",
      "Explain clinical benefit, equity, opportunity cost, financing structure, risk, and first-year execution.",
    ],
    preparation:
      "Study healthcare finance, capital budgeting, debt and cash concepts, hospital operations, reimbursement, community access, quality measures, and executive communication. The annual health-system type and broad capital challenge are announced in advance. The full financial, clinical, and community packet releases two hours before the summit.",
    experience:
      "Two-hour supervised portfolio build. Teams place finite capital tokens across investment categories and submit a balanced five-year allocation table. Board summit: presentation to clinical, finance, labor, patient, and community stakeholders. Red Ledger shock: a bond downgrade, payer shift, cyberattack, physician exit, major employer closure, or emergency-capacity failure changes borrowing cost or community need. Teams must rebalance the portfolio publicly and defend what they are willing to defer.",
    workProduct:
      "Five-year capital portfolio. Financing plan covering cash, debt, lease, partnership, grant, philanthropy, or staged investment. Clinical-access and equity impact statement. Risk register and first-90-days execution plan. Community and employee board briefing.",
    rubric: [
      { criterion: "Capital-allocation logic and financial viability", points: 30 },
      { criterion: "Clinical benefit, safety, access, and equity", points: 25 },
      { criterion: "Use of data and explicit assumptions", points: 15 },
      { criterion: "Financing strategy and risk management", points: 15 },
      { criterion: "Response to the Red Ledger shock", points: 10 },
      { criterion: "Board communication and team leadership", points: 5 },
    ],
    success:
      "A standout team inhabits the capital allocation council, performs allocate, and uses The Red Ledger to prove the portfolio holds when credit or community need changes.",
    extraRules: [
      "No portfolio is pre-designated as correct. Judges score coherent tradeoffs, data discipline, and viable implementation.",
      "Teams cannot earn top marks by maximizing margin while ignoring essential access, nor by preserving every service without a funding explanation.",
    ],
    judgeStandard: legacyScoring,
    annualExpansion:
      "The annual system can change: rural nonprofit network, pediatric system, safety-net organization, urban academic center, or merger candidate, without weakening the event identity.",
    escalation: sharedEscalation,
  },
  {
    id: "black-box-protocol",
    number: 3,
    name: "Black Box Protocol",
    domain: "Technology, medicine, cybersecurity, clinical evidence, procurement, and ethics",
    formatLabel: "Team-only, 2 to 4 Legacy delegates",
    releaseClass: "ADVANCED_RELEASE",
    releaseLabel: "On-site: Advanced Release",
    role: "Independent clinical technology review board",
    action: "Validate",
    mechanic: "Kill Switch: live incident and deployment-governance drill",
    overview:
      "A hospital system is considering a high-stakes technology, such as sepsis prediction, radiology prioritization, maternal-risk modeling, remote monitoring, medication-error detection, AI documentation, or prior-authorization automation. The product promises savings, speed, and improved detection, but the evidence may be incomplete, biased, non-generalizable, insecure, or incompatible with the real workflow. Teams must decide whether and how the system should deploy it.",
    whyLegacy: sharedWhy,
    decisionLayers: [
      "Technical performance must be separated from clinical usefulness.",
      "Audit validation results, subgroup performance, calibration, data provenance, missingness, workflow fit, privacy, cybersecurity, vendor terms, and financial impact.",
      "Define a deployment scope, human-oversight model, success thresholds, monitoring plan, audit rights, incident protocol, and shutdown authority.",
      "Approve, reject, pilot, restrict, redesign, defer, or replace the technology with a nontechnical alternative.",
    ],
    preparation:
      "Study clinical AI and digital-health evaluation, basic diagnostic-performance concepts, bias, privacy, cybersecurity, interoperability, workflow design, procurement, contracts, and health-system finance. The annual technology class is announced in advance. The full dossier releases two hours before competition.",
    experience:
      "Two-hour supervised technical and clinical review. Teams submit a go, no-go, or conditional-go decision memo and deployment map. The review board hearing tests contract terms, oversight, workflow impacts, and financial assumptions. Kill Switch drill: a false negative, subgroup disparity, cyber incident, vendor acquisition, dashboard outage, clinician work-around, or data-sharing breach. Teams must decide whether to pause, modify, disclose, audit, continue, or terminate deployment, and communicate that decision to patients, clinicians, executives, and the vendor.",
    workProduct:
      "Formal recommendation and rationale. Deployment map and human-in-the-loop workflow. Validation and equity audit plan. Contract redline or procurement memorandum. Financial sensitivity analysis. Incident response and public-facing statement.",
    rubric: [
      { criterion: "Clinical validity and patient safety", points: 25 },
      { criterion: "Technical and data-quality analysis", points: 20 },
      { criterion: "Equity, privacy, cybersecurity, and governance", points: 20 },
      { criterion: "Deployment, workflow, and accountability design", points: 15 },
      { criterion: "Financial, contractual, and procurement reasoning", points: 10 },
      { criterion: "Kill Switch response and stakeholder communication", points: 10 },
    ],
    success:
      "A standout team inhabits the clinical technology review board, performs validate, and uses the Kill Switch to prove the deployment decision holds when the system fails.",
    extraRules: [
      "This event is not a generic AI debate. Teams must make an operational decision and define exact deployment conditions.",
      "A recommendation to reject technology can score at the highest level if the case evidence supports it.",
      "Judges reward teams that recognize when workforce, process redesign, or simpler technology is better than automation.",
    ],
    judgeStandard: legacyScoring,
    annualExpansion: "The annual fact pattern can change completely while retaining the Black Box Protocol structure.",
    escalation: sharedEscalation,
  },
  {
    id: "the-last-mile-accord",
    number: 4,
    name: "The Last Mile Accord",
    domain: "Population health, payer-provider contracting, chronic care, reimbursement, negotiation, and justice",
    formatLabel: "Team-only, 2 to 4 Legacy delegates",
    releaseClass: "ADVANCED_RELEASE",
    releaseLabel: "On-site: Advanced Release",
    role: "Multi-stakeholder payment-design delegation",
    action: "Negotiate",
    mechanic: "The Corridor: closed-door negotiation followed by public arbitration",
    overview:
      "A payer, a physician network, a safety-net hospital, and a patient coalition are trapped in a dispute over a value-based chronic-disease contract. The existing agreement rewards some outcomes but may penalize providers who serve complex patients, underfund social needs, increase administrative burden, or create incentives to avoid high-risk people. Teams must design or arbitrate a durable payment accord that aligns quality, access, risk, accountability, and financial sustainability.",
    whyLegacy: sharedWhy,
    decisionLayers: [
      "Interpret quality metrics, risk adjustment, utilization, patient complexity, shared savings, penalties, care-management costs, pharmacy costs, access protections, and administrative burden.",
      "Decide which outcomes count, who bears downside risk, how patient complexity is adjusted, how disputes are appealed, and how savings or losses are distributed.",
      "Protect against gaming, under-service, cherry-picking, and metric fixation while preserving a financially credible contract.",
    ],
    preparation:
      "Study health insurance and reimbursement, value-based care, risk adjustment, quality measurement, provider incentives, negotiation, chronic-disease management, health equity, and contract design. The broad clinical population and payment domain are announced early. The full data packet and stakeholder mandates release two hours before competition.",
    experience:
      "Two-hour supervised analysis and strategy build. Part I: closed-door negotiation with judges acting as stakeholder representatives. Teams may make offers, concessions, and conditional proposals. Part II: public arbitration hearing where teams defend the proposed contract to an independent panel and patient advocates. The Corridor update introduces an adverse-selection pattern, a quality-metric failure, a new expensive therapy, or a budget shock that requires contract revision.",
    workProduct:
      "Term sheet for the payment accord. Quality and risk-adjustment framework. Patient-access and equity protections. Shared-savings, penalty, and appeals structure. Negotiation log and public arbitration defense.",
    rubric: [
      { criterion: "Payment design and financial logic", points: 25 },
      { criterion: "Clinical quality, access, and equity protections", points: 25 },
      { criterion: "Risk adjustment and incentive analysis", points: 20 },
      { criterion: "Negotiation and stakeholder management", points: 15 },
      { criterion: "Contract feasibility and governance", points: 10 },
      { criterion: "Response to Corridor update", points: 5 },
    ],
    success:
      "A standout team inhabits the payment-design delegation, performs negotiate, and uses The Corridor to prove the accord holds when the contract is shocked.",
    extraRules: [
      "This event is neither a standard debate nor a generic insurance case. Teams must produce negotiated contract language and live concessions.",
      "There may be several valid contracts. Judges score consistency, protections against perverse incentives, and financial realism.",
    ],
    judgeStandard: legacyScoring,
    annualExpansion:
      "Annual versions may focus on diabetes, heart failure, maternal care, behavioral health, oncology navigation, or another chronic or population-health context.",
    escalation: sharedEscalation,
  },
  {
    id: "nightfall-command",
    number: 5,
    name: "Nightfall Command",
    domain: "Clinical operations, incident command, hospital finance, workforce, logistics, and public trust",
    formatLabel: "Team-only, 2 to 4 Legacy delegates",
    releaseClass: "ADVANCED_RELEASE",
    releaseLabel: "On-site: Advanced Release",
    role: "Hospital incident-command executive team",
    action: "Command",
    mechanic: "The Nightfall Clock: escalating real-time crisis injects",
    overview:
      "A hospital must maintain safe care while multiple failures converge. Teams serve as the incident-command executive group for a fictional health system confronting a crisis such as ransomware plus mass casualties, oxygen disruption during a winter storm, neonatal infection concern, supply contamination, behavioral-health surge, medication-system outage, or respiratory demand spike. The event rewards disciplined command, not flashy improvisation.",
    whyLegacy: sharedWhy,
    decisionLayers: [
      "Establish authority, assign functional roles, identify immediate safety threats, allocate beds, staff, supplies, and cash, set service priorities, protect vulnerable patients, communicate internally and externally, and plan recovery.",
      "Each choice creates consequences. Stopping elective care may protect capacity but lose revenue. Using agency staff may preserve coverage but raise cost and handoff risk. Public statements may protect trust or create exposure.",
      "The team must make decisions on a time horizon of 30 minutes, 24 hours, 72 hours, and post-incident recovery.",
    ],
    preparation:
      "Study incident command, hospital operations, clinical continuity, emergency logistics, staffing, bed management, communications, finance, risk, quality improvement, and ethical resource allocation. The broad crisis domain is announced in advance. The full incident packet releases two hours before the simulation.",
    experience:
      "Two-hour supervised initial planning. Round 1 Stabilize: establish command structure and immediate patient-safety actions. Round 2 Escalate: a new clinical, technical, staffing, or supply failure appears. Round 3 Scrutiny: media, regulator, board, labor, or patient advocate challenges the team. Round 4 Recover: teams explain restoration, financial mitigation, accountability, and system redesign. The Nightfall Clock limits response windows and forces clear prioritization.",
    workProduct:
      "30-minute stabilization plan. 24-hour and 72-hour operational plans. Incident-command chart and resource-allocation table. Service-prioritization matrix: continue, modify, defer, transfer, or suspend. Staff, patient, and public communications. Board and CFO financial brief and after-action review.",
    rubric: [
      { criterion: "Immediate patient safety and continuity of care", points: 25 },
      { criterion: "Incident-command structure and leadership", points: 20 },
      { criterion: "Resource allocation and operational feasibility", points: 15 },
      { criterion: "Workforce strategy and staff safety", points: 10 },
      { criterion: "Financial resilience and decision transparency", points: 10 },
      { criterion: "Communication, equity, and public trust", points: 10 },
      { criterion: "Response to escalating injects and recovery plan", points: 10 },
    ],
    success:
      "A standout team inhabits the incident-command executive team, performs command, and uses the Nightfall Clock to prove the hospital can keep care safe as injects escalate.",
    extraRules: [
      "This is deliberately the most interdependent Legacy event. No single student can credibly carry clinical, operations, finance, and communication responsibilities alone.",
      "Judges should score explicit decision logic and responsible adaptation, not whether teams predict every later inject.",
    ],
    judgeStandard: legacyScoring,
    annualExpansion: "The annual scenario may change radically while retaining the Nightfall Command structure.",
    escalation: sharedEscalation,
  },
];

export function getLegacyHandbook(id: string) {
  return legacyEventHandbook.find((event) => event.id === id) || null;
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
    "Core decision layers",
    ...event.decisionLayers.map((layer) => `- ${layer}`),
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
    "Championship rubric. 100 points.",
    event.judgeStandard,
    "",
    legacyEliteNote,
    "",
    rows,
    "",
    event.annualExpansion,
  ].join("\n");
}

export function getAnyHandbook(id: string) {
  return getLegacyHandbook(id);
}
