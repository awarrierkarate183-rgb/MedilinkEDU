import { apiSuccess, errors } from "@/lib/api/respond";
import { parsed, readJson } from "@/lib/api/parse";
import { seasonSettingsSchema } from "@/lib/api/schemas";
import { getRequestActor } from "@/lib/api/session";
import { isAdminRole } from "@/lib/auth/roles";
import { createAdminClient } from "@/lib/supabase/admin";
import { currentSeason } from "@/lib/competition/operations";

export async function POST(request: Request) {
  const session = await getRequestActor();
  if (!session.configured) return errors.notConfigured();
  if (!session.actor || !isAdminRole(session.actor.role)) return errors.forbidden();
  const admin = createAdminClient();
  if (!admin) return errors.notConfigured();
  const body = parsed(seasonSettingsSchema, await readJson(request));
  if (body.error) return body.error;
  const season = await currentSeason(admin);
  if (!season) return errors.validation("No competition season is open.");
  const { error } = await admin
    .from("competition_seasons")
    .update({
      roster_locked: body.data.rosterLocked ?? season.roster_locked,
      invitational_nominations_open:
        body.data.invitationalNominationsOpen ?? season.invitational_nominations_open,
    })
    .eq("id", season.id);
  if (error) return errors.validation(error.message);
  return apiSuccess({ saved: true });
}
