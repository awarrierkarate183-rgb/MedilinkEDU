import {
  INVITATIONAL_NOMINATIONS_PER_CHAPTER,
  LEGACY_GROUP_SIZE,
  LEGACY_ROSTER_SIZE,
  NORMAL_EVENT_CAP,
  getCatalogEvent,
  type EventFormat,
} from "@/lib/content/competition-system";

export function assertNormalFormat(format: EventFormat, teamSize: number) {
  if (format === "SOLO_ONLY" && teamSize !== 1) {
    return "That event is solo-only.";
  }
  if (format === "TEAM_ONLY" && (teamSize < 2 || teamSize > 5)) {
    return "That event requires a team of 2 to 5.";
  }
  if (format === "SOLO_OR_TEAM" && (teamSize < 1 || teamSize > 5)) {
    return "That event allows a solo competitor or a team of up to 5.";
  }
  return null;
}

export function assertNormalEventCap(existingEventIds: string[], nextEventId: string) {
  const unique = new Set(existingEventIds);
  if (unique.has(nextEventId)) return null;
  if (unique.size >= NORMAL_EVENT_CAP) {
    return `A student may register for at most ${NORMAL_EVENT_CAP} Normal Events in a season.`;
  }
  return null;
}

export function assertLegacyGroups(groupA: string[], groupB: string[]) {
  const combined = [...groupA, ...groupB];
  if (new Set(combined).size !== combined.length) {
    return "A student cannot sit in both Legacy groups.";
  }
  if (groupA.length > LEGACY_GROUP_SIZE || groupB.length > LEGACY_GROUP_SIZE) {
    return `Each Legacy group may have at most ${LEGACY_GROUP_SIZE} students.`;
  }
  if (combined.length > LEGACY_ROSTER_SIZE) {
    return `A chapter Legacy roster may have at most ${LEGACY_ROSTER_SIZE} students.`;
  }
  return null;
}

export function assertLegacyEntry(eventId: string, alreadyEntered: boolean, groupSize: number) {
  const event = getCatalogEvent(eventId);
  if (!event || event.tier !== "LEGACY") return "That event is not a Legacy Event.";
  if (alreadyEntered) return "This chapter already entered one group in that Legacy event.";
  if (groupSize !== LEGACY_GROUP_SIZE) {
    return `That Legacy group must have ${LEGACY_GROUP_SIZE} students before it can enter.`;
  }
  return null;
}

export function assertNominationCap(existingNominations: number, alreadyNominated: boolean) {
  if (alreadyNominated) return null;
  if (existingNominations >= INVITATIONAL_NOMINATIONS_PER_CHAPTER) {
    return `A chapter may nominate at most ${INVITATIONAL_NOMINATIONS_PER_CHAPTER} students for the invitational.`;
  }
  return null;
}

export function canEditLockedRoster(hasApprovedException: boolean, rosterLocked: boolean) {
  if (!rosterLocked) return null;
  if (hasApprovedException) return null;
  return "The Legacy roster is locked for this season. Use a documented exception.";
}
