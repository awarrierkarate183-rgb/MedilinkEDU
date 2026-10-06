"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/States";
import { catalogEvents } from "@/lib/content/competition-system";
import type { EventChoiceRow } from "@/lib/competition/choices";

const field = "mt-1 w-full rounded-md border border-border px-3 py-2 font-normal";

export function ChooseEventForm({
  existing,
}: {
  existing: EventChoiceRow[];
}) {
  const router = useRouter();
  const locked = useMemo(
    () => new Set(existing.filter((row) => row.status === "APPROVED").map((row) => row.eventId)),
    [existing],
  );
  const starting = useMemo(() => {
    const next: Record<string, string> = {};
    for (const row of existing.filter((item) => item.status === "PENDING" || item.status === "APPROVED")) {
      next[row.eventId] = row.intent;
    }
    return next;
  }, [existing]);
  const [selected, setSelected] = useState<Record<string, string>>(starting);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function toggle(eventId: string) {
    if (locked.has(eventId)) return;
    setSelected((current) => {
      const next = { ...current };
      if (eventId in next) delete next[eventId];
      else next[eventId] = "";
      return next;
    });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setOk(null);
    const choices = Object.entries(selected)
      .filter(([eventId]) => !locked.has(eventId))
      .map(([eventId, intent]) => ({ eventId, intent }));
    if (!choices.length) {
      setError("Choose at least one new event. Approved events stay on your record.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/competitions/choices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choices }),
      });
      const json = await response.json();
      if (json.error) {
        setError(json.error.message);
        return;
      }
      setOk("Your choices went to your chapter advisor. They will enter the ones they accept.");
      router.refresh();
    } catch {
      setError("Your choices could not be sent. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error ? (
        <Alert title="Not sent" tone="danger">
          {error}
        </Alert>
      ) : null}
      {ok ? (
        <Alert title="Sent to your advisor" tone="navy">
          {ok}
        </Alert>
      ) : null}
      {(["NORMAL", "LEGACY"] as const).map((tier) => (
        <section key={tier} className="rounded-[var(--radius)] bg-white p-5">
          <h2 className="font-semibold">{tier === "NORMAL" ? "Normal Events" : "Legacy Events"}</h2>
          <p className="mt-1 text-sm text-muted">
            {tier === "NORMAL"
              ? "Pick up to six. Write what you want to do in that event."
              : "You can ask for a Legacy seat. Your advisor still has to name the four-person team."}
          </p>
          <div className="mt-4 grid gap-4">
            {catalogEvents
              .filter((item) => item.tier === tier)
              .map((item) => {
                const checked = item.id in selected;
                const alreadyIn = locked.has(item.id);
                return (
                  <label key={item.id} className="block rounded-md border border-border p-4">
                    <span className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={checked}
                        disabled={alreadyIn}
                        onChange={() => toggle(item.id)}
                      />
                      <span>
                        <span className="block font-semibold">
                          {item.number}. {item.name}
                        </span>
                        <span className="mt-1 block text-sm text-muted">
                          {item.formatLabel}. {item.summary}
                          {alreadyIn ? " Already entered." : ""}
                        </span>
                      </span>
                    </span>
                    {checked && !alreadyIn ? (
                      <textarea
                        className={field}
                        rows={3}
                        maxLength={800}
                        placeholder="What do you want to do in this event?"
                        value={selected[item.id] || ""}
                        onChange={(change) =>
                          setSelected((current) => ({ ...current, [item.id]: change.target.value }))
                        }
                      />
                    ) : null}
                  </label>
                );
              })}
          </div>
        </section>
      ))}
      <Button type="submit" loading={loading}>
        Send choices to my advisor
      </Button>
    </form>
  );
}
