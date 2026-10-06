"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/States";
import { getCatalogEvent } from "@/lib/content/competition-system";

const field = "mt-1 w-full rounded-md border border-border px-3 py-2 font-normal";

export type PrepItem = {
  id: string;
  catalog_event_id: string;
  kind: string;
  title: string;
  body: string | null;
  status: string;
  notes: string | null;
  file_path: string | null;
};

function statusLabel(status: string) {
  return status.replaceAll("_", " ").toLowerCase();
}

function ItemForm({ item }: { item: PrepItem }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function send(form: HTMLFormElement, status?: string) {
    setError(null);
    setOk(null);
    const data = new FormData(form);
    data.set("itemId", item.id);
    if (status) data.set("status", status);
    setLoading(true);
    try {
      const response = await fetch("/api/projects/prep", {
        method: "POST",
        body: data,
      });
      const json = await response.json();
      if (json.error) {
        setError(json.error.message);
        return;
      }
      setOk(status === "SUBMITTED" || status === "DONE" ? "Sent to your advisor." : "Progress saved.");
      router.refresh();
    } catch {
      setError("That update could not be saved.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="rounded-md border border-border p-4">
      <p className="kicker">{item.kind === "SUBMIT" ? "Submit before the competition date" : "Develop"}</p>
      <h4 className="mt-1 font-semibold">{item.title}</h4>
      {item.body ? <p className="mt-1 text-sm text-muted">{item.body}</p> : null}
      <p className="mt-2 text-sm text-muted">Status: {statusLabel(item.status)}</p>
      {item.file_path ? <p className="mt-1 text-sm">A file is already on this item.</p> : null}
      {error ? (
        <div className="mt-3">
          <Alert title="Not saved" tone="danger">
            {error}
          </Alert>
        </div>
      ) : null}
      {ok ? (
        <div className="mt-3">
          <Alert title="Saved" tone="navy">
            {ok}
          </Alert>
        </div>
      ) : null}
      <form
        className="mt-3 space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          send(event.currentTarget, item.kind === "SUBMIT" ? "SUBMITTED" : "DONE");
        }}
      >
        <label className="block text-sm font-semibold">
          Notes
          <textarea name="notes" rows={3} maxLength={4000} className={field} defaultValue={item.notes || ""} />
        </label>
        {item.kind === "SUBMIT" ? (
          <label className="block text-sm font-semibold">
            File
            <input name="file" type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg" className={field} />
          </label>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            loading={loading}
            onClick={(event) => {
              const form = event.currentTarget.closest("form");
              if (form) send(form, "IN_PROGRESS");
            }}
          >
            Save progress
          </Button>
          <Button type="submit" size="sm" loading={loading}>
            {item.kind === "SUBMIT" ? "Submit to advisor" : "Mark developed"}
          </Button>
        </div>
      </form>
    </article>
  );
}

export function ProjectPrepBoard({ items }: { items: PrepItem[] }) {
  const groups = useMemo(() => {
    const map = new Map<string, PrepItem[]>();
    for (const item of items) {
      const list = map.get(item.catalog_event_id) ?? [];
      list.push(item);
      map.set(item.catalog_event_id, list);
    }
    return [...map.entries()];
  }, [items]);

  if (!items.length) {
    return (
      <div className="rounded-[var(--radius)] bg-white p-5 text-sm text-muted">
        After your advisor enters you in an event, this page fills with what you need to develop and what you need to
        submit before the competition date.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map(([eventId, list]) => {
        const event = getCatalogEvent(eventId);
        const submit = list.filter((item) => item.kind === "SUBMIT");
        const develop = list.filter((item) => item.kind === "DEVELOP");
        return (
          <section key={eventId} className="rounded-[var(--radius)] bg-white p-5">
            <h2 className="font-semibold">{event?.name || "Assigned event"}</h2>
            <p className="mt-1 text-sm text-muted">
              {event?.formatLabel}. These are the prerequisite pieces from the official event packet.
            </p>
            {submit.length ? (
              <div className="mt-4 space-y-3">
                <h3 className="text-sm font-semibold">Submit before the competition date</h3>
                {submit.map((item) => (
                  <ItemForm key={item.id} item={item} />
                ))}
              </div>
            ) : null}
            {develop.length ? (
              <div className="mt-4 space-y-3">
                <h3 className="text-sm font-semibold">Develop</h3>
                {develop.map((item) => (
                  <ItemForm key={item.id} item={item} />
                ))}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
