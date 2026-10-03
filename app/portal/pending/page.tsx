import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/lib/auth/actions";
import { Button } from "@/components/ui/Button";

export default async function PendingChapterPage() {
  const { profile } = await requireRole(["CHAPTER_ADVISOR"], { allowPending: true });
  const supabase = await createClient();
  const { data: application } = supabase
    ? await supabase
        .from("chapter_applications")
        .select("school_name, city, state, review_status, created_at")
        .eq("advisor_profile_id", profile?.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()
    : { data: null };

  const denied = application?.review_status === "DENIED";

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-lg rounded-[var(--radius)] border border-border bg-white p-8">
        <p className="kicker">Chapter request</p>
        <h1 className="mt-2 text-2xl font-semibold">
          {denied ? "This request was not accepted" : "Waiting for administrator review"}
        </h1>
        <p className="mt-3 text-sm text-muted">
          {denied
            ? `${application?.school_name || "Your school"} was reviewed and not accepted. Contact MediLink if this is a mistake.`
            : `Your login works. ${application?.school_name || "Your chapter"} still needs an administrator to accept the request before the advisor portal opens.`}
        </p>
        {application && !denied ? (
          <p className="mt-4 text-sm">
            Requested {new Date(application.created_at).toLocaleDateString()}
            {application.city ? ` · ${application.city}, ${application.state}` : ""}
          </p>
        ) : null}
        <form action={signOutAction} className="mt-6">
          <Button type="submit" variant="outline">
            Sign out
          </Button>
        </form>
      </div>
    </div>
  );
}
