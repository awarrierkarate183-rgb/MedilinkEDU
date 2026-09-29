import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PortalEmpty } from "@/components/portal/PortalEmpty";
import { IDEA_CATEGORIES } from "@/lib/constants";
import { createIdeaAction } from "@/lib/ideas/actions";
import { Button } from "@/components/ui/Button";

export default async function IdeasPage() {
  const { profile } = await requireRole(["STUDENT", "CHAPTER_OFFICER", "CHAPTER_ADVISOR", "SUPER_ADMIN"]);
  const supabase = await createClient();
  const { data: ideas } = supabase
    ? await supabase.from("ideas").select("id, title, status, category").eq("owner_id", profile?.id)
    : { data: [] };

  return (
    <div className="space-y-8">
      <form
        action={async (formData) => {
          "use server";
          await createIdeaAction(formData);
          return;
        }}
        className="rounded-[var(--radius)] bg-white p-5"
      >
        <h2 className="font-semibold">New idea</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="text-sm font-semibold">
            Title
            <input name="title" required className="mt-1 w-full rounded-md border border-border px-3 py-2 font-normal" />
          </label>
          <label className="text-sm font-semibold">
            Category
            <select name="category" className="mt-1 w-full rounded-md border border-border px-3 py-2 font-normal">
              {IDEA_CATEGORIES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold md:col-span-2">
            Problem
            <textarea name="problem" className="mt-1 w-full rounded-md border border-border px-3 py-2 font-normal" />
          </label>
          <label className="text-sm font-semibold">
            Who is affected
            <textarea name="who" className="mt-1 w-full rounded-md border border-border px-3 py-2 font-normal" />
          </label>
          <label className="text-sm font-semibold">
            Proposed solution
            <textarea name="solution" className="mt-1 w-full rounded-md border border-border px-3 py-2 font-normal" />
          </label>
          <label className="text-sm font-semibold">
            Why it matters
            <textarea name="why" className="mt-1 w-full rounded-md border border-border px-3 py-2 font-normal" />
          </label>
          <label className="text-sm font-semibold">
            Healthcare component
            <textarea name="healthcare" className="mt-1 w-full rounded-md border border-border px-3 py-2 font-normal" />
          </label>
          <label className="text-sm font-semibold">
            Financial component
            <textarea name="financial" className="mt-1 w-full rounded-md border border-border px-3 py-2 font-normal" />
          </label>
          <label className="text-sm font-semibold">
            Technology component
            <textarea name="technology" className="mt-1 w-full rounded-md border border-border px-3 py-2 font-normal" />
          </label>
        </div>
        <div className="mt-4">
          <Button type="submit" size="sm">
            Save draft
          </Button>
        </div>
      </form>
      {!ideas?.length ? (
        <PortalEmpty
          title="Your Ideas Lab is empty"
          body="Start with a problem you've noticed in healthcare."
        />
      ) : (
        <ul className="space-y-2">
          {ideas.map((idea) => (
            <li key={idea.id} className="rounded-[var(--radius)] bg-white px-4 py-3">
              <strong>{idea.title}</strong>
              <span className="ml-2 text-sm text-muted">
                {idea.status} · {idea.category}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
