import type { ArticleBlock } from "@/components/public/ArticlePage";

export type SectionArticle = {
  href: string;
  title: string;
  lead: string;
  blocks: ArticleBlock[];
  actions?: Array<{ href: string; label: string; variant?: "primary" | "secondary" | "outline" }>;
};

export const sectionArticles: SectionArticle[] = [
  {
    href: "/about/what-is-medilink",
    title: "What is MediLink?",
    lead: "A student-founded nonprofit network of high school chapters. Members learn how real health systems work: a clinical problem, a money problem, and a technology problem at once.",
    blocks: [
      {
        heading: "The one-sentence version",
        body: [
          "MediLink is a high school chapter network. Students join a school chapter, study a shared syllabus, compete through that chapter, and build projects that have to survive clinic, money, and technology at the same time.",
          "It is not a lecture club, a hospital volunteering hour-counter, or a coding camp that never asks who pays. Healthcare is bigger than one discipline. That line is the whole point.",
        ],
      },
      {
        heading: "What a week can look like",
        body: [
          "A chapter meeting can open with a fictional chart, a claim denial, or a device that looks clever until nobody can staff it. Students argue in the three lenses, then write the tradeoff down. Later in the year that same habit shows up in Normal Events and, for a smaller roster, in Legacy Events.",
          "Full lesson files wait until the chapter is accepted and the student is on the roster. Public pages stay at titles, rules, and honest news. This site does not invent school names or fake placements.",
        ],
      },
      {
        heading: "High school only",
        body: [
          "There is no middle-school division and no college division. Membership is chapter-based. You do not join as a visitor on a public form. Charlotte, North Carolina is the home base. Listings grow when real schools are accepted.",
        ],
      },
    ],
    actions: [
      { href: "/chapters/start", label: "Start a chapter" },
      { href: "/curriculum/how-it-works", label: "See the syllabus", variant: "outline" },
    ],
  },
  {
    href: "/about/mission",
    title: "Mission and vision",
    lead: "The mission is the training job. The vision is the kind of graduate the network is trying to produce.",
    blocks: [
      {
        heading: "Mission",
        body: [
          "To train the next generation of healthcare problem-solvers by combining clinical understanding, financial reasoning, and technological literacy through chapters, curriculum, and competition.",
          "Training here means fluency in a case, not a license. A student who can name the patient, the payer, and the system has finished more work than a student who only collected vocabulary.",
        ],
      },
      {
        heading: "Vision",
        body: [
          "A nationwide student network where every chapter graduate can walk into a hospital, an insurance company, or a health-tech startup and already understand how those three worlds connect.",
          "That sentence is a direction, not a claim that the network already sits in every state. Public maps show accepted chapters only.",
        ],
      },
      {
        heading: "What the mission is not",
        body: [
          "It is not a promise of internships, college credit, or a product already in market. Partners appear after leadership sets the relationship. Competition medals appear after results are entered and published.",
        ],
      },
    ],
  },
  {
    href: "/about/lenses",
    title: "The three lenses",
    lead: "This is the only public page that explains the lenses at length. Packets still use the internal names Care, Cost, and Code.",
    blocks: [
      {
        heading: "Clinical. What is the actual health problem, and who is affected?",
        body: [
          "Name the condition, the patients or communities, and the gap in care. Who is left out, and why. Rural distance, uninsured families, delayed diagnosis, language access, and wait times are examples of gaps, not a complete list.",
          "If you cannot point to a person or a community, you have a theme, not a clinical problem. This lens is not a license to practice. Members do not treat patients from a club meeting.",
        ],
      },
      {
        heading: "Financial. Who pays, what it costs, and whether it lasts.",
        body: [
          "Insurance, hospital billing, premiums, deductibles, employer coverage, public programs, and grants belong here. If the money path fails, the clinical idea stays on the page.",
          "A team that cannot say who writes the check has not finished the case. The Finance and Treasury Lead owns Track 3.",
        ],
      },
      {
        heading: "Technology. How data, software, or infrastructure changes access.",
        body: [
          "Records, telehealth, devices, or a simple tool. The test is outcome, not novelty. A finished product is not required. Coding background is not required to take Track 2.",
          "If the answer is only that the idea is new, it is not yet a technology solution. The Technology Lead owns Track 2.",
        ],
      },
      {
        heading: "How the lenses show up later",
        body: [
          "Track 4 and the competition packets force the same three questions under a clock. A pitch that forgets the payer fails The Sovereign Ledger. A hearing that forgets the patient fails The Janus Protocol. The names change. The habit does not.",
        ],
      },
    ],
    actions: [{ href: "/curriculum/track-4", label: "See how Track 4 uses the lenses", variant: "outline" }],
  },
  {
    href: "/about/how-chapters-work",
    title: "How chapters work",
    lead: "Every chapter uses the same five offices, the same public syllabus, and the same competition calendar.",
    blocks: [
      {
        heading: "The five offices",
        body: [
          "President. Vice President of Operations. Finance and Treasury Lead. Technology Lead. Outreach and Service Lead.",
          "Finance owns Track 3 and chapter budgets. Technology owns Track 2 and digital projects. Outreach owns service that can be described without inventing a hospital partnership.",
        ],
      },
      {
        heading: "The same calendar, locally run",
        body: [
          "Curriculum titles are public. Full lessons open after the advisor adds a student. Normal Events allow up to six entries per student. Legacy Events use one team of four in the Legacy Triad. Rankings and the Apex are chapter outcomes.",
          "A new school uses Start a Chapter. After MediLink accepts the request, the school can appear on the public map. Pending requests stay off that map.",
        ],
      },
    ],
    actions: [
      { href: "/chapters/find", label: "Find a chapter" },
      { href: "/chapters/start", label: "Start a chapter", variant: "outline" },
    ],
  },
  {
    href: "/about/leadership",
    title: "Leadership",
    lead: "Names, roles, and photos are data-driven. They appear when leadership publishes them.",
    blocks: [
      {
        heading: "No invented founder story",
        body: [
          "This page does not invent a biography, a title stack, or a quote. Until an approved narrative is published, MediLink is described by the mission, the chapter structure, and the public syllabus.",
          "Chapter photos on News are different. Those pictures came from an accepted school and went through review. They are not a substitute for a leadership bio.",
        ],
      },
      {
        heading: "How to reach the people who decide",
        body: [
          "Chapter requests, partner notes, and news submissions all land with administrators. The contact address is medi.link.edu@gmail.com. Charlotte, North Carolina is the home base.",
        ],
      },
    ],
    actions: [{ href: "/contact", label: "Contact page", variant: "outline" }],
  },
  {
    href: "/about/aims",
    title: "Aims and contact",
    lead: "These six aims describe the work, not results already in hand.",
    blocks: [
      {
        heading: "What we aim to achieve",
        body: [
          "Train students to apply the three-lens framework to real health-system problems.",
          "Grow a nationwide chapter network with a shared officer structure, curriculum, and starter kit.",
          "Run twenty Normal Events and three Legacy Triad events each season, plus a biennial Apex and a separate individual invitational.",
          "Connect members with clinical, finance, and health-tech partners for shadowing, internships, and research.",
          "Give students titles, projects, and competition experience that transfer to college and career.",
          "Give back through chapter service and outreach.",
        ],
      },
      {
        heading: "Write us",
        body: [
          "Questions about a chapter, a partnership, or a sponsorship can go to medi.link.edu@gmail.com. Use the contact page if you want a form. Do not send student emails, grades, or portal screens as a public news tip.",
        ],
      },
    ],
    actions: [
      { href: "/contact", label: "Contact page" },
      { href: "/get-involved", label: "Get involved", variant: "outline" },
    ],
  },
  {
    href: "/chapters/find",
    title: "Find a chapter",
    lead: "The public list is the accepted-school list. It updates when MediLink accepts a Start a Chapter request.",
    blocks: [
      {
        heading: "How to read the map",
        body: [
          "Open Find a chapter on the Chapters overview to search by school or state. A pin marks the state entered on the form, not a street address. Lake Norman Charter High School in Huntersville, North Carolina is on that map as a founding chapter because it was accepted.",
          "If your school is not there, it has not been accepted yet, or it has not applied. Starting a chapter is the path. Searching harder will not invent a listing.",
        ],
      },
      {
        heading: "Joining versus starting",
        body: [
          "Students join through their chapter advisor after the chapter exists. There is no public student signup that skips the school. Advisors add a name, email, and grade. The student gets a link, chooses a password, and uses the student portal only.",
        ],
      },
    ],
    actions: [
      { href: "/chapters", label: "Open the chapter map" },
      { href: "/chapters/start", label: "Start a chapter", variant: "outline" },
    ],
  },
  {
    href: "/chapters/start",
    title: "Start a chapter",
    lead: "An advisor fills the school, the city, the state, and a portal password. MediLink still has to accept the request.",
    blocks: [
      {
        heading: "What the form actually does",
        body: [
          "Start a Chapter creates an advisor login and a pending chapter record. The advisor can sign in immediately. Advisor tools stay closed until an administrator accepts the school.",
          "After accept, the chapter status becomes Founding, the school can appear on the public map, and the advisor can add students. Denied requests do not become pins.",
        ],
      },
      {
        heading: "What you should have ready",
        body: [
          "The high school name, city, and state. An advisor first name, last name, email, and a password you will remember. A short statement about why this school wants MediLink. This is high school only.",
          "Do not invent a second campus or a college chapter on the form. Duplicate school-and-city records are blocked.",
        ],
      },
    ],
    actions: [
      { href: "/start-a-chapter", label: "Open Start a Chapter" },
      { href: "/chapters/advisors", label: "Advisor tools after accept", variant: "outline" },
    ],
  },
  {
    href: "/chapters/advisors",
    title: "Advisors and the portal",
    lead: "Advisors run the roster, the calendar, and competition entries. Students never see those controls.",
    blocks: [
      {
        heading: "What opens after accept",
        body: [
          "Members. The advisor enters first name, last name, grade, and email. MediLink emails the student a link. The student chooses a password and lands in the student portal only.",
          "Competitions. The advisor types student names and submits the event. The student page then opens that event's instructions and rubric. Legacy uses one team of four that may enter one, two, or all three Triad events.",
          "Updates. Advisor announcements appear on the student dashboard. Public pages never show student emails, grades, login codes, or internal IDs.",
        ],
      },
      {
        heading: "Who else can see a school",
        body: [
          "MediLink administrators can open every accepted school workbook. A state administrator stays inside that state's chapters. Pending schools stay in the request queue until someone accepts or denies them.",
        ],
      },
    ],
    actions: [{ href: "/portal", label: "Portal login" }],
  },
  {
    href: "/chapters/status",
    title: "Founding to Flagship",
    lead: "Status tracks work already done. It is not a marketing badge and it is not for sale.",
    blocks: [
      {
        heading: "Founding",
        body: [
          "The chapter was accepted. The advisor can add students and enter events. The school may appear on the public map. Founding is the honest first status, not a lesser brand.",
        ],
      },
      {
        heading: "Established",
        body: [
          "Used when recorded work meets the published bar. Administrators change it. A chapter cannot click a button and award itself the word.",
        ],
      },
      {
        heading: "Flagship-Eligible",
        body: [
          "A later status after the chapter meets a higher published bar. Until leadership publishes that bar in full, this page will not invent extra perks or a secret score.",
        ],
      },
    ],
  },
  {
    href: "/chapters/listings",
    title: "What the public map shows",
    lead: "Approved names only. Pins mark the state from the Start a Chapter form, not a street address.",
    blocks: [
      {
        heading: "What is public",
        body: [
          "School name, city, state, and chapter status. That is enough for a family to see whether a school exists in the network. It is not a directory of student emails.",
        ],
      },
      {
        heading: "What stays off the map",
        body: [
          "Pending requests. Denied requests. Inactive chapters. Join codes. Advisor phone numbers. Student names. If a pin is missing, the chapter is not accepted yet.",
          "State networks listed in older copy, such as North Carolina and Georgia, are state listings. They are not fake schools.",
        ],
      },
    ],
    actions: [{ href: "/chapters", label: "Open the map" }],
  },
  {
    href: "/chapters/support",
    title: "Support and reactivation",
    lead: "Existing chapters can ask for the kit or coaching. A paused chapter can come back without inventing a new history.",
    blocks: [
      {
        heading: "Chapter resources",
        body: [
          "Use Chapter resources when the school already exists and needs materials, coaching, or a question answered. That path is not a second Start a Chapter form.",
        ],
      },
      {
        heading: "Reactivation",
        body: [
          "Reactivation keeps the name and history with new student leadership. Use it when the school already had a chapter and the roster went quiet. Do not file a brand-new school name if the old one still belongs to that campus.",
        ],
      },
    ],
    actions: [
      { href: "/chapter-support", label: "Chapter resources" },
      { href: "/get-involved/contact", label: "Write MediLink", variant: "outline" },
    ],
  },
  {
    href: "/curriculum/how-it-works",
    title: "How the syllabus works",
    lead: "Visitors see names and one-line descriptions. Members open the files after a chapter approves them.",
    blocks: [
      {
        heading: "Four tracks on purpose",
        body: [
          "Track 1 teaches who pays. Track 2 teaches records and tools. Track 3 asks whether an idea lasts. Track 4 ties the three lenses to Normal and Legacy events.",
          "The order is a staircase, not a buffet. A team that jumps to a pitch without Track 1 will treat price as a slogan. A team that skips Track 2 will treat software as magic.",
        ],
      },
      {
        heading: "What stays public",
        body: [
          "Track titles, module titles, short descriptions, and a one-line lab preview. That is enough for a principal or a parent to understand the year. It is not a dump of slides.",
        ],
      },
      {
        heading: "What waits",
        body: [
          "Lesson slideshows, worksheets, scenarios, and the longer question bank wait in the member portal. New schools start a chapter. They do not email for a zip file of the curriculum.",
        ],
      },
    ],
    actions: [{ href: "/curriculum/track-1", label: "Start with Track 1", variant: "outline" }],
  },
  {
    href: "/curriculum/track-1",
    title: "Track 1. Foundations of Health Economics",
    lead: "How care is paid for, why it costs what it costs, and who is left out. No prior economics class is required.",
    blocks: [
      {
        heading: "Why this track comes first",
        body: [
          "A clinical idea that cannot name the payer is a poster. Track 1 is the public home of the financial lens before Track 3 turns it into budgets and funding plans.",
        ],
      },
      {
        heading: "1.1 How Healthcare Gets Paid For",
        body: [
          "Insurance basics, premiums, deductibles, and employer versus government coverage. A student who finishes this module should be able to say who writes the check for a visit, not just that insurance pays.",
        ],
      },
      {
        heading: "1.2 The Cost of Care",
        body: [
          "Why healthcare is expensive: administrative costs, drug pricing, and hospital billing. This is the module that stops a team from treating price as a mystery or a moral slogan.",
        ],
      },
      {
        heading: "1.3 Access and Disparities",
        body: [
          "Rural care deserts, uninsured populations, and global health gaps. Examples of gaps, not a complete list. If you cannot point to a person or a community, you are not done with this module.",
        ],
      },
      {
        heading: "Lab preview",
        body: [
          "Build a basic insurance-comparison worksheet for a hypothetical family. Full files wait behind roster approval.",
        ],
      },
    ],
  },
  {
    href: "/curriculum/track-2",
    title: "Track 2. Health Technology and Systems",
    lead: "Records, data, devices. No coding background required. Outcome over novelty.",
    blocks: [
      {
        heading: "What this track owns",
        body: [
          "How software and infrastructure change access. A finished product is not required. The chapter Technology Lead owns this track and the digital projects that come out of it.",
        ],
      },
      {
        heading: "2.1 Digital Health 101",
        body: [
          "Electronic health records, telehealth, and patient portals. What actually moves between a clinic, a family, and a screen, and what gets stuck.",
        ],
      },
      {
        heading: "2.2 Data and AI in Medicine",
        body: [
          "Diagnostics, imaging, and predictive tools, explained conceptually. Students should be able to say what a tool claims to predict and who is left out of the data, not train a model from this module.",
        ],
      },
      {
        heading: "2.3 Medical Devices and Wearables",
        body: [
          "How monitoring technology is changing care delivery. A device concept still has to name a user and a gap. Pitch Day and Seed Round later test that as a live pitch.",
        ],
      },
      {
        heading: "Lab preview",
        body: [
          "Wireframe one feature of a telehealth app. Finished product not required. Full files wait behind roster approval.",
        ],
      },
    ],
  },
  {
    href: "/curriculum/track-3",
    title: "Track 3. Financial Modeling for Health Ventures",
    lead: "Budgets, funding paths, and why return on investment looks different in health.",
    blocks: [
      {
        heading: "What this track owns",
        body: [
          "The chapter Finance and Treasury Lead owns this track, chapter budgets, and finance workshops. Track 1 taught who pays. Track 3 asks whether an idea lasts.",
        ],
      },
      {
        heading: "3.1 Reading a Budget",
        body: [
          "Revenue, expenses, and break-even basics. A one-page budget that a chapter or a mock program could actually run, not a slide full of round numbers.",
        ],
      },
      {
        heading: "3.2 Funding a Health Idea",
        body: [
          "Grants, investors, and nonprofit versus for-profit funding paths. Students should be able to say which path fits the idea and why the others do not.",
        ],
      },
      {
        heading: "3.3 Measuring Impact and ROI",
        body: [
          "Why return on investment is measured differently in health than in typical business. A clinical win that nobody can pay for is still unfinished work.",
        ],
      },
      {
        heading: "Lab preview",
        body: [
          "Build a one-page budget and funding plan for a mock community health program. Full files wait behind roster approval.",
        ],
      },
    ],
  },
  {
    href: "/curriculum/track-4",
    title: "Track 4. Applied Capstone and Competition Prep",
    lead: "Curriculum and competition stay linked on purpose. Prepare for the event you entered.",
    blocks: [
      {
        heading: "Why the capstone exists",
        body: [
          "Packets still use Care, Cost, Code. Normal Events and Legacy Events use the same Regional, State, and National stages, with different cutoffs. Track 4 is where a chapter stops collecting modules and starts running a case the way a judge will hear it.",
        ],
      },
      {
        heading: "4.1 Applying the Framework",
        body: [
          "One case run through the three-lens framework. Name the patient, the payer, and the system. About is still the only page that explains those lenses at length.",
        ],
      },
      {
        heading: "4.2 Case Analysis Practice",
        body: [
          "Guided practice on past-style cases. Teams should already be covering clinic, money, and tech before they enter a judged event.",
        ],
      },
      {
        heading: "4.3 Competition-Specific Prep",
        body: [
          "A pitch is not a hearing. A solo chart review is not a four-person crisis command. Prepare for the event you entered.",
        ],
      },
      {
        heading: "Lab preview",
        body: [
          "A full mock case run-through, in teams. New schools should start a chapter, not email for a dump of lessons.",
        ],
      },
    ],
    actions: [{ href: "/competitions/two-tiers", label: "See the two competition tiers", variant: "outline" }],
  },
  {
    href: "/curriculum/member-access",
    title: "Member access",
    lead: "The portal opens the files. The website explains the map.",
    blocks: [
      {
        heading: "The path",
        body: [
          "A school uses Start a Chapter. MediLink accepts the request. The advisor adds the student. The student clicks the email, chooses a password, and signs into the student portal.",
          "Inside the portal, curriculum titles become lesson pages. Public visitors still see only this syllabus. That split is intentional.",
        ],
      },
      {
        heading: "If you are not on a roster yet",
        body: [
          "Ask your advisor, or start a chapter if the school does not have one. Emailing MediLink for unofficial slides skips the chapter, the advisor, and the point of the network.",
        ],
      },
    ],
    actions: [
      { href: "/portal", label: "Portal login" },
      { href: "/start-a-chapter", label: "Start a chapter", variant: "outline" },
    ],
  },
  {
    href: "/competitions/two-tiers",
    title: "Two tiers. Different rules.",
    lead: "Normal Events are broad-access. Legacy Events are a scarce chapter delegation. Do not treat them as one shared format.",
    blocks: [
      {
        heading: "Normal Events",
        body: [
          "Twenty events. A student may enter up to six in a season. Most allow a solo competitor or a team of up to five. Regional is required. Everyone who competes at Regional advances to State. State top three earn a National nomination. Nationals first place is National Champion.",
          "Open the Normal Events page for every official packet: role, mechanic, work product, and the 100-point rubric. Advisors enter names in the portal. The assigned student page opens the same packet.",
        ],
      },
      {
        heading: "Legacy Events",
        body: [
          "Three championship simulations: The Sovereign Ledger, Nightfall: Code Meridian, and The Janus Protocol. A chapter registers exactly one team of four. That team may enter one, two, or all three events. The roster locks before Regionals.",
          "Regionals fit five acts into one day. The complete fictional case releases at monitored check-in. Regional keeps the top three in each pool, separately by event. State standing is 35 percent Regional raw score plus 65 percent State raw score. One cumulative champion per event advances to Nationals.",
        ],
      },
      {
        heading: "What they share",
        body: [
          "High school only. In person. Fictional cases. No license to treat anyone. You enter through a chapter. Rankings and Apex are chapter outcomes. The invitational is individual.",
        ],
      },
    ],
    actions: [
      { href: "/competitions/normal", label: "Open Normal Events" },
      { href: "/competitions/legacy", label: "Open Legacy Events", variant: "outline" },
    ],
  },
  {
    href: "/competitions/advancement",
    title: "Advancement and points",
    lead: "Same conference names. Different cutoffs. Legacy uses raw scores out of 1,000, not placement bonuses.",
    blocks: [
      {
        heading: "Normal ladder",
        body: [
          "Regional is the starting round. State takes every Regional competitor. Nationals takes the top three at State. First place at Nationals is National Champion. Second and third receive prizes and finalist recognition.",
        ],
      },
      {
        heading: "Legacy ladder",
        body: [
          "Each event is scored out of 1,000. Regionals advance the top three eligible teams from each regional pool, separately in each event. A thin pool advances its eligible teams. No empty qualifiers.",
          "State standing equals 35 percent Regional raw score plus 65 percent State raw score. The single highest cumulative standing in each event advances to Nationals. Proposed National standing is 15 percent Regional, 25 percent State, and 60 percent National. That national formula is published before registration and is not changed after results are seen.",
          "State ties use the higher State raw score, then the safety or clinical criterion, then live adaptation, then a common 15-minute tie case. The numbers in the handbook example are illustrations of the formula, not real chapter results.",
        ],
      },
    ],
    actions: [{ href: "/competitions/rankings", label: "Rankings and Apex", variant: "outline" }],
  },
  {
    href: "/competitions/rankings",
    title: "Rankings and Apex",
    lead: "The annual Top 10 resets. The Road to Apex is a running two-year total. They are not the same list.",
    blocks: [
      {
        heading: "Annual chapter rankings",
        body: [
          "Sixty-five percent Legacy performance, twenty-five percent Normal Event performance, ten percent membership and participation. Top 10 nationally and top 10 per state. The list appears after administrators enter results and publish the season.",
        ],
      },
      {
        heading: "MediLink Apex",
        body: [
          "Every two years, top-ranked chapters by a running two-year cumulative total qualify. The weights match the annual ranking. The total does not reset each season. Active regions keep a minimum number of spots. The Apex includes sponsor networking and a gala. It is a chapter summit, not an individual honor.",
        ],
      },
      {
        heading: "What is not shown yet",
        body: [
          "If the public lists are empty, no season ranking has been published. This page will not invent a leaderboard.",
        ],
      },
    ],
  },
  {
    href: "/competitions/invitational",
    title: "Biennial individual invitational",
    lead: "An individual honor. Separate from the Apex. Separate from a Legacy group placement.",
    blocks: [
      {
        heading: "How someone is considered",
        body: [
          "Once every two full competition years, after that cycle's Nationals, MediLink announces individual invitees. Selection uses a confidential individual performance metric plus up to two chapter nominations per chapter.",
          "A nomination is consideration, not an automatic invite. The metric is not shown on this site or in the student portal. A four-person Legacy group can produce one invitee while the other three do not.",
        ],
      },
      {
        heading: "How you get there",
        body: [
          "You compete through a chapter first. There is no public self-nomination form that skips the school. Invitee names appear here only after administrators finalize the list.",
        ],
      },
    ],
    actions: [
      { href: "/chapters/find", label: "Find a chapter" },
      { href: "/start-a-chapter", label: "Start a chapter", variant: "outline" },
    ],
  },
  {
    href: "/get-involved/start-a-chapter",
    title: "Start a chapter",
    lead: "A MediLink chapter is a school, an advisor, and a roster. The form is the start of that, not a shortcut around it.",
    blocks: [
      {
        heading: "Who this path is for",
        body: [
          "A teacher, counselor, or administrator who can stay with the chapter. A student officer can help gather names, but the application still needs an adult advisor and a real high school.",
          "This is high school only. There is no middle-school chapter and no college chapter. If the school is not ready to meet, compete, and keep a roster, wait. A paused idea is better than a ghost listing.",
        ],
      },
      {
        heading: "What happens after you submit",
        body: [
          "You choose a password on the form and receive a login. That login does not unlock advisor tools until MediLink accepts the request. Until then, the account is a pending chapter, not a live chapter.",
          "Accept is a board decision. After accept, the school can appear on the public map, the advisor can invite students, and the first meeting can use the shared syllabus.",
        ],
      },
      {
        heading: "What you will need on the form",
        body: [
          "School name, city, state, advisor name and email, and the password you want for the advisor portal. Use the school name as it appears on official records. Do not invent a second campus to look larger.",
          "The long form lives on its own page so an advisor can fill it without hunting through Get Involved.",
        ],
      },
    ],
    actions: [{ href: "/start-a-chapter", label: "Open the Start a Chapter page" }],
  },
  {
    href: "/get-involved/partner",
    title: "Partner with MediLink",
    lead: "Hospitals, payers, health-tech teams, universities, and community groups can sit with a chapter. They do not become the chapter.",
    blocks: [
      {
        heading: "What a useful partnership looks like",
        body: [
          "A guest session mapped to a syllabus module. A two-hour workshop. A judged panel. A shadowing day that a chapter can describe without pretending the students are clinicians.",
          "The best partners leave students with a case they can rerun later. A logo on a slide with no session behind it is not a partnership yet.",
        ],
      },
      {
        heading: "Who we will name in public",
        body: [
          "Logos and partner names appear only after leadership sets the relationship and makes it public. This page does not invent hospitals, insurers, or universities to look established.",
          "If you want a first conversation, use the partner page or write medi.link.edu@gmail.com. Say what you can actually host, and which track or event it would serve.",
        ],
      },
    ],
    actions: [{ href: "/partner", label: "Open the partner page" }],
  },
  {
    href: "/get-involved/sponsor",
    title: "Sponsor MediLink",
    lead: "Sponsorship pays for students, conferences, and the work it takes to run a network. It does not buy a ranking.",
    blocks: [
      {
        heading: "How to read the tiers",
        body: [
          "Corporate tiers load from approved sponsor data. Open the sponsor page for the current amounts and benefits. If a perk is not on that page, it is not part of the public offer.",
          "A sponsor can fund travel, materials, or a gathering. A sponsor cannot buy a Legacy roster slot, a published ranking, or a fake chapter listing.",
        ],
      },
      {
        heading: "What we will not invent",
        body: [
          "This site will not invent dollar amounts, exclusive perks, or a sold-out gala. When a season has published sponsor names, they appear on the sponsor page. Until then, write us and ask for the current packet.",
        ],
      },
    ],
    actions: [{ href: "/sponsor", label: "See sponsor tiers" }],
  },
  {
    href: "/get-involved/volunteer",
    title: "Volunteer",
    lead: "Mentors and judges sit with chapters after leadership sets the relationship. They back the five student offices. They do not replace them.",
    blocks: [
      {
        heading: "Where time goes",
        body: [
          "A mock hearing. A budget workshop. A Track 2 critique. A Normal Event judge seat. A Legacy Advanced Release rehearsal if a chapter asks for one.",
          "Tell us your field so the match is honest. A claims analyst and a bedside nurse can both help. They should not be asked to do the same hour of work.",
        ],
      },
      {
        heading: "What volunteers do not do",
        body: [
          "They do not become the chapter president. They do not treat patients with students. They do not write the case for a team the night before Regional.",
          "Use the volunteer page to say when you can show up. Leadership places people after the chapter is accepted and the calendar is real.",
        ],
      },
    ],
    actions: [{ href: "/volunteer", label: "Volunteer page" }],
  },
  {
    href: "/get-involved/send-news",
    title: "Send news and photos",
    lead: "Pictures and write-ups of work that happened. Leadership decides whether they run.",
    blocks: [
      {
        heading: "One desk for partners and chapters",
        body: [
          "The News tab holds the album, the send-photos rules, and the review path. Get Involved only points you there so a partner and a chapter officer use the same desk.",
          "Send a sharp photo, a real school name, a city, and one sentence about the frame. Ask the people in the picture first.",
        ],
      },
      {
        heading: "What this is not",
        body: [
          "It is not a press release factory. It is not a place to invent a second school or a medal that has not been published. If the work happened, send it. If it did not, wait.",
        ],
      },
    ],
    actions: [
      { href: "/news", label: "Open News" },
      { href: "/news/send-photos", label: "Send photos", variant: "outline" },
    ],
  },
  {
    href: "/get-involved/contact",
    title: "Contact",
    lead: "Write MediLink in Charlotte, North Carolina. Use the address that matches the job.",
    blocks: [
      {
        heading: "How to reach us",
        body: [
          "medi.link.edu@gmail.com for a chapter question, a partnership, a sponsorship, or a news caption. Use the contact page if you want a form.",
          "Chapter start still goes through Start a Chapter. Student accounts still go through an advisor invite. Emailing for a password reset of someone else's portal login will not work.",
        ],
      },
      {
        heading: "What not to send",
        body: [
          "Do not send student passwords, a screenshot of the portal, or a spreadsheet of emails. Do not send medical details about a real patient. Fictional cases stay fictional.",
        ],
      },
    ],
    actions: [{ href: "/contact", label: "Contact page" }],
  },
  {
    href: "/news/photos",
    title: "Chapter photos",
    lead: "The current album is from accepted chapters. Captions stay factual. The album stays small until more schools send honest pictures.",
    blocks: [
      {
        heading: "What you are looking at",
        body: [
          "The News overview holds the rotating album. The first pictures came from Lake Norman Charter High School in Huntersville, North Carolina: a welcome slide, table conversation, and members reading printed materials. Student names are not listed.",
          "More photos appear after review. This page will not invent a second school to make the album look bigger.",
        ],
      },
      {
        heading: "How to read a caption",
        body: [
          "A caption names the school, the city, and what the frame shows. It does not invent a placement, a sponsor dollar amount, or a patient story. If a picture needs a longer story, that story waits until leadership accepts it.",
        ],
      },
    ],
    actions: [{ href: "/news", label: "Open the album" }],
  },
  {
    href: "/news/send-photos",
    title: "Send your chapter photos",
    lead: "If your chapter met, competed, served, or launched something that happened, send the pictures. Make them look like the room you were actually in.",
    blocks: [
      {
        heading: "What to shoot",
        body: [
          "A meeting table. A whiteboard with a real case. A service day after it happened. A prep session with printed packets. Faces that agreed to be shown.",
          "Avoid locker-room candids, hospital patients, and screens that show emails or grades. Crop the frame so a visitor can tell what the chapter was doing.",
        ],
      },
      {
        heading: "What to write with the file",
        body: [
          "School name. City. One sentence about the frame. The date if you have it. Ask everyone in the photo before you send it.",
        ],
      },
      {
        heading: "How to send it",
        body: [
          "Use the news form or email medi.link.edu@gmail.com. Keep a copy of the files. A form is a request, not an automatic post.",
        ],
      },
    ],
    actions: [{ href: "/news", label: "Back to News" }],
  },
  {
    href: "/news/how-review-works",
    title: "How review works",
    lead: "MediLink checks that the school is real, the event happened, and the caption does not invent a win.",
    blocks: [
      {
        heading: "What the desk looks for",
        body: [
          "An accepted or pending chapter we can place. A caption that matches the photo. No student emails, grades, or login codes in the frame. No claim that members treated a patient.",
          "If we need a clearer caption or an advisor confirmation, we write back to the address you used. Silence on the public site means the file is still in review or was not accepted.",
        ],
      },
      {
        heading: "Where an accepted photo can go",
        body: [
          "News. The homepage strip. A later gathering recap. Denied photos stay off the site. We do not publish a rejection notice next to the album.",
        ],
      },
    ],
  },
  {
    href: "/news/what-we-run",
    title: "What we can run",
    lead: "Meetings, service, prep days, and honest project updates. The bar is that it happened.",
    blocks: [
      {
        heading: "The usable list",
        body: [
          "Chapter meetings and officer work. Service or outreach the chapter completed. Competition prep or conference days after they happen. Research or project updates with a real school name.",
          "A short written note is enough if you do not have a photo yet. A caption that names the work is better than a collage with no school.",
        ],
      },
      {
        heading: "Why this list is short",
        body: [
          "News is a desk, not a magazine that has to fill pages. We would rather run three true pictures than a season of invented highlights.",
        ],
      },
    ],
  },
  {
    href: "/news/what-we-will-not-run",
    title: "What we will not run",
    lead: "No invented schools. No private data. No fake placements. The album is not a place to look bigger than the network is.",
    blocks: [
      {
        heading: "Hard stops",
        body: [
          "No made-up school names. No student emails, phone numbers, grades, or login codes. No photos of people who did not agree to be shown. No medical advice or claims that members treated patients.",
          "No unpublished ranking, no invented sponsor dollar amount, and no caption that turns a practice round into a national title.",
        ],
      },
      {
        heading: "If you are unsure",
        body: [
          "Send the photo and say what you cannot confirm. The desk would rather ask one follow-up than take down a post later.",
        ],
      },
    ],
  },
  {
    href: "/news/after-you-send",
    title: "After you send",
    lead: "The album stays small on purpose until more chapters send honest pictures.",
    blocks: [
      {
        heading: "What you should expect",
        body: [
          "A review, not an instant post. A possible reply if the caption is thin. Silence on the public site until something is accepted.",
          "One honest album is better than a feed of invented highlights. If your photo runs, it will name the school that actually met.",
        ],
      },
      {
        heading: "If nothing appears",
        body: [
          "Write again only if you have a clearer caption or a better file. Do not send the same picture five times. Leadership will not invent a second school to keep the homepage busy while yours is in review.",
        ],
      },
    ],
  },
];

export function getSectionArticle(href: string) {
  return sectionArticles.find((article) => article.href === href) || null;
}
