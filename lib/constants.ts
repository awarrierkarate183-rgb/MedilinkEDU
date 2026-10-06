export const CONTACT_EMAIL = "medi.link.edu@gmail.com";

export const SITE_NAME = "MediLink";

export const MISSION =
  "To train the next generation of healthcare problem-solvers by combining clinical understanding, financial reasoning, and technological literacy through chapters, curriculum, and competition.";

export const VISION =
  "A nationwide student network where every chapter graduate can walk into a hospital, an insurance company, or a health-tech startup and already understand how those three worlds connect.";

export const HOMEBASE = "Charlotte, North Carolina";

export const PUBLIC_NAV = [
  { href: "/about", label: "About" },
  { href: "/chapters", label: "Chapters" },
  { href: "/curriculum", label: "Curriculum" },
  { href: "/competitions", label: "Competitions" },
  { href: "/medilink-events", label: "MediLink Events" },
  { href: "/get-involved", label: "Get Involved" },
  { href: "/news", label: "News" },
] as const;

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  STATE_ADMIN: "STATE_ADMIN",
  CHAPTER_ADVISOR: "CHAPTER_ADVISOR",
  STUDENT: "STUDENT",
  CHAPTER_OFFICER: "CHAPTER_OFFICER",
} as const;

export type AppRole = (typeof ROLES)[keyof typeof ROLES];

export const CHAPTER_STATUSES = [
  "PROPOSED",
  "PENDING_APPROVAL",
  "FOUNDING",
  "ESTABLISHED",
  "FLAGSHIP_ELIGIBLE",
  "INACTIVE",
  "REACTIVATION_PENDING",
] as const;

export const MEMBER_STATUSES = [
  "INVITED",
  "PENDING",
  "ACTIVE",
  "INACTIVE",
  "REMOVED",
] as const;

export const ADVISOR_STATUSES = [
  "PENDING",
  "ACTIVE",
  "SUSPENDED",
  "INACTIVE",
] as const;

export const OFFICER_ROLES = [
  "President",
  "Vice President of Operations",
  "Finance and Treasury Lead",
  "Technology Lead",
  "Outreach and Service Lead",
] as const;

export const IDEA_CATEGORIES = [
  "HEALTHCARE",
  "TECHNOLOGY",
  "FINANCE",
  "RESEARCH",
  "POLICY",
  "COMMUNITY",
  "OTHER",
] as const;

export const RESOURCE_CATEGORIES = [
  "Curriculum",
  "Competition",
  "Advisor",
  "Chapter Leadership",
  "Research",
  "Technology",
  "Finance",
  "Healthcare",
  "Templates",
  "Guides",
] as const;

export const ADVISOR_RESOURCE_CATEGORIES = [
  "Chapter Management",
  "Recruitment",
  "Curriculum",
  "Competitions",
  "Events",
  "Leadership",
  "Community Service",
  "Partnerships",
  "Fundraising",
  "Promotion",
  "Templates",
] as const;

export const STUDENT_RESOURCE_CATEGORIES = [
  "Learn",
  "Compete",
  "Build",
  "Research",
  "Lead",
] as const;
