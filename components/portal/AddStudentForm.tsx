"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/States";

type Created = {
  email: string;
  password: string;
  name: string;
};

const field = "mt-1 w-full rounded-md border border-border px-3 py-2 font-normal";

export function AddStudentForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<Created | null>(null);

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
          grade: String(data.get("grade") || "") || undefined,
        }),
      });
      const json = await response.json();
      if (json.error) {
        setError(json.error.message);
        return;
      }
      setCreated(json.data);
      form.reset();
    } catch {
      setError("The student account could not be created. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[var(--radius)] bg-white p-5">
      <h2 className="font-semibold">Add a student</h2>
      <p className="mt-1 text-sm text-muted">
        This creates a student portal account on your roster. Give them the
        username and password once. MediLink does not show the password again.
      </p>
      {error ? (
        <div className="mt-3">
          <Alert title="Student not added" tone="danger">
            {error}
          </Alert>
        </div>
      ) : null}
      {created ? (
        <div className="mt-3">
          <Alert title={`Account ready for ${created.name}`}>
            Username {created.email}. Temporary password {created.password}.
          </Alert>
        </div>
      ) : null}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
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
          <select name="grade" className={field} defaultValue="9">
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </select>
        </label>
      </div>
      <div className="mt-4">
        <Button type="submit" size="sm" loading={loading}>
          Create student account
        </Button>
      </div>
    </form>
  );
}
