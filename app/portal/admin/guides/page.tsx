import { requireRole } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { ConnectionTrouble } from "@/components/portal/ConnectionTrouble";
import { AdminGuideDesk } from "@/components/portal/AdminGuideDesk";
import { listEventGuides } from "@/lib/guides/operations";
import { normalEventHandbook } from "@/lib/content/normal-event-handbook";
import { legacyEventHandbook } from "@/lib/content/legacy-event-handbook";

export default async function AdminGuidesPage() {
  const { profile } = await requireRole(["SUPER_ADMIN", "STATE_ADMIN"]);
  const admin = createAdminClient();
  if (!admin || !profile) return <ConnectionTrouble />;
  const guides = await listEventGuides(admin);
  return (
    <div className="space-y-6">
      <section className="rounded-[var(--radius)] bg-white p-5">
        <h2 className="text-xl font-semibold">Event guides</h2>
        <p className="mt-2 text-sm text-muted">
          When an advisor or administrator enters a student in a Normal or
          Legacy Event, the student portal opens that event's official
          instructions and rubric. Publish each handbook once, then
          upload replacements here any time.
        </p>
      </section>
      <AdminGuideDesk />
      <section className="overflow-x-auto rounded-[var(--radius)] bg-white p-5">
        <h3 className="font-semibold">Published status</h3>
        <table className="mt-4 w-full min-w-[36rem] text-left text-sm">
          <thead>
            <tr className="text-muted">
              <th className="py-2 pr-3 font-semibold">Event</th>
              <th className="py-2 pr-3 font-semibold">Instructions</th>
              <th className="py-2 font-semibold">Rubric</th>
            </tr>
          </thead>
          <tbody>
            {[
              ...normalEventHandbook.map((event) => ({ ...event, label: `${event.number}. ${event.name}` })),
              ...legacyEventHandbook.map((event) => ({ ...event, label: `L${event.number}. ${event.name}` })),
            ].map((event) => {
              const instructions = guides.find(
                (row) => row.catalog_event_id === event.id && row.kind === "INSTRUCTIONS",
              );
              const rubric = guides.find((row) => row.catalog_event_id === event.id && row.kind === "RUBRIC");
              return (
                <tr key={event.id} className="border-t border-border">
                  <td className="py-2 pr-3 font-semibold">{event.label}</td>
                  <td className="py-2 pr-3">{instructions?.published ? "Published" : "Handbook fallback"}</td>
                  <td className="py-2">{rubric?.published ? "Published" : "Handbook fallback"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
