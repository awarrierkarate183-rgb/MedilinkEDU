import { apiSuccess, errors } from "@/lib/api/respond";
import { parsed, readJson } from "@/lib/api/parse";
import { unpublishMedilinkListingSchema } from "@/lib/api/schemas";
import { getRequestActor } from "@/lib/api/session";
import { canApproveMembers, isAdminRole } from "@/lib/auth/roles";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const session = await getRequestActor();
  if (!session.configured) return errors.notConfigured();
  if (!session.actor) return errors.unauthenticated();
  const admin = createAdminClient();
  if (!admin) return errors.notConfigured();

  const body = parsed(unpublishMedilinkListingSchema, await readJson(request));
  if (body.error) return body.error;

  const { data: listing } = await admin
    .from("medilink_listings")
    .select("id, scope, chapter_id")
    .eq("id", body.data.listingId)
    .maybeSingle();
  if (!listing) return errors.notFound();

  if (listing.scope === "ORGANIZATION") {
    if (!isAdminRole(session.actor.role)) return errors.forbidden();
  } else if (!canApproveMembers(session.actor) || listing.chapter_id !== session.actor.chapterId) {
    return errors.forbidden();
  }

  const { error } = await admin
    .from("medilink_listings")
    .update({ status: "unpublished", updated_at: new Date().toISOString() })
    .eq("id", listing.id);
  if (error) return errors.internal();
  return apiSuccess({ unpublished: true });
}
