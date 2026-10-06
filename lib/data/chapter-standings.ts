import type { SupabaseClient } from "@supabase/supabase-js";
import { getCatalogEvent } from "@/lib/content/competition-system";
import { currentSeason } from "@/lib/competition/operations";

export type ChapterPlacement = {
  eventId: string;
  eventName: string;
  tier: "NORMAL" | "LEGACY";
  round: string;
  placement: number;
  points: number;
  published: boolean;
};

export type ChapterStanding = {
  seasonLabel: string | null;
  weighted: number;
  legacy: number;
  normal: number;
  membership: number;
  nationalRank: number | null;
  stateRank: number | null;
  published: boolean;
  placements: ChapterPlacement[];
  wins: ChapterPlacement[];
};

export async function loadChapterStandings(admin: SupabaseClient, chapterId: string | null) {
  const empty: ChapterStanding = {
    seasonLabel: null,
    weighted: 0,
    legacy: 0,
    normal: 0,
    membership: 0,
    nationalRank: null,
    stateRank: null,
    published: false,
    placements: [],
    wins: [],
  };
  if (!chapterId) return empty;
  const season = await currentSeason(admin);
  if (!season) return empty;

  const [{ data: ranking }, { data: results }] = await Promise.all([
    admin
      .from("chapter_annual_rankings")
      .select("weighted_score, legacy_score, normal_score, membership_score, national_rank, state_rank, published")
      .eq("season_id", season.id)
      .eq("chapter_id", chapterId)
      .maybeSingle(),
    admin
      .from("event_results")
      .select("catalog_event_id, round, placement, points, published")
      .eq("season_id", season.id)
      .eq("chapter_id", chapterId)
      .order("round")
      .order("placement"),
  ]);

  const placements = (results ?? [])
    .map((row) => {
      const event = getCatalogEvent(row.catalog_event_id);
      if (!event) return null;
      return {
        eventId: event.id,
        eventName: event.name,
        tier: event.tier,
        round: row.round,
        placement: row.placement,
        points: Number(row.points || 0),
        published: Boolean(row.published),
      } satisfies ChapterPlacement;
    })
    .filter((row): row is ChapterPlacement => Boolean(row))
    .sort((a, b) => a.placement - b.placement || a.eventName.localeCompare(b.eventName));

  return {
    seasonLabel: season.label,
    weighted: Number(ranking?.weighted_score || 0),
    legacy: Number(ranking?.legacy_score || 0),
    normal: Number(ranking?.normal_score || 0),
    membership: Number(ranking?.membership_score || 0),
    nationalRank: ranking?.national_rank ?? null,
    stateRank: ranking?.state_rank ?? null,
    published: Boolean(ranking?.published),
    placements,
    wins: placements.filter((row) => row.placement === 1),
  };
}
