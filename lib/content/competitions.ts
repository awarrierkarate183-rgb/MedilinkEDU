import { competitionPillars } from "@/lib/content/competition-system";

export const competitions = competitionPillars;

export function getCompetition(id: string) {
  return competitions.find((item) => item.id === id);
}
