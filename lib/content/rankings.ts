import { createAdminClient } from "@/lib/supabase/admin";

export type RankingRow = {
  chapterId: string;
  name: string;
  rank: number;
  state?: string | null;
};

export type PublishedStandings = {
  national: RankingRow[];
  byState: Array<{ state: string; rows: RankingRow[] }>;
  apex: RankingRow[];
  invitees: Array<{ id: string; name: string }>;
};

const empty: PublishedStandings = {
  national: [],
  byState: [],
  apex: [],
  invitees: [],
};

export async function loadPublishedCompetitionStandings(): Promise<PublishedStandings> {
  const admin = createAdminClient();
  if (!admin) return empty;

  try {
    const [{ data: annual }, { data: apex }, { data: invitees }] = await Promise.all([
      admin
        .from("chapter_annual_rankings")
        .select("chapter_id, national_rank, state_rank, chapters(id, name, state)")
        .eq("published", true)
        .order("national_rank", { ascending: true }),
      admin
        .from("apex_cumulative_ledger")
        .select("chapter_id, weighted_score, chapters(id, name)")
        .eq("published", true)
        .order("weighted_score", { ascending: false }),
      admin
        .from("invitational_invitees")
        .select("id, profiles(full_name, display_name)")
        .eq("announced", true),
    ]);

    const national = (annual ?? [])
      .filter((row) => row.national_rank && row.national_rank <= 10)
      .map((row) => ({
        chapterId: row.chapter_id as string,
        name: chapterName(row.chapters),
        rank: Number(row.national_rank),
        state: chapterState(row.chapters),
      }));

    const byStateMap = new Map<string, RankingRow[]>();
    for (const row of annual ?? []) {
      const state = chapterState(row.chapters);
      if (!state || !row.state_rank || row.state_rank > 10) continue;
      const list = byStateMap.get(state) ?? [];
      list.push({
        chapterId: row.chapter_id as string,
        name: chapterName(row.chapters),
        rank: Number(row.state_rank),
        state,
      });
      byStateMap.set(state, list);
    }

    return {
      national,
      byState: [...byStateMap.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([state, rows]) => ({
          state,
          rows: rows.sort((left, right) => left.rank - right.rank),
        })),
      apex: (apex ?? []).map((row, index) => ({
        chapterId: row.chapter_id as string,
        name: chapterName(row.chapters),
        rank: index + 1,
      })),
      invitees: (invitees ?? []).map((row) => ({
        id: row.id as string,
        name: personName(row.profiles) || "Invitee",
      })),
    };
  } catch {
    return empty;
  }
}

function chapterName(value: unknown) {
  if (Array.isArray(value)) return String(value[0]?.name || "Chapter");
  if (value && typeof value === "object" && "name" in value) {
    return String((value as { name?: string }).name || "Chapter");
  }
  return "Chapter";
}

function chapterState(value: unknown) {
  if (Array.isArray(value)) return (value[0]?.state as string | null) ?? null;
  if (value && typeof value === "object" && "state" in value) {
    return ((value as { state?: string | null }).state) ?? null;
  }
  return null;
}

function personName(value: unknown) {
  const row = Array.isArray(value) ? value[0] : value;
  if (!row || typeof row !== "object") return "";
  const record = row as { display_name?: string; full_name?: string };
  return record.display_name || record.full_name || "";
}
