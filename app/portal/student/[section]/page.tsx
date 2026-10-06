import { PortalEmpty } from "@/components/portal/PortalEmpty";

const catalog: Record<string, { title: string; body: string }> = {
  competitions: {
    title: "Open Competitions in the student menu.",
    body: "Ask for events, see assignments, and read published rankings on that page.",
  },
  projects: {
    title: "Open Projects in the student menu.",
    body: "After you are entered in an event, that page lists what to develop and submit before the competition date.",
  },
  announcements: {
    title: "No new chapter announcements.",
    body: "Advisor and national announcements for your chapter show here.",
  },
  chapter: {
    title: "Your chapter",
    body: "Public chapter facts only. Other students' private data is not shown.",
  },
  profile: {
    title: "Profile",
    body: "Update allowed fields, change your password, and log out. You cannot change your own role.",
  },
};

export default async function StudentSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const copy = catalog[section];
  if (!copy) {
    return <PortalEmpty title="Page not found" body="This student tool is not available." />;
  }
  return <PortalEmpty title={copy.title} body={copy.body} />;
}
