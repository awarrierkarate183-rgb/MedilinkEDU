import { getCatalogEvent } from "@/lib/content/competition-system";
import { getEventHandbook } from "@/lib/content/event-handbook";

export type PrepKind = "SUBMIT" | "DEVELOP";

export type EventPrepBlueprint = {
  kind: PrepKind;
  title: string;
  body: string;
};

function splitPieces(text: string) {
  const parts = text
    .split(/;|\n|•/)
    .map((part) => part.replace(/\s+/g, " ").trim().replace(/\.$/, ""))
    .filter((part) => part.length > 6);
  return parts.length ? parts : [text.trim()].filter(Boolean);
}

export function eventPrepBlueprint(eventId: string): EventPrepBlueprint[] {
  const handbook = getEventHandbook(eventId);
  const catalog = getCatalogEvent(eventId);
  const name = handbook?.name || catalog?.name || "this event";
  const work = handbook?.workProduct || catalog?.description || `Required work product for ${name}.`;
  const prep = handbook?.preparation || `Prepare for ${name} using the official event packet.`;
  const items: EventPrepBlueprint[] = [
    ...splitPieces(work).map((title) => ({
      kind: "SUBMIT" as const,
      title: title.slice(0, 160),
      body: `Submit a draft or practice version before the competition date. Official required work product: ${work}`,
    })),
    ...splitPieces(prep).slice(0, 6).map((title) => ({
      kind: "DEVELOP" as const,
      title: title.slice(0, 160),
      body: handbook?.preparation || prep,
    })),
  ];
  return items;
}
