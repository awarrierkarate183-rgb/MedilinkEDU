import { apiSuccess, errors } from "@/lib/api/respond";
import { parsed, readJson } from "@/lib/api/parse";
import { awardPointsSchema } from "@/lib/api/schemas";
import { getRequestActor } from "@/lib/api/session";
import { canAwardPoints } from "@/lib/auth/roles";
import { awardPoints } from "@/lib/platform/operations";

export async function POST(request: Request) {
  const session = await getRequestActor();
  if (!session.configured || !session.supabase) return errors.notConfigured();
  if (!session.actor) return errors.unauthenticated();
  if (!canAwardPoints(session.actor)) return errors.forbidden();

  const body = parsed(awardPointsSchema, await readJson(request));
  if (body.error) return body.error;

  const result = await awardPoints({
    client: session.supabase,
    actor: session.actor,
    reasonCode: body.data.reasonCode,
    competitionId: body.data.competitionId,
    stageId: body.data.stageId,
    teamId: body.data.teamId,
    profileId: body.data.profileId,
    eventDate: body.data.eventDate,
  });
  if (result.error) return errors.forbidden();
  return apiSuccess({ awarded: true, amount: result.amount });
}
