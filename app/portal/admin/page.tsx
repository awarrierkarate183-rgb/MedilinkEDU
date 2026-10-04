import { MetricCard } from "@/components/ui/Card";
import { PortalEmpty } from "@/components/portal/PortalEmpty";
import { ConnectionTrouble } from "@/components/portal/ConnectionTrouble";
import { loadAdminDashboard } from "@/lib/data/dashboards";

export default async function AdminDashboard() {
  const result = await loadAdminDashboard();
  if (result.error) return <ConnectionTrouble />;
  const data = result.data;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Chapters" value={data?.chapters ?? 0} />
        <MetricCard label="Active users" value={data?.users ?? 0} />
        <MetricCard label="Pending chapter approvals" value={data?.pendingChapters ?? 0} />
        <MetricCard label="Upcoming competitions" value={data?.competitions ?? 0} />
        <MetricCard label="Submissions in review" value={data?.submissions ?? 0} />
        <MetricCard label="Recent audit events" value={data?.activity.length ?? 0} />
      </div>
      <section className="rounded-[var(--radius)] bg-white p-5">
        <h2 className="text-lg font-semibold">School proceedings</h2>
        <p className="mt-2 text-sm text-muted">
          Every school that has come through is listed on Competitions. Open a
          school to see its workbook, type student names, submit the event they
          are doing, and that assignment appears on the student portal.
        </p>
        <p className="mt-3 text-sm">
          <a href="/portal/admin/competitions" className="font-semibold underline">
            Open the school directory
          </a>
        </p>
      </section>
      <section>
        <h2 className="mb-3 text-lg font-semibold">Chapter requests</h2>
        {!data?.alerts?.length ? (
          <p className="text-sm text-muted">No new chapter requests or pending sign-ins.</p>
        ) : (
          <ul className="mb-8 divide-y divide-border rounded-[var(--radius)] bg-white">
            {data.alerts.map((row) => (
              <li key={row.id} className="px-4 py-3 text-sm">
                <a href="/portal/admin/chapters" className="font-semibold">
                  {row.title}
                </a>
                <p className="text-muted">{row.message}</p>
                <p className="mt-1 text-muted">{new Date(row.created_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h2 className="mb-3 text-lg font-semibold">System activity</h2>
        {!data?.activity.length ? (
          <PortalEmpty
            title="Admin tools"
            body="Create and archive chapters, assign advisors, manage competitions, and read the audit log. Prefer deactivation over destructive deletion when history matters. Student names are not listed on this summary."
          />
        ) : (
          <ul className="divide-y divide-border rounded-[var(--radius)] bg-white">
            {data.activity.map((row) => (
              <li key={row.id} className="px-4 py-3 text-sm">
                <strong>{row.action}</strong>
                <span className="ml-2 text-muted">{new Date(row.created_at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
