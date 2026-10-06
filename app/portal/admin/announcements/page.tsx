import { requireRole } from "@/lib/auth/session";
import { AnnouncementForm } from "@/components/portal/AnnouncementForm";
import { AnnouncementFeed } from "@/components/portal/AnnouncementFeed";
import { ConnectionTrouble } from "@/components/portal/ConnectionTrouble";
import { loadPortalAnnouncements } from "@/lib/data/announcements";

export default async function AdminAnnouncementsPage() {
  await requireRole(["SUPER_ADMIN", "STATE_ADMIN"]);
  const result = await loadPortalAnnouncements({ viewer: "admin" });
  if (result.error) return <ConnectionTrouble />;

  return (
    <div className="space-y-8">
      <section className="rounded-[var(--radius)] bg-white p-5">
        <h1 className="text-xl font-semibold">MediLink announcements</h1>
        <p className="mt-2 text-sm text-muted">
          Every announcement published here stays visible to current members and to anyone who joins later.
          Students and advisors see the full list on their Announcements page.
        </p>
      </section>
      <AnnouncementForm variant="admin" />
      <AnnouncementFeed organization={result.organization} chapter={[]} viewer="admin" />
    </div>
  );
}
