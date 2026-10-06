import { apiSuccess, errors } from "@/lib/api/respond";
import { parsed, readJson } from "@/lib/api/parse";
import { createChapterIdeaSchema } from "@/lib/api/schemas";
import { getRequestActor } from "@/lib/api/session";
import { canAccessStudentPortal } from "@/lib/auth/roles";
import { notify, writeAudit } from "@/lib/platform/operations";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const session = await getRequestActor();
  if (!session.configured || !session.supabase) return errors.notConfigured();
  if (!session.actor) return errors.unauthenticated();
  if (!canAccessStudentPortal(session.actor.role) || !session.actor.chapterId) {
    return errors.forbidden();
  }
  const body = parsed(createChapterIdeaSchema, await readJson(request));
  if (body.error) return body.error;

  const payload = {
    owner_id: session.actor.id,
    chapter_id: session.actor.chapterId,
    title: body.data.title,
    request_kind: body.data.requestKind,
    problem: body.data.body,
    why_it_matters: body.data.why,
    category: body.data.requestKind === "EVENT" ? "OTHER" : "COMMUNITY",
    status: "SUBMITTED",
  };
  let { error } = await session.supabase.from("ideas").insert(payload);
  if (error && /request_kind/i.test(error.message)) {
    const { request_kind: _kind, ...fallback } = payload;
    ({ error } = await session.supabase.from("ideas").insert(fallback));
  }
  if (error) return errors.internal();

  const admin = createAdminClient();
  if (admin) {
    const { data: profile } = await admin
      .from("profiles")
      .select("first_name, last_name, full_name, display_name")
      .eq("id", session.actor.id)
      .maybeSingle();
    const studentName =
      [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim() ||
      profile?.full_name ||
      profile?.display_name ||
      "A student";
    const { data: advisors } = await admin
      .from("profiles")
      .select("id")
      .eq("chapter_id", session.actor.chapterId)
      .eq("role", "CHAPTER_ADVISOR")
      .neq("status", "REMOVED");
    await Promise.all(
      (advisors ?? []).map((advisor) =>
        notify(
          admin,
          advisor.id,
          "chapter_idea",
          `${studentName} sent a chapter idea`,
          `${studentName} submitted "${body.data.title}" on Ideas Lab. Open Submissions to read it.`,
          "/portal/advisor/submissions",
        ),
      ),
    );
    await writeAudit(admin, session.actor.id, "idea_submitted", "chapter", session.actor.chapterId);
  }
  return apiSuccess({ created: true });
}
