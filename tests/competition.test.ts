import { describe, expect, it } from "vitest";
import {
  assertEventChoiceSet,
  assertLegacyEntry,
  assertLegacyGroups,
  assertNominationCap,
  assertNormalEventCap,
  assertNormalFormat,
  canEditLockedRoster,
  matchRosterNames,
} from "../lib/competition/rules";
import { normalEventHandbook } from "../lib/content/normal-event-handbook";
import { legacyEventHandbook } from "../lib/content/legacy-event-handbook";
import {
  legacyAdvancesFromRegional,
  legacyAdvancesFromState,
  legacyStateStanding,
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

  it("requires one team of four and blocks a second group", () => {
    expect(assertLegacyGroups(["a", "b", "c", "d", "e"], [])).toMatch(/exactly 4/);
    expect(assertLegacyGroups(["a", "b", "c", "d"], ["e"])).toMatch(/one team of four/);
    expect(assertLegacyGroups(["a", "b", "c", "d"], [])).toBeNull();
    expect(assertLegacyEntry("the-sovereign-ledger", true, 4)).toMatch(/already entered/);
    expect(assertLegacyEntry("the-sovereign-ledger", false, 1)).toMatch(/exactly 4 students/);
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

  it("lets a student choose six Normal Events plus Legacy, and blocks a seventh Normal", () => {
    expect(assertEventChoiceSet([])).toMatch(/at least one/);
    expect(assertEventChoiceSet([{ eventId: "not-an-event" }])).toMatch(/real MediLink events/);
    expect(
      assertEventChoiceSet([
        { eventId: "triage-protocol" },
        { eventId: "the-chart-room" },
        { eventId: "system-failure" },
        { eventId: "patient-zero" },
        { eventId: "under-review" },
        { eventId: "the-gray-area" },
        { eventId: "the-sovereign-ledger", intent: "I want the finance seat." },
      ]),
    ).toBeNull();
    expect(
      assertEventChoiceSet([
        { eventId: "triage-protocol" },
        { eventId: "the-chart-room" },
        { eventId: "system-failure" },
        { eventId: "patient-zero" },
        { eventId: "under-review" },
        { eventId: "the-gray-area" },
        { eventId: "the-floor" },
      ]),
    ).toMatch(/at most 6/);
  });

  it("caps invitational nominations at two and locks the roster", () => {
    expect(assertNominationCap(2, false)).toMatch(/at most 2/);
    expect(canEditLockedRoster(false, true)).toMatch(/locked/);
    expect(canEditLockedRoster(true, true)).toBeNull();
  });
});

describe("competition scoring", () => {
  it("uses the 35 / 65 State standing formula", () => {
    expect(legacyStateStanding(920, 800)).toBe(842);
    expect(legacyStateStanding(780, 950)).toBe(890.5);
  });

  it("keeps the top 3 Regional and one cumulative State champion", () => {
    const regional = legacyAdvancesFromRegional([
      { id: "a", points: 920 },
      { id: "b", points: 830 },
      { id: "c", points: 780 },
      { id: "d", points: 700 },
    ]);
    expect(regional).toEqual(["a", "b", "c"]);
    expect(
      legacyAdvancesFromState([
        { id: "a", regionalPoints: 920, statePoints: 800 },
        { id: "b", regionalPoints: 830, statePoints: 920 },
        { id: "c", regionalPoints: 780, statePoints: 950 },
      ]),
    ).toEqual(["c"]);
  });

  it("keeps twenty Normal Event handbooks at 100 points", () => {
    expect(normalEventHandbook).toHaveLength(20);
    for (const event of normalEventHandbook) {
      expect(event.rubric.reduce((sum, row) => sum + row.points, 0)).toBe(100);
      expect(event.role).toBeTruthy();
      expect(event.mechanic).toBeTruthy();
    }
  });

  it("keeps three Legacy Triad events at 1,000 points", () => {
    expect(legacyEventHandbook.map((event) => event.id)).toEqual([
      "the-sovereign-ledger",
      "nightfall-code-meridian",
      "the-janus-protocol",
    ]);
    for (const event of legacyEventHandbook) {
      expect(event.rubric.reduce((sum, row) => sum + row.points, 0)).toBe(1000);
      expect(event.acts).toHaveLength(5);
      expect(event.roles).toHaveLength(4);
    }
  });

  it("weights annual ranking 65 / 25 / 10", () => {
    expect(weightedChapterScore({ legacy: 100, normal: 100, membership: 100 })).toBe(100);
    expect(weightedChapterScore({ legacy: 100, normal: 0, membership: 0 })).toBe(65);
    expect(membershipScore({ activeMembers: 10, registeredMembers: 5, seasonMaxActive: 10 })).toBe(75);
  });
});
