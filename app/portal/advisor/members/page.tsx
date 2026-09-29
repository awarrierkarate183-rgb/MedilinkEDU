import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { InviteMemberForm, RevokeButton } from "@/components/portal/InviteMemberForm";
import { PortalEmpty } from "@/components/portal/PortalEmpty";

export default async function MembersPage() {
  const { profile } = await requireRole(["CHAPTER_ADVISOR", "STATE_ADMIN", "SUPER_ADMIN"]);
  const supabase = await createClient();
  const { data: members } = supabase
    ? await supabase
        .from("chapter_members")
        .select("id, status, profiles(full_name, grade, role)")
        .eq("chapter_id", profile?.chapter_id)
    : { data: [] };
  const { data: invites } = supabase
    ? await supabase
        .from("invitations")
        .select("id, email, expires_at, revoked_at, used_at, use_count")
        .eq("chapter_id", profile?.chapter_id)
        .is("revoked_at", null)
        .is("used_at", null)
    : { data: [] };

  return (
    <div className="space-y-8">
      <InviteMemberForm />
      <section>
        <h2 className="mb-3 text-lg font-semibold">Roster</h2>
        {!members?.length ? (
          <PortalEmpty
            title="No members yet"
            body="Invite students. Passwords are never shown here. Inactive members keep historical competition records."
          />
        ) : (
          <ul className="divide-y divide-border rounded-[var(--radius)] bg-white">
            {members.map((member) => {
              const person = Array.isArray(member.profiles) ? member.profiles[0] : member.profiles;
              return (
                <li key={member.id} className="flex items-center justify-between px-4 py-3">
                  <span>
                    <strong>{person?.full_name || "Unnamed member"}</strong>
                    <span className="ml-2 text-sm text-muted">{member.status}</span>
                  </span>
                  <span className="text-sm text-muted">{person?.grade || ""}</span>
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
            {invites.map((invite) => (
              <li key={invite.id} className="flex items-center justify-between rounded-md bg-white px-4 py-3">
                <span className="text-sm">
                  {invite.email || "Unaddressed code"} expires {new Date(invite.expires_at).toLocaleDateString()}
                </span>
                <RevokeButton id={invite.id} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
