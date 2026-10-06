import type { NavIcon as NavIconName } from "@/lib/content/public-nav";

const paths: Record<NavIconName, string> = {
  mission: "M12 3l7 4v6c0 4-3 7-7 8-4-1-7-4-7-8V7z",
  impact: "M4 18V9m5 9V5m5 13v-7m5 7V7",
  lenses: "M8 12a4 4 0 108 0 4 4 0 10-8 0M4 12h4m8 0h4",
  chapters: "M4 20V6l8-3 8 3v14M4 20h16M12 10v10",
  people: "M8 11a3 3 0 100-6 3 3 0 000 6zm8 0a3 3 0 100-6 3 3 0 000 6zM4 20v-1a4 4 0 014-4h2m4 0h2a4 4 0 014 4v1",
  contact: "M4 6h16v12H4zM4 7l8 6 8-6",
  map: "M5 6l5-2 4 2 5-2v14l-5 2-4-2-5 2zM10 4v14m4-12v14",
  start: "M12 5v14M5 12h14",
  portal: "M5 7h9v10H5zM14 12h5m-2-3 3 3-3 3",
  status: "M6 16l4 4 8-12",
  list: "M7 7h12M7 12h12M7 17h12M4 7h.01M4 12h.01M4 17h.01",
  support: "M12 21a9 9 0 100-18 9 9 0 000 18zm0-13v4m0 3h.01",
  book: "M5 5h7v14H5zM12 5h7v14h-7",
  track: "M4 16l5-8 4 6 3-4 4 6",
  tech: "M8 9h8M8 13h5M6 5h12v14H6z",
  finance: "M4 18h16M7 18V9m5 9V6m5 12v-7",
  capstone: "M4 10l8-5 8 5-8 4zM7 12v5l5 3 5-3v-5",
  lock: "M8 11V8a4 4 0 118 0v3M7 11h10v9H7z",
  tiers: "M7 8h10M5 12h14M8 16h8",
  trophy: "M8 5h8v4a4 4 0 01-8 0zM8 5H6a2 2 0 002 4m8-4h2a2 2 0 01-2 4M10 17h4m-2-4v4",
  legacy: "M12 4l6 3v5c0 4-3 7-6 8-3-1-6-4-6-8V7z",
  advance: "M5 12h14M13 6l6 6-6 6",
  rank: "M6 16V9h4v7zM10 16V5h4v11zM14 16v-5h4v5z",
  star: "M12 4l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z",
  partner: "M8 12h8M8 8h8M7 16h5M6 5h12v14H6z",
  sponsor: "M4 8h16v10H4zM8 8V6h8v2",
  volunteer: "M8 11a3 3 0 100-6 3 3 0 000 6zM4 20v-1a4 4 0 014-4h3m5-8 4 4-7 7H9v-4z",
  photo: "M5 7h14v12H5zM9 11a2 2 0 104 0 2 2 0 00-4 0m-1 6 3-3 2 2 3-4 3 5",
  review: "M6 6h12v12H6zM9 10h6M9 14h4",
  check: "M6 12l4 4 8-8",
  block: "M6 6l12 12M18 6L6 18",
  clock: "M12 7v5l3 2M12 4a8 8 0 100 16 8 8 0 000-16z",
  news: "M6 5h12v14H6zM9 9h6M9 13h6M9 17h4",
  calendar: "M7 5v2M17 5v2M5 9h14M6 7h12v12H6z",
};

export function NavIcon({ name }: { name: NavIconName }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-gold" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d={paths[name]} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
