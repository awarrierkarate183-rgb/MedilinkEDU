import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { IdeaLabForm } from "@/components/portal/IdeaLabForm";
import { PortalEmpty } from "@/components/portal/PortalEmpty";

function kindLabel(kind?: string | null) {
  if (kind === "EVENT") return "Chapter event";
  if (kind === "ACTIVITY") return "Activity";
  if (kind === "OTHER") return "Other";
  return "Idea";
}

export default async function IdeasPage() {
  const { profile } = await requireRole(["STUDENT", "CHAPTER_OFFICER"]);
  const supabase = await createClient();
  let ideas: Array<{
    id: string;
    title: string;
    status: string;
    request_kind?: string | null;
    problem?: string | null;
    why_it_matters?: string | null;
    advisor_feedback?: string | null;
  }> = [];
  if (supabase && profile?.id) {
    const first = await supabase
      .from("ideas")
      .select("id, title, status, request_kind, problem, why_it_matters, advisor_feedback, created_at")
      .eq("owner_id", profile.id)
      .order("created_at", { ascending: false });
    if (first.error && /request_kind/i.test(first.error.message)) {
      const fallback = await supabase
        .from("ideas")
        .select("id, title, status, problem, why_it_matters, advisor_feedback, created_at")
        .eq("owner_id", profile.id)
        .order("created_at", { ascending: false });
      ideas = fallback.data ?? [];
    } else {
      ideas = first.data ?? [];
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[var(--radius)] bg-white p-5">
        <h1 className="text-xl font-semibold">Ideas Lab</h1>
        <p className="mt-2 text-sm text-muted">
          Send an idea for an event or something the chapter can do. Your advisor sees it on Submissions.
        </p>
        {!profile?.chapter_id ? (
          <p className="mt-3 text-sm text-muted">
            Your account is not attached to a chapter yet, so an idea cannot reach an advisor.
          </p>
        ) : null}
      </section>
      {profile?.chapter_id ? <IdeaLabForm /> : null}
      {!ideas.length ? (
        <PortalEmpty
          title="No ideas sent yet"
          body="Describe what you want the chapter to do. Your advisor will review it."
        />
      ) : (
        <ul className="space-y-3">
          {ideas.map((idea) => (
            <li key={idea.id} className="rounded-[var(--radius)] bg-white px-4 py-4">
              <p className="text-sm text-muted">
                {kindLabel(idea.request_kind)} · {idea.status.replaceAll("_", " ").toLowerCase()}
              </p>
              <h2 className="mt-1 font-semibold">{idea.title}</h2>
              {idea.problem ? <p className="mt-2 whitespace-pre-wrap text-sm">{idea.problem}</p> : null}
              {idea.why_it_matters ? <p className="mt-2 text-sm text-muted">Why: {idea.why_it_matters}</p> : null}
              {idea.advisor_feedback ? (
                <p className="mt-2 text-sm">Advisor note: {idea.advisor_feedback}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
