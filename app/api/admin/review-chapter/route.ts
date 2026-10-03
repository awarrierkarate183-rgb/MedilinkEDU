import { apiSuccess, errors } from "@/lib/api/respond";
import { parsed, readJson } from "@/lib/api/parse";
import { reviewChapterSchema } from "@/lib/api/schemas";
import { getRequestActor } from "@/lib/api/session";
import { isAdminRole } from "@/lib/auth/roles";
import { createAdminClient } from "@/lib/supabase/admin";
import { reviewChapterRequest } from "@/lib/platform/provision";

export async function POST(request: Request) {
  const session = await getRequestActor();
  if (!session.configured) return errors.notConfigured();
  if (!session.actor) return errors.unauthenticated();
  if (!isAdminRole(session.actor.role)) return errors.forbidden();

  const admin = createAdminClient();
  if (!admin) return errors.notConfigured();

  const body = parsed(reviewChapterSchema, await readJson(request));
  if (body.error) return body.error;

  const result = await reviewChapterRequest(
    admin,
    session.actor.id,
    body.data.chapterId,
    body.data.decision,
  );
  if (result.error) return errors.validation(result.error);
  return apiSuccess({ reviewed: true, decision: body.data.decision });
}
