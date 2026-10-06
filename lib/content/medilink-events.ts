export const opportunityRegions = [
  { id: "national", name: "National" },
  { id: "northeast", name: "Northeast" },
  { id: "southeast", name: "Southeast" },
  { id: "midwest", name: "Midwest" },
  { id: "southwest", name: "Southwest" },
  { id: "west", name: "West" },
] as const;

export type OpportunityKind = "volunteer" | "event" | "internship" | "research";

export type MediLinkOpportunity = {
  id: string;
  kind: OpportunityKind;
  title: string;
  region: (typeof opportunityRegions)[number]["id"];
  summary: string;
  href?: string;
};

export const opportunityKinds: Array<{
  id: OpportunityKind;
  title: string;
  lead: string;
  empty: string;
}> = [
  {
    id: "volunteer",
    title: "Volunteer by region",
    lead: "Regional volunteer openings MediLink publishes for members and adults who want to help a chapter or a program day.",
    empty: "No volunteer listings are published yet.",
  },
  {
    id: "event",
    title: "MediLink events",
    lead: "Workshops, program days, and other MediLink-hosted events. Dates appear when they are set.",
    empty: "No MediLink events are published yet.",
  },
  {
    id: "internship",
    title: "Internships",
    lead: "Internships MediLink opens or passes through. Nothing is listed until a real seat exists.",
    empty: "No internships are published yet.",
  },
  {
    id: "research",
    title: "Research",
    lead: "Research opportunities MediLink gives out. Listings stay empty until a project is actually open.",
    empty: "No research listings are published yet.",
  },
];

export const medilinkOpportunities: MediLinkOpportunity[] = [];

export function opportunitiesByKind(kind: OpportunityKind) {
  return medilinkOpportunities.filter((item) => item.kind === kind);
}

export function opportunitiesByRegion(region: string) {
  return medilinkOpportunities.filter((item) => item.kind === "volunteer" && item.region === region);
}

export function regionName(id: string) {
  return opportunityRegions.find((region) => region.id === id)?.name || id;
}
