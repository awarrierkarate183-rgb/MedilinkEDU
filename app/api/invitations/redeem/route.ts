import { apiSuccess, errors } from "@/lib/api/respond";
import { parsed, readJson } from "@/lib/api/parse";
import { redeemInvitationSchema } from "@/lib/api/schemas";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { redeemInvitation } from "@/lib/platform/operations";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) return errors.notConfigured();
  const supabase = await createClient();
  if (!supabase) return errors.notConfigured();

  const body = parsed(redeemInvitationSchema, await readJson(request));
  if (body.error) return body.error;

  const result = await redeemInvitation({
    userClient: supabase,
    token: body.data.token,
    email: body.data.email,
    password: body.data.password,
    firstName: body.data.firstName,
    lastName: body.data.lastName || "",
  });
  if ("error" in result && result.error) return errors.validation(result.error);
  return apiSuccess({ redeemed: true });
}
