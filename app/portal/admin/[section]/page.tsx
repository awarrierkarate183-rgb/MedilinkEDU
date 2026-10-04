import { PortalEmpty } from "@/components/portal/PortalEmpty";

const catalog: Record<string, { title: string; body: string }> = {
  chapters: {
    title: "Chapter management",
    body: "Create, approve, suspend, reactivate, assign advisors, and generate join QR codes. Prefer archive over deletion.",
  },
  users: {
    title: "Users",
    body: "Advisors and students. Roles are assigned here, never from the browser.",
  },
  events: { title: "Events", body: "National and chapter events are database-driven. Dates are not hardcoded." },
  competitions: {
    title: "Open Competitions in the admin menu.",
    body: "Enter results, lock the Legacy roster, publish rankings, and manage the invitational there.",
  },
  curriculum: { title: "Curriculum", body: "Attach lesson files later. Public titles already exist." },
  resources: { title: "Resources", body: "Access control: public, member, advisor, admin." },
  news: { title: "News", body: "Student submissions must be reviewed before they publish." },
  sponsors: { title: "Sponsors", body: "Do not invent logos or benefits. Publish only approved records." },
  points: { title: "Points", body: "Administrators see all chapters. Public rankings stay off until the board decides." },
  announcements: { title: "Announcements", body: "Audience can be all users, advisors, students, or a chapter." },
  reports: { title: "Reports", body: "Organization-level CSV exports when data exists." },
  audit: { title: "Audit log", body: "Sensitive actions only. Students never see this page." },
};

export default async function AdminSection({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const copy = catalog[section];
  if (!copy) return <PortalEmpty title="Not found" body="This admin tool is not available." />;
  return <PortalEmpty title={copy.title} body={copy.body} />;
}
