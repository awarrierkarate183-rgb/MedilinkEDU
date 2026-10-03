import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PortalEmpty } from "@/components/portal/PortalEmpty";
import { ConnectionTrouble } from "@/components/portal/ConnectionTrouble";
import { ReviewChapterButtons } from "@/components/portal/ReviewChapterButtons";

export default async function AdminChaptersPage() {
  await requireRole(["SUPER_ADMIN", "STATE_ADMIN"]);
  const supabase = await createClient();
  if (!supabase) return <ConnectionTrouble />;

  const { data: chapters, error } = await supabase
    .from("chapters")
    .select(
      "id, name, school, city, state, status, chapter_code, join_code, created_at, chapter_applications(advisor_first_name, advisor_last_name, advisor_email, advisor_phone, advisor_title, principal_name, estimated_students, statement, created_at, review_status, last_sign_in_attempt_at)",
    )
    .order("created_at", { ascending: false });

  if (error) return <ConnectionTrouble />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Chapters</h2>
        <p className="mt-1 text-sm text-muted">
          New Start a Chapter forms land here as requests. Accept one to open
          the advisor portal and student roster tools for that school.
        </p>
      </div>
      {!chapters?.length ? (
        <PortalEmpty
          title="No chapters yet"
          body="When a school uses Start a Chapter, the record and advisor account land here."
        />
      ) : (
        <ul className="space-y-4">
          {chapters.map((chapter) => {
            const applications = Array.isArray(chapter.chapter_applications)
              ? chapter.chapter_applications
              : chapter.chapter_applications
                ? [chapter.chapter_applications]
                : [];
            const application = applications[0];
            return (
              <li key={chapter.id} className="rounded-[var(--radius)] bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="kicker">{chapter.chapter_code}</p>
                    <h3 className="text-lg font-semibold">{chapter.school}</h3>
                    <p className="text-sm text-muted">
                      {[chapter.city, chapter.state].filter(Boolean).join(", ")} · {chapter.status}
                      {application?.review_status ? ` · ${application.review_status}` : ""}
                    </p>
                    {application?.last_sign_in_attempt_at ? (
                      <p className="mt-1 text-sm font-semibold text-navy">
                        Signed in while waiting {new Date(application.last_sign_in_attempt_at).toLocaleString()}
                      </p>
                    ) : null}
                  </div>
                  <p className="text-sm text-muted">Join {chapter.join_code}</p>
                </div>
                {application ? (
                  <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                    <div>
                      <dt className="text-muted">Advisor</dt>
                      <dd>
                        {application.advisor_first_name} {application.advisor_last_name}
                        {application.advisor_title ? ` · ${application.advisor_title}` : ""}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted">Advisor email</dt>
                      <dd>{application.advisor_email}</dd>
                    </div>
                    <div>
                      <dt className="text-muted">Phone</dt>
                      <dd>{application.advisor_phone || "Not provided"}</dd>
                    </div>
                    <div>
                      <dt className="text-muted">School contact</dt>
                      <dd>{application.principal_name || "Not provided"}</dd>
                    </div>
                    <div>
                      <dt className="text-muted">Estimated students</dt>
                      <dd>{application.estimated_students ?? "Not provided"}</dd>
                    </div>
                    {application.statement ? (
                      <div className="md:col-span-2">
                        <dt className="text-muted">Statement</dt>
                        <dd>{application.statement}</dd>
                      </div>
                    ) : null}
                  </dl>
                ) : null}
                {application?.review_status === "PENDING" ? (
                  <ReviewChapterButtons chapterId={chapter.id} />
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
