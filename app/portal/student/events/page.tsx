import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PortalEmpty } from "@/components/portal/PortalEmpty";

export default async function StudentEventsPage() {
  const { profile } = await requireRole(["STUDENT", "CHAPTER_OFFICER"]);
  const supabase = await createClient();
  const query = supabase
    ? supabase
        .from("events")
        .select("id, title, event_date, location, status, chapter_id")
        .in("status", ["PUBLISHED", "REGISTRATION_OPEN", "REGISTRATION_CLOSED"])
        .order("event_date", { ascending: true })
        .limit(25)
    : null;
  const { data, error } = query ? await query : { data: [], error: null };
  const events = error ? [] : data || [];

  return (
    <div className="space-y-6">
      {!events.length ? (
        <PortalEmpty
          title="You're all caught up. New MediLink events will appear here."
          body="Chapter, regional, state, national, workshop, webinar, competition, and deadline events are listed when published."
        />
      ) : (
        <ul className="space-y-2">
          {events.map((event) => (
            <li key={event.id} className="rounded-[var(--radius)] bg-white px-4 py-3">
              <strong>{event.title}</strong>
              <span className="ml-2 text-sm text-muted">{event.status.replaceAll("_", " ")}</span>
              {profile?.chapter_id && event.chapter_id && event.chapter_id !== profile.chapter_id ? (
                <span className="ml-2 text-sm text-muted">Organization event</span>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
