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

export function AddStudentForm({
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
      const response = await fetch("/api/members/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: String(data.get("firstName") || ""),
          lastName: String(data.get("lastName") || ""),
          email: String(data.get("email") || ""),
          grade: String(data.get("grade") || ""),
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
      setError("The invite email could not be sent. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[var(--radius)] bg-white p-5">
      <h2 className="font-semibold">Add a student</h2>
      <p className="mt-1 text-sm text-muted">
        Enter first name, last name, email, and grade. MediLink emails them a
        link from a MediLink address. They click it, choose a password, and sign
        in through the student portal.
      </p>
      {error ? (
        <div className="mt-3">
          <Alert title={/already has a MediLink account/i.test(error) ? "Could not add student" : "Email not sent"} tone="danger">
            {error}
          </Alert>
        </div>
      ) : null}
      {invited?.sent ? (
        <div className="mt-3 rounded-md border border-gold bg-gold-soft p-4">
          <p className="font-semibold">Email sent to {invited.email}</p>
          <p className="mt-1 text-sm">
            {invited.name} should get a message from medi.link.edu@gmail.com. If
            it is not in their inbox, have them check spam. You can also open
            that MediLink Gmail and confirm it is in Sent.
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
        <label className="block text-sm font-semibold">
          Email
          <input name="email" type="email" required className={field} />
        </label>
        <label className="block text-sm font-semibold">
          Grade
          <select name="grade" required className={field} defaultValue="9">
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </select>
        </label>
      </div>
      <div className="mt-4">
        <Button type="submit" size="sm" loading={loading}>
          Send invite email
        </Button>
      </div>
    </form>
  );
}
