import { requireRole } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { ConnectionTrouble } from "@/components/portal/ConnectionTrouble";
import { ChooseEventForm } from "@/components/portal/ChooseEventForm";
import { CompetitionDesk } from "@/components/portal/CompetitionDesk";
import { StudentEventBoard } from "@/components/portal/StudentEventBoard";
import { loadEventChoices } from "@/lib/competition/choices";
import { loadCompetitionWorkspace } from "@/lib/data/competition-workspace";
import { loadStudentAssignments } from "@/lib/data/admin-proceedings";

export default async function StudentCompetitionsPage() {
  const { profile } = await requireRole(["STUDENT", "CHAPTER_OFFICER"]);
  const admin = createAdminClient();
  if (!admin || !profile) return <ConnectionTrouble />;
  const [data, assigned, choiceData] = await Promise.all([
    loadCompetitionWorkspace(admin, {
      chapterId: profile.chapter_id,
      profileId: profile.id,
    }),
    loadStudentAssignments(admin, {
      profileId: profile.id,
      chapterId: profile.chapter_id,
    }),
    loadEventChoices(admin, { profileId: profile.id }),
  ]);
  const members = Array.isArray(data.delegation?.legacy_delegation_members)
    ? data.delegation.legacy_delegation_members
    : [];
  return (
    <div className="space-y-6">
      <section className="rounded-[var(--radius)] bg-white p-5">
        <h1 className="text-xl font-semibold">Competitions</h1>
        <p className="mt-2 text-sm text-muted">
          Season {choiceData.season?.label || assigned.season?.label || "not opened"}. Ask for the events you want.
          When your advisor enters you, the assignment and rubric open below, and Projects fills with what to develop
          and submit before the competition date.
        </p>
        {!profile.chapter_id ? (
          <p className="mt-3 text-sm text-muted">
            Your account is not attached to a chapter yet, so a choice cannot reach an advisor.
          </p>
        ) : null}
      </section>
      {choiceData.choices.length ? (
        <section className="rounded-[var(--radius)] bg-white p-5">
          <h2 className="font-semibold">Your current choices</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {choiceData.choices.map((choice) => (
              <li key={choice.id}>
                <strong>{choice.eventName}</strong>
                <span className="ml-2 text-muted">{choice.status.replaceAll("_", " ").toLowerCase()}</span>
                {choice.intent ? <span className="ml-2 text-muted">· {choice.intent}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {profile.chapter_id ? <ChooseEventForm existing={choiceData.choices} /> : null}
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
