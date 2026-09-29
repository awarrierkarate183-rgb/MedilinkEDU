import { apiSuccess, errors } from "@/lib/api/respond";
import { parsed, readJson } from "@/lib/api/parse";
import { joinChapterSchema } from "@/lib/api/schemas";
import { getRequestActor } from "@/lib/api/session";
import { writeAudit } from "@/lib/platform/operations";

export async function POST(request: Request) {
  const session = await getRequestActor();
  if (!session.configured || !session.supabase) return errors.notConfigured();
  if (!session.actor) return errors.unauthenticated();

  const body = parsed(joinChapterSchema, await readJson(request));
  if (body.error) return body.error;

  const { data: chapter } = await session.supabase
    .from("chapters")
    .select("id, name, public_visibility")
    .eq("join_code", body.data.joinCode)
    .maybeSingle();
  if (!chapter || !chapter.public_visibility) return errors.notFound("That chapter was not found.");

  const { error } = await session.supabase.from("chapter_members").insert({
    chapter_id: chapter.id,
    profile_id: session.actor.id,
    status: "PENDING",
  });
  if (error) return errors.conflict("You already have a membership record for that chapter.");

  await session.supabase
    .from("profiles")
    .update({ chapter_id: chapter.id, status: "PENDING" })
    .eq("id", session.actor.id);

  await writeAudit(session.supabase, session.actor.id, "chapter_join_requested", "chapter", chapter.id);
  return apiSuccess({ chapterId: chapter.id, status: "PENDING" });
}
