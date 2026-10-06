import {
  getNormalHandbook,
  handbookInstructionsBody,
  handbookRubricBody,
  HANDBOOK_PDF,
  integrityRules,
  universalScoring,
  type NormalHandbookEntry,
} from "@/lib/content/normal-event-handbook";
import {
  getLegacyHandbook,
  legacyHandbookInstructionsBody,
  legacyHandbookRubricBody,
  LEGACY_HANDBOOK_PDF,
  legacyIntegrityRules,
  legacyScoring,
  type LegacyHandbookEntry,
} from "@/lib/content/legacy-event-handbook";

export type AnyHandbook = NormalHandbookEntry | LegacyHandbookEntry;

export function getEventHandbook(id: string): AnyHandbook | null {
  return getNormalHandbook(id) || getLegacyHandbook(id);
}

export function handbookPdf(id: string) {
  return getLegacyHandbook(id) ? LEGACY_HANDBOOK_PDF : HANDBOOK_PDF;
}

export function handbookPdfLabel(id: string) {
  return getLegacyHandbook(id) ? "Open the Legacy Championship handbook" : "Open the Normal Events handbook";
}

export function handbookInstructions(event: AnyHandbook) {
  return "whyLegacy" in event ? legacyHandbookInstructionsBody(event) : handbookInstructionsBody(event);
}

export function handbookRubric(event: AnyHandbook) {
  return "whyLegacy" in event ? legacyHandbookRubricBody(event) : handbookRubricBody(event);
}

export function handbookRules(event: AnyHandbook) {
  return "whyLegacy" in event ? legacyIntegrityRules : integrityRules;
}

export function handbookScoring(event: AnyHandbook) {
  return "whyLegacy" in event ? legacyScoring : universalScoring;
}
