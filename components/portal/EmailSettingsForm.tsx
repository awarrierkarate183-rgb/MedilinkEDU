"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/States";
import { CONTACT_EMAIL } from "@/lib/constants";

const field = "mt-1 w-full rounded-md border border-border px-3 py-2 font-normal";

export function EmailSettingsForm({
  connected,
  user,
}: {
  connected?: boolean;
  user?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaved(false);
    setLoading(true);
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/email-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: String(data.get("user") || ""),
          pass: String(data.get("pass") || ""),
          from: String(data.get("from") || ""),
        }),
      });
      const json = await response.json();
      if (json.error) {
        setError(json.error.message);
        return;
      }
      setSaved(true);
      router.refresh();
    } catch {
      setError("Email sending could not be connected. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[var(--radius)] bg-white p-5">
      <h2 className="font-semibold">Send student emails</h2>
      <p className="mt-1 text-sm text-muted">
        Connect the MediLink Gmail so invites go to each student inbox. Create a
        Google App password for this account, then paste it here once.
      </p>
      {connected ? (
        <div className="mt-3">
          <Alert title="Email is connected" tone="navy">
            Student invites will send from {user || CONTACT_EMAIL}.
          </Alert>
        </div>
      ) : null}
      {error ? (
        <div className="mt-3">
          <Alert title="Email not connected" tone="danger">
            {error}
          </Alert>
        </div>
      ) : null}
      {saved ? (
        <div className="mt-3">
          <Alert title="Email connected" tone="navy">
            New student invites will go to the student inbox.
          </Alert>
        </div>
      ) : null}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-semibold">
          Gmail address
          <input
            name="user"
            type="email"
            required
            defaultValue={user || CONTACT_EMAIL}
            className={field}
          />
        </label>
        <label className="block text-sm font-semibold">
          App password
          <input name="pass" type="password" required autoComplete="new-password" className={field} />
        </label>
        <label className="block text-sm font-semibold md:col-span-2">
          From name
          <input
            name="from"
            defaultValue={`MediLink <${user || CONTACT_EMAIL}>`}
            className={field}
          />
        </label>
      </div>
      <div className="mt-4">
        <Button type="submit" size="sm" loading={loading}>
          {connected ? "Update email sending" : "Connect email sending"}
        </Button>
      </div>
    </form>
  );
}
