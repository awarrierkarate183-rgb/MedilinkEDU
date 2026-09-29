import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { ConnectionTrouble } from "@/components/portal/ConnectionTrouble";
import { PortalEmpty } from "@/components/portal/PortalEmpty";

export default async function StudentEventsPage() {
  const { profile } = await requireRole(["STUDENT", "CHAPTER_OFFICER", "CHAPTER_ADVISOR", "STATE_ADMIN", "SUPER_ADMIN"]);
  const supabase = await createClient();
  const { data, error } = supabase
    ? await supabase
        .from("events")
        .select("id, title, start_at, location, status, chapter_id")
        .in("status", ["PUBLISHED", "REGISTRATION_OPEN", "REGISTRATION_CLOSED"])
        .order("start_at", { ascending: true })
        .limit(25)
    : { data: [], error: null };

  if (error) return <ConnectionTrouble />;

  return (
    <div className="space-y-6">
      {!data?.length ? (
        <PortalEmpty
          title="You're all caught up. New MediLink events will appear here."
          body="Chapter, regional, state, national, workshop, webinar, competition, and deadline events are listed when published."
        />
      ) : (
        <ul className="space-y-2">
          {data.map((event) => (
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
