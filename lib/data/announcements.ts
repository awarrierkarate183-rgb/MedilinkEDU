import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type PortalAnnouncement = {
  id: string;
  title: string;
  body: string | null;
  message: string | null;
  created_at: string;
  scope: "ORGANIZATION" | "CHAPTER";
  audience: string;
  status: string | null;
  chapter_id: string | null;
};

type RawAnnouncement = {
  id: string;
  title: string;
  body: string | null;
  message: string | null;
  created_at: string;
  scope?: string | null;
  audience?: string | null;
  audience_type?: string | null;
  status?: string | null;
  chapter_id?: string | null;
  expires_at?: string | null;
  expire_at?: string | null;
};

function published(row: RawAnnouncement) {
  const status = (row.status || "").toLowerCase();
  return !status || status === "published" || status === "publish";
}

export function isOrganizationAnnouncement(row: RawAnnouncement) {
  if ((row.scope || "").toUpperCase() === "ORGANIZATION") return true;
  const audience = `${row.audience_type || ""} ${row.audience || ""}`.toUpperCase();
  return !row.chapter_id && audience.includes("ALL");
}

export function announcementVisibleTo(
  row: RawAnnouncement,
  viewer: "student" | "advisor" | "admin",
) {
  if (!published(row)) return false;
  if (isOrganizationAnnouncement(row)) return true;
  if (viewer === "student") {
    const audience = `${row.audience_type || ""} ${row.audience || ""}`.toLowerCase();
    if (audience.includes("advisor")) return false;
  }
  const ended = row.expires_at || row.expire_at;
  if (ended && new Date(ended).getTime() < Date.now()) return false;
  return true;
}

function normalize(row: RawAnnouncement): PortalAnnouncement {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    message: row.message,
    created_at: row.created_at,
    scope: isOrganizationAnnouncement(row) ? "ORGANIZATION" : "CHAPTER",
    audience: row.audience_type || row.audience || "",
    status: row.status ?? null,
    chapter_id: row.chapter_id ?? null,
  };
}

function mergeRows(rows: RawAnnouncement[]) {
  const seen = new Set<string>();
  const next: RawAnnouncement[] = [];
  for (const row of rows) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    next.push(row);
  }
  return next.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
}

export async function loadPortalAnnouncements(options: {
  chapterId?: string | null;
  viewer: "student" | "advisor" | "admin";
}) {
  const admin = createAdminClient();
  const supabase = admin || (await createClient());
  if (!supabase) {
    return { error: true as const, organization: [] as PortalAnnouncement[], chapter: [] as PortalAnnouncement[] };
  }

  const select =
    "id, title, body, message, created_at, scope, audience, audience_type, status, chapter_id, expires_at, expire_at";
  const fallbackSelect =
    "id, title, body, message, created_at, audience, audience_type, status, chapter_id, expires_at, expire_at";

  let orgRes: { data: RawAnnouncement[] | null; error: unknown } = await supabase
    .from("announcements")
    .select(select)
    .or("scope.eq.ORGANIZATION,and(chapter_id.is.null,audience.eq.ALL),and(chapter_id.is.null,audience_type.eq.all)")
    .order("created_at", { ascending: false });
  if (orgRes.error) {
    orgRes = await supabase
      .from("announcements")
      .select(fallbackSelect)
      .is("chapter_id", null)
      .order("created_at", { ascending: false });
  }

  const chapterRes = options.chapterId
    ? await supabase
        .from("announcements")
        .select(orgRes.error ? fallbackSelect : select)
        .eq("chapter_id", options.chapterId)
        .order("created_at", { ascending: false })
    : { data: [] as RawAnnouncement[], error: null };

  if (orgRes.error && chapterRes.error) {
    return { error: true as const, organization: [], chapter: [] };
  }

  const rows = mergeRows([
    ...((orgRes.data || []) as RawAnnouncement[]),
    ...((chapterRes.data || []) as RawAnnouncement[]),
  ]).filter((row) => announcementVisibleTo(row, options.viewer));

  return {
    error: false as const,
    organization: rows.filter((row) => isOrganizationAnnouncement(row)).map(normalize),
    chapter: rows.filter((row) => !isOrganizationAnnouncement(row)).map(normalize),
  };
}
