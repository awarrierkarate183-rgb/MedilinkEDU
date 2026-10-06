import { apiSuccess, errors } from "@/lib/api/respond";
import { parsed, readJson } from "@/lib/api/parse";
import { createMedilinkListingSchema } from "@/lib/api/schemas";
import { getRequestActor } from "@/lib/api/session";
import { canApproveMembers, isAdminRole } from "@/lib/auth/roles";
import { writeAudit } from "@/lib/platform/operations";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const session = await getRequestActor();
  if (!session.configured) return errors.notConfigured();
  if (!session.actor) return errors.unauthenticated();

  const adminPost = isAdminRole(session.actor.role);
  if (!adminPost && (!canApproveMembers(session.actor) || !session.actor.chapterId)) {
    return errors.forbidden();
  }

  const body = parsed(createMedilinkListingSchema, await readJson(request));
  if (body.error) return body.error;

  const admin = createAdminClient();
  if (!admin) return errors.notConfigured();

  const eventDate = body.data.eventDate || null;
  const payload = {
    title: body.data.title,
    body: body.data.body,
    kind: body.data.kind,
    region: body.data.region,
    href: body.data.href || null,
    event_date: eventDate || null,
    scope: adminPost ? "ORGANIZATION" : "CHAPTER",
    chapter_id: adminPost ? null : session.actor.chapterId,
    status: "published",
    created_by: session.actor.id,
  };

  const { error } = await admin.from("medilink_listings").insert(payload);
  if (error) return errors.internal();
  await writeAudit(
    admin,
    session.actor.id,
    "medilink_listing_created",
    adminPost ? "organization" : "chapter",
    adminPost ? undefined : session.actor.chapterId || undefined,
  );
  return apiSuccess({ created: true, scope: payload.scope });
}
