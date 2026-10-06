import Link from "next/link";
import { MetricCard } from "@/components/ui/Card";
import { PortalEmpty } from "@/components/portal/PortalEmpty";
import { ConnectionTrouble } from "@/components/portal/ConnectionTrouble";
import { requireRole } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { loadAdvisorDashboard } from "@/lib/data/dashboards";
import { loadEventChoices } from "@/lib/competition/choices";

export default async function AdvisorDashboard() {
  const { profile } = await requireRole(["CHAPTER_ADVISOR", "STATE_ADMIN", "SUPER_ADMIN"]);
  const result = await loadAdvisorDashboard(profile?.chapter_id ?? null);
  const admin = createAdminClient();
  const pendingChoices =
    admin && profile?.chapter_id
      ? (await loadEventChoices(admin, { chapterId: profile.chapter_id })).choices.filter(
          (row) => row.status === "PENDING",
        ).length
      : 0;

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
        {(data?.pending ?? 0) > 0 || pendingChoices > 0 ? (
          <div className="space-y-2">
            {(data?.pending ?? 0) > 0 ? (
              <Link href="/portal/advisor/members" className="block rounded-[var(--radius)] bg-white p-4 font-semibold">
                {data?.pending} student registrations awaiting approval
              </Link>
            ) : null}
            {pendingChoices > 0 ? (
              <Link href="/portal/advisor/events" className="block rounded-[var(--radius)] bg-white p-4 font-semibold">
                {pendingChoices} student event {pendingChoices === 1 ? "choice" : "choices"} waiting to be entered
              </Link>
            ) : null}
          </div>
        ) : (
          <PortalEmpty
            title="No pending actions"
            body="Approvals, event choices, and reviews will land here from live chapter data."
          />
        )}
      </section>
      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="text-lg font-semibold">Upcoming events</h2>
          <Link href="/portal/advisor/events" className="text-sm font-semibold">
            Open events
          </Link>
        </div>
        {!data?.upcoming.length ? (
          <PortalEmpty title="No dated chapter events yet" body="The full MediLink event catalog is on Events. Student choices land there too." />
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
