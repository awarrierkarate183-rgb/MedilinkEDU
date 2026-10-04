import { requireRole } from "@/lib/auth/session";
import { loadStudentDashboard } from "@/lib/data/dashboards";
import { PortalEmpty } from "@/components/portal/PortalEmpty";

export default async function StudentAnnouncementsPage() {
  const { profile } = await requireRole(["STUDENT", "CHAPTER_OFFICER"]);
  const result = await loadStudentDashboard(profile?.id || "", profile?.chapter_id ?? null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Advisor updates</h2>
        <p className="mt-1 text-sm text-muted">
          These are announcements your chapter advisor sent to students.
        </p>
      </div>
      {!result.data?.announcements.length ? (
        <PortalEmpty
          title="No advisor updates yet"
          body="When your chapter advisor publishes an announcement, it will show here."
        />
      ) : (
        <ul className="space-y-3">
          {result.data.announcements.map((update) => (
            <li key={update.id} className="rounded-[var(--radius)] bg-white px-4 py-4">
              <p className="text-sm text-muted">{new Date(update.created_at).toLocaleDateString()}</p>
              <h3 className="font-semibold">{update.title}</h3>
              <p className="mt-1 text-sm text-muted">{update.body || update.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
