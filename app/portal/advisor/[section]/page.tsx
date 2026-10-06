import { PortalEmpty } from "@/components/portal/PortalEmpty";

const catalog: Record<
  string,
  { title: string; body: string }
> = {
  competitions: {
    title: "Open Competitions in the advisor menu.",
    body: "Register students, set the Legacy roster, and assign Legacy events on that page.",
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
