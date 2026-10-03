import { apiSuccess, errors } from "@/lib/api/respond";
import { parsed, readJson } from "@/lib/api/parse";
import { startChapterSchema } from "@/lib/api/schemas";
import { createAdminClient } from "@/lib/supabase/admin";
import { startChapter } from "@/lib/platform/provision";

export async function POST(request: Request) {
  const admin = createAdminClient();
  if (!admin) return errors.notConfigured();

  const body = parsed(startChapterSchema, await readJson(request));
  if (body.error) return body.error;

  const result = await startChapter(admin, body.data);
  if ("error" in result && result.error) {
    return errors.validation(result.error);
  }
  if (!("email" in result)) return errors.internal();
  return apiSuccess(result, 201);
}
