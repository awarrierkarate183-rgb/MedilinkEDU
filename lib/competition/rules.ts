import {
  INVITATIONAL_NOMINATIONS_PER_CHAPTER,
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

export function assertLegacyGroups(groupA: string[], groupB: string[] = []) {
  if (groupB.length) {
    return "Legacy uses one team of four. Do not assign a second group.";
  }
  if (new Set(groupA).size !== groupA.length) {
    return "A student cannot appear twice on the Legacy roster.";
  }
  if (groupA.length !== LEGACY_ROSTER_SIZE) {
    return `A chapter Legacy delegation must be exactly ${LEGACY_ROSTER_SIZE} students.`;
  }
  return null;
}

export function assertLegacyEntry(eventId: string, alreadyEntered: boolean, groupSize: number) {
  const event = getCatalogEvent(eventId);
  if (!event || event.tier !== "LEGACY") return "That event is not a Legacy Event.";
  if (alreadyEntered) return "This chapter already entered that Legacy event.";
  const min = event.minTeamSize;
  const max = event.maxTeamSize;
  if (groupSize < min || groupSize > max) {
    return `That Legacy team must have exactly ${min} students before it can enter.`;
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

export function matchRosterNames(
  roster: Array<{
    id: string;
    first_name?: string | null;
    last_name?: string | null;
    full_name?: string | null;
    display_name?: string | null;
    status?: string | null;
  }>,
  names: Array<{ firstName: string; lastName: string }>,
) {
  const used = new Set<string>();
  const matched: string[] = [];
  for (const name of names) {
    const first = name.firstName.trim().toLowerCase();
    const last = name.lastName.trim().toLowerCase();
    const full = `${first} ${last}`.trim();
    const hit = roster.find((row) => {
      if (used.has(row.id) || row.status === "REMOVED") return false;
      const rowFirst = (row.first_name || "").trim().toLowerCase();
      const rowLast = (row.last_name || "").trim().toLowerCase();
      const rowFull = (row.full_name || row.display_name || "").trim().toLowerCase();
      return (rowFirst === first && rowLast === last) || rowFull === full;
    });
    if (!hit) {
      return { error: `${name.firstName} ${name.lastName} is not on this school's active roster.` };
    }
    used.add(hit.id);
    matched.push(hit.id);
  }
  return { profileIds: matched };
}

export function canEditLockedRoster(hasApprovedException: boolean, rosterLocked: boolean) {
  if (!rosterLocked) return null;
  if (hasApprovedException) return null;
  return "The Legacy roster is locked for this season. Use a documented exception.";
}
