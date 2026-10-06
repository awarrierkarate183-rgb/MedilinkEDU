import { requireRole } from "@/lib/auth/session";
import { ConnectionTrouble } from "@/components/portal/ConnectionTrouble";
import { MediLinkEventsBoard } from "@/components/portal/MediLinkEventsBoard";
import { MediLinkListingForm } from "@/components/portal/MediLinkListingForm";
import { loadMediLinkListings } from "@/lib/data/medilink-listings";

export default async function AdminMediLinkEventsPage() {
  await requireRole(["SUPER_ADMIN", "STATE_ADMIN"]);
  const result = await loadMediLinkListings({ viewer: "admin" });
  if (result.error) return <ConnectionTrouble />;

  return (
    <div className="space-y-8">
      <section className="rounded-[var(--radius)] bg-white p-5">
        <h1 className="text-xl font-semibold">MediLink Events</h1>
        <p className="mt-2 text-sm text-muted">
          Publish a volunteer opening, event, internship, or research seat for every chapter. Advisors can add their
          own listings, but those stay inside that chapter.
        </p>
      </section>
      <MediLinkListingForm variant="admin" />
      <MediLinkEventsBoard listings={result.listings} viewer="admin" showIntro={false} />
    </div>
  );
}
