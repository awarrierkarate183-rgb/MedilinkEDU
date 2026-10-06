import { requireRole } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { ConnectionTrouble } from "@/components/portal/ConnectionTrouble";
import { ChapterPointsBoard } from "@/components/portal/ChapterPointsBoard";
import { loadChapterStandings } from "@/lib/data/chapter-standings";

export default async function StudentAchievementsPage() {
  const { profile } = await requireRole(["STUDENT", "CHAPTER_OFFICER"]);
  const admin = createAdminClient();
  if (!admin || !profile) return <ConnectionTrouble />;
  const standing = await loadChapterStandings(admin, profile.chapter_id);
  return <ChapterPointsBoard standing={standing} audience="student" />;
}
