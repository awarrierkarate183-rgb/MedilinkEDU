import { requireRole } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { ConnectionTrouble } from "@/components/portal/ConnectionTrouble";
import { CompetitionDesk } from "@/components/portal/CompetitionDesk";
import { StudentEventBoard } from "@/components/portal/StudentEventBoard";
import { loadCompetitionWorkspace } from "@/lib/data/competition-workspace";
import { loadStudentAssignments } from "@/lib/data/admin-proceedings";

export default async function StudentCompetitionsPage() {
  const { profile } = await requireRole(["STUDENT", "CHAPTER_OFFICER"]);
  const admin = createAdminClient();
  if (!admin || !profile) return <ConnectionTrouble />;
  const [data, assigned] = await Promise.all([
    loadCompetitionWorkspace(admin, {
      chapterId: profile.chapter_id,
      profileId: profile.id,
    }),
    loadStudentAssignments(admin, {
      profileId: profile.id,
      chapterId: profile.chapter_id,
    }),
  ]);
  const members = Array.isArray(data.delegation?.legacy_delegation_members)
    ? data.delegation.legacy_delegation_members
    : [];
  return (
    <div className="space-y-6">
      <StudentEventBoard assignments={assigned.assignments} seasonLabel={assigned.season?.label} />
    <CompetitionDesk
      mode={profile.role === "CHAPTER_OFFICER" ? "officer" : "student"}
      profileId={profile.id}
      chapterId={profile.chapter_id}
      seasonLabel={data.season?.label}
      rosterLocked={Boolean(data.season?.roster_locked)}
      nominationsOpen={Boolean(data.season?.invitational_nominations_open)}
      roster={data.roster}
      myEventIds={data.myRegistrations.map((row) => row.catalog_event_id)}
      delegation={{
        groupA: members.filter((row) => row.group_label === "A").map((row) => row.profile_id),
        groupB: members.filter((row) => row.group_label === "B").map((row) => row.profile_id),
      }}
      entries={data.entries}
      results={data.results.filter((row) => row.chapter_id === profile.chapter_id || row.profile_id === profile.id)}
      annual={data.annual}
      apex={data.apex}
      invitees={data.invitees}
      candidates={[]}
      chapters={[]}
      cutoffs={data.cutoffs}
    />
    </div>
  );
}
