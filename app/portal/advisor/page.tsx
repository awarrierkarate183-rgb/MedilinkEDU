import Link from "next/link";
import { MetricCard } from "@/components/ui/Card";
import { PortalEmpty } from "@/components/portal/PortalEmpty";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export default async function AdvisorDashboard() {
  const { profile } = await requireRole(["CHAPTER_ADVISOR", "STATE_ADMIN", "SUPER_ADMIN"]);
  const supabase = await createClient();
  const chapterId = profile?.chapter_id;

  const [{ count: members }, { count: events }, { count: pending }, { data: chapter }, { data: points }] =
    chapterId && supabase
      ? await Promise.all([
          supabase.from("chapter_members").select("id", { count: "exact", head: true }).eq("chapter_id", chapterId).eq("status", "ACTIVE"),
          supabase.from("events").select("id", { count: "exact", head: true }).eq("chapter_id", chapterId).in("status", ["PUBLISHED", "REGISTRATION_OPEN"]),
          supabase.from("chapter_members").select("id", { count: "exact", head: true }).eq("chapter_id", chapterId).eq("status", "PENDING"),
          supabase.from("chapters").select("name, status").eq("id", chapterId).maybeSingle(),
          supabase.from("points_transactions").select("amount").eq("chapter_id", chapterId),
        ])
      : [
          { count: 0 },
          { count: 0 },
          { count: 0 },
          { data: null },
          { data: [] },
        ];

  const cyclePoints = (points || []).reduce((sum: number, row: { amount: number }) => sum + row.amount, 0);

  return (
    <div className="space-y-8">
      <p className="text-lg font-semibold">{chapter?.name || "Chapter not assigned yet"}</p>
      <div className="grid gap-4 md:grid-cols-5">
        <MetricCard label="Active members" value={members ?? 0} />
        <MetricCard label="Upcoming events" value={events ?? 0} />
        <MetricCard label="Competition entries" value={0} hint="Shown when registrations exist." />
        <MetricCard label="Pending approvals" value={pending ?? 0} />
        <MetricCard label="Cycle points" value={cyclePoints} />
      </div>
      <section>
        <h2 className="mb-3 text-lg font-semibold">Pending actions</h2>
        {(pending ?? 0) > 0 ? (
          <Link href="/portal/advisor/members" className="block rounded-[var(--radius)] bg-white p-4 font-semibold">
            {pending} student registrations awaiting approval
          </Link>
        ) : (
          <PortalEmpty
            title="No pending actions"
            body="Approvals, incomplete registrations, and reviews will land here from live chapter data."
          />
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
      <section>
        <h2 className="mb-3 text-lg font-semibold">Advisor onboarding</h2>
        <PortalEmpty
          title="Complete your chapter profile"
          body="Add officers, invite members, review curriculum, and check upcoming events. Progress is calculated from real chapter records only."
        />
      </section>
    </div>
  );
}
