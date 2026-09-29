export const POINT_REASON_AMOUNTS = {
  one_time_participation: 10,
  one_time_top10: 20,
  one_time_top3: 35,
  one_time_win: 50,
  nationals_regional_participation: 10,
  nationals_regional_to_state: 20,
  nationals_state_top3: 30,
  nationals_state_to_national: 40,
  nationals_national_participation: 50,
  nationals_national_top10: 30,
  nationals_national_top3: 50,
  nationals_national_win: 80,
} as const;

export type PointReasonCode = keyof typeof POINT_REASON_AMOUNTS;

export function pointsForReason(code: string) {
  if (code in POINT_REASON_AMOUNTS) {
    return POINT_REASON_AMOUNTS[code as PointReasonCode];
  }
  return null;
}

export function sumPoints(rows: Array<{ amount?: number; points?: number }>) {
  return rows.reduce((sum, row) => sum + (row.amount ?? row.points ?? 0), 0);
}
