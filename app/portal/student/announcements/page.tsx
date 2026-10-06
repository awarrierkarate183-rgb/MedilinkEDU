import { requireRole } from "@/lib/auth/session";
import { loadPortalAnnouncements } from "@/lib/data/announcements";
import { AnnouncementFeed } from "@/components/portal/AnnouncementFeed";
import { ConnectionTrouble } from "@/components/portal/ConnectionTrouble";

export default async function StudentAnnouncementsPage() {
  const { profile } = await requireRole(["STUDENT", "CHAPTER_OFFICER"]);
  const result = await loadPortalAnnouncements({
    chapterId: profile?.chapter_id,
    viewer: "student",
  });
  if (result.error) return <ConnectionTrouble />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Announcements</h1>
        <p className="mt-1 text-sm text-muted">
          MediLink announcements stay here for every member, including people who join after they were published.
          Chapter advisor updates sit under that.
        </p>
      </div>
      <AnnouncementFeed organization={result.organization} chapter={result.chapter} viewer="student" />
    </div>
  );
}
