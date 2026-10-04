import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { ConnectionTrouble } from "@/components/portal/ConnectionTrouble";
import { CompetitionDesk } from "@/components/portal/CompetitionDesk";
import { SchoolWorkbook } from "@/components/portal/SchoolWorkbook";
import { loadCompetitionWorkspace } from "@/lib/data/competition-workspace";
import { loadSchoolWorkbook } from "@/lib/data/admin-proceedings";
import type { Actor } from "@/lib/auth/roles";
import type { AppRole } from "@/lib/constants";

export default async function AdminSchoolCompetitionsPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const { chapterId } = await params;
  const { profile } = await requireRole(["SUPER_ADMIN", "STATE_ADMIN"]);
  const admin = createAdminClient();
  if (!admin || !profile) return <ConnectionTrouble />;
  const actor: Actor = {
    id: profile.id,
    role: profile.role as AppRole,
    chapterId: profile.chapter_id,
    stateScope: profile.state_scope,
  };
  const [workbook, data] = await Promise.all([
    loadSchoolWorkbook(admin, actor, chapterId),
    loadCompetitionWorkspace(admin, {
      chapterId,
      profileId: profile.id,
      adminView: true,
    }),
  ]);
  if (!workbook.school) notFound();
  const members = Array.isArray(data.delegation?.legacy_delegation_members)
    ? data.delegation.legacy_delegation_members
    : [];
  return (
    <div className="space-y-6">
      <SchoolWorkbook
        school={workbook.school}
        students={workbook.students}
        seasonLabel={workbook.season?.label}
      />
      <CompetitionDesk
        mode="admin"
        profileId={profile.id}
        chapterId={chapterId}
        seasonLabel={data.season?.label}
        rosterLocked={Boolean(data.season?.roster_locked)}
        nominationsOpen={Boolean(data.season?.invitational_nominations_open)}
        roster={data.roster}
        myEventIds={[]}
        delegation={{
          groupA: members.filter((row) => row.group_label === "A").map((row) => row.profile_id),
          groupB: members.filter((row) => row.group_label === "B").map((row) => row.profile_id),
        }}
        entries={data.entries}
        results={data.results.filter((row) => row.chapter_id === chapterId)}
        annual={data.annual}
        apex={data.apex}
        invitees={data.invitees}
        candidates={data.candidates.filter((row) => row.chapter_id === chapterId)}
        chapters={data.chapters}
        cutoffs={data.cutoffs}
      />
    </div>
  );
}
