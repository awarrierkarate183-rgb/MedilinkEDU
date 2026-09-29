import { apiSuccess, errors } from "@/lib/api/respond";
import { parsed, readJson } from "@/lib/api/parse";
import { approveChapterSchema } from "@/lib/api/schemas";
import { getRequestActor } from "@/lib/api/session";
import { isAdminRole } from "@/lib/auth/roles";
import { approveChapter } from "@/lib/platform/operations";

export async function POST(request: Request) {
  const session = await getRequestActor();
  if (!session.configured || !session.supabase) return errors.notConfigured();
  if (!session.actor) return errors.unauthenticated();
  if (!isAdminRole(session.actor.role)) return errors.forbidden();

  const body = parsed(approveChapterSchema, await readJson(request));
  if (body.error) return body.error;

  const result = await approveChapter({
    client: session.supabase,
    actor: session.actor,
    chapterId: body.data.chapterId,
    status: body.data.status,
  });
  if (result.error) return errors.forbidden();
  return apiSuccess({ updated: true });
}
