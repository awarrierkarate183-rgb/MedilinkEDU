import {
  LEGACY_REGIONAL_ADVANCE,
  LEGACY_STANDING,
  LEGACY_STATE_ADVANCE,
  NORMAL_CHAPTER_POINTS,
  RANKING_WEIGHTS,
} from "@/lib/content/competition-system";

export type Round = "REGIONAL" | "STATE" | "NATIONAL";

export function legacyStateStanding(regionalRaw: number, stateRaw: number) {
  return regionalRaw * LEGACY_STANDING.STATE.regional + stateRaw * LEGACY_STANDING.STATE.state;
}

export function legacyNationalStanding(regionalRaw: number, stateRaw: number, nationalRaw: number) {
  return (
    regionalRaw * LEGACY_STANDING.NATIONAL.regional +
    stateRaw * LEGACY_STANDING.NATIONAL.state +
    nationalRaw * LEGACY_STANDING.NATIONAL.national
  );
}

export function normalChapterPointsForPlacement(round: Round, placement: number) {
  const table = NORMAL_CHAPTER_POINTS[round] as Record<number | "competed", number>;
  if (table[placement]) return table[placement];
  return table.competed ?? 0;
}

export function legacyAdvancesFromRegional(entries: Array<{ id: string; points: number }>) {
  return [...entries]
    .sort((a, b) => b.points - a.points)
    .slice(0, LEGACY_REGIONAL_ADVANCE)
    .map((row) => row.id);
}

export function legacyAdvancesFromState(
  entries: Array<{ id: string; regionalPoints: number; statePoints: number }>,
) {
  return [...entries]
    .map((row) => ({
      id: row.id,
      total: legacyStateStanding(row.regionalPoints, row.statePoints),
      stateRaw: row.statePoints,
    }))
    .sort((a, b) => b.total - a.total || b.stateRaw - a.stateRaw)
    .slice(0, LEGACY_STATE_ADVANCE)
    .map((row) => row.id);
}

export function normalizeScores(values: number[]) {
  const max = Math.max(0, ...values);
  if (max <= 0) return values.map(() => 0);
  return values.map((value) => (value / max) * 100);
}

export function weightedChapterScore(input: {
  legacy: number;
  normal: number;
  membership: number;
}) {
  return (
    input.legacy * RANKING_WEIGHTS.legacy +
    input.normal * RANKING_WEIGHTS.normal +
    input.membership * RANKING_WEIGHTS.membership
  );
}

export function membershipScore(input: {
  activeMembers: number;
  registeredMembers: number;
  seasonMaxActive: number;
}) {
  const sizeShare =
    input.seasonMaxActive > 0 ? Math.min(1, input.activeMembers / input.seasonMaxActive) : 0;
  const participationShare =
    input.activeMembers > 0 ? Math.min(1, input.registeredMembers / input.activeMembers) : 0;
  return sizeShare * 50 + participationShare * 50;
}

export function assignRanks<T extends { score: number; state?: string | null }>(rows: T[]) {
  const national = [...rows].sort((a, b) => b.score - a.score);
  const byState = new Map<string, T[]>();
  national.forEach((row, index) => {
    (row as T & { nationalRank: number }).nationalRank = index + 1;
    const state = row.state || "Unlisted";
    const list = byState.get(state) ?? [];
    list.push(row);
    byState.set(state, list);
  });
  for (const list of byState.values()) {
    list
      .sort((a, b) => b.score - a.score)
      .forEach((row, index) => {
        (row as T & { stateRank: number }).stateRank = index + 1;
      });
  }
  return national as Array<T & { nationalRank: number; stateRank: number }>;
}
