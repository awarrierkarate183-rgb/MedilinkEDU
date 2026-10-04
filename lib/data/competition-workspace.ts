import type { SupabaseClient } from "@supabase/supabase-js";
import { catalogEvents, legacyEvents, normalEvents } from "@/lib/content/competition-system";
import { currentSeason, legacyCutoffs } from "@/lib/competition/operations";

export async function loadCompetitionWorkspace(
  admin: SupabaseClient,
  opts: { chapterId?: string | null; profileId?: string | null; adminView?: boolean },
) {
  const season = await currentSeason(admin);
  const chapterFilter = opts.chapterId;
  const [
    registrations,
    teams,
    roster,
    delegation,
    entries,
    results,
    annual,
    apex,
    invitees,
    candidates,
    chapters,
  ] = await Promise.all([
    season
      ? admin
          .from("normal_event_registrations")
          .select("id, catalog_event_id, profile_id, team_id, chapter_id")
          .eq("season_id", season.id)
          .match(chapterFilter ? { chapter_id: chapterFilter } : {})
      : Promise.resolve({ data: [] }),
    season
      ? admin.from("normal_teams").select("id, name, catalog_event_id, chapter_id").eq("season_id", season.id)
      : Promise.resolve({ data: [] }),
    chapterFilter
      ? admin
          .from("profiles")
          .select("id, full_name, display_name, email, role, status")
          .eq("chapter_id", chapterFilter)
          .eq("status", "ACTIVE")
          .in("role", ["STUDENT", "CHAPTER_OFFICER"])
      : Promise.resolve({ data: [] }),
    season && chapterFilter
      ? admin
          .from("legacy_delegations")
          .select("id, legacy_delegation_members(profile_id, group_label)")
          .eq("season_id", season.id)
          .eq("chapter_id", chapterFilter)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    season
      ? admin
          .from("legacy_event_entries")
          .select("id, catalog_event_id, group_label, chapter_id")
          .eq("season_id", season.id)
          .match(chapterFilter ? { chapter_id: chapterFilter } : {})
      : Promise.resolve({ data: [] }),
    season
      ? admin
          .from("event_results")
          .select("id, catalog_event_id, round, chapter_id, profile_id, team_id, legacy_entry_id, placement, points, published")
          .eq("season_id", season.id)
      : Promise.resolve({ data: [] }),
    season
      ? admin
          .from("chapter_annual_rankings")
          .select("chapter_id, weighted_score, national_rank, state_rank, published, chapters(name, state)")
          .eq("season_id", season.id)
          .order("national_rank", { ascending: true })
      : Promise.resolve({ data: [] }),
    admin
      .from("apex_cumulative_ledger")
      .select("chapter_id, weighted_score, published, chapters(name)")
      .eq("published", true)
      .order("weighted_score", { ascending: false }),
    admin
      .from("invitational_invitees")
      .select("id, profile_id, announced, profiles(full_name, display_name)")
      .eq("announced", true),
    opts.adminView && season
      ? admin
          .from("invitational_candidates")
          .select("id, profile_id, chapter_id, confidential_score, nominated, profiles(full_name, display_name), chapters(name)")
          .eq("season_id", season.id)
      : Promise.resolve({ data: [] }),
    opts.adminView
      ? admin.from("chapters").select("id, name, school, state, status").in("status", ["FOUNDING", "ESTABLISHED", "FLAGSHIP_ELIGIBLE"])
      : Promise.resolve({ data: [] }),
  ]);

  const visibleResults = (results.data ?? []).filter((row) => row.published || opts.adminView);
  const cutoffs = legacyCutoffs(
    visibleResults
      .filter((row) => row.legacy_entry_id)
      .map((row) => ({
        legacy_entry_id: row.legacy_entry_id as string,
        catalog_event_id: row.catalog_event_id,
        round: row.round,
        points: row.points,
      })),
  );

  const myRegs = opts.profileId
    ? (registrations.data ?? []).filter((row) => row.profile_id === opts.profileId)
    : registrations.data ?? [];

  return {
    season,
    normalEvents,
    legacyEvents,
    catalogEvents,
    roster: roster.data ?? [],
    registrations: registrations.data ?? [],
    myRegistrations: myRegs,
    teams: teams.data ?? [],
    delegation: delegation.data,
    entries: entries.data ?? [],
    results: visibleResults,
    annual: (annual.data ?? []).filter((row) => row.published || opts.adminView),
    apex: apex.data ?? [],
    invitees: invitees.data ?? [],
    candidates: opts.adminView ? candidates.data ?? [] : [],
    chapters: chapters.data ?? [],
    cutoffs,
  };
}
