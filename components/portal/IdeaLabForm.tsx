"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/States";

const field = "mt-1 w-full rounded-md border border-border px-3 py-2 font-normal";

const kinds = [
  { value: "EVENT", label: "Chapter event" },
  { value: "ACTIVITY", label: "Activity or meeting" },
  { value: "OTHER", label: "Something else the chapter can do" },
] as const;

export function IdeaLabForm() {
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
      const response = await fetch("/api/ideas/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: String(data.get("title") || ""),
          requestKind: String(data.get("requestKind") || "ACTIVITY"),
          body: String(data.get("body") || ""),
          why: String(data.get("why") || ""),
        }),
      });
      const json = await response.json();
      if (json.error) {
        setError(json.error.message);
        return;
      }
      setOk("Your idea went to your chapter advisor. They will see it on Submissions.");
      event.currentTarget.reset();
      router.refresh();
    } catch {
      setError("The idea could not be sent. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[var(--radius)] bg-white p-5">
      <h2 className="font-semibold">Submit an idea</h2>
      <p className="mt-1 text-sm text-muted">
        Suggest an event or something the chapter can do. Your advisor reads every submission.
      </p>
      {error ? (
        <div className="mt-4">
          <Alert title="Not sent" tone="danger">
            {error}
          </Alert>
        </div>
      ) : null}
      {ok ? (
        <div className="mt-4">
          <Alert title="Sent to your advisor" tone="navy">
            {ok}
          </Alert>
        </div>
      ) : null}
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="text-sm font-semibold">
          Title
          <input name="title" required maxLength={160} className={field} />
        </label>
        <label className="text-sm font-semibold">
          What kind of idea
          <select name="requestKind" className={field} defaultValue="ACTIVITY">
            {kinds.map((kind) => (
              <option key={kind.value} value={kind.value}>
                {kind.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold md:col-span-2">
          What do you want the chapter to do
          <textarea name="body" required rows={5} maxLength={4000} className={field} />
        </label>
        <label className="text-sm font-semibold md:col-span-2">
          Why it would help (optional)
          <textarea name="why" rows={3} maxLength={2000} className={field} />
        </label>
      </div>
      <div className="mt-4">
        <Button type="submit" size="sm" loading={loading}>
          Send to my advisor
        </Button>
      </div>
    </form>
  );
}
