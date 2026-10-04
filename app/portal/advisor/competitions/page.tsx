import { requireRole } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { ConnectionTrouble } from "@/components/portal/ConnectionTrouble";
import { AssignEventForm } from "@/components/portal/AssignEventForm";
import { CompetitionDesk } from "@/components/portal/CompetitionDesk";
import { SchoolWorkbook } from "@/components/portal/SchoolWorkbook";
import { loadCompetitionWorkspace } from "@/lib/data/competition-workspace";
import { loadSchoolWorkbook } from "@/lib/data/admin-proceedings";
import type { Actor } from "@/lib/auth/roles";
import type { AppRole } from "@/lib/constants";

export default async function AdvisorCompetitionsPage() {
  const { profile } = await requireRole(["CHAPTER_ADVISOR", "STATE_ADMIN", "SUPER_ADMIN"]);
  const admin = createAdminClient();
  if (!admin || !profile) return <ConnectionTrouble />;
  const actor: Actor = {
    id: profile.id,
    role: profile.role as AppRole,
    chapterId: profile.chapter_id,
    stateScope: profile.state_scope,
  };
  const [data, workbook] = await Promise.all([
    loadCompetitionWorkspace(admin, {
      chapterId: profile.chapter_id,
      profileId: profile.id,
    }),
    profile.chapter_id
      ? loadSchoolWorkbook(admin, actor, profile.chapter_id)
      : Promise.resolve(null),
  ]);
  const members = Array.isArray(data.delegation?.legacy_delegation_members)
    ? data.delegation.legacy_delegation_members
    : [];
  return (
    <div className="space-y-6">
      {workbook?.school ? (
        <SchoolWorkbook
          school={workbook.school}
          students={workbook.students}
          seasonLabel={workbook.season?.label}
          backHref={null}
        />
      ) : (
        <>
          <section className="rounded-[var(--radius)] bg-white p-5">
            <h2 className="text-xl font-semibold">How to enter a student in a competition</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">
              <li>Type the student first and last names exactly as they appear on your roster.</li>
              <li>Choose the competition they are doing.</li>
              <li>Add teammates only if the event allows a team.</li>
              <li>Submit. Each student will see the event, format, and rubric slots on their Competitions page immediately.</li>
            </ol>
          </section>
          {profile.chapter_id ? (
            <AssignEventForm chapterId={profile.chapter_id} school="your chapter" />
          ) : (
            <p className="text-sm text-muted">
              This account is not attached to a chapter, so it cannot enter students by name. Use the national Administration portal to open a school workbook.
            </p>
          )}
        </>
      )}
    <CompetitionDesk
      mode="officer"
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
      results={data.results.filter((row) => row.chapter_id === profile.chapter_id)}
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
