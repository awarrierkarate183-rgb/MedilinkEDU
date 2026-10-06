import { apiSuccess, errors } from "@/lib/api/respond";
import { parsed, readJson } from "@/lib/api/parse";
import { createAnnouncementSchema } from "@/lib/api/schemas";
import { getRequestActor } from "@/lib/api/session";
import { canApproveMembers, isAdminRole } from "@/lib/auth/roles";
import { writeAudit } from "@/lib/platform/operations";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const session = await getRequestActor();
  if (!session.configured || !session.supabase) return errors.notConfigured();
  if (!session.actor) return errors.unauthenticated();

  const adminPost = isAdminRole(session.actor.role);
  if (!adminPost && (!canApproveMembers(session.actor) || !session.actor.chapterId)) {
    return errors.forbidden();
  }

  const body = parsed(createAnnouncementSchema, await readJson(request));
  if (body.error) return body.error;

  const now = new Date().toISOString();
  const client = adminPost ? createAdminClient() || session.supabase : session.supabase;
  const payload = {
    title: body.data.title,
    message: body.data.body,
    body: body.data.body,
    audience: adminPost ? "ALL" : body.data.audienceType.toUpperCase(),
    audience_type: adminPost ? "all" : body.data.audienceType,
    chapter_id: adminPost ? null : session.actor.chapterId,
    scope: adminPost ? "ORGANIZATION" : "CHAPTER",
    priority: body.data.priority,
    status: body.data.status,
    author_id: session.actor.id,
    created_by: session.actor.id,
    published_at: body.data.status === "published" ? now : null,
    publish_at: body.data.status === "published" ? now : null,
    expires_at: adminPost ? null : undefined,
    expire_at: adminPost ? null : undefined,
  };
  let { error } = await client.from("announcements").insert(payload);
  if (error && adminPost) {
    const { scope: _scope, expires_at: _expires, expire_at: _expire, ...fallback } = payload;
    ({ error } = await client.from("announcements").insert(fallback));
  }
  if (error) return errors.internal();
  await writeAudit(
    session.supabase,
    session.actor.id,
    "announcement_created",
    adminPost ? "organization" : "chapter",
    adminPost ? undefined : session.actor.chapterId || undefined,
  );
  return apiSuccess({ created: true, scope: adminPost ? "ORGANIZATION" : "CHAPTER" });
}
