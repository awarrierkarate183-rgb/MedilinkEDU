import { MISSION, VISION } from "@/lib/constants";

export const aims = [
  "Train students to apply the three-lens framework to real health-system problems.",
  "Grow a nationwide chapter network with a shared officer structure, curriculum, and starter kit.",
  "Run twenty Normal Events and five Legacy Events each season, plus a biennial Apex and a separate individual invitational.",
  "Connect members with clinical, finance, and health-tech partners for shadowing, internships, and research.",
  "Give students titles, projects, and competition experience that transfer to college and career.",
  "Give back through chapter service and outreach.",
];

export const lenses = [
  {
    id: "clinical",
    name: "Clinical",
    question: "What is the actual health problem, and who is affected?",
    summary: "Name the condition, the people, and the gap in care.",
    body: "Name the condition, the patients or communities, and the gap in care. Who is left out, and why. Rural distance, uninsured families, delayed diagnosis, language access, and wait times are examples of gaps, not a complete list. If you cannot point to a person or a community, you have a theme, not a clinical problem.",
    note: "This lens is not a license to practice. Members do not treat patients from a club meeting. Packets still use the internal name Care.",
  },
  {
    id: "financial",
    name: "Financial",
    question: "Who pays, what it costs, and whether it lasts.",
    summary: "Cost, coverage, and whether the idea lasts.",
    body: "Insurance, hospital billing, premiums, deductibles, employer coverage, public programs, and grants belong here. If the money path fails, the clinical idea stays on the page. A team that cannot say who writes the check has not finished the case.",
    note: "The Finance and Treasury Lead owns Track 3. Packets still use the internal name Cost.",
  },
  {
    id: "technology",
    name: "Technology",
    question: "How data, software, or infrastructure changes access.",
    summary: "Records, tools, and infrastructure. Outcome over novelty.",
    body: "Records, telehealth, devices, or a simple tool. The test is outcome, not novelty. A finished product is not required. Coding background is not required to take Track 2. If the answer is only that the idea is new, it is not yet a technology solution.",
    note: "The Technology Lead owns Track 2. Packets still use the internal name Code.",
  },
];

export const experienceSteps = [
  { title: "Join a chapter", body: "Membership is chapter-based. You join a school, not a generic website account." },
  { title: "Learn", body: "Four tracks and twelve modules. Titles are public. Full lessons wait behind roster approval." },
  { title: "Build", body: "Ideas Lab and projects turn a health-system problem into something a team can ship or argue." },
  { title: "Compete", body: "Twenty Normal Events and five Legacy Events. You compete through your chapter." },
  { title: "Connect", body: "Partners in clinic, finance, and health-tech sit with chapters after leadership sets the relationship." },
  { title: "Lead", body: "Five officer roles. Status is earned: Founding, Established, Flagship-Eligible." },
];

export { MISSION, VISION };
