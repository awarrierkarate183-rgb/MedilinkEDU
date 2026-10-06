import { requireRole } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { ConnectionTrouble } from "@/components/portal/ConnectionTrouble";
import { ProjectPrepBoard } from "@/components/portal/ProjectPrepBoard";
import { loadStudentAssignments } from "@/lib/data/admin-proceedings";
import { ensureAssignedPrep, loadStudentPrep } from "@/lib/competition/prep";

export default async function StudentProjectsPage() {
  const { profile } = await requireRole(["STUDENT", "CHAPTER_OFFICER"]);
  const admin = createAdminClient();
  if (!admin || !profile) return <ConnectionTrouble />;
  const assigned = await loadStudentAssignments(admin, {
    profileId: profile.id,
    chapterId: profile.chapter_id,
  });
  if (assigned.season && profile.chapter_id && assigned.assignments.length) {
    await ensureAssignedPrep(admin, {
      seasonId: assigned.season.id,
      chapterId: profile.chapter_id,
      profileId: profile.id,
      eventIds: assigned.assignments.map((item) => item.eventId),
    });
  }
  const items = await loadStudentPrep(admin, {
    profileId: profile.id,
    seasonId: assigned.season?.id,
  });

  return (
    <div className="space-y-6">
      <section className="rounded-[var(--radius)] bg-white p-5">
        <h1 className="text-xl font-semibold">Projects</h1>
        <p className="mt-2 text-sm text-muted">
          After you are entered in an event, this page fills with the work you need to develop and the drafts you need
          to submit before the competition date. Official rubrics stay on Resources.
        </p>
      </section>
      <ProjectPrepBoard items={items} />
    </div>
  );
}
