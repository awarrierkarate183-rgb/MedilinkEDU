"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/States";

type Invited = {
  email: string;
  name: string;
  sent: boolean;
};

const field = "mt-1 w-full rounded-md border border-border px-3 py-2 font-normal";

export function InviteAdvisorForm({
  chapters,
}: {
  chapters?: Array<{ id: string; label: string }>;
}) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [invited, setInvited] = useState<Invited | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const response = await fetch("/api/members/invite-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: String(data.get("firstName") || ""),
          lastName: String(data.get("lastName") || ""),
          email: String(data.get("email") || ""),
          chapterId: String(data.get("chapterId") || "") || undefined,
        }),
      });
      const json = await response.json();
      if (json.error) {
        setError(json.error.message);
        return;
      }
      setInvited(json.data);
      form.reset();
    } catch {
      setError("The teacher invite email could not be sent. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[var(--radius)] bg-white p-5">
      <h2 className="font-semibold">Invite a teacher advisor</h2>
      <p className="mt-1 text-sm text-muted">
        Send your teacher an advisor account for this chapter. They get the same
        advisor portal you use, so both of you can watch the roster,
        competitions, and chapter tools.
      </p>
      {error ? (
        <div className="mt-3">
          <Alert title="Could not invite teacher" tone="danger">
            {error}
          </Alert>
        </div>
      ) : null}
      {invited?.sent ? (
        <div className="mt-3 rounded-md border border-gold bg-gold-soft p-4">
          <p className="font-semibold">Email sent to {invited.email}</p>
          <p className="mt-1 text-sm">
            {invited.name} should get a message from medi.link.edu@gmail.com. If
            it is not in their inbox, have them check spam.
          </p>
        </div>
      ) : null}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {chapters?.length ? (
          <label className="block text-sm font-semibold md:col-span-2">
            Chapter
            <select name="chapterId" required className={field} defaultValue="">
              <option value="" disabled>
                Choose a chapter
              </option>
              {chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <label className="block text-sm font-semibold">
          First name
          <input name="firstName" required className={field} />
        </label>
        <label className="block text-sm font-semibold">
          Last name
          <input name="lastName" required className={field} />
        </label>
        <label className="block text-sm font-semibold md:col-span-2">
          School email
          <input name="email" type="email" required className={field} />
        </label>
      </div>
      <div className="mt-4">
        <Button type="submit" size="sm" loading={loading}>
          Send advisor account
        </Button>
      </div>
    </form>
  );
}
