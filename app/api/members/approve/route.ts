import { apiSuccess, errors } from "@/lib/api/respond";
import { parsed, readJson } from "@/lib/api/parse";
import { approveMemberSchema } from "@/lib/api/schemas";
import { getRequestActor } from "@/lib/api/session";
import { canApproveMembers } from "@/lib/auth/roles";
import { approveMember } from "@/lib/platform/operations";

export async function POST(request: Request) {
  const session = await getRequestActor();
  if (!session.configured || !session.supabase) return errors.notConfigured();
  if (!session.actor) return errors.unauthenticated();
  if (!canApproveMembers(session.actor)) return errors.forbidden();

  const body = parsed(approveMemberSchema, await readJson(request));
  if (body.error) return body.error;

  const result = await approveMember({
    client: session.supabase,
    actor: session.actor,
    membershipId: body.data.membershipId,
  });
  if (result.error) return errors.forbidden();
  return apiSuccess({ approved: true });
}
