import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { AddStudentForm } from "@/components/portal/AddStudentForm";
import { RevokeButton } from "@/components/portal/InviteMemberForm";
import { ApproveMemberButton } from "@/components/portal/ApproveMemberButton";
import { PortalEmpty } from "@/components/portal/PortalEmpty";
import { ConnectionTrouble } from "@/components/portal/ConnectionTrouble";

export default async function MembersPage() {
  const { profile } = await requireRole(["CHAPTER_ADVISOR", "STATE_ADMIN", "SUPER_ADMIN"]);
  const supabase = await createClient();
  const chapterId = profile?.chapter_id || null;
  const canPickChapter = profile?.role === "SUPER_ADMIN" || profile?.role === "STATE_ADMIN";

  const chapters = supabase && canPickChapter
    ? await supabase.from("chapters").select("id, name, school, status").order("name")
    : { data: [] as Array<{ id: string; name: string; school: string | null; status: string }>, error: null };

  const { data: members, error: memberError } = supabase && chapterId
    ? await supabase
        .from("chapter_members")
        .select("id, status, profiles(full_name, email, grade, role)")
        .eq("chapter_id", chapterId)
    : { data: [], error: null };
  const { data: invites, error: inviteError } = supabase
    ? chapterId
      ? await supabase
          .from("invitations")
          .select("id, email, first_name, last_name, grade, expires_at, revoked_at, used_at, use_count")
          .eq("chapter_id", chapterId)
          .is("revoked_at", null)
          .is("used_at", null)
      : canPickChapter
        ? await supabase
            .from("invitations")
            .select("id, email, first_name, last_name, grade, expires_at, revoked_at, used_at, use_count")
            .is("revoked_at", null)
            .is("used_at", null)
        : { data: [], error: null }
    : { data: [], error: null };

  if (memberError || inviteError || chapters.error) return <ConnectionTrouble />;

  return (
    <div className="space-y-8">
      {!chapterId && canPickChapter ? (
        <p className="rounded-[var(--radius)] bg-white px-4 py-3 text-sm text-muted">
          This admin account is not tied to one chapter. Choose a chapter when you add a student.
        </p>
      ) : null}
      <AddStudentForm
        chapters={
          !chapterId && canPickChapter
            ? (chapters.data || []).map((chapter) => ({
                id: chapter.id,
                label: chapter.school || chapter.name,
              }))
            : undefined
        }
      />
      <section>
        <h2 className="mb-3 text-lg font-semibold">Roster</h2>
        {!members?.length ? (
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
                      {person?.email || ""} {member.status}
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
        {!invites?.length ? (
          <p className="text-sm text-muted">No open invitations.</p>
        ) : (
          <ul className="space-y-2">
            {invites.map((invite) => {
              const name = [invite.first_name, invite.last_name].filter(Boolean).join(" ");
              return (
                <li key={invite.id} className="flex items-center justify-between rounded-md bg-white px-4 py-3">
                  <span className="text-sm">
                    <strong>{name || "Student"}</strong>
                    <span className="ml-2 text-muted">
                      {invite.email}
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
