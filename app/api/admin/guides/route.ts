import { apiSuccess, errors } from "@/lib/api/respond";
import { parsed, readJson } from "@/lib/api/parse";
import { eventGuideSchema } from "@/lib/api/schemas";
import { getRequestActor } from "@/lib/api/session";
import { isAdminRole } from "@/lib/auth/roles";
import { createAdminClient } from "@/lib/supabase/admin";
import { listEventGuides, publishLegacyHandbook, publishNormalHandbook, upsertEventGuide } from "@/lib/guides/operations";

export async function GET() {
  const session = await getRequestActor();
  if (!session.configured) return errors.notConfigured();
  if (!session.actor) return errors.unauthenticated();
  if (!isAdminRole(session.actor.role)) return errors.forbidden();
  const admin = createAdminClient();
  if (!admin) return errors.notConfigured();
  return apiSuccess({ guides: await listEventGuides(admin) });
}

export async function POST(request: Request) {
  const session = await getRequestActor();
  if (!session.configured) return errors.notConfigured();
  if (!session.actor) return errors.unauthenticated();
  if (!isAdminRole(session.actor.role)) return errors.forbidden();
  const admin = createAdminClient();
  if (!admin) return errors.notConfigured();
  const raw = await readJson(request);
  if (raw && typeof raw === "object" && "publishHandbook" in raw) {
    const result = await publishNormalHandbook(admin, session.actor);
    if ("error" in result && result.error) return errors.validation(result.error);
    return apiSuccess(result);
  }
  if (raw && typeof raw === "object" && "publishLegacyHandbook" in raw) {
    const result = await publishLegacyHandbook(admin, session.actor);
    if ("error" in result && result.error) return errors.validation(result.error);
    return apiSuccess(result);
  }
  const body = parsed(eventGuideSchema, raw);
  if (body.error) return body.error;
  const result = await upsertEventGuide(admin, session.actor, body.data);
  if ("error" in result && result.error) return errors.validation(result.error);
  return apiSuccess(result);
}
