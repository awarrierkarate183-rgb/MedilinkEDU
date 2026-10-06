import { requireRole } from "@/lib/auth/session";
import { ConnectionTrouble } from "@/components/portal/ConnectionTrouble";
import { MediLinkEventsBoard } from "@/components/portal/MediLinkEventsBoard";
import { loadMediLinkListings } from "@/lib/data/medilink-listings";

export default async function StudentMediLinkEventsPage() {
  const { profile } = await requireRole(["STUDENT", "CHAPTER_OFFICER"]);
  const result = await loadMediLinkListings({
    viewer: "student",
    chapterId: profile?.chapter_id,
  });
  if (result.error) return <ConnectionTrouble />;
  return <MediLinkEventsBoard listings={result.listings} viewer="student" />;
}
