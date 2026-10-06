import type { SupabaseClient } from "@supabase/supabase-js";
import type { Actor } from "@/lib/auth/roles";
import { getCatalogEvent } from "@/lib/content/competition-system";
import { currentSeason } from "@/lib/competition/operations";
import {
  getEventHandbook,
  handbookInstructions,
  handbookPdf,
  handbookRubric,
  type AnyHandbook,
} from "@/lib/content/event-handbook";

export type SchoolRow = {
  id: string;
  school: string;
  name: string;
  city: string | null;
  state: string | null;
  status: string;
  chapterCode: string;
  studentCount: number;
  eventCount: number;
  legacyReady: boolean;
};

export type SchoolStudentRow = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  grade: string;
  status: string;
  normalEvents: string[];
  teammates: string[];
  legacyGroup: string | null;
  legacyEvents: string[];
};

export async function loadSchoolDirectory(admin: SupabaseClient, actor: Actor) {
  const season = await currentSeason(admin);
  let query = admin
    .from("chapters")
    .select("id, name, school, city, state, status, chapter_code")
    .neq("status", "INACTIVE")
    .order("school");
  if (actor.role === "STATE_ADMIN" && actor.stateScope) {
    query = query.eq("state", actor.stateScope);
  }
  const { data: chapters, error } = await query;
  if (error) return { error: error.message, season, schools: [] as SchoolRow[] };

  const ids = (chapters ?? []).map((row) => row.id);
  if (!ids.length) return { season, schools: [] as SchoolRow[] };

  const [students, registrations, delegations] = await Promise.all([
    admin
      .from("profiles")
      .select("id, chapter_id, status")
      .in("chapter_id", ids)
      .in("role", ["STUDENT", "CHAPTER_OFFICER"]),
    season
      ? admin
          .from("normal_event_registrations")
          .select("chapter_id, catalog_event_id")
          .eq("season_id", season.id)
          .in("chapter_id", ids)
      : Promise.resolve({ data: [] }),
    season
      ? admin
          .from("legacy_delegations")
          .select("chapter_id, legacy_delegation_members(profile_id)")
          .eq("season_id", season.id)
          .in("chapter_id", ids)
      : Promise.resolve({ data: [] }),
  ]);

  const studentCount = new Map<string, number>();
  for (const row of students.data ?? []) {
    if (row.status !== "ACTIVE") continue;
    studentCount.set(row.chapter_id, (studentCount.get(row.chapter_id) || 0) + 1);
  }
  const eventCount = new Map<string, Set<string>>();
  for (const row of registrations.data ?? []) {
    const set = eventCount.get(row.chapter_id) ?? new Set<string>();
    set.add(row.catalog_event_id);
    eventCount.set(row.chapter_id, set);
  }
  const legacyReady = new Set(
    (delegations.data ?? [])
      .filter((row) => {
        const members = Array.isArray(row.legacy_delegation_members) ? row.legacy_delegation_members : [];
        return members.length > 0;
      })
      .map((row) => row.chapter_id),
  );

  return {
    season,
    schools: (chapters ?? []).map((chapter) => ({
      id: chapter.id,
      school: chapter.school || chapter.name,
      name: chapter.name,
      city: chapter.city,
      state: chapter.state,
      status: chapter.status,
      chapterCode: chapter.chapter_code,
      studentCount: studentCount.get(chapter.id) || 0,
      eventCount: eventCount.get(chapter.id)?.size || 0,
      legacyReady: legacyReady.has(chapter.id),
    })),
  };
}

export async function loadSchoolWorkbook(admin: SupabaseClient, actor: Actor, chapterId: string) {
  if (actor.role === "CHAPTER_ADVISOR" && actor.chapterId !== chapterId) {
    return { error: "That school is not on your list.", school: null, students: [] as SchoolStudentRow[], season: null };
  }
  const directory = await loadSchoolDirectory(admin, actor);
  const school = directory.schools.find((row) => row.id === chapterId);
  if (!school) return { error: "That school is not on your list.", school: null, students: [] as SchoolStudentRow[], season: directory.season };

  const season = directory.season;
  const [{ data: students }, { data: registrations }, { data: teams }, { data: delegation }, { data: entries }, guidesRes] =
    await Promise.all([
      admin
        .from("profiles")
        .select("id, first_name, last_name, full_name, display_name, email, grade, status, role")
        .eq("chapter_id", chapterId)
        .in("role", ["STUDENT", "CHAPTER_OFFICER"])
        .order("last_name"),
      season
        ? admin
            .from("normal_event_registrations")
            .select("profile_id, catalog_event_id, team_id")
            .eq("season_id", season.id)
            .eq("chapter_id", chapterId)
        : Promise.resolve({ data: [] }),
      season
        ? admin.from("normal_teams").select("id, catalog_event_id").eq("season_id", season.id).eq("chapter_id", chapterId)
        : Promise.resolve({ data: [] }),
      season
        ? admin
            .from("legacy_delegations")
            .select("id, legacy_delegation_members(profile_id, group_label)")
            .eq("season_id", season.id)
            .eq("chapter_id", chapterId)
            .maybeSingle()
        : Promise.resolve({ data: null }),
      season
        ? admin
            .from("legacy_event_entries")
            .select("catalog_event_id, group_label")
            .eq("season_id", season.id)
            .eq("chapter_id", chapterId)
        : Promise.resolve({ data: [] }),
      admin.from("event_guides").select("catalog_event_id, kind, published").eq("published", true),
    ]);

  const teamIds = (teams ?? []).map((row) => row.id);
  const { data: members } = teamIds.length
    ? await admin.from("normal_team_members").select("team_id, profile_id").in("team_id", teamIds)
    : { data: [] };

  const nameById = new Map(
    (students ?? []).map((row) => [
      row.id,
      row.display_name || row.full_name || `${row.first_name} ${row.last_name}`.trim(),
    ]),
  );
  const teammateNames = new Map<string, string[]>();
  for (const seat of members ?? []) {
    const others = (members ?? [])
      .filter((row) => row.team_id === seat.team_id && row.profile_id !== seat.profile_id)
      .map((row) => nameById.get(row.profile_id) || "Teammate");
    teammateNames.set(seat.profile_id, [...new Set([...(teammateNames.get(seat.profile_id) ?? []), ...others])]);
  }

  const delegationMembers = Array.isArray(delegation?.legacy_delegation_members)
    ? delegation.legacy_delegation_members
    : [];
  const groupByStudent = new Map(delegationMembers.map((row) => [row.profile_id, row.group_label]));
  const legacyByGroup = new Map<string, string[]>();
  for (const entry of entries ?? []) {
    const list = legacyByGroup.get(entry.group_label) ?? [];
    list.push(getCatalogEvent(entry.catalog_event_id)?.name || entry.catalog_event_id);
    legacyByGroup.set(entry.group_label, list);
  }

  const eventsByStudent = new Map<string, string[]>();
  for (const row of registrations ?? []) {
    const list = eventsByStudent.get(row.profile_id) ?? [];
    list.push(getCatalogEvent(row.catalog_event_id)?.name || row.catalog_event_id);
    eventsByStudent.set(row.profile_id, list);
  }

  return {
    season,
    school,
    guides: guidesRes.error ? [] : guidesRes.data ?? [],
    students: (students ?? []).map((row) => {
      const group = groupByStudent.get(row.id) || null;
      return {
        id: row.id,
        firstName: row.first_name || "",
        lastName: row.last_name || "",
        name: nameById.get(row.id) || "Student",
        email: row.email || "",
        grade: row.grade || "",
        status: row.status,
        normalEvents: eventsByStudent.get(row.id) ?? [],
        teammates: teammateNames.get(row.id) ?? [],
        legacyGroup: group,
        legacyEvents: group ? legacyByGroup.get(group) ?? [] : [],
      };
    }),
  };
}

export async function loadPublishedGuides(admin: SupabaseClient) {
  const { data, error } = await admin
    .from("event_guides")
    .select("catalog_event_id, kind, title, body, file_path, published")
    .eq("published", true);
  if (error) return [];
  return data ?? [];
}

export type StudentAssignment = {
  eventId: string;
  name: string;
  number: number;
  tier: "NORMAL" | "LEGACY";
  formatLabel: string;
  description: string;
  teammates: string[];
  groupLabel: string | null;
  instructions: { title: string; body: string; filePath: string | null } | null;
  rubric: { title: string; body: string; filePath: string | null } | null;
  handbook: AnyHandbook | null;
};

export async function loadStudentAssignments(
  admin: SupabaseClient,
  opts: { profileId: string; chapterId?: string | null },
) {
  const season = await currentSeason(admin);
  const guides = await loadPublishedGuides(admin);
  const guideFor = (eventId: string, kind: "INSTRUCTIONS" | "RUBRIC") => {
    const row = guides.find((item) => item.catalog_event_id === eventId && item.kind === kind && item.published);
    const handbook = getEventHandbook(eventId);
    if (row?.body) {
      return { title: row.title, body: row.body, filePath: row.file_path || handbookPdf(eventId) };
    }
    if (!handbook) return null;
    return {
      title: kind === "RUBRIC" ? `${handbook.name} rubric` : `${handbook.name} instructions`,
      body: kind === "RUBRIC" ? handbookRubric(handbook) : handbookInstructions(handbook),
      filePath: handbookPdf(eventId),
    };
  };

  if (!season) return { season: null, assignments: [] as StudentAssignment[] };

  const [{ data: registrations }, { data: members }, { data: delegation }, { data: entries }] = await Promise.all([
    admin
      .from("normal_event_registrations")
      .select("catalog_event_id, team_id")
      .eq("season_id", season.id)
      .eq("profile_id", opts.profileId),
    admin
      .from("normal_team_members")
      .select("team_id, profile_id, profiles(full_name, display_name, first_name, last_name)")
      .neq("profile_id", opts.profileId),
    opts.chapterId
      ? admin
          .from("legacy_delegations")
          .select("id, legacy_delegation_members(profile_id, group_label)")
          .eq("season_id", season.id)
          .eq("chapter_id", opts.chapterId)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    opts.chapterId
      ? admin
          .from("legacy_event_entries")
          .select("catalog_event_id, group_label")
          .eq("season_id", season.id)
          .eq("chapter_id", opts.chapterId)
      : Promise.resolve({ data: [] }),
  ]);

  const teamIds = [...new Set((registrations ?? []).map((row) => row.team_id).filter(Boolean))];
  const teammateNames = new Map<string, string[]>();
  for (const seat of members ?? []) {
    if (!teamIds.includes(seat.team_id)) continue;
    const person = Array.isArray(seat.profiles) ? seat.profiles[0] : seat.profiles;
    const name =
      person?.display_name ||
      person?.full_name ||
      [person?.first_name, person?.last_name].filter(Boolean).join(" ") ||
      "Teammate";
    const eventId = (registrations ?? []).find((row) => row.team_id === seat.team_id)?.catalog_event_id;
    if (!eventId) continue;
    teammateNames.set(eventId, [...new Set([...(teammateNames.get(eventId) ?? []), name])]);
  }

  const assignments: StudentAssignment[] = [];
  for (const row of registrations ?? []) {
    const event = getCatalogEvent(row.catalog_event_id);
    if (!event) continue;
    assignments.push({
      eventId: event.id,
      name: event.name,
      number: event.number,
      tier: event.tier,
      formatLabel: event.formatLabel,
      description: event.description,
      teammates: teammateNames.get(event.id) ?? [],
      groupLabel: null,
      instructions: guideFor(event.id, "INSTRUCTIONS"),
      rubric: guideFor(event.id, "RUBRIC"),
      handbook: getEventHandbook(event.id),
    });
  }

  const myGroup = Array.isArray(delegation?.legacy_delegation_members)
    ? delegation.legacy_delegation_members.find((row) => row.profile_id === opts.profileId)?.group_label
    : null;
  for (const entry of entries ?? []) {
    if (myGroup && entry.group_label !== myGroup) continue;
    if (!myGroup) continue;
    const event = getCatalogEvent(entry.catalog_event_id);
    if (!event) continue;
    assignments.push({
      eventId: event.id,
      name: event.name,
      number: event.number,
      tier: event.tier,
      formatLabel: event.formatLabel,
      description: event.description,
      teammates: [],
      groupLabel: entry.group_label,
      instructions: guideFor(event.id, "INSTRUCTIONS"),
      rubric: guideFor(event.id, "RUBRIC"),
      handbook: getEventHandbook(event.id),
    });
  }

  return { season, assignments };
}
