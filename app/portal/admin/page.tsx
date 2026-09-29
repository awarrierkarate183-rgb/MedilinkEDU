import { MetricCard } from "@/components/ui/Card";
import { PortalEmpty } from "@/components/portal/PortalEmpty";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { count: chapters } = supabase
    ? await supabase.from("chapters").select("id", { count: "exact", head: true })
    : { count: 0 };
  const { count: users } = supabase
    ? await supabase.from("profiles").select("id", { count: "exact", head: true })
    : { count: 0 };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Chapters" value={chapters ?? 0} />
        <MetricCard label="Users" value={users ?? 0} />
        <MetricCard label="Published news" value={0} />
      </div>
      <PortalEmpty
        title="Admin tools"
        body="Create and archive chapters, assign advisors, manage competitions, and read the audit log. Prefer deactivation over destructive deletion when history matters."
      />
    </div>
  );
}
