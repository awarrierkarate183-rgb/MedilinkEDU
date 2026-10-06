export type NavItem = {
  href: string;
  label: string;
  blurb: string;
};

export type NavTab = {
  href: string;
  label: string;
  kicker: string;
  blurb: string;
  items: NavItem[];
};

export const publicNav: NavTab[] = [
  {
    href: "/about",
    label: "About",
    kicker: "Who we are",
    blurb: "A student-founded high school network that treats healthcare as clinic, money, and technology at once.",
    items: [
      { href: "/about/what-is-medilink", label: "What is MediLink?", blurb: "The short answer, then the longer one." },
      { href: "/about/mission", label: "Mission and vision", blurb: "What we train students to do, and what we are building toward." },
      { href: "/about/lenses", label: "The three lenses", blurb: "Clinical, financial, and technology. Packets still say Care, Cost, Code." },
      { href: "/about/how-chapters-work", label: "How chapters work", blurb: "Five offices, one syllabus, one competition calendar." },
      { href: "/about/leadership", label: "Leadership", blurb: "Names and photos appear when leadership publishes them." },
      { href: "/about/aims", label: "Aims and contact", blurb: "Six aims for the work, plus how to write us." },
    ],
  },
  {
    href: "/chapters",
    label: "Chapters",
    kicker: "The network",
    blurb: "School chapters are the unit. You join a school, not a generic website account.",
    items: [
      { href: "/chapters/find", label: "Find a chapter", blurb: "Search accepted schools and open the map." },
      { href: "/chapters/start", label: "Start a chapter", blurb: "How a form becomes a founding chapter and a map pin." },
      { href: "/chapters/advisors", label: "Advisors and the portal", blurb: "Who runs the roster, the calendar, and student invites." },
      { href: "/chapters/status", label: "Founding to Flagship", blurb: "Status is earned. It is not a sticker you buy." },
      { href: "/chapters/listings", label: "What the public map shows", blurb: "Approved names only. Pins mark the recorded state." },
      { href: "/chapters/support", label: "Support and reactivation", blurb: "Kits, coaching, and bringing a paused chapter back." },
    ],
  },
  {
    href: "/curriculum",
    label: "Curriculum",
    kicker: "The syllabus",
    blurb: "Four tracks. Twelve modules. Public titles. Full files wait behind roster approval.",
    items: [
      { href: "/curriculum/how-it-works", label: "How the syllabus works", blurb: "What is public, what stays in the portal, and why." },
      { href: "/curriculum/track-1", label: "Track 1. Health economics", blurb: "Who pays, why care costs what it costs, and who is left out." },
      { href: "/curriculum/track-2", label: "Track 2. Health technology", blurb: "Records, data, devices. No coding background required." },
      { href: "/curriculum/track-3", label: "Track 3. Financial modeling", blurb: "Budgets, funding paths, and why ROI looks different in health." },
      { href: "/curriculum/track-4", label: "Track 4. Capstone and prep", blurb: "The yearly capstone that points at Normal and Legacy events." },
      { href: "/curriculum/member-access", label: "Member access", blurb: "How a student actually opens the lesson files." },
    ],
  },
  {
    href: "/competitions",
    label: "Competitions",
    kicker: "The season",
    blurb: "Twenty Normal Events. Five Legacy Events. Different rules. You compete through a chapter.",
    items: [
      { href: "/competitions/two-tiers", label: "Two tiers", blurb: "Why Normal and Legacy are not one shared format." },
      { href: "/competitions/normal", label: "Normal Events", blurb: "Twenty events, six-event cap, and the full 100-point packets." },
      { href: "/competitions/legacy", label: "Legacy Events", blurb: "The five championship simulations and the eight-student roster." },
      { href: "/competitions/advancement", label: "Advancement and points", blurb: "Regional, State, Nationals, and the Legacy placement table." },
      { href: "/competitions/rankings", label: "Rankings and Apex", blurb: "Annual Top 10 and the 2-year Road to Apex." },
      { href: "/competitions/invitational", label: "Invitational", blurb: "A separate individual honor after a two-year cycle." },
    ],
  },
  {
    href: "/get-involved",
    label: "Get Involved",
    kicker: "Work with us",
    blurb: "Schools, partners, sponsors, volunteers, and people with real news to send.",
    items: [
      { href: "/get-involved/start-a-chapter", label: "Start a chapter", blurb: "The path from interest to an accepted high school chapter." },
      { href: "/get-involved/partner", label: "Partner", blurb: "Hospitals, payers, health-tech, universities, and community groups." },
      { href: "/get-involved/sponsor", label: "Sponsor", blurb: "Approved tiers only. No invented benefits." },
      { href: "/get-involved/volunteer", label: "Volunteer", blurb: "Mentors and judges back the student offices. They do not replace them." },
      { href: "/get-involved/send-news", label: "Send news and photos", blurb: "Pictures and write-ups of work that actually happened." },
      { href: "/get-involved/contact", label: "Contact", blurb: "Write MediLink in Charlotte, North Carolina." },
    ],
  },
  {
    href: "/news",
    label: "News",
    kicker: "The desk",
    blurb: "Chapter photographs and highlights after review. Nothing fake gets posted.",
    items: [
      { href: "/news/photos", label: "Chapter photos", blurb: "The current album from accepted chapters." },
      { href: "/news/send-photos", label: "Send your photos", blurb: "What to shoot, what to write, and how to send it." },
      { href: "/news/how-review-works", label: "How review works", blurb: "A form is a request, not an automatic post." },
      { href: "/news/what-we-run", label: "What we can run", blurb: "Meetings, service, prep days, and honest project updates." },
      { href: "/news/what-we-will-not-run", label: "What we will not run", blurb: "No invented schools, no private data, no fake placements." },
      { href: "/news/after-you-send", label: "After you send", blurb: "What happens while a submission sits with leadership." },
    ],
  },
];

export function navTabByHref(href: string) {
  return publicNav.find((tab) => href === tab.href || href.startsWith(`${tab.href}/`));
}

export function navItemByHref(href: string) {
  for (const tab of publicNav) {
    const item = tab.items.find((entry) => entry.href === href);
    if (item) return { tab, item };
  }
  return null;
}
