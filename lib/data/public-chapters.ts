import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { PublicChapter } from "@/lib/content/chapters";

export const PUBLIC_CHAPTER_STATUSES = ["FOUNDING", "ESTABLISHED", "FLAGSHIP_ELIGIBLE"] as const;

export async function loadPublicChapters(): Promise<PublicChapter[]> {
  const admin = createAdminClient();
  const client = admin ?? (await createClient());
  if (!client) return [];

  let query = client
    .from("chapters")
    .select("id, school, city, state, status")
    .in("status", [...PUBLIC_CHAPTER_STATUSES])
    .order("school");
  if (!admin) {
    query = query.eq("public_visibility", true);
  }
  const { data } = await query;
  return (data ?? []).map((row) => ({
    id: row.id,
    school: row.school,
    city: row.city,
    state: row.state,
    status: row.status,
  }));
}
