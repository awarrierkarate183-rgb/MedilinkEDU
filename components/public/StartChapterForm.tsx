"use client";

import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Alert } from "@/components/ui/States";
import { ADVISOR_TITLES, US_STATES } from "@/lib/content/states";

type Created = {
  email: string;
  password: string;
  school: string;
  chapterCode: string;
  loginUrl: string;
};

const field = "mt-1 w-full rounded-md border border-border px-3 py-2 font-normal";

export function StartChapterForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<Created | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const payload = {
      schoolName: String(form.get("schoolName") || ""),
      city: String(form.get("city") || ""),
      state: String(form.get("state") || ""),
      advisorFirstName: String(form.get("advisorFirstName") || ""),
      advisorLastName: String(form.get("advisorLastName") || ""),
      advisorEmail: String(form.get("advisorEmail") || ""),
      advisorPhone: String(form.get("advisorPhone") || ""),
      advisorTitle: String(form.get("advisorTitle") || ""),
      principalName: String(form.get("principalName") || ""),
      estimatedStudents: form.get("estimatedStudents")
        ? Number(form.get("estimatedStudents"))
        : undefined,
      statement: String(form.get("statement") || ""),
      highSchool: form.get("highSchool") ? "yes" : "",
      website: String(form.get("website") || ""),
    };

    try {
      const response = await fetch("/api/chapters/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await response.json();
      if (json.error) {
        setError(json.error.message);
        return;
      }
      setCreated(json.data);
    } catch {
      setError("The chapter request could not be sent. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (created) {
    return (
      <div className="rounded-[var(--radius)] border border-border bg-white p-6">
        <Alert title="Request received. Save your login." tone="navy">
          {created.school} is waiting for an administrator to accept it. Save
          these credentials now. You can sign in, but the advisor tools open
          only after MediLink accepts the chapter. The password is not shown
          again.
        </Alert>
        <dl className="mt-6 space-y-3 text-sm">
          <div>
            <dt className="text-muted">Username</dt>
            <dd className="font-semibold">{created.email}</dd>
          </div>
          <div>
            <dt className="text-muted">Temporary password</dt>
            <dd className="break-all font-semibold">{created.password}</dd>
          </div>
          <div>
            <dt className="text-muted">Chapter code</dt>
            <dd className="font-semibold">{created.chapterCode}</dd>
          </div>
        </dl>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/portal/login">Sign in and wait for review</ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[var(--radius)] border border-border bg-white p-6">
      <h2 className="text-2xl font-semibold">Start your chapter</h2>
      <p className="mt-2 text-sm text-muted">
        This sends a chapter request and creates a login. An administrator
        still has to accept the chapter before you can add students.
      </p>
      {error ? (
        <div className="mt-4">
          <Alert title="Chapter not created" tone="danger">
            {error}
          </Alert>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-semibold md:col-span-2">
          High school name
          <input name="schoolName" required className={field} />
        </label>
        <label className="block text-sm font-semibold">
          City
          <input name="city" required className={field} />
        </label>
        <label className="block text-sm font-semibold">
          State
          <select name="state" required defaultValue="" className={field}>
            <option value="" disabled>
              Choose a state
            </option>
            {US_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Advisor first name
          <input name="advisorFirstName" required className={field} />
        </label>
        <label className="block text-sm font-semibold">
          Advisor last name
          <input name="advisorLastName" required className={field} />
        </label>
        <label className="block text-sm font-semibold">
          Advisor email
          <input name="advisorEmail" type="email" required autoComplete="email" className={field} />
        </label>
        <label className="block text-sm font-semibold">
          Advisor phone
          <input name="advisorPhone" type="tel" className={field} />
        </label>
        <label className="block text-sm font-semibold">
          Role at the school
          <select name="advisorTitle" defaultValue="Teacher" className={field}>
            {ADVISOR_TITLES.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Principal or school contact
          <input name="principalName" className={field} />
        </label>
        <label className="block text-sm font-semibold">
          Estimated interested students
          <input name="estimatedStudents" type="number" min={1} max={500} className={field} />
        </label>
        <label className="block text-sm font-semibold md:col-span-2">
          Why this school wants a chapter
          <textarea name="statement" rows={4} className={field} />
        </label>
      </div>

      <label className="sr-only" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <label className="mt-5 flex items-start gap-3 text-sm">
        <input name="highSchool" type="checkbox" value="yes" required className="mt-1" />
        <span>This is a high school chapter. MediLink does not charter middle school or college chapters.</span>
      </label>

      <div className="mt-6">
        <Button type="submit" loading={loading} className="w-full md:w-auto">
          Submit chapter request
        </Button>
      </div>
    </form>
  );
}
