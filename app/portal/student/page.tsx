import { MetricCard } from "@/components/ui/Card";
import { PortalEmpty } from "@/components/portal/PortalEmpty";
import { ConnectionTrouble } from "@/components/portal/ConnectionTrouble";
import { requireRole } from "@/lib/auth/session";
import { loadStudentDashboard } from "@/lib/data/dashboards";

export default async function StudentDashboard() {
  const { profile } = await requireRole([
    "STUDENT",
    "CHAPTER_OFFICER",
    "CHAPTER_ADVISOR",
    "STATE_ADMIN",
    "SUPER_ADMIN",
  ]);
  if (!profile) return <ConnectionTrouble />;
  const result = await loadStudentDashboard(profile.id, profile.chapter_id ?? null);
  if (result.error) return <ConnectionTrouble />;
  const data = result.data;

  return (
    <div className="space-y-8">
      <p className="text-lg font-semibold">{data?.chapter?.name || "Chapter assignment pending"}</p>
      <div className="grid gap-4 md:grid-cols-5">
        <MetricCard label="Upcoming events" value={data?.events.length ?? 0} />
        <MetricCard label="Active competitions" value={data?.competitionCount ?? 0} />
        <MetricCard
          label="Curriculum progress"
          value={`${data?.curriculumCompleted ?? 0}/${data?.curriculumTotal ?? 0}`}
        />
        <MetricCard label="My points" value={data?.points ?? 0} />
        <MetricCard label="Ideas" value={data?.ideaCount ?? 0} />
      </div>
      <section>
        <h2 className="mb-3 text-lg font-semibold">Your next steps</h2>
        {!data?.notifications.length && !data?.events.length ? (
          <PortalEmpty
            title="You're all caught up."
            body="Next steps are built from your events, curriculum progress, and open competitions. Nothing is invented here."
          />
        ) : (
          <ul className="space-y-2">
            {data?.notifications.map((item) => (
              <li key={item.id} className="rounded-[var(--radius)] bg-white px-4 py-3">
                {item.title}
              </li>
            ))}
            {data?.events.map((event) => (
              <li key={event.id} className="rounded-[var(--radius)] bg-white px-4 py-3">
                Upcoming: {event.title}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
