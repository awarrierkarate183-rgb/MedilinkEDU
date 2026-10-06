import { PortalShell } from "@/components/portal/PortalShell";
import { requireRole } from "@/lib/auth/session";

const nav = [
  { href: "/portal/student", label: "Dashboard" },
  { href: "/portal/student/events", label: "Competition Events" },
  { href: "/portal/student/choose-event", label: "Choose Event" },
  { href: "/portal/student/competitions", label: "Competitions" },
  { href: "/portal/student/curriculum", label: "Curriculum" },
  { href: "/portal/student/ideas", label: "Ideas Lab" },
  { href: "/portal/student/projects", label: "Projects" },
  { href: "/portal/student/resources", label: "Resources" },
  { href: "/portal/student/achievements", label: "Achievements" },
  { href: "/portal/student/announcements", label: "Announcements" },
  { href: "/portal/student/chapter", label: "My Chapter" },
  { href: "/portal/student/profile", label: "Profile" },
];

const mobileNav = [
  { href: "/portal/student", label: "Home" },
  { href: "/portal/student/events", label: "Comp Events" },
  { href: "/portal/student/choose-event", label: "Choose" },
  { href: "/portal/student/competitions", label: "Compete" },
  { href: "/portal/student/ideas", label: "Ideas" },
  { href: "/portal/student/profile", label: "Profile" },
];

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireRole(["STUDENT", "CHAPTER_OFFICER"]);
  return (
    <PortalShell
      title={`Welcome, ${(profile?.full_name || "student").split(" ")[0]}`}
      subtitle="Student portal"
      nav={nav}
      mobileNav={mobileNav}
    >
      {children}
    </PortalShell>
  );
}
