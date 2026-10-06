import { PortalEmpty } from "@/components/portal/PortalEmpty";
import type { PortalAnnouncement } from "@/lib/data/announcements";

function List({
  title,
  emptyTitle,
  emptyBody,
  rows,
}: {
  title: string;
  emptyTitle: string;
  emptyBody: string;
  rows: PortalAnnouncement[];
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {!rows.length ? (
        <PortalEmpty title={emptyTitle} body={emptyBody} />
      ) : (
        <ul className="space-y-3">
          {rows.map((update) => (
            <li key={update.id} className="rounded-[var(--radius)] bg-white px-4 py-4">
              <p className="text-sm text-muted">{new Date(update.created_at).toLocaleDateString()}</p>
              <h3 className="font-semibold">{update.title}</h3>
              <p className="mt-1 text-sm text-muted">{update.body || update.message}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function AnnouncementFeed({
  organization,
  chapter,
  viewer,
}: {
  organization: PortalAnnouncement[];
  chapter: PortalAnnouncement[];
  viewer: "student" | "advisor" | "admin";
}) {
  return (
    <div className="space-y-8">
      <List
        title="MediLink announcements"
        emptyTitle="No MediLink announcements yet"
        emptyBody="When an administrator publishes an organization announcement, every current and future member will see it here."
        rows={organization}
      />
      {viewer !== "admin" ? (
        <List
          title={viewer === "student" ? "Chapter advisor updates" : "Chapter announcements"}
          emptyTitle="No chapter announcements yet"
          emptyBody={
            viewer === "student"
              ? "When your chapter advisor publishes an announcement, it will show here."
              : "Published announcements for this chapter appear here."
          }
          rows={chapter}
        />
      ) : null}
    </div>
  );
}
