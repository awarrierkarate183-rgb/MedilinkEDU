"use client";

import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Alert } from "@/components/ui/States";
import { ADVISOR_TITLES, US_STATES } from "@/lib/content/states";

type Created = {
  email: string;
  school: string;
  chapterCode: string;
};

const field =
  "mt-1 w-full rounded-md border border-border bg-cream-card px-3 py-3 font-normal text-navy";

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
      password: String(form.get("password") || ""),
      confirmPassword: String(form.get("confirmPassword") || ""),
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
      <div className="flex min-h-[calc(100vh-var(--header-h))] items-center justify-center px-4 py-16">
        <div className="w-full max-w-xl rounded-[var(--radius)] bg-cream-card p-8 text-navy">
          <Alert title="Request received" tone="navy">
            {created.school} is waiting for an administrator to accept it. Sign
            in with the email you chose. The advisor tools open only after
            MediLink accepts the chapter.
          </Alert>
          <dl className="mt-6 space-y-3 text-sm">
            <div>
              <dt className="text-muted">Username</dt>
              <dd className="font-semibold">{created.email}</dd>
            </div>
            <div>
              <dt className="text-muted">Password</dt>
              <dd>The password you entered on this form.</dd>
            </div>
            <div>
              <dt className="text-muted">Chapter code</dt>
              <dd className="font-semibold">{created.chapterCode}</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm text-muted">
            After MediLink accepts the chapter, the school name appears on the
            chapter map with a pin for the state you entered.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/portal/login">Sign in and wait for review</ButtonLink>
            <ButtonLink href="/chapters" variant="outline">
              Open the chapter map
            </ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="min-h-[calc(100vh-var(--header-h))] bg-navy text-white">
      <div className="mx-auto grid min-h-[calc(100vh-var(--header-h))] w-full max-w-6xl gap-10 px-4 py-[calc(var(--header-h)+2rem)] lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <aside className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
          <p className="kicker">Chapter request</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Apply for a MediLink chapter
          </h1>
          <p className="mt-4 max-w-md text-white/75">
            Fill every section on this page. Your email is the portal username.
            Choose a password you will remember. An administrator still has to
            accept the chapter before you can add students.
          </p>
          <ol className="mt-8 space-y-3 text-sm text-white/80">
            <li>1. School</li>
            <li>2. Advisor</li>
            <li>3. Portal password</li>
            <li>4. Why this chapter</li>
          </ol>
          <p className="mt-8 text-sm">
            <a href="/start-a-chapter" className="font-semibold text-gold">
              Back to Start a Chapter
            </a>
          </p>
        </aside>

        <div className="space-y-6 pb-16">
          {error ? (
            <Alert title="Chapter not created" tone="danger">
              {error}
            </Alert>
          ) : null}

          <section className="rounded-[var(--radius)] bg-cream-card p-6 text-navy md:p-8">
            <p className="kicker">School</p>
            <h2 className="mt-2 text-2xl font-semibold">Where will this chapter meet?</h2>
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
                Estimated interested students
                <input name="estimatedStudents" type="number" min={1} max={500} className={field} />
              </label>
              <label className="block text-sm font-semibold">
                Principal or school contact
                <input name="principalName" className={field} />
              </label>
            </div>
          </section>

          <section className="rounded-[var(--radius)] bg-cream-card p-6 text-navy md:p-8">
            <p className="kicker">Advisor</p>
            <h2 className="mt-2 text-2xl font-semibold">Who will run the chapter?</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-semibold">
                First name
                <input name="advisorFirstName" required className={field} />
              </label>
              <label className="block text-sm font-semibold">
                Last name
                <input name="advisorLastName" required className={field} />
              </label>
              <label className="block text-sm font-semibold">
                Email
                <input name="advisorEmail" type="email" required autoComplete="email" className={field} />
              </label>
              <label className="block text-sm font-semibold">
                Phone
                <input name="advisorPhone" type="tel" className={field} />
              </label>
              <label className="block text-sm font-semibold md:col-span-2">
                Role at the school
                <select name="advisorTitle" defaultValue="Teacher" className={field}>
                  {ADVISOR_TITLES.map((title) => (
                    <option key={title} value={title}>
                      {title}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="rounded-[var(--radius)] bg-cream-card p-6 text-navy md:p-8">
            <p className="kicker">Portal password</p>
            <h2 className="mt-2 text-2xl font-semibold">Choose your login password</h2>
            <p className="mt-2 text-sm text-muted">
              Use at least 8 characters. This is the password you will type on
              the portal login page with your email.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-semibold">
                Password
                <input
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className={field}
                />
              </label>
              <label className="block text-sm font-semibold">
                Confirm password
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className={field}
                />
              </label>
            </div>
          </section>

          <section className="rounded-[var(--radius)] bg-cream-card p-6 text-navy md:p-8">
            <p className="kicker">Chapter</p>
            <h2 className="mt-2 text-2xl font-semibold">Why this school wants MediLink</h2>
            <label className="mt-6 block text-sm font-semibold">
              Short statement
              <textarea name="statement" rows={5} className={field} />
            </label>
            <label className="sr-only" aria-hidden="true">
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
            <label className="mt-5 flex items-start gap-3 text-sm">
              <input name="highSchool" type="checkbox" value="yes" required className="mt-1" />
              <span>
                This is a high school chapter. MediLink does not charter middle
                school or college chapters.
              </span>
            </label>
            <div className="mt-8">
              <Button type="submit" loading={loading} className="w-full md:w-auto">
                Submit chapter request
              </Button>
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}
