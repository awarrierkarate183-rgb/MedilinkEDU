import { describe, expect, it } from "vitest";
import {
  assertLegacyEntry,
  assertLegacyGroups,
  assertNominationCap,
  assertNormalEventCap,
  assertNormalFormat,
  canEditLockedRoster,
  matchRosterNames,
} from "../lib/competition/rules";
import { normalEventHandbook } from "../lib/content/normal-event-handbook";
import {
  legacyAdvancesFromRegional,
  legacyAdvancesFromState,
  legacyPointsForPlacement,
  membershipScore,
  weightedChapterScore,
} from "../lib/competition/scoring";

describe("competition rules", () => {
  it("blocks a seventh Normal Event", () => {
    expect(
      assertNormalEventCap(
        ["triage-protocol", "the-chart-room", "system-failure", "patient-zero", "under-review", "the-gray-area"],
        "the-floor",
      ),
    ).toMatch(/6 Normal Events/);
  });

  it("allows replacing an event already on the list", () => {
    expect(assertNormalEventCap(["triage-protocol"], "triage-protocol")).toBeNull();
  });

  it("enforces solo-only and team-only formats", () => {
    expect(assertNormalFormat("SOLO_ONLY", 2)).toMatch(/solo-only/);
    expect(assertNormalFormat("TEAM_ONLY", 1)).toMatch(/2 to 5/);
    expect(assertNormalFormat("SOLO_OR_TEAM", 1)).toBeNull();
  });

  it("blocks two groups in the same Legacy event and a fifth group member", () => {
    expect(assertLegacyGroups(["a", "b", "c", "d", "e"], [])).toMatch(/at most 4/);
    expect(assertLegacyEntry("the-meridian-hearing", true, 4)).toMatch(/already entered/);
    expect(assertLegacyEntry("the-meridian-hearing", false, 3)).toMatch(/4 students/);
  });

  it("matches roster names and rejects unknown students", () => {
    const roster = [
      { id: "a", first_name: "Rithvik", last_name: "Balamurali", status: "ACTIVE" },
      { id: "b", full_name: "Jordan Lee", status: "ACTIVE" },
      { id: "c", first_name: "Sam", last_name: "Patel", status: "REMOVED" },
    ];
    expect(
      matchRosterNames(roster, [
        { firstName: "Rithvik", lastName: "Balamurali" },
        { firstName: "Jordan", lastName: "Lee" },
      ]),
    ).toEqual({ profileIds: ["a", "b"] });
    expect(matchRosterNames(roster, [{ firstName: "Sam", lastName: "Patel" }])).toEqual({
      error: "Sam Patel is not on this school's active roster.",
    });
  });

  it("caps invitational nominations at two and locks the roster", () => {
    expect(assertNominationCap(2, false)).toMatch(/at most 2/);
    expect(canEditLockedRoster(false, true)).toMatch(/locked/);
    expect(canEditLockedRoster(true, true)).toBeNull();
  });
});

describe("competition scoring", () => {
  it("uses the Legacy points table", () => {
    expect(legacyPointsForPlacement("REGIONAL", 1)).toBe(12);
    expect(legacyPointsForPlacement("STATE", 3)).toBe(13);
    expect(legacyPointsForPlacement("NATIONAL", 1)).toBe(35);
    expect(legacyPointsForPlacement("NATIONAL", 4)).toBe(0);
  });

  it("keeps the top 5 Regional and top 3 cumulative State entries", () => {
    const regional = legacyAdvancesFromRegional([
      { id: "a", points: 12 },
      { id: "b", points: 10 },
      { id: "c", points: 8 },
      { id: "d", points: 6 },
      { id: "e", points: 4 },
      { id: "f", points: 0 },
    ]);
    expect(regional).toEqual(["a", "b", "c", "d", "e"]);
    expect(
      legacyAdvancesFromState([
        { id: "a", regionalPoints: 12, statePoints: 10 },
        { id: "b", regionalPoints: 10, statePoints: 20 },
        { id: "c", regionalPoints: 8, statePoints: 8 },
        { id: "d", regionalPoints: 6, statePoints: 16 },
      ]),
    ).toEqual(["b", "a", "d"]);
  });

  it("keeps twenty Normal Event handbooks at 100 points", () => {
    expect(normalEventHandbook).toHaveLength(20);
    for (const event of normalEventHandbook) {
      expect(event.rubric.reduce((sum, row) => sum + row.points, 0)).toBe(100);
      expect(event.role).toBeTruthy();
      expect(event.mechanic).toBeTruthy();
    }
  });

  it("weights annual ranking 65 / 25 / 10", () => {
    expect(weightedChapterScore({ legacy: 100, normal: 100, membership: 100 })).toBe(100);
    expect(weightedChapterScore({ legacy: 100, normal: 0, membership: 0 })).toBe(65);
    expect(membershipScore({ activeMembers: 10, registeredMembers: 5, seasonMaxActive: 10 })).toBe(75);
  });
});
