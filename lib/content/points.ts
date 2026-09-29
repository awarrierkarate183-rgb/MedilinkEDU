import apex from "@/data/apex-points.json";

export type OneTimeResult = "participation" | "top10" | "top3" | "win" | null;

export type NationalsKey =
  | "regionalParticipation"
  | "regionalToState"
  | "stateTop3"
  | "stateToNational"
  | "nationalCompete"
  | "nationalTop10"
  | "nationalTop3"
  | "nationalWin";

type YearResults = {
  innovation: OneTimeResult;
  policy: OneTimeResult;
  research: OneTimeResult;
  nationals: NationalsKey[];
};

type ChapterLedger = {
  region: string;
  year1: YearResults;
  year2: YearResults;
  nationalWins: number;
  nationalTop3Placements: number;
  teamsFielded: number;
};

type ApexFile = {
  cycle: string;
  pointSchedule: {
    oneTime: Record<Exclude<OneTimeResult, null>, number>;
    nationalsLadder: Record<NationalsKey, number>;
  };
  chapters: Record<string, ChapterLedger>;
  qualification: {
    totalApexSpots: number;
    minSpotsPerRegion: number;
  };
};

const data = apex as ApexFile;

export const pointSchedule = data.pointSchedule;
export const currentCycleLabel = data.cycle;
export const qualification = data.qualification;

const NATIONAL_FINISH = new Set<NationalsKey>([
  "nationalTop10",
  "nationalTop3",
  "nationalWin",
]);

export function oneTimePoints(result: OneTimeResult) {
  if (!result) return 0;
  return data.pointSchedule.oneTime[result];
}

export function nationalsPoints(items: NationalsKey[]) {
  const finishes = items.filter((item) => NATIONAL_FINISH.has(item));
  const climb = items.filter((item) => !NATIONAL_FINISH.has(item));
  const finishPoints =
    finishes.length > 0
      ? Math.max(...finishes.map((key) => data.pointSchedule.nationalsLadder[key]))
      : 0;
  const climbPoints = climb.reduce(
    (sum, key) => sum + data.pointSchedule.nationalsLadder[key],
    0,
  );
  return climbPoints + finishPoints;
}

export function yearPoints(year: YearResults) {
  return (
    oneTimePoints(year.innovation) +
    oneTimePoints(year.policy) +
    oneTimePoints(year.research) +
    nationalsPoints(year.nationals)
  );
}

export function chapterCyclePoints(chapter: ChapterLedger) {
  return yearPoints(chapter.year1) + yearPoints(chapter.year2);
}

export function publicStandings() {
  return Object.entries(data.chapters)
    .map(([id, chapter]) => ({
      id,
      region: chapter.region,
      points: chapterCyclePoints(chapter),
      nationalWins: chapter.nationalWins,
      nationalTop3Placements: chapter.nationalTop3Placements,
      teamsFielded: chapter.teamsFielded,
    }))
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.nationalWins !== a.nationalWins) return b.nationalWins - a.nationalWins;
      if (b.nationalTop3Placements !== a.nationalTop3Placements) {
        return b.nationalTop3Placements - a.nationalTop3Placements;
      }
      return b.teamsFielded - a.teamsFielded;
    });
}

export const NATIONALS_MAX = 230;
export const ONE_TIME_MAX = 50;
