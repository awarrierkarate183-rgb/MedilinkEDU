import { requireRole } from "@/lib/auth/session";
import { ConnectionTrouble } from "@/components/portal/ConnectionTrouble";
import { MediLinkEventsBoard } from "@/components/portal/MediLinkEventsBoard";
import { MediLinkListingForm } from "@/components/portal/MediLinkListingForm";
import { loadMediLinkListings } from "@/lib/data/medilink-listings";

export default async function AdvisorMediLinkEventsPage() {
  const { profile } = await requireRole(["CHAPTER_ADVISOR", "STATE_ADMIN", "SUPER_ADMIN"]);
  const result = await loadMediLinkListings({
    viewer: "advisor",
    chapterId: profile?.chapter_id,
  });
  if (result.error) return <ConnectionTrouble />;

  return (
    <div className="space-y-8">
      {profile?.chapter_id ? <MediLinkListingForm variant="advisor" /> : (
        <section className="rounded-[var(--radius)] bg-white p-5 text-sm text-muted">
          Attach a chapter before you can add a listing that stays in that chapter.
        </section>
      )}
      <MediLinkEventsBoard listings={result.listings} viewer="advisor" />
    </div>
  );
}
