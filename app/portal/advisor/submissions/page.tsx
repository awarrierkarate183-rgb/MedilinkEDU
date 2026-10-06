import { requireRole } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { ConnectionTrouble } from "@/components/portal/ConnectionTrouble";
import { IdeaInbox, type ChapterIdea } from "@/components/portal/IdeaInbox";
import { AdvisorPrepInbox, type AdvisorPrepRow } from "@/components/portal/AdvisorPrepInbox";
import { currentSeason } from "@/lib/competition/operations";
import { loadChapterPrep } from "@/lib/competition/prep";

function displayName(row: {
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  display_name?: string | null;
}) {
  const named = [row.first_name, row.last_name].filter(Boolean).join(" ").trim();
  return named || row.full_name || row.display_name || "Student";
}

export default async function AdvisorSubmissionsPage() {
  const { profile } = await requireRole(["CHAPTER_ADVISOR", "STATE_ADMIN", "SUPER_ADMIN"]);
  const admin = createAdminClient();
  if (!admin || !profile?.chapter_id) {
    return profile?.chapter_id ? <ConnectionTrouble /> : (
      <div className="rounded-[var(--radius)] bg-white p-5 text-sm text-muted">
        Attach a chapter to see Ideas Lab submissions and prerequisite files.
      </div>
    );
  }

  const season = await currentSeason(admin);
  type IdeaRow = {
    id: string;
    title: string;
    request_kind?: string | null;
    problem: string | null;
    why_it_matters: string | null;
    status: string;
    advisor_feedback: string | null;
    created_at: string;
    owner_id: string;
  };
  let ideaQuery: { data: IdeaRow[] | null; error: { message?: string } | null } = await admin
    .from("ideas")
    .select("id, title, request_kind, problem, why_it_matters, status, advisor_feedback, created_at, owner_id")
    .eq("chapter_id", profile.chapter_id)
    .neq("status", "DRAFT")
    .order("created_at", { ascending: false });
  if (ideaQuery.error && /request_kind/i.test(ideaQuery.error.message || "")) {
    ideaQuery = await admin
      .from("ideas")
      .select("id, title, problem, why_it_matters, status, advisor_feedback, created_at, owner_id")
      .eq("chapter_id", profile.chapter_id)
      .neq("status", "DRAFT")
      .order("created_at", { ascending: false });
  }
  const prepRows = await loadChapterPrep(admin, { chapterId: profile.chapter_id, seasonId: season?.id });
  const ownerIds = [...new Set((ideaQuery.data ?? []).map((row) => row.owner_id).filter(Boolean))];
  const prepIds = [...new Set(prepRows.map((row) => row.profile_id).filter(Boolean))];
  const peopleIds = [...new Set([...ownerIds, ...prepIds])];
  const { data: people } = peopleIds.length
    ? await admin
        .from("profiles")
        .select("id, first_name, last_name, full_name, display_name")
        .in("id", peopleIds)
    : { data: [] };
  const names = new Map((people ?? []).map((row) => [row.id, displayName(row)]));

  const ideas: ChapterIdea[] = (ideaQuery.data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    requestKind: "request_kind" in row ? String(row.request_kind || "OTHER") : "OTHER",
    body: row.problem || "",
    why: row.why_it_matters || "",
    status: row.status,
    feedback: row.advisor_feedback || "",
    createdAt: row.created_at,
    studentName: names.get(row.owner_id) || "Student",
  }));

  const items: AdvisorPrepRow[] = prepRows.map((row) => ({
    id: row.id,
    catalog_event_id: row.catalog_event_id,
    kind: row.kind,
    title: row.title,
    notes: row.notes,
    file_path: row.file_path,
    status: row.status,
    submitted_at: row.submitted_at,
    studentName: names.get(row.profile_id) || "Student",
  }));

  return (
    <div className="space-y-10">
      <section className="rounded-[var(--radius)] bg-white p-5">
        <h1 className="text-xl font-semibold">Submissions</h1>
        <p className="mt-2 text-sm text-muted">
          Chapter ideas from Ideas Lab and prerequisite work from Projects land here. Competition entries stay on
          Competitions.
        </p>
      </section>
      <IdeaInbox ideas={ideas} />
      <AdvisorPrepInbox items={items} />
    </div>
  );
}
