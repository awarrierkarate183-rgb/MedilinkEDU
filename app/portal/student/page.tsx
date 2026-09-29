import { MetricCard } from "@/components/ui/Card";
import { PortalEmpty } from "@/components/portal/PortalEmpty";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export default async function StudentDashboard() {
  const { profile } = await requireRole([
    "STUDENT",
    "CHAPTER_OFFICER",
    "CHAPTER_ADVISOR",
    "STATE_ADMIN",
    "SUPER_ADMIN",
  ]);
  const supabase = await createClient();
  const { data: chapter } = supabase && profile?.chapter_id
    ? await supabase.from("chapters").select("name").eq("id", profile.chapter_id).maybeSingle()
    : { data: null };
  const { data: points } = supabase
    ? await supabase.from("points_transactions").select("amount").eq("profile_id", profile?.id)
    : { data: [] };
  const myPoints = (points || []).reduce((sum: number, row: { amount: number }) => sum + row.amount, 0);

  return (
    <div className="space-y-8">
      <p className="text-lg font-semibold">{chapter?.name || "Chapter assignment pending"}</p>
      <div className="grid gap-4 md:grid-cols-5">
        <MetricCard label="Upcoming events" value={0} hint="Events appear when published." />
        <MetricCard label="Active competitions" value={0} />
        <MetricCard label="Curriculum progress" value={0} />
        <MetricCard label="My points" value={myPoints} />
        <MetricCard label="Achievements" value={0} />
      </div>
      <section>
        <h2 className="mb-3 text-lg font-semibold">Your next steps</h2>
        <PortalEmpty
          title="You're all caught up."
          body="Next steps are built from your events, curriculum progress, and open competitions. Nothing is invented here."
        />
      </section>
    </div>
  );
}
