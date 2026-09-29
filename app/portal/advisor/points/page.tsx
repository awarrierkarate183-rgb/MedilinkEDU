import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { AwardPointsForm } from "@/components/portal/AwardPointsForm";
import { ConnectionTrouble } from "@/components/portal/ConnectionTrouble";
import { PortalEmpty } from "@/components/portal/PortalEmpty";
import { sumPoints } from "@/lib/points/award";

export default async function AdvisorPointsPage() {
  const { profile } = await requireRole(["CHAPTER_ADVISOR", "STATE_ADMIN", "SUPER_ADMIN"]);
  const supabase = await createClient();
  const { data, error } = supabase
    ? await supabase
        .from("points_transactions")
        .select("id, amount, reason, reason_code, created_at")
        .eq("chapter_id", profile?.chapter_id)
        .order("created_at", { ascending: false })
        .limit(50)
    : { data: [], error: null };

  if (error) return <ConnectionTrouble />;
  const total = sumPoints(data || []);

  return (
    <div className="space-y-8">
      <p className="text-lg font-semibold">Chapter total: {total}</p>
      <AwardPointsForm />
      {!data?.length ? (
        <PortalEmpty
          title="No point transactions yet"
          body="Totals come from recorded transactions in the current Apex cycle. This page does not let anyone type a chapter total."
        />
      ) : (
        <ul className="divide-y divide-border rounded-[var(--radius)] bg-white">
          {data.map((row) => (
            <li key={row.id} className="flex justify-between px-4 py-3 text-sm">
              <span>{row.reason}</span>
              <span className="font-semibold">{row.amount}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
