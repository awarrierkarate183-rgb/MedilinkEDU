import chaptersFile from "@/data/chapters.json";

export type SchoolChapter = {
  id: string;
  name: string;
  location: string;
  address?: string;
  email?: string;
  phone?: string;
  lat?: number;
  lng?: number;
  status?: string;
};

export type StateChapter = {
  id: string;
  name: string;
  location: string;
  address?: string;
  email?: string;
  phone?: string;
  lat: number;
  lng: number;
  chapters: SchoolChapter[];
};

type ChaptersFile = {
  states: StateChapter[];
};

export function getStateListings(): StateChapter[] {
  return (chaptersFile as ChaptersFile).states;
}

export function getPublicSchoolChapters() {
  return getStateListings().flatMap((state) =>
    (state.chapters || []).map((chapter) => ({
      ...chapter,
      stateName: state.name,
      stateId: state.id,
    })),
  );
}

export function confirmedChapterCount() {
  return getPublicSchoolChapters().length;
}

export type PublicChapter = {
  id: string;
  school: string;
  city: string | null;
  state: string | null;
  status: string;
};

export function publicStatusLabel(status: string) {
  if (status === "FLAGSHIP_ELIGIBLE") return "Flagship-Eligible";
  if (status === "FOUNDING") return "Founding";
  if (status === "ESTABLISHED") return "Established";
  return status;
}
