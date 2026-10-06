"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/States";

const field = "mt-1 w-full rounded-md border border-border px-3 py-2 font-normal";

export type ChapterIdea = {
  id: string;
  title: string;
  requestKind: string;
  body: string;
  why: string;
  status: string;
  feedback: string;
  createdAt: string;
  studentName: string;
};

function kindLabel(kind: string) {
  if (kind === "EVENT") return "Chapter event";
  if (kind === "ACTIVITY") return "Activity";
  return "Other";
}

function IdeaCard({ idea }: { idea: ChapterIdea }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setOk(null);
    const data = new FormData(event.currentTarget);
    setLoading(true);
    try {
      const response = await fetch("/api/ideas/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaId: idea.id,
          status: String(data.get("status") || "UNDER_REVIEW"),
          feedback: String(data.get("feedback") || ""),
        }),
      });
      const json = await response.json();
      if (json.error) {
        setError(json.error.message);
        return;
      }
      setOk("The student will see this update in Ideas Lab.");
      router.refresh();
    } catch {
      setError("The review could not be saved.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="rounded-[var(--radius)] bg-white p-5">
      <p className="kicker">{kindLabel(idea.requestKind)}</p>
      <h3 className="mt-1 font-semibold">{idea.title}</h3>
      <p className="mt-1 text-sm text-muted">
        {idea.studentName} · {new Date(idea.createdAt).toLocaleDateString()} ·{" "}
        {idea.status.replaceAll("_", " ").toLowerCase()}
      </p>
      <p className="mt-3 whitespace-pre-wrap text-sm">{idea.body}</p>
      {idea.why ? <p className="mt-2 text-sm text-muted">Why: {idea.why}</p> : null}
      {error ? (
        <div className="mt-3">
          <Alert title="Not saved" tone="danger">
            {error}
          </Alert>
        </div>
      ) : null}
      {ok ? (
        <div className="mt-3">
          <Alert title="Saved" tone="navy">
            {ok}
          </Alert>
        </div>
      ) : null}
      <form onSubmit={onSubmit} className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="text-sm font-semibold">
          Status
          <select name="status" className={field} defaultValue={idea.status === "SUBMITTED" ? "UNDER_REVIEW" : idea.status}>
            <option value="UNDER_REVIEW">Under review</option>
            <option value="APPROVED">Approved</option>
            <option value="IN_DEVELOPMENT">In development</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </label>
        <label className="text-sm font-semibold md:col-span-2">
          Note to the student
          <textarea name="feedback" rows={3} maxLength={2000} className={field} defaultValue={idea.feedback} />
        </label>
        <div>
          <Button type="submit" size="sm" loading={loading}>
            Save review
          </Button>
        </div>
      </form>
    </article>
  );
}

export function IdeaInbox({ ideas }: { ideas: ChapterIdea[] }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Chapter ideas</h2>
        <p className="mt-1 text-sm text-muted">
          Students send these from Ideas Lab. An idea is a chapter event or activity, not a competition entry.
        </p>
      </div>
      {ideas.length ? (
        ideas.map((idea) => <IdeaCard key={idea.id} idea={idea} />)
      ) : (
        <div className="rounded-[var(--radius)] bg-white p-5 text-sm text-muted">
          No chapter ideas have been sent yet.
        </div>
      )}
    </section>
  );
}
