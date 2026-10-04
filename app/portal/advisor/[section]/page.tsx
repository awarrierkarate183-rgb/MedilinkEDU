import { PortalEmpty } from "@/components/portal/PortalEmpty";

const catalog: Record<
  string,
  { title: string; body: string }
> = {
  events: {
    title: "No upcoming events",
    body: "You're all caught up. New MediLink events will appear here when they are published.",
  },
  competitions: {
    title: "Competition registration will appear here when available.",
    body: "Advisors review chapter teams, approve registrations, and finalize entries from live competition records.",
  },
  curriculum: {
    title: "Chapter curriculum progress",
    body: "Progress is calculated from real module completion only. Full lesson files attach when content is uploaded.",
  },
  resources: {
    title: "Advisor resource center",
    body: "Resources appear by category when an administrator publishes them. Nothing here is placeholder content pretending to be a file.",
  },
  submissions: {
    title: "No submissions waiting",
    body: "Ideas, projects, and competition files from your chapter land here for review.",
  },
  reports: {
    title: "Reports",
    body: "Roster, participation, curriculum, activity, points, and project summaries export as CSV when records exist.",
  },
};

export default async function AdvisorSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const copy = catalog[section];
  if (!copy) {
    return <PortalEmpty title="Page not found" body="This advisor tool is not available." />;
  }
  return <PortalEmpty title={copy.title} body={copy.body} />;
}

export function generateStaticParams() {
  return Object.keys(catalog).map((section) => ({ section }));
}
