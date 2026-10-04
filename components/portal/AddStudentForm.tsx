"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/States";

type Invited = {
  email: string;
  name: string;
  sent: boolean;
  inviteUrl?: string;
};

const field = "mt-1 w-full rounded-md border border-border px-3 py-2 font-normal";

function mailHref(invite: Invited) {
  const subject = "Create your MediLink student account";
  const body = [
    `Hi ${invite.name},`,
    "",
    "Your chapter advisor invited you to MediLink.",
    "Open this link, choose a password, and create your student portal account:",
    "",
    invite.inviteUrl || "",
    "",
    "This login only works in the student portal.",
  ].join("\n");
  return `mailto:${invite.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function AddStudentForm({
  chapters,
}: {
  chapters?: Array<{ id: string; label: string }>;
}) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [invited, setInvited] = useState<Invited | null>(null);
  const [copied, setCopied] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setCopied(false);
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
      setError("The student invitation could not be created. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copyLink() {
    if (!invited?.inviteUrl) return;
    try {
      await navigator.clipboard.writeText(invited.inviteUrl);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[var(--radius)] bg-white p-5">
      <h2 className="font-semibold">Add a student</h2>
      <p className="mt-1 text-sm text-muted">
        Enter their first name, last name, email, and grade. Then send them the
        invite so they can choose a password and open the student portal.
      </p>
      {error ? (
        <div className="mt-3">
          <Alert title="Student not invited" tone="danger">
            {error}
          </Alert>
        </div>
      ) : null}
      {invited ? (
        <div className="mt-3 rounded-md border border-gold bg-gold-soft p-4">
          <p className="font-semibold">Invite ready for {invited.name}</p>
          <p className="mt-1 text-sm">
            {invited.sent
              ? `An email was sent to ${invited.email}. You can also send the link from your inbox.`
              : `Send this to ${invited.email}. They click the link, choose a password, and that login only works in the student portal.`}
          </p>
          {invited.inviteUrl ? (
            <>
              <p className="mt-3 break-all rounded-md bg-white px-3 py-2 font-mono text-sm">
                {invited.inviteUrl}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button type="button" size="sm" onClick={copyLink}>
                  {copied ? "Link copied" : "Copy invite link"}
                </Button>
                <a
                  href={mailHref(invited)}
                  className="inline-flex items-center justify-center rounded-md border border-navy px-3 py-2 text-sm font-semibold text-navy"
                >
                  Send from your email
                </a>
              </div>
            </>
          ) : null}
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
          Create student invite
        </Button>
      </div>
    </form>
  );
}
