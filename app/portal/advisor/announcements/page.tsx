import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { AnnouncementForm } from "@/components/portal/AnnouncementForm";
import { ConnectionTrouble } from "@/components/portal/ConnectionTrouble";
import { PortalEmpty } from "@/components/portal/PortalEmpty";

export default async function AdvisorAnnouncementsPage() {
  const { profile } = await requireRole(["CHAPTER_ADVISOR", "STATE_ADMIN", "SUPER_ADMIN"]);
  const supabase = await createClient();
  const { data, error } = supabase && profile?.chapter_id
    ? await supabase
        .from("announcements")
        .select("id, title, body, message, created_at, status")
        .eq("chapter_id", profile.chapter_id)
        .order("created_at", { ascending: false })
        .limit(25)
    : { data: [], error: null };

  if (error) return <ConnectionTrouble />;

  return (
    <div className="space-y-8">
      <AnnouncementForm />
      {!data?.length ? (
        <PortalEmpty title="No chapter announcements" body="Published announcements for this chapter appear here." />
      ) : (
        <ul className="space-y-2">
          {data.map((row) => (
            <li key={row.id} className="rounded-[var(--radius)] bg-white px-4 py-3">
              <strong>{row.title}</strong>
              <p className="mt-1 text-sm text-muted">{row.body || row.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
