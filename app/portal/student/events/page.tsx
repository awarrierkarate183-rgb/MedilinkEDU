import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { ConnectionTrouble } from "@/components/portal/ConnectionTrouble";
import { PortalEventList } from "@/components/portal/PortalEventList";
import { StudentEventBoard } from "@/components/portal/StudentEventBoard";
import { loadStudentAssignments } from "@/lib/data/admin-proceedings";
import { loadEventChoices } from "@/lib/competition/choices";

export default async function StudentEventsPage() {
  const { profile } = await requireRole(["STUDENT", "CHAPTER_OFFICER"]);
  const admin = createAdminClient();
  if (!admin || !profile) return <ConnectionTrouble />;
  const [assigned, requested] = await Promise.all([
    loadStudentAssignments(admin, {
      profileId: profile.id,
      chapterId: profile.chapter_id,
    }),
    loadEventChoices(admin, { profileId: profile.id }),
  ]);
  const pending = requested.choices.filter((row) => row.status === "PENDING");

  return (
    <div className="space-y-8">
      <section className="rounded-[var(--radius)] bg-white p-5">
        <h1 className="text-xl font-semibold">Events</h1>
        <p className="mt-2 text-sm text-muted">
          Every Normal Event and Legacy Event is listed here with the official format, instructions, and rubric. Use
          Choose Event to tell your advisor what you want to do.
        </p>
        <p className="mt-4">
          <Link href="/portal/student/choose-event" className="text-sm font-semibold">
            Choose Event
          </Link>
        </p>
      </section>
      <StudentEventBoard assignments={assigned.assignments} seasonLabel={assigned.season?.label} />
      {pending.length ? (
        <section className="rounded-[var(--radius)] bg-white p-5">
          <h2 className="font-semibold">Waiting on your advisor</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {pending.map((choice) => (
              <li key={choice.id}>
                <strong>{choice.eventName}</strong>
                {choice.intent ? <span className="ml-2 text-muted">{choice.intent}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <PortalEventList audience="student" />
    </div>
  );
}
