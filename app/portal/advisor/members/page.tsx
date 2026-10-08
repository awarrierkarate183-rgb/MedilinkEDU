import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { AddStudentForm } from "@/components/portal/AddStudentForm";
import { InviteAdvisorForm } from "@/components/portal/InviteAdvisorForm";
import { RevokeButton } from "@/components/portal/InviteMemberForm";
import { ApproveMemberButton } from "@/components/portal/ApproveMemberButton";
import { PortalEmpty } from "@/components/portal/PortalEmpty";

function chapterIdOf(value: string | null | undefined) {
  return value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
    ? value
    : null;
}

export default async function MembersPage() {
  const { profile } = await requireRole(["CHAPTER_ADVISOR", "STATE_ADMIN", "SUPER_ADMIN"]);
  const supabase = await createClient();
  const db = createAdminClient() ?? supabase;
  const chapterId = chapterIdOf(profile?.chapter_id);
  const canPickChapter = profile?.role === "SUPER_ADMIN" || profile?.role === "STATE_ADMIN";

  const chapters =
    db && canPickChapter
      ? ((await db.from("chapters").select("id, name, school, status").order("name")).data ?? [])
      : [];

  const members =
    db && chapterId
      ? ((
          await db
            .from("chapter_members")
            .select("id, status, profiles(full_name, email, grade, role)")
            .eq("chapter_id", chapterId)
        ).data ?? [])
      : [];

  let invites: Array<{
    id: string;
    email: string | null;
    first_name?: string | null;
    last_name?: string | null;
    grade?: string | null;
    intended_role?: string | null;
    expires_at: string;
  }> = [];
  if (db && (chapterId || canPickChapter)) {
    const detailed = db
      .from("invitations")
      .select("id, email, first_name, last_name, grade, intended_role, expires_at, revoked_at, used_at, use_count")
      .is("revoked_at", null)
      .is("used_at", null);
    const first = chapterId ? await detailed.eq("chapter_id", chapterId) : await detailed;
    if (!first.error && first.data) {
      invites = first.data;
    } else {
      const basic = db
        .from("invitations")
        .select("id, email, expires_at, revoked_at, used_at, use_count")
        .is("revoked_at", null)
        .is("used_at", null);
      const second = chapterId ? await basic.eq("chapter_id", chapterId) : await basic;
      invites = second.data ?? [];
    }
  }

  return (
    <div className="space-y-8">
      {!chapterId && canPickChapter ? (
        <p className="rounded-[var(--radius)] bg-white px-4 py-3 text-sm text-muted">
          This admin account is not tied to one chapter. Choose a chapter when you add a student.
        </p>
      ) : null}
      <InviteAdvisorForm
        chapters={
          !chapterId && canPickChapter
            ? chapters.map((chapter) => ({
                id: chapter.id,
                label: chapter.school || chapter.name,
              }))
            : undefined
        }
      />
      <AddStudentForm
        chapters={
          !chapterId && canPickChapter
            ? chapters.map((chapter) => ({
                id: chapter.id,
                label: chapter.school || chapter.name,
              }))
            : undefined
        }
      />
      <section>
        <h2 className="mb-3 text-lg font-semibold">Roster</h2>
        {!members.length ? (
          <PortalEmpty
            title="No members yet"
            body={
              chapterId
                ? "Add a student above. They create their own student portal account from the email."
                : "Choose a chapter when you add a student. Their roster stays with that chapter."
            }
          />
        ) : (
          <ul className="divide-y divide-border rounded-[var(--radius)] bg-white">
            {members.map((member) => {
              const person = Array.isArray(member.profiles) ? member.profiles[0] : member.profiles;
              return (
                <li key={member.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <span>
                    <strong>{person?.full_name || "Unnamed member"}</strong>
                    <span className="ml-2 text-sm text-muted">
                      {person?.role === "CHAPTER_ADVISOR" ? "Advisor" : "Student"} · {person?.email || ""}{" "}
                      {member.status}
                    </span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="text-sm text-muted">{person?.grade || ""}</span>
                    {member.status === "PENDING" ? <ApproveMemberButton membershipId={member.id} /> : null}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
      <section>
        <h2 className="mb-3 text-lg font-semibold">Open invitations</h2>
        {!invites.length ? (
          <p className="text-sm text-muted">No open invitations.</p>
        ) : (
          <ul className="space-y-2">
            {invites.map((invite) => {
              const name = [invite.first_name, invite.last_name].filter(Boolean).join(" ");
              return (
                <li key={invite.id} className="flex items-center justify-between rounded-md bg-white px-4 py-3">
                  <span className="text-sm">
                    <strong>{name || (invite.intended_role === "CHAPTER_ADVISOR" ? "Teacher advisor" : "Student")}</strong>
                    <span className="ml-2 text-muted">
                      {invite.intended_role === "CHAPTER_ADVISOR" ? "Advisor invite" : "Student invite"} · {invite.email}
                      {invite.grade ? ` · Grade ${invite.grade}` : ""}
                      {` · expires ${new Date(invite.expires_at).toLocaleDateString()}`}
                    </span>
                  </span>
                  <RevokeButton id={invite.id} />
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
