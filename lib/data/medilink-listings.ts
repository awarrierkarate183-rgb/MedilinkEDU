import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { OpportunityKind } from "@/lib/content/medilink-events";

export type ListingScope = "ORGANIZATION" | "CHAPTER";

export type MediLinkListing = {
  id: string;
  title: string;
  body: string;
  kind: OpportunityKind;
  region: string;
  scope: ListingScope;
  chapter_id: string | null;
  status: string;
  href: string | null;
  event_date: string | null;
  created_at: string;
};

export function listingVisibleTo(
  row: Pick<MediLinkListing, "scope" | "chapter_id" | "status">,
  options: { viewer: "public" | "student" | "advisor" | "admin"; chapterId?: string | null },
) {
  if ((row.status || "").toLowerCase() !== "published") return false;
  if (row.scope === "ORGANIZATION") return true;
  if (options.viewer === "public" || options.viewer === "admin") return false;
  return Boolean(options.chapterId && row.chapter_id === options.chapterId);
}

export async function loadMediLinkListings(options: {
  viewer: "public" | "student" | "advisor" | "admin";
  chapterId?: string | null;
}) {
  const admin = createAdminClient();
  const supabase = admin || (await createClient());
  if (!supabase) return { error: true as const, listings: [] as MediLinkListing[] };

  const { data, error } = await supabase
    .from("medilink_listings")
    .select("id, title, body, kind, region, scope, chapter_id, status, href, event_date, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (error) return { error: true as const, listings: [] as MediLinkListing[] };

  const listings = ((data || []) as MediLinkListing[]).filter((row) => listingVisibleTo(row, options));
  return { error: false as const, listings };
}
