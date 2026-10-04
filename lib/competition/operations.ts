import type { SupabaseClient } from "@supabase/supabase-js";
import type { Actor } from "@/lib/auth/roles";
import { canManageChapterCompetitions, isAdminRole } from "@/lib/auth/roles";
import { getCatalogEvent } from "@/lib/content/competition-system";
import {
  assertLegacyEntry,
  assertLegacyGroups,
  assertNominationCap,
  assertNormalEventCap,
  assertNormalFormat,
  canEditLockedRoster,
} from "@/lib/competition/rules";
import {
  assignRanks,
  legacyAdvancesFromRegional,
  legacyAdvancesFromState,
  legacyPointsForPlacement,
  membershipScore,
  normalizeScores,
  normalChapterPointsForPlacement,
  weightedChapterScore,
  type Round,
} from "@/lib/competition/scoring";
import { writeAudit } from "@/lib/platform/operations";

type Admin = SupabaseClient;

export async function currentSeason(admin: Admin) {
  const { data } = await admin
    .from("competition_seasons")
    .select("id, label, roster_locked, invitational_nominations_open, invitational_published, is_current, apex_cycle_id")
    .eq("is_current", true)
    .maybeSingle();
  return data;
}

function chapterForActor(actor: Actor, requested?: string | null) {
  if (isAdminRole(actor.role)) return requested || actor.chapterId;
  return actor.chapterId;
}

export async function registerForNormalEvent(
  admin: Admin,
  actor: Actor,
  input: { eventId: string; profileIds: string[]; chapterId?: string },
) {
  const season = await currentSeason(admin);
  if (!season) return { error: "No competition season is open." };
  const event = getCatalogEvent(input.eventId);
  if (!event || event.tier !== "NORMAL") return { error: "Choose a Normal Event." };
  const chapterId = chapterForActor(actor, input.chapterId);
  if (!chapterId) return { error: "Your account is not attached to a chapter." };
  if (actor.role === "STUDENT" && !input.profileIds.includes(actor.id)) {
    return { error: "Students can only register themselves and teammates they name." };
  }
  if (actor.role === "STUDENT" && input.profileIds.length > 1 && !canManageChapterCompetitions(actor)) {
    // students may still form a team with named chapter members
  }
  const formatError = assertNormalFormat(event.format, input.profileIds.length);
  if (formatError) return { error: formatError };

  const { data: members } = await admin
    .from("profiles")
    .select("id, chapter_id, role, status")
    .in("id", input.profileIds);
  if (!members || members.length !== input.profileIds.length) {
    return { error: "Every teammate must have a MediLink student account." };
  }
  if (members.some((row) => row.chapter_id !== chapterId || row.status !== "ACTIVE")) {
    return { error: "Every teammate must be an active student in this chapter." };
  }

  for (const member of members) {
    const { data: existing } = await admin
      .from("normal_event_registrations")
      .select("catalog_event_id")
      .eq("season_id", season.id)
      .eq("profile_id", member.id);
    const capError = assertNormalEventCap(
      (existing ?? []).map((row) => row.catalog_event_id),
      input.eventId,
    );
    if (capError) return { error: `${capError} (${member.id === actor.id ? "you" : "a teammate"})` };
  }

  let teamId: string | null = null;
  if (input.profileIds.length > 1) {
    const { data: team, error: teamError } = await admin
      .from("normal_teams")
      .insert({
        season_id: season.id,
        chapter_id: chapterId,
        catalog_event_id: input.eventId,
        name: event.name,
        created_by: actor.id,
      })
      .select("id")
      .single();
    if (teamError || !team) return { error: "The team could not be created." };
    teamId = team.id;
    const { error: memberError } = await admin.from("normal_team_members").insert(
      input.profileIds.map((profileId) => ({ team_id: teamId, profile_id: profileId })),
    );
    if (memberError) return { error: "The team roster could not be saved." };
  }

  const { error } = await admin.from("normal_event_registrations").upsert(
    input.profileIds.map((profileId) => ({
      season_id: season.id,
      catalog_event_id: input.eventId,
      chapter_id: chapterId,
      profile_id: profileId,
      team_id: teamId,
      created_by: actor.id,
    })),
    { onConflict: "season_id,catalog_event_id,profile_id" },
  );
  if (error) return { error: error.message };
  await writeAudit(admin, actor.id, "competition.normal_registered", "catalog_event", input.eventId, {
    chapter_id: chapterId,
  });
  return { ok: true };
}

export async function saveLegacyDelegation(
  admin: Admin,
  actor: Actor,
  input: { groupA: string[]; groupB: string[]; chapterId?: string; exceptionReason?: string; exceptionNotes?: string },
) {
  if (!canManageChapterCompetitions(actor) && !isAdminRole(actor.role)) {
    return { error: "Only a chapter officer or advisor can set the Legacy roster." };
  }
  const season = await currentSeason(admin);
  if (!season) return { error: "No competition season is open." };
  const chapterId = chapterForActor(actor, input.chapterId);
  if (!chapterId) return { error: "Choose a chapter." };
  const groupError = assertLegacyGroups(input.groupA, input.groupB);
  if (groupError) return { error: groupError };

  const { data: delegation } = await admin
    .from("legacy_delegations")
    .upsert({ season_id: season.id, chapter_id: chapterId }, { onConflict: "season_id,chapter_id" })
    .select("id")
    .single();
  if (!delegation) return { error: "The Legacy roster could not be created." };

  if (season.roster_locked) {
    return { error: canEditLockedRoster(false, true) };
  }

  await admin.from("legacy_delegation_members").delete().eq("delegation_id", delegation.id);
  const rows = [
    ...input.groupA.map((profileId) => ({ delegation_id: delegation.id, profile_id: profileId, group_label: "A" })),
    ...input.groupB.map((profileId) => ({ delegation_id: delegation.id, profile_id: profileId, group_label: "B" })),
  ];
  if (rows.length) {
    const { error } = await admin.from("legacy_delegation_members").insert(rows);
    if (error) return { error: error.message };
  }
  await writeAudit(admin, actor.id, "competition.legacy_roster", "chapter", chapterId);
  return { ok: true };
}

export async function applyLegacyException(
  admin: Admin,
  actor: Actor,
  input: {
    chapterId?: string;
    profileOut: string;
    profileIn: string;
    reason: "WITHDRAWAL_FROM_SCHOOL" | "MEDICAL" | "NATIONALLY_APPROVED";
    notes?: string;
  },
) {
  if (!isAdminRole(actor.role)) return { error: "Only an administrator can approve a Legacy roster exception." };
  const season = await currentSeason(admin);
  if (!season) return { error: "No competition season is open." };
  const chapterId = chapterForActor(actor, input.chapterId);
  if (!chapterId) return { error: "Choose a chapter." };
  const { data: delegation } = await admin
    .from("legacy_delegations")
    .select("id")
    .eq("season_id", season.id)
    .eq("chapter_id", chapterId)
    .maybeSingle();
  if (!delegation) return { error: "That chapter has no Legacy roster yet." };
  const { data: outgoing } = await admin
    .from("legacy_delegation_members")
    .select("group_label")
    .eq("delegation_id", delegation.id)
    .eq("profile_id", input.profileOut)
    .maybeSingle();
  if (!outgoing) return { error: "That student is not on the locked roster." };
  const { error: exceptionError } = await admin.from("legacy_roster_exceptions").insert({
    delegation_id: delegation.id,
    profile_id_out: input.profileOut,
    profile_id_in: input.profileIn,
    reason: input.reason,
    notes: input.notes || "",
    approved_by: actor.id,
  });
  if (exceptionError) return { error: exceptionError.message };
  await admin
    .from("legacy_delegation_members")
    .delete()
    .eq("delegation_id", delegation.id)
    .eq("profile_id", input.profileOut);
  const { error } = await admin.from("legacy_delegation_members").insert({
    delegation_id: delegation.id,
    profile_id: input.profileIn,
    group_label: outgoing.group_label,
  });
  if (error) return { error: error.message };
  return { ok: true };
}

export async function assignLegacyEvent(
  admin: Admin,
  actor: Actor,
  input: { eventId: string; groupLabel: "A" | "B"; chapterId?: string },
) {
  if (!canManageChapterCompetitions(actor) && !isAdminRole(actor.role)) {
    return { error: "Only a chapter officer or advisor can assign a Legacy event." };
  }
  const season = await currentSeason(admin);
  if (!season) return { error: "No competition season is open." };
  const chapterId = chapterForActor(actor, input.chapterId);
  if (!chapterId) return { error: "Choose a chapter." };

  const { data: existing } = await admin
    .from("legacy_event_entries")
    .select("id")
    .eq("season_id", season.id)
    .eq("chapter_id", chapterId)
    .eq("catalog_event_id", input.eventId)
    .maybeSingle();
  const { data: members } = await admin
    .from("legacy_delegation_members")
    .select("profile_id, group_label, legacy_delegations!inner(season_id, chapter_id)")
    .eq("group_label", input.groupLabel)
    .eq("legacy_delegations.season_id", season.id)
    .eq("legacy_delegations.chapter_id", chapterId);
  const groupError = assertLegacyEntry(input.eventId, Boolean(existing), members?.length ?? 0);
  if (groupError) return { error: groupError };

  const { error } = await admin.from("legacy_event_entries").insert({
    season_id: season.id,
    chapter_id: chapterId,
    catalog_event_id: input.eventId,
    group_label: input.groupLabel,
    created_by: actor.id,
  });
  if (error) return { error: error.message };
  return { ok: true };
}

export async function enterEventResult(
  admin: Admin,
  actor: Actor,
  input: {
    eventId: string;
    round: Round;
    chapterId: string;
    placement: number;
    profileId?: string;
    teamId?: string;
    legacyEntryId?: string;
    published?: boolean;
  },
) {
  if (!isAdminRole(actor.role)) return { error: "Only an administrator can enter results." };
  const season = await currentSeason(admin);
  if (!season) return { error: "No competition season is open." };
  const event = getCatalogEvent(input.eventId);
  if (!event) return { error: "Choose an event." };
  const points =
    event.tier === "LEGACY"
      ? legacyPointsForPlacement(input.round, input.placement)
      : normalChapterPointsForPlacement(input.round, input.placement);

  let legacyEntryId = input.legacyEntryId || null;
  if (event.tier === "LEGACY" && !legacyEntryId) {
    const { data: entry } = await admin
      .from("legacy_event_entries")
      .select("id")
      .eq("season_id", season.id)
      .eq("chapter_id", input.chapterId)
      .eq("catalog_event_id", input.eventId)
      .maybeSingle();
    legacyEntryId = entry?.id ?? null;
  }

  const { error } = await admin.from("event_results").insert({
    season_id: season.id,
    catalog_event_id: input.eventId,
    round: input.round,
    chapter_id: input.chapterId,
    profile_id: input.profileId || null,
    team_id: input.teamId || null,
    legacy_entry_id: legacyEntryId,
    placement: input.placement,
    points,
    published: Boolean(input.published),
    entered_by: actor.id,
  });
  if (error) return { error: error.message };
  await recomputeRankings(admin, { publish: false });
  return { ok: true, points };
}

export function legacyCutoffs(results: Array<{
  legacy_entry_id: string;
  catalog_event_id: string;
  round: Round;
  points: number;
}>) {
  const byEvent = new Map<string, typeof results>();
  for (const row of results) {
    const list = byEvent.get(row.catalog_event_id) ?? [];
    list.push(row);
    byEvent.set(row.catalog_event_id, list);
  }
  const regionalAdvance: string[] = [];
  const stateAdvance: string[] = [];
  for (const rows of byEvent.values()) {
    const regional = rows
      .filter((row) => row.round === "REGIONAL")
      .map((row) => ({ id: row.legacy_entry_id, points: row.points }));
    regionalAdvance.push(...legacyAdvancesFromRegional(regional));
    const state = rows
      .filter((row) => row.round === "REGIONAL" || row.round === "STATE")
      .reduce((map, row) => {
        const current = map.get(row.legacy_entry_id) ?? { id: row.legacy_entry_id, regionalPoints: 0, statePoints: 0 };
        if (row.round === "REGIONAL") current.regionalPoints = row.points;
        if (row.round === "STATE") current.statePoints = row.points;
        map.set(row.legacy_entry_id, current);
        return map;
      }, new Map<string, { id: string; regionalPoints: number; statePoints: number }>());
    stateAdvance.push(...legacyAdvancesFromState([...state.values()]));
  }
  return { regionalAdvance, stateAdvance };
}

export async function recomputeRankings(admin: Admin, opts?: { publish?: boolean }) {
  const season = await currentSeason(admin);
  if (!season) return { error: "No competition season is open." };
  const [{ data: chapters }, { data: results }, { data: registrations }, { data: members }] = await Promise.all([
    admin.from("chapters").select("id, name, state, status").in("status", ["FOUNDING", "ESTABLISHED", "FLAGSHIP_ELIGIBLE"]),
    admin.from("event_results").select("chapter_id, catalog_event_id, round, points, legacy_entry_id").eq("season_id", season.id),
    admin.from("normal_event_registrations").select("chapter_id, profile_id").eq("season_id", season.id),
    admin.from("profiles").select("id, chapter_id, status, role").eq("status", "ACTIVE").in("role", ["STUDENT", "CHAPTER_OFFICER"]),
  ]);

  const chapterRows = chapters ?? [];
  const maxActive = Math.max(
    1,
    ...chapterRows.map((chapter) => (members ?? []).filter((row) => row.chapter_id === chapter.id).length),
  );
  const raw = chapterRows.map((chapter) => {
    const chapterResults = (results ?? []).filter((row) => row.chapter_id === chapter.id);
    const legacy = chapterResults
      .filter((row) => row.legacy_entry_id)
      .reduce((sum, row) => sum + (row.points || 0), 0);
    const normal = chapterResults
      .filter((row) => !row.legacy_entry_id)
      .reduce((sum, row) => sum + (row.points || 0), 0);
    const activeMembers = (members ?? []).filter((row) => row.chapter_id === chapter.id).length;
    const registeredMembers = new Set(
      (registrations ?? []).filter((row) => row.chapter_id === chapter.id).map((row) => row.profile_id),
    ).size;
    return {
      chapterId: chapter.id,
      state: chapter.state,
      legacy,
      normal,
      membership: membershipScore({ activeMembers, registeredMembers, seasonMaxActive: maxActive }),
      score: 0,
    };
  });
  const legacyNorm = normalizeScores(raw.map((row) => row.legacy));
  const normalNorm = normalizeScores(raw.map((row) => row.normal));
  raw.forEach((row, index) => {
    row.legacy = legacyNorm[index];
    row.normal = normalNorm[index];
    row.score = weightedChapterScore({
      legacy: row.legacy,
      normal: row.normal,
      membership: row.membership,
    });
  });
  const ranked = assignRanks(raw);
  const publish = Boolean(opts?.publish);
  const { error } = await admin.from("chapter_annual_rankings").upsert(
    ranked.map((row) => ({
      season_id: season.id,
      chapter_id: row.chapterId,
      legacy_score: row.legacy,
      normal_score: row.normal,
      membership_score: row.membership,
      weighted_score: row.score,
      national_rank: row.nationalRank,
      state_rank: row.stateRank,
      published: publish,
      computed_at: new Date().toISOString(),
    })),
    { onConflict: "season_id,chapter_id" },
  );
  if (error) return { error: error.message };

  if (season.apex_cycle_id) {
    const { data: prior } = await admin
      .from("chapter_annual_rankings")
      .select("chapter_id, legacy_score, normal_score, membership_score, competition_seasons!inner(apex_cycle_id)")
      .eq("competition_seasons.apex_cycle_id", season.apex_cycle_id);
    const totals = new Map<string, { legacy: number; normal: number; membership: number }>();
    for (const row of prior ?? []) {
      const current = totals.get(row.chapter_id) ?? { legacy: 0, normal: 0, membership: 0 };
      current.legacy += Number(row.legacy_score || 0);
      current.normal += Number(row.normal_score || 0);
      current.membership += Number(row.membership_score || 0);
      totals.set(row.chapter_id, current);
    }
    await admin.from("apex_cumulative_ledger").upsert(
      [...totals.entries()].map(([chapterId, scores]) => ({
        apex_cycle_id: season.apex_cycle_id,
        chapter_id: chapterId,
        legacy_score: scores.legacy,
        normal_score: scores.normal,
        membership_score: scores.membership,
        weighted_score: weightedChapterScore(scores),
        published: publish,
        computed_at: new Date().toISOString(),
      })),
      { onConflict: "apex_cycle_id,chapter_id" },
    );
  }
  return { ok: true, count: ranked.length };
}

export async function nominateForInvitational(
  admin: Admin,
  actor: Actor,
  input: { profileId: string; chapterId?: string },
) {
  if (!canManageChapterCompetitions(actor) && !isAdminRole(actor.role)) {
    return { error: "Only a chapter officer or advisor can nominate." };
  }
  const season = await currentSeason(admin);
  if (!season) return { error: "No competition season is open." };
  if (!season.invitational_nominations_open && !isAdminRole(actor.role)) {
    return { error: "The invitational nomination window is closed." };
  }
  const chapterId = chapterForActor(actor, input.chapterId);
  if (!chapterId) return { error: "Choose a chapter." };
  const { data: existing } = await admin
    .from("invitational_candidates")
    .select("profile_id, nominated")
    .eq("season_id", season.id)
    .eq("chapter_id", chapterId);
  const capError = assertNominationCap(
    (existing ?? []).filter((row) => row.nominated).length,
    Boolean(existing?.some((row) => row.profile_id === input.profileId && row.nominated)),
  );
  if (capError) return { error: capError };
  const { error } = await admin.from("invitational_candidates").upsert(
    {
      season_id: season.id,
      profile_id: input.profileId,
      chapter_id: chapterId,
      nominated: true,
      nominated_by: actor.id,
    },
    { onConflict: "season_id,profile_id" },
  );
  if (error) return { error: error.message };
  return { ok: true };
}

export async function setConfidentialScore(
  admin: Admin,
  actor: Actor,
  input: { profileId: string; chapterId: string; score: number },
) {
  if (!isAdminRole(actor.role)) return { error: "Only an administrator can enter the confidential metric." };
  const season = await currentSeason(admin);
  if (!season) return { error: "No competition season is open." };
  const { error } = await admin.from("invitational_candidates").upsert(
    {
      season_id: season.id,
      profile_id: input.profileId,
      chapter_id: input.chapterId,
      confidential_score: input.score,
    },
    { onConflict: "season_id,profile_id" },
  );
  if (error) return { error: error.message };
  return { ok: true };
}

export async function publishInvitees(admin: Admin, actor: Actor, profileIds: string[]) {
  if (!isAdminRole(actor.role)) return { error: "Only an administrator can publish invitees." };
  const season = await currentSeason(admin);
  if (!season) return { error: "No competition season is open." };
  const { data: profiles } = await admin.from("profiles").select("id, chapter_id").in("id", profileIds);
  await admin.from("invitational_invitees").delete().eq("season_id", season.id);
  if (profiles?.length) {
    const { error } = await admin.from("invitational_invitees").insert(
      profiles.map((row) => ({
        season_id: season.id,
        profile_id: row.id,
        chapter_id: row.chapter_id,
        announced: true,
      })),
    );
    if (error) return { error: error.message };
  }
  await admin.from("competition_seasons").update({ invitational_published: true }).eq("id", season.id);
  await writeAudit(admin, actor.id, "competition.invitational_published", "season", season.id);
  return { ok: true };
}
