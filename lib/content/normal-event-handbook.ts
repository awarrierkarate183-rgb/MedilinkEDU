export type ReleaseClass = "STANDARD" | "ADVANCED_RELEASE" | "PREPARATION";
export type EventDomain = "CLINICAL" | "FINANCIAL" | "SYSTEMS";

export type HandbookRubricRow = {
  criterion: string;
  points: number;
};

export type NormalHandbookEntry = {
  id: string;
  number: number;
  name: string;
  domain: EventDomain;
  formatLabel: string;
  releaseClass: ReleaseClass;
  releaseLabel: string;
  role: string;
  action: string;
  mechanic: string;
  overview: string;
  preparation: string;
  experience: string;
  workProduct: string;
  rubric: HandbookRubricRow[];
  success: string;
  extraRules?: string[];
};

export const HANDBOOK_PDF = "/docs/normal-events-handbook.pdf";

export const handbookDesignPurpose =
  "Each regular MediLink event should feel like a different professional world. Events are not distinguished only by topic. Each has a unique student role, primary action, signature mechanic, deliverable, judging environment, and live pressure point.";

export const handbookCoreStandard =
  "A student who enters multiple events should not feel that they repeated the same read-a-case-and-give-a-presentation experience. They should audit, prioritize, trace, investigate, deliberate, debate, design, plan, trade, negotiate, allocate, optimize, diligence, adjudicate, rescue, validate, found, implement, and communicate.";

export const distinctivenessRequirements = [
  { name: "Unique role", meaning: "Students enter a different professional setting." },
  { name: "Unique action verb", meaning: "The central task is different in every event." },
  { name: "Unique signature mechanic", meaning: "A defining live feature such as a shock card, negotiation, evidence wall, token board, incident drill, or press conference." },
  { name: "Unique work product", meaning: "Different outputs: action board, audit worksheet, causal map, ruling, term sheet, and more." },
  { name: "Unique judging environment", meaning: "Judges act as the right stakeholders for that event." },
  { name: "Unique live pressure", meaning: "Students must respond to an event-specific challenge, not only deliver a prepared speech." },
];

export const eventClasses = [
  {
    name: "On-site: Standard",
    before: "Students study the published domain, skills, and sample format.",
    at: "The complete prompt is released at the site. Event-specific work happens under timed supervision.",
  },
  {
    name: "On-site: Advanced Release",
    before: "Students study the published domain in advance.",
    at: "The full confidential packet releases two hours before the judged round in a supervised preparation room.",
  },
  {
    name: "Preparation-based",
    before: "Students receive the specific case or prompt and submission requirements in advance.",
    at: "They present, negotiate, demonstrate, defend, or respond to a live twist in person.",
  },
];

export const integrityRules = [
  "Unless an annual guide expressly permits a specified use, personal devices, internet access, external communication, generative AI, and outside assistance are prohibited during supervised on-site preparation.",
  "Compliance is supported through monitored rooms, device procedures, submitted work products, role documentation, and individual oral questioning.",
  "Automated AI-detector output alone should never determine a penalty.",
  "Use only authorized materials and follow all monitored-preparation instructions.",
  "Ground all claims in the event packet or clearly labeled assumptions.",
  "Every team member must understand the full recommendation and may be questioned individually.",
  "The annual event guide may specify exact submission deadlines, room procedures, equipment, and permitted reference materials.",
  "All scenarios are fictional and educational. Competitors must not present themselves as licensed clinicians or give real-person medical advice.",
];

export const universalScoring =
  "Every event uses a 100-point rubric. High-scoring work is accurate, case-specific, feasible, ethically aware, transparent about uncertainty, and resilient under questioning. Judges score substance and reasoning over aesthetic polish. A material safety error, fabricated evidence, prohibited assistance, or failure to meet required deliverables may result in deductions or formal review.";

export const normalEventHandbook: NormalHandbookEntry[] = [
  {
    id: "triage-protocol",
    number: 1,
    name: "Medical Triage",
    domain: "CLINICAL",
    formatLabel: "Solo or team, 1 to 5",
    releaseClass: "ADVANCED_RELEASE",
    releaseLabel: "On-site: Advanced Release",
    role: "Emergency clinical-prioritization team",
    action: "Prioritize",
    mechanic: "Evolving patient-status board",
    overview:
      "Students receive a fictional acute-care scenario with symptoms, vitals, laboratory or imaging findings, operational constraints, and progressively released updates. Their task is to establish the safest order of action, not merely name a diagnosis, and explain why each step occurs now, later, or not at all.",
    preparation:
      "Study clinical reasoning, triage frameworks, patient safety, escalation, and interpretation of basic fictional diagnostic data. The broad annual domain is announced early. The complete case is released in a supervised room two hours before the judged round.",
    experience:
      "Teams build a one-page action board. During the round, staff release two or three new updates, such as worsening vital signs, a medication allergy, bed unavailability, or transport delay. Teams must visibly reorder priorities and defend the change.",
    workProduct: "Prioritized action board; evidence/risk map; escalation plan; oral defense.",
    rubric: [
      { criterion: "Safety and prioritization", points: 35 },
      { criterion: "Evidence interpretation", points: 25 },
      { criterion: "Adaptation to live changes", points: 15 },
      { criterion: "Feasibility and escalation", points: 15 },
      { criterion: "Individual oral defense", points: 10 },
    ],
    success:
      "A standout entry inhabits the emergency clinical-prioritization team, performs prioritize, and uses the evolving patient-status board to prove the reasoning holds when conditions change.",
  },
  {
    id: "the-chart-room",
    number: 2,
    name: "Chart Audit",
    domain: "CLINICAL",
    formatLabel: "Solo-only",
    releaseClass: "STANDARD",
    releaseLabel: "On-site: Standard",
    role: "Patient-safety chart auditor",
    action: "Audit",
    mechanic: "Line-by-line error hunt",
    overview:
      "Competitors act as documentation and patient-safety auditors. A fictional chart contains material inconsistencies, omissions, unsafe abbreviations, medication or allergy conflicts, date errors, or documentation weaknesses that could affect care, billing, privacy, or continuity.",
    preparation:
      "Study medical terminology, chart structures, safe documentation practices, patient-safety concepts, privacy, and basic billing and reimbursement vocabulary. The chart is confidential until the event.",
    experience:
      "Students complete a timed, line-referenced audit. Every claimed issue must identify the exact chart evidence, likely consequence, and appropriate correction. Finalists may defend one disputed finding in a short interview.",
    workProduct: "Completed audit worksheet; ranked issue list; consequence-and-correction rationale.",
    rubric: [
      { criterion: "Accuracy of material findings", points: 40 },
      { criterion: "Patient-safety impact", points: 25 },
      { criterion: "Documentation and terminology reasoning", points: 20 },
      { criterion: "Billing, privacy, or continuity analysis", points: 10 },
      { criterion: "Clarity and completeness", points: 5 },
    ],
    success:
      "A standout entry inhabits the patient-safety chart auditor, performs audit, and uses the line-by-line error hunt to prove the reasoning holds when conditions change.",
  },
  {
    id: "system-failure",
    number: 3,
    name: "Disease Pathway",
    domain: "CLINICAL",
    formatLabel: "Solo or team, 1 to 5",
    releaseClass: "STANDARD",
    releaseLabel: "On-site: Standard",
    role: "Physiology systems analyst",
    action: "Trace",
    mechanic: "Causal-cascade mapping board",
    overview:
      "A fictional physiologic system breaks down. Competitors trace the cascade from initiating event to compensatory changes, organ-level effects, clinical deterioration, intervention priorities, and care-resource impact. This is a systems-mapping challenge, not a rapid triage contest.",
    preparation:
      "Study anatomy, physiology, pathophysiology, disease pathways, and basic implications of complications for beds, testing, staffing, and cost. The annual system focus may be announced. The case is released on-site.",
    experience:
      "Competitors construct a visual cascade map with arrows, decision points, and clinical consequences. Judges interrupt at selected links and ask what evidence supports that connection and what would break the cascade.",
    workProduct: "Causal map; intervention nodes; clinical and operations impact summary; oral explanation.",
    rubric: [
      { criterion: "Physiologic accuracy and causal logic", points: 35 },
      { criterion: "Depth of cascade analysis", points: 25 },
      { criterion: "Intervention reasoning", points: 20 },
      { criterion: "Healthcare-resource connection", points: 10 },
      { criterion: "Visual clarity and oral defense", points: 10 },
    ],
    success:
      "A standout entry inhabits the physiology systems analyst, performs trace, and uses the causal-cascade mapping board to prove the reasoning holds when conditions change.",
  },
  {
    id: "patient-zero",
    number: 4,
    name: "Outbreak Investigation",
    domain: "CLINICAL",
    formatLabel: "Solo or team, 1 to 5",
    releaseClass: "ADVANCED_RELEASE",
    releaseLabel: "On-site: Advanced Release",
    role: "Outbreak investigation unit",
    action: "Investigate",
    mechanic: "Physical evidence wall and outbreak map",
    overview:
      "Competitors investigate a fictional outbreak through case records, timelines, maps, exposure histories, laboratory data, and population statistics. They determine the most plausible source and transmission pathway, then propose a proportional response under resource and trust constraints.",
    preparation:
      "Study epidemiology, outbreak methods, epidemic curves, attack rates, surveillance, communication, and response planning. The full outbreak packet releases two hours before the round.",
    experience:
      "Teams assemble an evidence wall connecting people, places, exposures, and time. They issue a command briefing, then receive a new lab result or exposure record that may require the hypothesis to change.",
    workProduct: "Source and transmission hypothesis; evidence wall or map; response plan; communications and resource summary.",
    rubric: [
      { criterion: "Use of epidemiologic evidence", points: 30 },
      { criterion: "Source and transmission reasoning", points: 20 },
      { criterion: "Containment and implementation plan", points: 20 },
      { criterion: "Adaptation to new evidence", points: 15 },
      { criterion: "Equity, ethics, and public trust", points: 10 },
      { criterion: "Communication quality", points: 5 },
    ],
    success:
      "A standout entry inhabits the outbreak investigation unit, performs investigate, and uses the evidence wall and outbreak map to prove the reasoning holds when conditions change.",
  },
  {
    id: "under-review",
    number: 5,
    name: "Research Review",
    domain: "CLINICAL",
    formatLabel: "Team-only, 2 to 5",
    releaseClass: "ADVANCED_RELEASE",
    releaseLabel: "On-site: Advanced Release",
    role: "Biomedical peer-review committee",
    action: "Peer-review",
    mechanic: "Confidential journal decision hearing",
    overview:
      "Teams receive a fictional biomedical paper, trial report, or evidence dossier with a consequential methodological, statistical, ethical, reporting, or interpretation problem. They decide whether the work should be accepted, revised, rejected, replicated, restricted, or deferred.",
    preparation:
      "Study study design, bias, basic statistics, evidence hierarchies, clinical research ethics, conflicts of interest, and scientific communication. The complete paper packet is released two hours before the hearing.",
    experience:
      "Teams prepare a structured peer-review memorandum and issue a formal committee ruling. Judges conduct a journal-editor hearing in which each member must defend a particular claim, limitation, or recommendation.",
    workProduct: "Peer-review memorandum; decision statement; evidence audit; proposed corrective or next-study plan.",
    rubric: [
      { criterion: "Identification of consequential flaws", points: 35 },
      { criterion: "Methodological and statistical reasoning", points: 25 },
      { criterion: "Ethics and integrity analysis", points: 15 },
      { criterion: "Quality of ruling and next steps", points: 15 },
      { criterion: "Committee defense and role mastery", points: 10 },
    ],
    success:
      "A standout entry inhabits the biomedical peer-review committee, performs peer-review, and uses the confidential journal decision hearing to prove the reasoning holds when conditions change.",
  },
  {
    id: "the-gray-area",
    number: 6,
    name: "Medical Ethics",
    domain: "CLINICAL",
    formatLabel: "Solo or team, 1 to 5",
    releaseClass: "STANDARD",
    releaseLabel: "On-site: Standard",
    role: "Clinical ethics committee",
    action: "Deliberate",
    mechanic: "Stakeholder testimony and written ruling",
    overview:
      "Competitors receive a difficult healthcare dilemma involving consent, privacy, scarce resources, end-of-life care, AI, disability rights, family conflict, or equitable access. They must reach a concrete recommendation, openly identify the harm it may cause, and establish safeguards.",
    preparation:
      "Study ethical frameworks, consent, privacy, equity, institutional decision-making, and respectful healthcare communication. The scenario is released at the event.",
    experience:
      "After analysis, competitors hear short fictional stakeholder statements. They issue a written ruling and defend it before an ethics-chair panel. The event does not use assigned opposing sides. It tests deliberation and accountable decision-making.",
    workProduct: "Decision and ruling; stakeholder-impact matrix; safeguards and communication plan; oral defense.",
    rubric: [
      { criterion: "Ethical reasoning and stakeholder analysis", points: 35 },
      { criterion: "Defensibility of the recommendation", points: 25 },
      { criterion: "Equity and unintended-effects analysis", points: 15 },
      { criterion: "Safeguards and practical implementation", points: 15 },
      { criterion: "Communication and response", points: 10 },
    ],
    success:
      "A standout entry inhabits the clinical ethics committee, performs deliberate, and uses stakeholder testimony and a written ruling to prove the reasoning holds when conditions change.",
  },
  {
    id: "the-floor",
    number: 7,
    name: "Health Policy Debate",
    domain: "SYSTEMS",
    formatLabel: "Team-only, 2 to 5",
    releaseClass: "ADVANCED_RELEASE",
    releaseLabel: "On-site: Advanced Release",
    role: "Legislative and policy advocacy team",
    action: "Debate",
    mechanic: "Formal hearing with cross-examination and amendment round",
    overview:
      "Teams argue assigned affirmative or negative positions on a healthcare-policy resolution. They must show how the proposal would work, who benefits or bears risk, what it costs, and how implementation would occur. This is adversarial policy advocacy, not an ethics committee discussion.",
    preparation:
      "Study the announced policy domain, health-system financing, access, implementation, evidence use, and rebuttal. The official resolution, assigned side, evidence packet, and amendment details release two hours before competition.",
    experience:
      "The event includes opening advocacy, evidence presentation, cross-examination, rebuttal, an amendment or fiscal-impact round, and closing. Every member must hold a visible role such as lead advocate, evidence analyst, cross-examiner, or closing strategist.",
    workProduct: "Evidence outline; formal debate performance; amendment response; closing recommendation.",
    rubric: [
      { criterion: "Policy and evidence analysis", points: 25 },
      { criterion: "Medical, access, and equity impact", points: 20 },
      { criterion: "Financial and implementation analysis", points: 20 },
      { criterion: "Rebuttal and cross-examination", points: 20 },
      { criterion: "Team role execution", points: 10 },
      { criterion: "Professionalism", points: 5 },
    ],
    success:
      "A standout entry inhabits the legislative and policy advocacy team, performs debate, and uses the formal hearing with cross-examination and amendment round to prove the reasoning holds when conditions change.",
  },
  {
    id: "pitch-day",
    number: 8,
    name: "Solution Design",
    domain: "SYSTEMS",
    formatLabel: "Solo or team, 1 to 5",
    releaseClass: "PREPARATION",
    releaseLabel: "Preparation-based",
    role: "Healthcare solution designer",
    action: "Design",
    mechanic: "Demonstration, prototype, workflow, or storyboard requirement",
    overview:
      "Competitors develop a solution for deployment inside an existing hospital, clinic, payer, nonprofit, school, or public-health program. Entries may be workflows, services, apps, devices, navigation systems, quality-improvement tools, or interventions, but must demonstrate a real operational path, not just an idea.",
    preparation:
      "The problem area and submission rules are released before competition. Students research need, build a solution, test or refine it where appropriate, and prepare a practical implementation plan. Safe mockups, workflow demonstrations, and storyboards are encouraged. No unapproved human testing is allowed.",
    experience:
      "At competition, teams demonstrate how the solution works, pitch the implementing organization, and respond to an adoption barrier such as budget reduction, staff resistance, privacy concern, or patient-access complication.",
    workProduct: "Solution brief; implementation roadmap; demonstration, prototype, or workflow; budget; impact metrics; live defense.",
    rubric: [
      { criterion: "Need and user definition", points: 20 },
      { criterion: "Solution quality and usability", points: 25 },
      { criterion: "Clinical and public-health value", points: 15 },
      { criterion: "Implementation and operational feasibility", points: 20 },
      { criterion: "Financial sustainability and metrics", points: 10 },
      { criterion: "Demonstration and defense", points: 10 },
    ],
    success:
      "A standout entry inhabits the healthcare solution designer, performs design, and uses a demonstration, prototype, workflow, or storyboard to prove the reasoning holds when conditions change.",
  },
  {
    id: "the-ledger",
    number: 9,
    name: "Healthcare Budgeting",
    domain: "FINANCIAL",
    formatLabel: "Solo-only",
    releaseClass: "STANDARD",
    releaseLabel: "On-site: Standard",
    role: "Household financial planner",
    action: "Plan",
    mechanic: "Budget board with unexpected expense cards",
    overview:
      "Competitors manage a fictional individual or household facing healthcare-related financial choices involving income, insurance, deductibles, debt, emergency savings, treatment costs, risk, and competing obligations. The goal is a sustainable and humane plan, not simply the lowest short-term expense.",
    preparation:
      "Study budgeting, insurance fundamentals, debt, savings, risk, consumer choices, and healthcare affordability. The household scenario is released at the event.",
    experience:
      "Competitors create a budget and decision plan, then draw an unexpected event card, such as a job loss, emergency visit, coverage change, or medication cost increase, and revise their strategy.",
    workProduct: "Budget worksheet; coverage and care decision; risk and savings plan; revision rationale.",
    rubric: [
      { criterion: "Calculation accuracy and case reading", points: 30 },
      { criterion: "Financial decision quality", points: 30 },
      { criterion: "Healthcare-access and human-impact reasoning", points: 20 },
      { criterion: "Response to unexpected expense", points: 15 },
      { criterion: "Clarity and completeness", points: 5 },
    ],
    success:
      "A standout entry inhabits the household financial planner, performs plan, and uses the budget board with unexpected expense cards to prove the reasoning holds when conditions change.",
  },
  {
    id: "market-call",
    number: 10,
    name: "Market Analysis",
    domain: "FINANCIAL",
    formatLabel: "Solo or team, 1 to 5",
    releaseClass: "STANDARD",
    releaseLabel: "On-site: Standard",
    role: "Investment desk analyst",
    action: "Trade",
    mechanic: "Live market-shock ticker",
    overview:
      "Competitors receive a fictional market mandate and newly released market or company information. They develop an investment view, allocation, or strategic position, name their catalysts and risks, and defend the call. The result is scored on reasoning at the time of decision, not hindsight performance.",
    preparation:
      "Study financial statements, valuation, risk and return, portfolios, market structure, macroeconomic signals, and healthcare-sector drivers where applicable. The case data are confidential until competition.",
    experience:
      "After timed analysis, competitors make a recorded call. A live market-shock ticker then releases a policy change, earnings surprise, competitor action, or macroeconomic event. Competitors must hold, hedge, exit, or revise, and explain why.",
    workProduct: "Investment thesis; allocation or position; risk plan; post-shock update; oral defense.",
    rubric: [
      { criterion: "Data interpretation and analysis", points: 30 },
      { criterion: "Thesis and strategic coherence", points: 25 },
      { criterion: "Risk management and assumptions", points: 20 },
      { criterion: "Response to market shock", points: 15 },
      { criterion: "Communication and questioning", points: 10 },
    ],
    success:
      "A standout entry inhabits the investment desk analyst, performs trade, and uses the live market-shock ticker to prove the reasoning holds when conditions change.",
    extraRules: [
      "Financial analysis is educational and simulation-based. It is not personal investment advice or a real solicitation of capital.",
    ],
  },
  {
    id: "the-term-sheet",
    number: 11,
    name: "Deal Negotiation",
    domain: "FINANCIAL",
    formatLabel: "Team-only, 2 to 5",
    releaseClass: "PREPARATION",
    releaseLabel: "Preparation-based",
    role: "Deal team: investor, lender, or corporate finance adviser",
    action: "Negotiate",
    mechanic: "Live founder, investor, or lender negotiation",
    overview:
      "Teams receive a company and financing context in advance. They recommend funding structure and terms based on valuation, capital needs, dilution, control, milestones, downside protection, and intended use of proceeds. The core event is negotiation, not spreadsheet display.",
    preparation:
      "Students receive the company dossier and rules before competition. Teams prepare a financing memorandum, draft term sheet, and negotiation strategy grounded in the company's facts and sector risks.",
    experience:
      "Teams first present their proposed deal. A judge role-playing founder, investor, lender, or board representative then negotiates valuation, control, milestones, covenant, liquidation, or timing points. A late performance update forces a revised offer or walk-away decision.",
    workProduct: "Investment memorandum; draft term sheet; financial assumptions; negotiation strategy; final deal rationale.",
    rubric: [
      { criterion: "Financial and valuation logic", points: 30 },
      { criterion: "Term quality and risk allocation", points: 25 },
      { criterion: "Strategic use of proceeds", points: 15 },
      { criterion: "Negotiation execution", points: 20 },
      { criterion: "Adaptation and team command", points: 10 },
    ],
    success:
      "A standout entry inhabits the deal team, performs negotiate, and uses the live founder, investor, or lender negotiation to prove the reasoning holds when conditions change.",
    extraRules: [
      "Financial analysis is educational and simulation-based. It is not personal investment advice or a real solicitation of capital.",
    ],
  },
  {
    id: "scarcity",
    number: 12,
    name: "Resource Allocation",
    domain: "FINANCIAL",
    formatLabel: "Solo or team, 1 to 5",
    releaseClass: "STANDARD",
    releaseLabel: "On-site: Standard",
    role: "Healthcare resource-allocation analyst",
    action: "Allocate",
    mechanic: "Finite-budget token board",
    overview:
      "Competitors confront a health-system or policy scenario in which demand exceeds available funding, capacity, workforce, medication, or service access. They allocate a visibly limited set of resources and explain the economic incentives, patient consequences, and safeguards behind each choice.",
    preparation:
      "Study healthcare economics, supply and demand, insurance, incentives, market failures, regulation, externalities, and access. The specific allocation problem releases at competition.",
    experience:
      "Teams receive a finite budget or token board. Each allocation to one program visibly prevents allocation elsewhere. A mid-round change in demand, reimbursement, or supply requires reallocation and a transparent explanation of what must be delayed, protected, or redesigned.",
    workProduct: "Allocation board; economic analysis; access and equity safeguards; revised plan after shock.",
    rubric: [
      { criterion: "Economic and incentive analysis", points: 30 },
      { criterion: "Allocation quality and tradeoff transparency", points: 25 },
      { criterion: "Access, equity, and patient outcomes", points: 20 },
      { criterion: "Fiscal and operational feasibility", points: 15 },
      { criterion: "Adaptation and oral defense", points: 10 },
    ],
    success:
      "A standout entry inhabits the healthcare resource-allocation analyst, performs allocate, and uses the finite-budget token board to prove the reasoning holds when conditions change.",
  },
  {
    id: "operating-margin",
    number: 13,
    name: "Clinic Operations",
    domain: "FINANCIAL",
    formatLabel: "Team-only, 2 to 5",
    releaseClass: "PREPARATION",
    releaseLabel: "Preparation-based",
    role: "Service-line or clinic optimization team",
    action: "Optimize",
    mechanic: "Operations dashboard and constraint round",
    overview:
      "Teams receive a defined hospital or clinic operational problem in advance, such as bottlenecks, staffing, denied claims, revenue leakage, avoidable utilization, quality costs, or service-line pressure. Unlike Hospital Recovery, this event targets one operating system and requires a measurable improvement plan.",
    preparation:
      "The organization packet, metrics, and decision question are released before competition. Teams build a focused plan supported by data, financial assumptions, workflow redesign, quality safeguards, and implementation metrics.",
    experience:
      "Teams present to an operations committee using a dashboard. Judges then impose a constraint: fewer staff, a budget cut, a payer rule, a capacity limit, or a quality threshold. Teams must protect the core plan or deliberately redesign it.",
    workProduct:
      "Problem diagnosis; dashboard; operating and financial plan; implementation timeline; quality and access safeguards; revised constraint response.",
    rubric: [
      { criterion: "Data-based problem diagnosis", points: 25 },
      { criterion: "Financial sustainability", points: 25 },
      { criterion: "Patient quality and access protection", points: 20 },
      { criterion: "Operational feasibility", points: 20 },
      { criterion: "Constraint response and defense", points: 10 },
    ],
    success:
      "A standout entry inhabits the service-line or clinic optimization team, performs optimize, and uses the operations dashboard and constraint round to prove the reasoning holds when conditions change.",
  },
  {
    id: "the-pipeline",
    number: 14,
    name: "Biotech Review",
    domain: "FINANCIAL",
    formatLabel: "Solo or team, 1 to 5",
    releaseClass: "PREPARATION",
    releaseLabel: "Preparation-based",
    role: "Biotech and pharma due-diligence committee",
    action: "Diligence",
    mechanic: "Investment committee with late clinical or patent update",
    overview:
      "Competitors assess whether a fictional biotechnology or pharmaceutical opportunity can succeed scientifically and commercially. They examine clinical evidence, trial risk, patent life, manufacturing, regulation, pricing, reimbursement, competition, capital needs, and launch strategy.",
    preparation:
      "The company dossier and therapeutic domain release before competition. Competitors research the area, complete a diligence analysis, and prepare a recommendation with scenarios and key assumptions.",
    experience:
      "Teams deliver an investment-committee recommendation. During questioning, they receive a new trial endpoint result, patent challenge, reimbursement decision, manufacturing issue, or competitor entry that forces a funding, valuation, partnership, or launch revision.",
    workProduct: "Diligence report; clinical-to-commercial assessment; risk matrix; scenario model; recommendation and live revision.",
    rubric: [
      { criterion: "Clinical and scientific interpretation", points: 20 },
      { criterion: "Commercial, regulatory, and reimbursement analysis", points: 25 },
      { criterion: "Financial logic and risk modeling", points: 25 },
      { criterion: "Strategic recommendation", points: 20 },
      { criterion: "Response to late update", points: 10 },
    ],
    success:
      "A standout entry inhabits the biotech and pharma due-diligence committee, performs diligence, and uses the late clinical or patent update to prove the reasoning holds when conditions change.",
    extraRules: [
      "Financial analysis is educational and simulation-based. It is not personal investment advice or a real solicitation of capital.",
    ],
  },
  {
    id: "claim-denied",
    number: 15,
    name: "Insurance Appeals",
    domain: "FINANCIAL",
    formatLabel: "Solo or team, 1 to 5",
    releaseClass: "STANDARD",
    releaseLabel: "On-site: Standard",
    role: "Claims appeal and adjudication panel",
    action: "Adjudicate",
    mechanic: "Two-chair payer and patient hearing",
    overview:
      "Competitors receive a fictional denied claim, policy language, medical record, coding and billing context, and appeal facts. They must accurately articulate both the patient-access case and payer-administration rationale before issuing a fair, evidence-based resolution.",
    preparation:
      "Study coverage design, reimbursement, medical-necessity review, appeals, documentation, coding context, patient access, and ethical decision-making. The case is released on-site.",
    experience:
      "Competitors first prepare separate patient and payer analyses. At the hearing, two judges represent those perspectives and challenge the proposed resolution. A late document or policy clarification may alter the outcome.",
    workProduct: "Claim analysis; patient and payer comparison; adjudication decision; appeals and process improvement recommendation.",
    rubric: [
      { criterion: "Case and coverage interpretation", points: 25 },
      { criterion: "Clinical evidence and appropriateness", points: 20 },
      { criterion: "Fairness and access reasoning", points: 20 },
      { criterion: "Financial and administrative defensibility", points: 20 },
      { criterion: "Hearing performance and resolution clarity", points: 15 },
    ],
    success:
      "A standout entry inhabits the claims appeal and adjudication panel, performs adjudicate, and uses the two-chair payer and patient hearing to prove the reasoning holds when conditions change.",
  },
  {
    id: "the-turnaround",
    number: 16,
    name: "Hospital Recovery",
    domain: "SYSTEMS",
    formatLabel: "Team-only, 2 to 5",
    releaseClass: "PREPARATION",
    releaseLabel: "Preparation-based",
    role: "Executive leadership team",
    action: "Rescue",
    mechanic: "Multi-round boardroom rescue simulation",
    overview:
      "Teams take over a failing healthcare organization facing interlocking problems in finance, staffing, quality, access, governance, and public confidence. This is an enterprise rescue, not a single workflow optimization. Teams must choose a strategic direction and protect essential care while restoring viability.",
    preparation:
      "The organization dossier and turnaround mandate are released before competition. Teams prepare a board-ready stabilization and multi-year recovery plan with financial, workforce, quality, communications, and governance components.",
    experience:
      "The boardroom simulation has multiple rounds: initial strategy, hostile board questions, a new crisis such as a payer shift or safety incident, and a final recovery and accountability briefing. Teams must show what they will change, what they will protect, and what they will stop doing.",
    workProduct: "Root-cause diagnosis; stabilization plan; multi-year strategy; financial, workforce, and quality plan; risk register; updated response.",
    rubric: [
      { criterion: "Strategic diagnosis and coherence", points: 20 },
      { criterion: "Quality, safety, and access protection", points: 20 },
      { criterion: "Financial and operational resilience", points: 20 },
      { criterion: "Workforce and governance plan", points: 15 },
      { criterion: "Implementation and risk management", points: 15 },
      { criterion: "Live executive adaptation", points: 10 },
    ],
    success:
      "A standout entry inhabits the executive leadership team, performs rescue, and uses the multi-round boardroom rescue simulation to prove the reasoning holds when conditions change.",
  },
  {
    id: "signal-vs-noise",
    number: 17,
    name: "Digital Health Review",
    domain: "SYSTEMS",
    formatLabel: "Solo or team, 1 to 5",
    releaseClass: "STANDARD",
    releaseLabel: "On-site: Standard",
    role: "Clinical technology review board",
    action: "Validate",
    mechanic: "Technology approval gate and incident drill",
    overview:
      "Competitors assess a fictional AI or digital-health product for true clinical, operational, and financial value. They distinguish good marketing from credible evidence by reviewing validation data, subgroup performance, workflow fit, privacy, cybersecurity, cost, adoption, and governance.",
    preparation:
      "Study digital-health evaluation, AI limitations, clinical evidence, bias, privacy, interoperability, cybersecurity, workflows, and business models. The product dossier is released at competition.",
    experience:
      "Teams run a formal approval gate: approve, pilot, restrict, redesign, reject, or defer. They must define conditions and monitoring thresholds. Then an incident drill reveals a false negative, subgroup disparity, outage, data-sharing concern, or clinician work-around.",
    workProduct: "Technology decision; evidence audit; deployment and oversight conditions; incident response; financial and operational assessment.",
    rubric: [
      { criterion: "Clinical value and patient safety", points: 25 },
      { criterion: "Data, evidence, and limitation analysis", points: 20 },
      { criterion: "Equity, privacy, and governance", points: 20 },
      { criterion: "Operational and financial feasibility", points: 20 },
      { criterion: "Approval conditions and incident response", points: 15 },
    ],
    success:
      "A standout entry inhabits the clinical technology review board, performs validate, and uses the technology approval gate and incident drill to prove the reasoning holds when conditions change.",
  },
  {
    id: "seed-round",
    number: 18,
    name: "Healthcare Startup",
    domain: "SYSTEMS",
    formatLabel: "Solo or team, 1 to 5",
    releaseClass: "PREPARATION",
    releaseLabel: "Preparation-based",
    role: "Healthcare startup founding team",
    action: "Found",
    mechanic: "Investor due-diligence gauntlet",
    overview:
      "Competitors build an independent healthcare venture with a defined customer, unmet need, business model, revenue logic, funding ask, milestones, and responsible-growth plan. Unlike Solution Design, Healthcare Startup asks whether a new company deserves capital and can become sustainable.",
    preparation:
      "The event prompt and submission rules release in advance. Teams validate the problem, develop the company model, build financial assumptions, identify competitors and risks, and submit venture materials before competition.",
    experience:
      "Teams pitch investors, then face a due-diligence gauntlet on market size, price, unit economics, clinical evidence, privacy, regulation, competition, and funding use. Judges may challenge one core assumption, requiring a revised path or a reasoned defense.",
    workProduct: "Executive summary; pitch deck; financial model; funding ask and use of funds; milestones; risk and impact plan.",
    rubric: [
      { criterion: "Problem-market fit and validation", points: 20 },
      { criterion: "Business model and financial logic", points: 25 },
      { criterion: "Innovation and competitive strategy", points: 20 },
      { criterion: "Responsible feasibility and growth", points: 15 },
      { criterion: "Funding strategy and milestones", points: 10 },
      { criterion: "Investor defense", points: 10 },
    ],
    success:
      "A standout entry inhabits the healthcare startup founding team, performs found, and uses the investor due-diligence gauntlet to prove the reasoning holds when conditions change.",
    extraRules: [
      "Financial analysis is educational and simulation-based. It is not personal investment advice or a real solicitation of capital.",
    ],
  },
  {
    id: "borders-and-budgets",
    number: 19,
    name: "Global Health",
    domain: "SYSTEMS",
    formatLabel: "Solo or team, 1 to 5",
    releaseClass: "PREPARATION",
    releaseLabel: "Preparation-based",
    role: "Contextual health-implementation team",
    action: "Implement",
    mechanic: "Geographic implementation board and logistics shock",
    overview:
      "Competitors receive a specified country or region and health challenge in advance. They design a response grounded in disease burden, local infrastructure, workforce, culture, supply chains, governance, financing, affordability, and community partnership. The central test is implementability in context.",
    preparation:
      "The setting, health challenge, baseline data, and rules are released before competition. Teams research responsibly, declare assumptions, develop a budget and phased implementation plan, and submit materials.",
    experience:
      "Teams present at an implementation board. A logistics shock, such as weather, supply interruption, funding cut, policy change, workforce departure, or changing disease burden, requires teams to protect core services and revise sequencing.",
    workProduct: "Context analysis; fixed-budget allocation; partnership and implementation roadmap; metrics; sustainability plan; live revision.",
    rubric: [
      { criterion: "Contextual accuracy and needs analysis", points: 20 },
      { criterion: "Clinical and public-health impact", points: 20 },
      { criterion: "Budget logic and allocation", points: 20 },
      { criterion: "Local feasibility and sustainability", points: 25 },
      { criterion: "Equity, ethics, and risk response", points: 10 },
      { criterion: "Communication", points: 5 },
    ],
    success:
      "A standout entry inhabits the contextual health-implementation team, performs implement, and uses the geographic implementation board and logistics shock to prove the reasoning holds when conditions change.",
  },
  {
    id: "on-record",
    number: 20,
    name: "Crisis Communications",
    domain: "SYSTEMS",
    formatLabel: "Team-only, 2 to 5",
    releaseClass: "PREPARATION",
    releaseLabel: "Preparation-based",
    role: "Health crisis communications team",
    action: "Communicate",
    mechanic: "Live press room and misinformation escalation",
    overview:
      "Teams prepare an evidence-based response to a fictional health misinformation, patient-trust, product-safety, outbreak, privacy, or organizational-confidence crisis. They must communicate accurately and humanely while aligning messages with an actual operational response. The event rewards trustworthy action, not public-relations polish alone.",
    preparation:
      "The initial scenario and submission rules release in advance. Teams create a communications strategy, stakeholder map, message architecture, selected materials, and escalation plan before competition.",
    experience:
      "At competition, teams conduct a press briefing and stakeholder briefing. Judges act as reporters, patients, staff, advocates, and board members. A live rumor, data correction, video clip, or affected-community concern tests whether the team can correct course without losing credibility.",
    workProduct: "Audience map; core messages; channel and timing strategy; misinformation protocol; selected materials; live briefing and update.",
    rubric: [
      { criterion: "Accuracy, evidence, and transparency", points: 25 },
      { criterion: "Audience strategy and accessibility", points: 20 },
      { criterion: "Operational integration and feasibility", points: 20 },
      { criterion: "Trust, ethics, and equity", points: 15 },
      { criterion: "Adaptation to escalation", points: 10 },
      { criterion: "Team communication", points: 10 },
    ],
    success:
      "A standout entry inhabits the health crisis communications team, performs communicate, and uses the live press room and misinformation escalation to prove the reasoning holds when conditions change.",
  },
];

export function getNormalHandbook(id: string) {
  return normalEventHandbook.find((event) => event.id === id) || null;
}

export function handbookInstructionsBody(event: NormalHandbookEntry) {
  return [
    event.name,
    `Student role: ${event.role}`,
    `Primary action: ${event.action}`,
    `Signature mechanic: ${event.mechanic}`,
    `Class: ${event.releaseLabel}`,
    `Format: ${event.formatLabel}`,
    "",
    event.overview,
    "",
    "Preparation before competition",
    event.preparation,
    "",
    "Competition experience",
    event.experience,
    "",
    "Required work product",
    event.workProduct,
    "",
    "Student success standard",
    event.success,
    "",
    "Rules and boundaries",
    ...integrityRules.map((rule) => `- ${rule}`),
    ...(event.extraRules || []).map((rule) => `- ${rule}`),
  ].join("\n");
}

export function handbookRubricBody(event: NormalHandbookEntry) {
  const rows = event.rubric.map((row) => `${row.criterion}: ${row.points} points`).join("\n");
  return [
    `${event.name} rubric. 100 points.`,
    universalScoring,
    "",
    rows,
    "",
    "Judge standard for every criterion: specific, evidence-based, feasible, and responsive to the event's unique role, live mechanic, and case constraints.",
  ].join("\n");
}
