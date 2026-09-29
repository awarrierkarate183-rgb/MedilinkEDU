import { describe, expect, it } from "vitest";
import { POINT_REASON_AMOUNTS, pointsForReason, sumPoints } from "../lib/points/award";

describe("point schedule", () => {
  it("uses fixed amounts and rejects unknown reasons", () => {
    expect(pointsForReason("one_time_participation")).toBe(10);
    expect(pointsForReason("one_time_top10")).toBe(20);
    expect(pointsForReason("one_time_top3")).toBe(35);
    expect(pointsForReason("one_time_win")).toBe(50);
    expect(pointsForReason("nationals_regional_participation")).toBe(10);
    expect(pointsForReason("nationals_national_win")).toBe(80);
    expect(pointsForReason("custom_total")).toBeNull();
    expect(POINT_REASON_AMOUNTS.one_time_win).toBe(50);
  });

  it("sums ledger rows instead of a editable total field", () => {
    expect(sumPoints([{ amount: 10 }, { amount: 20 }, { points: 50 }])).toBe(80);
  });
});
