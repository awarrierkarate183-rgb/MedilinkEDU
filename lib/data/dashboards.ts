import { createClient } from "@/lib/supabase/server";
import { tracks } from "@/lib/content/curriculum";

type ProgressRow = { module_id: string; status: string; progress_percent: number };

export async function loadStudentDashboard(userId: string, chapterId: string | null) {
  const supabase = await createClient();
  if (!supabase) return { configured: false as const, error: false as const, data: null };
  try {

  const now = new Date().toISOString();
  const [
    chapterRes,
    eventsRes,
    competitionsRes,
    progressRes,
    ideasRes,
    projectsRes,
    notificationsRes,
    pointsRes,
  ] = await Promise.all([
    chapterId
      ? supabase.from("chapters").select("id, name, status, school").eq("id", chapterId).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    supabase
      .from("events")
      .select("id, title, start_at, event_date, status")
      .in("status", ["PUBLISHED", "REGISTRATION_OPEN"])
      .order("start_at", { ascending: true })
      .limit(5),
    supabase
      .from("competitions")
      .select("id", { count: "exact", head: true })
      .in("status", ["UPCOMING", "REGISTRATION_OPEN", "IN_PROGRESS"]),
    supabase
      .from("curriculum_progress")
      .select("status")
      .eq("profile_id", userId),
    supabase.from("ideas").select("id", { count: "exact", head: true }).eq("owner_id", userId),
    chapterId
      ? supabase.from("projects").select("id", { count: "exact", head: true }).eq("chapter_id", chapterId)
      : Promise.resolve({ count: 0, error: null }),
    supabase
      .from("notifications")
      .select("id, title, message, created_at, read_at")
      .eq("profile_id", userId)
      .is("read_at", null)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("points_transactions").select("amount").eq("profile_id", userId),
  ]);

  const failed = [
    chapterRes,
    eventsRes,
    competitionsRes,
    progressRes,
    ideasRes,
    projectsRes,
    notificationsRes,
    pointsRes,
  ].some((row) => row && "error" in row && row.error);

  if (failed) return { configured: true as const, error: true as const, data: null };

  const completed = (progressRes.data || []).filter((row: { status: string }) => row.status === "COMPLETED").length;
  const totalModules = tracks.reduce((sum, track) => sum + track.modules.length, 0);

  return {
    configured: true as const,
    error: false as const,
    data: {
      chapter: chapterRes.data,
      events: eventsRes.data || [],
      competitionCount: competitionsRes.count ?? 0,
      curriculumCompleted: completed,
      curriculumTotal: totalModules,
      ideaCount: ideasRes.count ?? 0,
      projectCount: projectsRes.count ?? 0,
      notifications: notificationsRes.data || [],
      points: (pointsRes.data || []).reduce((sum: number, row: { amount: number }) => sum + row.amount, 0),
      generatedAt: now,
    },
  };
  } catch {
    return { configured: true as const, error: true as const, data: null };
  }
}

export async function loadAdvisorDashboard(chapterId: string | null) {
  const supabase = await createClient();
  if (!supabase) return { configured: false as const, error: false as const, data: null };
  if (!chapterId) {
    return {
      configured: true as const,
      error: false as const,
      data: {
        chapter: null,
        members: 0,
        events: 0,
        pending: 0,
        registrations: 0,
        points: 0,
        upcoming: [] as Array<{ id: string; title: string; start_at: string | null }>,
        announcements: [] as Array<{ id: string; title: string }>,
      },
    };
  }

  const [members, events, pending, chapter, points, registrations, upcoming, announcements] = await Promise.all([
    supabase.from("chapter_members").select("id", { count: "exact", head: true }).eq("chapter_id", chapterId).eq("status", "ACTIVE"),
    supabase.from("events").select("id", { count: "exact", head: true }).eq("chapter_id", chapterId).in("status", ["PUBLISHED", "REGISTRATION_OPEN"]),
    supabase.from("chapter_members").select("id", { count: "exact", head: true }).eq("chapter_id", chapterId).eq("status", "PENDING"),
    supabase.from("chapters").select("name, status, school").eq("id", chapterId).maybeSingle(),
    supabase.from("points_transactions").select("amount").eq("chapter_id", chapterId),
    supabase.from("competition_registrations").select("id", { count: "exact", head: true }).eq("chapter_id", chapterId),
    supabase
      .from("events")
      .select("id, title, start_at")
      .eq("chapter_id", chapterId)
      .in("status", ["PUBLISHED", "REGISTRATION_OPEN"])
      .order("start_at", { ascending: true })
      .limit(5),
    supabase
      .from("announcements")
      .select("id, title")
      .eq("chapter_id", chapterId)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const failed = [members, events, pending, chapter, points, registrations, upcoming, announcements].some(
    (row) => row && "error" in row && row.error,
  );
  if (failed) return { configured: true as const, error: true as const, data: null };

  return {
    configured: true as const,
    error: false as const,
    data: {
      chapter: chapter.data,
      members: members.count ?? 0,
      events: events.count ?? 0,
      pending: pending.count ?? 0,
      registrations: registrations.count ?? 0,
      points: (points.data || []).reduce((sum: number, row: { amount: number }) => sum + row.amount, 0),
      upcoming: upcoming.data || [],
      announcements: announcements.data || [],
    },
  };
}

export async function loadAdminDashboard() {
  const supabase = await createClient();
  if (!supabase) return { configured: false as const, error: false as const, data: null };
  try {

  const [chapters, users, pendingChapters, competitions, submissions, activity] = await Promise.all([
    supabase.from("chapters").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("chapters").select("id", { count: "exact", head: true }).in("status", ["PROPOSED", "PENDING_APPROVAL"]),
    supabase.from("competitions").select("id", { count: "exact", head: true }).in("status", ["UPCOMING", "REGISTRATION_OPEN"]),
    supabase.from("submissions").select("id", { count: "exact", head: true }).eq("status", "SUBMITTED"),
    supabase.from("audit_logs").select("id, action, created_at").order("created_at", { ascending: false }).limit(8),
  ]);

  const failed = [chapters, users, pendingChapters, competitions, submissions, activity].some(
    (row) => row && "error" in row && row.error,
  );
  if (failed) return { configured: true as const, error: true as const, data: null };

  return {
    configured: true as const,
    error: false as const,
    data: {
      chapters: chapters.count ?? 0,
      users: users.count ?? 0,
      pendingChapters: pendingChapters.count ?? 0,
      competitions: competitions.count ?? 0,
      submissions: submissions.count ?? 0,
      activity: activity.data || [],
    },
  };
  } catch {
    return { configured: true as const, error: true as const, data: null };
  }
}

export async function loadCurriculumProgress(userId: string) {
  const supabase = await createClient();
  if (!supabase) return { error: false as const, rows: [] as ProgressRow[] };
  const { data, error } = await supabase
    .from("curriculum_progress")
    .select("module_id, status, progress_percent")
    .eq("profile_id", userId);
  if (error) return { error: true as const, rows: [] as ProgressRow[] };
  return { error: false as const, rows: (data || []) as ProgressRow[] };
}
