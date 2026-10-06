export type NavIcon =
  | "mission"
  | "impact"
  | "lenses"
  | "chapters"
  | "people"
  | "contact"
  | "map"
  | "start"
  | "portal"
  | "status"
  | "list"
  | "support"
  | "book"
  | "track"
  | "tech"
  | "finance"
  | "capstone"
  | "lock"
  | "tiers"
  | "trophy"
  | "legacy"
  | "advance"
  | "rank"
  | "star"
  | "partner"
  | "sponsor"
  | "volunteer"
  | "photo"
  | "review"
  | "check"
  | "block"
  | "clock"
  | "news"
  | "calendar";

export type NavItem = {
  href: string;
  label: string;
  blurb: string;
  group: string;
  icon: NavIcon;
};

export type NavResource = {
  href: string;
  label: string;
  icon: NavIcon;
};

export type NavTab = {
  href: string;
  label: string;
  kicker: string;
  blurb: string;
  items: NavItem[];
  resources: NavResource[];
};

export const publicNav: NavTab[] = [
  {
    href: "/about",
    label: "About",
    kicker: "Who we are",
    blurb: "A student-founded high school network that treats healthcare as clinic, money, and technology at once.",
    items: [
      { href: "/about/what-is-medilink", label: "What is MediLink?", blurb: "The short answer, then the longer one.", group: "About MediLink", icon: "mission" },
      { href: "/about/mission", label: "Mission and vision", blurb: "What we train students to do, and what we are building toward.", group: "About MediLink", icon: "impact" },
      { href: "/about/lenses", label: "The three lenses", blurb: "Clinical, financial, and technology. Packets still say Care, Cost, Code.", group: "About MediLink", icon: "lenses" },
      { href: "/about/how-chapters-work", label: "How chapters work", blurb: "Five offices, one syllabus, one competition calendar.", group: "How we work", icon: "chapters" },
      { href: "/about/leadership", label: "Leadership", blurb: "Names and photos appear when leadership publishes them.", group: "How we work", icon: "people" },
      { href: "/about/aims", label: "Aims and contact", blurb: "Six aims for the work, plus how to write us.", group: "How we work", icon: "contact" },
    ],
    resources: [
      { href: "/start-a-chapter", label: "Start a Chapter", icon: "start" },
      { href: "/contact", label: "Contact", icon: "contact" },
      { href: "/portal", label: "Portal Login", icon: "portal" },
    ],
  },
  {
    href: "/chapters",
    label: "Chapters",
    kicker: "The network",
    blurb: "School chapters are the unit. You join a school, not a generic website account.",
    items: [
      { href: "/chapters/find", label: "Find a chapter", blurb: "Search accepted schools and open the map.", group: "Join a school", icon: "map" },
      { href: "/chapters/start", label: "Start a chapter", blurb: "How a form becomes a founding chapter and a map pin.", group: "Join a school", icon: "start" },
      { href: "/chapters/advisors", label: "Advisors and the portal", blurb: "Who runs the roster, the calendar, and student invites.", group: "Join a school", icon: "portal" },
      { href: "/chapters/status", label: "Founding to Flagship", blurb: "Status is earned. It is not a sticker you buy.", group: "How chapters grow", icon: "status" },
      { href: "/chapters/listings", label: "What the public map shows", blurb: "Approved names only. Pins mark the recorded state.", group: "How chapters grow", icon: "list" },
      { href: "/chapters/support", label: "Support and reactivation", blurb: "Kits, coaching, and bringing a paused chapter back.", group: "How chapters grow", icon: "support" },
    ],
    resources: [
      { href: "/start-a-chapter", label: "Start a Chapter", icon: "start" },
      { href: "/chapters/find", label: "Chapter map", icon: "map" },
      { href: "/portal", label: "Portal Login", icon: "portal" },
    ],
  },
  {
    href: "/curriculum",
    label: "Curriculum",
    kicker: "The syllabus",
    blurb: "Four tracks. Twelve modules. Public titles. Full files wait behind roster approval.",
    items: [
      { href: "/curriculum/how-it-works", label: "How the syllabus works", blurb: "What is public, what stays in the portal, and why.", group: "The syllabus", icon: "book" },
      { href: "/curriculum/track-1", label: "Track 1. Health economics", blurb: "Who pays, why care costs what it costs, and who is left out.", group: "The syllabus", icon: "finance" },
      { href: "/curriculum/track-2", label: "Track 2. Health technology", blurb: "Records, data, devices. No coding background required.", group: "The syllabus", icon: "tech" },
      { href: "/curriculum/track-3", label: "Track 3. Financial modeling", blurb: "Budgets, funding paths, and why ROI looks different in health.", group: "Tracks and access", icon: "track" },
      { href: "/curriculum/track-4", label: "Track 4. Capstone and prep", blurb: "The yearly capstone that points at Normal and Legacy events.", group: "Tracks and access", icon: "capstone" },
      { href: "/curriculum/member-access", label: "Member access", blurb: "How a student actually opens the lesson files.", group: "Tracks and access", icon: "lock" },
    ],
    resources: [
      { href: "/curriculum/how-it-works", label: "Public syllabus", icon: "book" },
      { href: "/competitions/normal", label: "Normal Events", icon: "trophy" },
      { href: "/portal", label: "Portal Login", icon: "portal" },
    ],
  },
  {
    href: "/competitions",
    label: "Competitions",
    kicker: "The season",
    blurb: "Twenty Normal Events. Three Legacy Events. Different rules. You compete through a chapter.",
    items: [
      { href: "/competitions/two-tiers", label: "Two tiers", blurb: "Why Normal and Legacy are not one shared format.", group: "The season", icon: "tiers" },
      { href: "/competitions/normal", label: "Normal Events", blurb: "Twenty events, six-event cap, and the full 100-point packets.", group: "The season", icon: "trophy" },
      { href: "/competitions/legacy", label: "Legacy Events", blurb: "The Legacy Triad. One team of four. Three arenas.", group: "The season", icon: "legacy" },
      { href: "/competitions/advancement", label: "Advancement and points", blurb: "Regional top three. One State champion per event. Raw scores out of 1,000.", group: "After the event", icon: "advance" },
      { href: "/competitions/rankings", label: "Rankings and Apex", blurb: "Annual Top 10 and the 2-year Road to Apex.", group: "After the event", icon: "rank" },
      { href: "/competitions/invitational", label: "Invitational", blurb: "A separate individual honor after a two-year cycle.", group: "After the event", icon: "star" },
    ],
    resources: [
      { href: "/competitions/normal", label: "Normal Events", icon: "trophy" },
      { href: "/competitions/legacy", label: "Legacy Triad", icon: "legacy" },
      { href: "/portal", label: "Portal Login", icon: "portal" },
    ],
  },
  {
    href: "/medilink-events",
    label: "MediLink Events",
    kicker: "Openings",
    blurb: "Volunteer by region, MediLink-hosted events, internships, and research seats. MediLink-wide listings reach every chapter.",
    items: [
      { href: "/medilink-events/volunteer", label: "Volunteer by region", blurb: "Openings grouped by region when MediLink publishes them.", group: "Ways to help", icon: "volunteer" },
      { href: "/medilink-events/events", label: "MediLink events", blurb: "Workshops and program days MediLink hosts.", group: "Ways to help", icon: "calendar" },
      { href: "/medilink-events/internships", label: "Internships", blurb: "Internships MediLink opens or passes through.", group: "Seats we open", icon: "star" },
      { href: "/medilink-events/research", label: "Research", blurb: "Research opportunities MediLink gives out.", group: "Seats we open", icon: "book" },
    ],
    resources: [
      { href: "/medilink-events/volunteer", label: "Volunteer", icon: "volunteer" },
      { href: "/portal", label: "Portal Login", icon: "portal" },
      { href: "/contact", label: "Contact", icon: "contact" },
    ],
  },
  {
    href: "/get-involved",
    label: "Get Involved",
    kicker: "Work with us",
    blurb: "Schools, partners, sponsors, volunteers, and people with real news to send.",
    items: [
      { href: "/get-involved/start-a-chapter", label: "Start a chapter", blurb: "The path from interest to an accepted high school chapter.", group: "Ways in", icon: "start" },
      { href: "/get-involved/partner", label: "Partner", blurb: "Hospitals, payers, health-tech, universities, and community groups.", group: "Ways in", icon: "partner" },
      { href: "/get-involved/sponsor", label: "Sponsor", blurb: "Approved tiers only. No invented benefits.", group: "Ways in", icon: "sponsor" },
      { href: "/get-involved/volunteer", label: "Volunteer", blurb: "Mentors and judges back the student offices. They do not replace them.", group: "Help the work", icon: "volunteer" },
      { href: "/get-involved/send-news", label: "Send news and photos", blurb: "Pictures and write-ups of work that actually happened.", group: "Help the work", icon: "photo" },
      { href: "/get-involved/contact", label: "Contact", blurb: "Write MediLink in Charlotte, North Carolina.", group: "Help the work", icon: "contact" },
    ],
    resources: [
      { href: "/start-a-chapter", label: "Start a Chapter", icon: "start" },
      { href: "/get-involved/partner", label: "Partner with MediLink", icon: "partner" },
      { href: "/contact", label: "Write us", icon: "contact" },
    ],
  },
  {
    href: "/news",
    label: "News",
    kicker: "The desk",
    blurb: "Chapter photographs and highlights after review. Nothing fake gets posted.",
    items: [
      { href: "/news/photos", label: "Chapter photos", blurb: "The current album from accepted chapters.", group: "On the desk", icon: "photo" },
      { href: "/news/send-photos", label: "Send your photos", blurb: "What to shoot, what to write, and how to send it.", group: "On the desk", icon: "news" },
      { href: "/news/how-review-works", label: "How review works", blurb: "A form is a request, not an automatic post.", group: "On the desk", icon: "review" },
      { href: "/news/what-we-run", label: "What we can run", blurb: "Meetings, service, prep days, and honest project updates.", group: "What runs", icon: "check" },
      { href: "/news/what-we-will-not-run", label: "What we will not run", blurb: "No invented schools, no private data, no fake placements.", group: "What runs", icon: "block" },
      { href: "/news/after-you-send", label: "After you send", blurb: "What happens while a submission sits with leadership.", group: "What runs", icon: "clock" },
    ],
    resources: [
      { href: "/news/photos", label: "Chapter photos", icon: "photo" },
      { href: "/news/send-photos", label: "Send photos", icon: "news" },
      { href: "/contact", label: "Contact", icon: "contact" },
    ],
  },
];

export function navGroups(tab: NavTab) {
  const seen: string[] = [];
  for (const item of tab.items) {
    if (!seen.includes(item.group)) seen.push(item.group);
  }
  return seen.map((heading) => ({
    heading,
    items: tab.items.filter((item) => item.group === heading),
  }));
}

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
