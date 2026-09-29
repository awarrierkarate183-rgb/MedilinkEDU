import { PortalEmpty } from "@/components/portal/PortalEmpty";
import { tracks } from "@/lib/content/curriculum";

const catalog: Record<string, { title: string; body: string }> = {
  events: {
    title: "You're all caught up. New MediLink events will appear here.",
    body: "Chapter, regional, state, national, workshop, webinar, competition, and deadline events are listed when published.",
  },
  competitions: {
    title: "Competition registration will appear here when available.",
    body: "Eligibility, teams, submissions, and points come from live competition records.",
  },
  curriculum: {
    title: "Curriculum progress",
    body: "Open a module when lesson files are attached. Status is not started, in progress, or completed.",
  },
  projects: {
    title: "No projects yet",
    body: "Turn an Ideas Lab entry into a project when you are ready. Private files are never public.",
  },
  resources: {
    title: "Student resources",
    body: "Learn, compete, build, research, and lead. Files appear when published for members.",
  },
  achievements: {
    title: "No achievements recorded",
    body: "Points and awards appear after results are entered. This page does not invent trophies.",
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
  if (section === "curriculum") {
    return (
      <div className="space-y-4">
        {tracks.map((track) => (
          <article key={track.id} className="rounded-[var(--radius)] bg-white p-5">
            <p className="kicker">Track {track.number}</p>
            <h2 className="font-semibold">{track.name}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {track.modules.map((mod) => (
                <li key={mod.code} className="flex justify-between">
                  <span>
                    {mod.code} {mod.name}
                  </span>
                  <span className="text-muted">Not started</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
        <p className="text-sm text-muted">
          Full lesson, video, reading, lab, and quiz files attach when content is
          uploaded. This page does not invent lesson text.
        </p>
      </div>
    );
  }
  const copy = catalog[section];
  if (!copy) {
    return <PortalEmpty title="Page not found" body="This student tool is not available." />;
  }
  return <PortalEmpty title={copy.title} body={copy.body} />;
}
