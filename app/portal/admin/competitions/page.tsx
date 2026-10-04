import { requireRole } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { ConnectionTrouble } from "@/components/portal/ConnectionTrouble";
import { CompetitionDesk } from "@/components/portal/CompetitionDesk";
import { loadCompetitionWorkspace } from "@/lib/data/competition-workspace";

export default async function AdminCompetitionsPage() {
  const { profile } = await requireRole(["SUPER_ADMIN", "STATE_ADMIN"]);
  const admin = createAdminClient();
  if (!admin || !profile) return <ConnectionTrouble />;
  const data = await loadCompetitionWorkspace(admin, {
    chapterId: profile.chapter_id,
    profileId: profile.id,
    adminView: true,
  });
  const members = Array.isArray(data.delegation?.legacy_delegation_members)
    ? data.delegation.legacy_delegation_members
    : [];
  return (
    <CompetitionDesk
      mode="admin"
      profileId={profile.id}
      chapterId={profile.chapter_id}
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
      results={data.results}
      annual={data.annual}
      apex={data.apex}
      invitees={data.invitees}
      candidates={data.candidates}
      chapters={data.chapters}
      cutoffs={data.cutoffs}
    />
  );
}
