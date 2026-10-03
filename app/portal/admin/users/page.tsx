import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PortalEmpty } from "@/components/portal/PortalEmpty";
import { ConnectionTrouble } from "@/components/portal/ConnectionTrouble";

export default async function AdminUsersPage() {
  await requireRole(["SUPER_ADMIN", "STATE_ADMIN"]);
  const supabase = await createClient();
  if (!supabase) return <ConnectionTrouble />;

  const { data: users, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, status, grade, chapter_id, chapters(school, chapter_code)")
    .order("created_at", { ascending: false });

  if (error) return <ConnectionTrouble />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Users</h2>
        <p className="mt-1 text-sm text-muted">
          Advisor and student accounts created from Start a Chapter and roster
          tools. Passwords are never stored here.
        </p>
      </div>
      {!users?.length ? (
        <PortalEmpty title="No users yet" body="Accounts appear after a chapter starts or an advisor adds a student." />
      ) : (
        <ul className="divide-y divide-border rounded-[var(--radius)] bg-white">
          {users.map((user) => {
            const chapter = Array.isArray(user.chapters) ? user.chapters[0] : user.chapters;
            return (
              <li key={user.id} className="px-4 py-3">
                <p className="font-semibold">{user.full_name || "Unnamed user"}</p>
                <p className="text-sm text-muted">
                  {user.email || "No email on file"} · {user.role} · {user.status}
                  {chapter?.school ? ` · ${chapter.school}` : ""}
                  {user.grade ? ` · Grade ${user.grade}` : ""}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
