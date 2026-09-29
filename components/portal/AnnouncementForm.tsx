"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/States";

export function AnnouncementForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setOk(false);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/announcements/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: String(form.get("title") || ""),
          body: String(form.get("body") || ""),
          audienceType: String(form.get("audienceType") || "chapter"),
          priority: "normal",
          status: "published",
        }),
      });
      const json = await response.json();
      if (json.error) {
        setError(json.error.message);
        return;
      }
      setOk(true);
      event.currentTarget.reset();
      router.refresh();
    } catch {
      setError("MediLink is having trouble connecting to your account data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[var(--radius)] bg-white p-5">
      <h2 className="font-semibold">Publish an announcement</h2>
      {error ? (
        <div className="mt-3">
          <Alert title="Announcement not saved" tone="danger">
            {error}
          </Alert>
        </div>
      ) : null}
      {ok ? (
        <div className="mt-3">
          <Alert title="Published">Your chapter can see this announcement.</Alert>
        </div>
      ) : null}
      <label className="mt-4 block text-sm font-semibold">
        Title
        <input name="title" required maxLength={160} className="mt-1 w-full rounded-md border border-border px-3 py-2 font-normal" />
      </label>
      <label className="mt-3 block text-sm font-semibold">
        Audience
        <select name="audienceType" className="mt-1 w-full rounded-md border border-border px-3 py-2 font-normal">
          <option value="chapter">This chapter</option>
          <option value="students">Students</option>
          <option value="advisors">Advisors</option>
          <option value="all">All members</option>
        </select>
      </label>
      <label className="mt-3 block text-sm font-semibold">
        Message
        <textarea name="body" required rows={4} className="mt-1 w-full rounded-md border border-border px-3 py-2 font-normal" />
      </label>
      <div className="mt-4">
        <Button type="submit" size="sm" loading={loading}>
          Publish
        </Button>
      </div>
    </form>
  );
}
