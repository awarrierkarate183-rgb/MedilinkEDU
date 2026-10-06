import { PortalShell } from "@/components/portal/PortalShell";
import { requireRole } from "@/lib/auth/session";

const nav = [
  { href: "/portal/advisor", label: "Dashboard" },
  { href: "/portal/advisor/members", label: "Members" },
  { href: "/portal/advisor/chapter", label: "Chapter" },
  { href: "/portal/advisor/events", label: "Competition Events" },
  { href: "/portal/advisor/competitions", label: "Competitions" },
  { href: "/portal/advisor/curriculum", label: "Curriculum" },
  { href: "/portal/advisor/resources", label: "Resources" },
  { href: "/portal/advisor/announcements", label: "Announcements" },
  { href: "/portal/advisor/submissions", label: "Submissions" },
  { href: "/portal/advisor/points", label: "Points" },
  { href: "/portal/advisor/reports", label: "Reports" },
  { href: "/portal/advisor/settings", label: "Settings" },
];

const mobileNav = [
  { href: "/portal/advisor", label: "Home" },
  { href: "/portal/advisor/members", label: "Members" },
  { href: "/portal/advisor/events", label: "Comp Events" },
  { href: "/portal/advisor/submissions", label: "Tasks" },
  { href: "/portal/advisor/settings", label: "More" },
];

export default async function AdvisorLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireRole(["CHAPTER_ADVISOR", "STATE_ADMIN", "SUPER_ADMIN"]);
  const hour = new Date().getHours();
  const hello = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return (
    <PortalShell
      title={`${hello}, ${profile?.display_name || profile?.full_name || "Advisor"}`}
      subtitle="Advisor portal"
      nav={nav}
      mobileNav={mobileNav}
    >
      {children}
    </PortalShell>
  );
}
