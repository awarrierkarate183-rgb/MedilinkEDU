import Link from "next/link";
import { MetricCard } from "@/components/ui/Card";
import { PortalEmpty } from "@/components/portal/PortalEmpty";
import { ConnectionTrouble } from "@/components/portal/ConnectionTrouble";
import { requireRole } from "@/lib/auth/session";
import { loadAdvisorDashboard } from "@/lib/data/dashboards";

export default async function AdvisorDashboard() {
  const { profile } = await requireRole(["CHAPTER_ADVISOR", "STATE_ADMIN", "SUPER_ADMIN"]);
  const result = await loadAdvisorDashboard(profile?.chapter_id ?? null);

  if (result.error) return <ConnectionTrouble />;

  const data = result.data;
  const chapter = data?.chapter;

  return (
    <div className="space-y-8">
      <p className="text-lg font-semibold">{chapter?.name || "Chapter not assigned yet"}</p>
      <div className="grid gap-4 md:grid-cols-5">
        <MetricCard label="Active members" value={data?.members ?? 0} />
        <MetricCard label="Upcoming events" value={data?.events ?? 0} />
        <MetricCard label="Competition entries" value={data?.registrations ?? 0} />
        <MetricCard label="Pending approvals" value={data?.pending ?? 0} />
        <MetricCard label="Cycle points" value={data?.points ?? 0} />
      </div>
      <section>
        <h2 className="mb-3 text-lg font-semibold">Pending actions</h2>
        {(data?.pending ?? 0) > 0 ? (
          <Link href="/portal/advisor/members" className="block rounded-[var(--radius)] bg-white p-4 font-semibold">
            {data?.pending} student registrations awaiting approval
          </Link>
        ) : (
          <PortalEmpty
            title="No pending actions"
            body="Approvals, incomplete registrations, and reviews will land here from live chapter data."
          />
        )}
      </section>
      <section>
        <h2 className="mb-3 text-lg font-semibold">Upcoming events</h2>
        {!data?.upcoming.length ? (
          <PortalEmpty title="No upcoming events" body="Published chapter events will appear here." />
        ) : (
          <ul className="space-y-2">
            {data.upcoming.map((event) => (
              <li key={event.id} className="rounded-[var(--radius)] bg-white px-4 py-3">
                <strong>{event.title}</strong>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h2 className="mb-3 text-lg font-semibold">Chapter progress</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {["FOUNDING", "ESTABLISHED", "FLAGSHIP_ELIGIBLE"].map((status) => (
            <div
              key={status}
              className={`rounded-[var(--radius)] border p-4 ${
                chapter?.status === status ? "border-gold bg-gold-soft" : "border-border bg-white"
              }`}
            >
              <p className="font-semibold">{status.replaceAll("_", " ")}</p>
              <p className="text-sm text-muted">
                {chapter?.status === status ? "Current recorded status" : "Not the current status"}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
