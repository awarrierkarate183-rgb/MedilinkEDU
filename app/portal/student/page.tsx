import Link from "next/link";
import { PortalEmpty } from "@/components/portal/PortalEmpty";
import { requireRole } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { loadStudentDashboard } from "@/lib/data/dashboards";
import { loadStudentAssignments } from "@/lib/data/admin-proceedings";

function roleLabel(role?: string | null) {
  if (role === "CHAPTER_OFFICER") return "Chapter officer";
  return "Student";
}

export default async function StudentDashboard() {
  const { profile } = await requireRole(["STUDENT", "CHAPTER_OFFICER"]);
  const result = await loadStudentDashboard(profile?.id || "", profile?.chapter_id ?? null);
  const admin = createAdminClient();
  const assigned = admin && profile
    ? await loadStudentAssignments(admin, { profileId: profile.id, chapterId: profile.chapter_id })
    : { assignments: [] };
  const data = result.data;
  const chapter = data?.chapter;
  const name = profile?.full_name || [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "Student";

  return (
    <div className="space-y-8">
      <section className="rounded-[var(--radius)] bg-white p-5">
        <h2 className="text-lg font-semibold">Your information</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted">Name</dt>
            <dd className="font-semibold">{name}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Email</dt>
            <dd className="font-semibold">{profile?.email || "Not on file"}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Grade</dt>
            <dd className="font-semibold">{profile?.grade || "Not set"}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Role</dt>
            <dd className="font-semibold">{roleLabel(profile?.role)}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm text-muted">Chapter</dt>
            <dd className="font-semibold">
              {chapter?.school || chapter?.name || "Your advisor has not attached a chapter yet"}
            </dd>
            {chapter?.city || chapter?.state ? (
              <p className="text-sm text-muted">
                {[chapter.city, chapter.state].filter(Boolean).join(", ")}
              </p>
            ) : null}
          </div>
        </dl>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="text-lg font-semibold">Your competitions</h2>
          <Link href="/portal/student/choose-event" className="text-sm font-semibold">
            Choose Event
          </Link>
        </div>
        {!assigned.assignments.length ? (
          <PortalEmpty
            title="No events assigned yet"
            body="Open Choose Event to send your picks to your advisor. When they enter you, the event and rubric show here."
          />
        ) : (
          <ul className="space-y-2">
            {assigned.assignments.map((item) => (
              <li key={`${item.tier}-${item.eventId}`} className="rounded-[var(--radius)] bg-white px-4 py-3">
                <strong>{item.name}</strong>
                <span className="ml-2 text-sm text-muted">
                  {item.tier === "NORMAL" ? "Normal Event" : "Legacy Event"} · {item.formatLabel}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="text-lg font-semibold">Advisor updates</h2>
          <Link href="/portal/student/announcements" className="text-sm font-semibold">
            All updates
          </Link>
        </div>
        {!data?.announcements.length ? (
          <PortalEmpty
            title="No advisor updates yet"
            body="When your chapter advisor publishes an announcement, it will show here."
          />
        ) : (
          <ul className="space-y-3">
            {data.announcements.map((update) => (
              <li key={update.id} className="rounded-[var(--radius)] bg-white px-4 py-4">
                <p className="text-sm text-muted">
                  {new Date(update.created_at).toLocaleDateString()}
                </p>
                <h3 className="font-semibold">{update.title}</h3>
                <p className="mt-1 text-sm text-muted">{update.body || update.message}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="text-lg font-semibold">Upcoming events</h2>
          <Link href="/portal/student/events" className="text-sm font-semibold">
            My events
          </Link>
        </div>
        {!data?.events.length ? (
          <PortalEmpty
            title="No upcoming events"
            body="Published chapter events will appear here."
          />
        ) : (
          <ul className="space-y-2">
            {data.events.map((event) => (
              <li key={event.id} className="rounded-[var(--radius)] bg-white px-4 py-3">
                <strong>{event.title}</strong>
                <span className="ml-2 text-sm text-muted">
                  {event.event_date
                    ? new Date(event.event_date).toLocaleDateString()
                    : event.status.replaceAll("_", " ")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
