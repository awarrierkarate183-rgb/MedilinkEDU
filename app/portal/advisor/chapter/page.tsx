import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { chapterJoinQrDataUrl } from "@/lib/qr";
import { PortalEmpty } from "@/components/portal/PortalEmpty";
import { siteUrl } from "@/lib/utils";

export default async function ChapterPage() {
  const { profile } = await requireRole(["CHAPTER_ADVISOR", "STATE_ADMIN", "SUPER_ADMIN"]);
  const supabase = await createClient();
  const { data: chapter } = supabase
    ? await supabase
        .from("chapters")
        .select("name, school, chapter_code, join_code, status, city, state, country")
        .eq("id", profile?.chapter_id)
        .maybeSingle()
    : { data: null };

  if (!chapter) {
    return (
      <PortalEmpty
        title="No chapter assigned"
        body="An administrator needs to attach this advisor to a chapter before QR codes and public join links can be issued."
      />
    );
  }

  const qr = await chapterJoinQrDataUrl(chapter.join_code);
  const joinUrl = `${siteUrl()}/join/${chapter.join_code}`;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <article className="rounded-[var(--radius)] bg-white p-6">
        <p className="kicker">Chapter</p>
        <h2 className="text-2xl font-semibold">{chapter.name}</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div>
            <dt className="text-muted">School</dt>
            <dd>{chapter.school}</dd>
          </div>
          <div>
            <dt className="text-muted">Status</dt>
            <dd>{chapter.status}</dd>
          </div>
          <div>
            <dt className="text-muted">Public join code</dt>
            <dd>{chapter.join_code}</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm text-muted">
          The QR contains only the public join URL. It does not contain passwords
          or invitation secrets.
        </p>
      </article>
      <article className="rounded-[var(--radius)] bg-white p-6 text-center">
        <p className="kicker">Join our MediLink chapter</p>
        <p className="font-semibold">{chapter.school}</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qr} alt={`QR code linking to ${joinUrl}`} className="mx-auto mt-4 h-56 w-56" />
        <a className="mt-4 inline-block text-sm font-semibold" href={qr} download={`${chapter.join_code}-join.png`}>
          Download / print
        </a>
      </article>
    </div>
  );
}
