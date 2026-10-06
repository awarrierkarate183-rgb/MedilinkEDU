"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/States";
import { normalEventHandbook } from "@/lib/content/normal-event-handbook";
import { legacyEventHandbook } from "@/lib/content/legacy-event-handbook";

const field = "mt-1 w-full rounded-md border border-border px-3 py-2 font-normal";

export function AdminGuideDesk() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState<string | null>(null);

  async function publishHandbook() {
    setError(null);
    setOk(null);
    setLoading(true);
    try {
      const response = await fetch("/api/admin/guides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publishHandbook: true }),
      });
      const json = await response.json();
      if (json.error) {
        setError(json.error.message);
        return;
      }
      setOk("The handbook is live. Assigned students now see instructions and rubrics.");
      router.refresh();
    } catch {
      setError("The handbook could not be published. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function askDesk(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setOk(null);
    setLoading(true);
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/desk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: String(data.get("message") || "") }),
      });
      const json = await response.json();
      if (json.error) {
        setError(json.error.message);
        return;
      }
      setReply(json.data?.reply || "Done.");
      router.refresh();
    } catch {
      setError("The desk could not run that request.");
    } finally {
      setLoading(false);
    }
  }

  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setOk(null);
    setLoading(true);
    try {
      const response = await fetch("/api/admin/guides/upload", {
        method: "POST",
        body: new FormData(event.currentTarget),
      });
      const json = await response.json();
      if (json.error) {
        setError(json.error.message);
        return;
      }
      setOk("That document is attached. Students in that event will see the download.");
      router.refresh();
    } catch {
      setError("The file could not be uploaded.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {error ? <Alert title="Not saved" tone="danger">{error}</Alert> : null}
      {ok ? <Alert title="Saved" tone="navy">{ok}</Alert> : null}
      <section className="rounded-[var(--radius)] bg-white p-5">
        <h2 className="font-semibold">Fix or publish from here</h2>
        <p className="mt-2 text-sm text-muted">
          If a student is missing a rubric, publish the handbook. If you have a
          new PDF or packet, upload it to the event. The AI desk can do the
          same remotely when you type what is wrong.
        </p>
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" loading={loading} onClick={publishHandbook}>
              Publish Normal Events handbook
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              loading={loading}
              onClick={async () => {
                setError(null);
                setOk(null);
                setLoading(true);
                try {
                  const response = await fetch("/api/admin/guides", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ publishLegacyHandbook: true }),
                  });
                  const json = await response.json();
                  if (json.error) {
                    setError(json.error.message);
                    return;
                  }
                  setOk("The Legacy Championship handbook is live on assigned student pages.");
                  router.refresh();
                } catch {
                  setError("The Legacy handbook could not be published. Try again.");
                } finally {
                  setLoading(false);
                }
              }}
            >
              Publish Legacy handbook
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-[var(--radius)] bg-white p-5">
        <h2 className="font-semibold">Administration desk</h2>
        <p className="mt-1 text-sm text-muted">
          Examples: publish the handbook. List schools. Which events are missing
          rubrics. Attach the new Chart Room packet.
        </p>
        <form onSubmit={askDesk} className="mt-4 space-y-3">
          <label className="block text-sm font-semibold">
            What needs fixing
            <textarea name="message" required rows={4} className={field} />
          </label>
          <Button type="submit" size="sm" loading={loading}>
            Run from the desk
          </Button>
        </form>
        {reply ? <p className="mt-3 whitespace-pre-wrap text-sm">{reply}</p> : null}
      </section>

      <section className="rounded-[var(--radius)] bg-white p-5">
        <h2 className="font-semibold">Upload an event document</h2>
        <form onSubmit={upload} className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="block text-sm font-semibold">
            Event
            <select name="eventId" required className={field} defaultValue="">
              <option value="" disabled>
                Choose the event
              </option>
              <optgroup label="Normal Events">
                {normalEventHandbook.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.number}. {event.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Legacy Events">
                {legacyEventHandbook.map((event) => (
                  <option key={event.id} value={event.id}>
                    L{event.number}. {event.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </label>
          <label className="block text-sm font-semibold">
            Kind
            <select name="kind" className={field} defaultValue="INSTRUCTIONS">
              <option value="INSTRUCTIONS">Instructions</option>
              <option value="RUBRIC">Rubric</option>
            </select>
          </label>
          <label className="block text-sm font-semibold md:col-span-2">
            File
            <input name="file" type="file" required accept=".pdf,.doc,.docx,.png,.jpg" className={field} />
          </label>
          <div>
            <Button type="submit" size="sm" loading={loading}>
              Upload and attach
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
