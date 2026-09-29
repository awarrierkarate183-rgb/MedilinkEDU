import { apiSuccess, errors } from "@/lib/api/respond";
import { parsed, readJson } from "@/lib/api/parse";
import { createAnnouncementSchema } from "@/lib/api/schemas";
import { getRequestActor } from "@/lib/api/session";
import { canApproveMembers } from "@/lib/auth/roles";
import { writeAudit } from "@/lib/platform/operations";

export async function POST(request: Request) {
  const session = await getRequestActor();
  if (!session.configured || !session.supabase) return errors.notConfigured();
  if (!session.actor) return errors.unauthenticated();
  if (!canApproveMembers(session.actor) || !session.actor.chapterId) return errors.forbidden();

  const body = parsed(createAnnouncementSchema, await readJson(request));
  if (body.error) return body.error;

  const now = new Date().toISOString();
  const { error } = await session.supabase.from("announcements").insert({
    title: body.data.title,
    message: body.data.body,
    body: body.data.body,
    audience: body.data.audienceType.toUpperCase(),
    audience_type: body.data.audienceType,
    chapter_id: session.actor.chapterId,
    priority: body.data.priority,
    status: body.data.status,
    author_id: session.actor.id,
    created_by: session.actor.id,
    published_at: body.data.status === "published" ? now : null,
    publish_at: body.data.status === "published" ? now : null,
  });
  if (error) return errors.internal();
  await writeAudit(session.supabase, session.actor.id, "announcement_created", "chapter", session.actor.chapterId);
  return apiSuccess({ created: true });
}
