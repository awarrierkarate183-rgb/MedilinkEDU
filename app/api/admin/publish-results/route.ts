import { apiSuccess, errors } from "@/lib/api/respond";
import { parsed, readJson } from "@/lib/api/parse";
import { publishResultsSchema } from "@/lib/api/schemas";
import { getRequestActor } from "@/lib/api/session";
import { publishResult } from "@/lib/platform/operations";

export async function POST(request: Request) {
  const session = await getRequestActor();
  if (!session.configured || !session.supabase) return errors.notConfigured();
  if (!session.actor) return errors.unauthenticated();

  const body = parsed(publishResultsSchema, await readJson(request));
  if (body.error) return body.error;

  const result = await publishResult({
    client: session.supabase,
    actor: session.actor,
    resultId: body.data.resultId,
  });
  if (result.error) return errors.forbidden();
  return apiSuccess({ published: true });
}
