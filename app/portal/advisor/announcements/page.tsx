import { requireRole } from "@/lib/auth/session";
import { AnnouncementForm } from "@/components/portal/AnnouncementForm";
import { AnnouncementFeed } from "@/components/portal/AnnouncementFeed";
import { ConnectionTrouble } from "@/components/portal/ConnectionTrouble";
import { loadPortalAnnouncements } from "@/lib/data/announcements";

export default async function AdvisorAnnouncementsPage() {
  const { profile } = await requireRole(["CHAPTER_ADVISOR", "STATE_ADMIN", "SUPER_ADMIN"]);
  const result = await loadPortalAnnouncements({
    chapterId: profile?.chapter_id,
    viewer: "advisor",
  });
  if (result.error) return <ConnectionTrouble />;

  return (
    <div className="space-y-8">
      <AnnouncementForm />
      <AnnouncementFeed organization={result.organization} chapter={result.chapter} viewer="advisor" />
    </div>
  );
}
