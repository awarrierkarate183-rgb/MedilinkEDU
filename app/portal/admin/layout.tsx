import { PortalShell } from "@/components/portal/PortalShell";
import { requireRole } from "@/lib/auth/session";

const nav = [
  { href: "/portal/admin", label: "Dashboard" },
  { href: "/portal/admin/chapters", label: "Chapters" },
  { href: "/portal/admin/users", label: "Users" },
  { href: "/portal/admin/events", label: "Events" },
  { href: "/portal/admin/competitions", label: "Competitions" },
  { href: "/portal/admin/curriculum", label: "Curriculum" },
  { href: "/portal/admin/resources", label: "Resources" },
  { href: "/portal/admin/news", label: "News" },
  { href: "/portal/admin/sponsors", label: "Sponsors" },
  { href: "/portal/admin/points", label: "Points" },
  { href: "/portal/admin/announcements", label: "Announcements" },
  { href: "/portal/admin/reports", label: "Reports" },
  { href: "/portal/admin/audit", label: "Audit log" },
  { href: "/portal/admin/settings", label: "Settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["SUPER_ADMIN"]);
  return (
    <PortalShell
      title="Administration"
      subtitle="Organizational control"
      nav={nav}
      mobileNav={nav.slice(0, 5)}
    >
      {children}
    </PortalShell>
  );
}
