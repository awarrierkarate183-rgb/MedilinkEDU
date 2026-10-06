import { apiSuccess, errors } from "@/lib/api/respond";
import { parsed, readJson } from "@/lib/api/parse";
import { reviewIdeaSchema } from "@/lib/api/schemas";
import { getRequestActor } from "@/lib/api/session";
import { canApproveMembers } from "@/lib/auth/roles";
import { notify } from "@/lib/platform/operations";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const session = await getRequestActor();
  if (!session.configured) return errors.notConfigured();
  if (!session.actor) return errors.unauthenticated();
  if (!canApproveMembers(session.actor) || !session.actor.chapterId) return errors.forbidden();
  const admin = createAdminClient();
  if (!admin) return errors.notConfigured();
  const body = parsed(reviewIdeaSchema, await readJson(request));
  if (body.error) return body.error;

  const { data: idea } = await admin
    .from("ideas")
    .select("id, chapter_id, owner_id, title")
    .eq("id", body.data.ideaId)
    .maybeSingle();
  if (!idea || idea.chapter_id !== session.actor.chapterId) return errors.notFound();

  const { error } = await admin
    .from("ideas")
    .update({
      status: body.data.status,
      advisor_feedback: body.data.feedback || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", idea.id);
  if (error) return errors.internal();
  await notify(
    admin,
    idea.owner_id,
    "chapter_idea",
    `Your idea was reviewed: ${idea.title}`,
    body.data.feedback
      ? `Status is now ${body.data.status.replaceAll("_", " ").toLowerCase()}. ${body.data.feedback}`
      : `Status is now ${body.data.status.replaceAll("_", " ").toLowerCase()}. Open Ideas Lab for the note from your advisor.`,
    "/portal/student/ideas",
  );
  return apiSuccess({ updated: true });
}
