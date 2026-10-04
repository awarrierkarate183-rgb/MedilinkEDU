"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/States";
import { catalogEvents } from "@/lib/content/competition-system";

const field = "mt-1 w-full rounded-md border border-border px-3 py-2 font-normal";

export function AssignEventForm({
  chapterId,
  school,
}: {
  chapterId: string;
  school: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState(1);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setOk(null);
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const students = [];
    for (let index = 0; index < rows; index += 1) {
      const firstName = String(data.get(`firstName-${index}`) || "").trim();
      const lastName = String(data.get(`lastName-${index}`) || "").trim();
      if (firstName || lastName) students.push({ firstName, lastName });
    }
    try {
      const response = await fetch("/api/competitions/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterId,
          eventId: String(data.get("eventId") || ""),
          students,
        }),
      });
      const json = await response.json();
      if (json.error) {
        setError(json.error.message);
        return;
      }
      setOk(
        `${json.data?.eventName || "That event"} is now on each named student's Competitions page.`,
      );
      event.currentTarget.reset();
      router.refresh();
    } catch {
      setError("The assignment could not be saved. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[var(--radius)] bg-white p-5">
      <h2 className="font-semibold">Enter students in an event</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted">
        <li>Type the student first and last names exactly as they appear on this school's roster.</li>
        <li>Choose the competition they are doing.</li>
        <li>Add teammates only if the event allows a team.</li>
        <li>Submit. Each student will see the event on their student portal immediately.</li>
      </ol>
      {error ? (
        <div className="mt-3">
          <Alert title="Not assigned" tone="danger">
            {error}
          </Alert>
        </div>
      ) : null}
      {ok ? (
        <div className="mt-3">
          <Alert title="Assigned" tone="navy">
            {ok}
          </Alert>
        </div>
      ) : null}
      <label className="mt-4 block text-sm font-semibold">
        Competition
        <select name="eventId" required className={field} defaultValue="">
          <option value="" disabled>
            Choose the event for {school}
          </option>
          {catalogEvents.map((item) => (
            <option key={item.id} value={item.id} disabled={item.tier === "LEGACY"}>
              {item.tier === "NORMAL" ? "Normal" : "Legacy"} · {item.number}. {item.name} ({item.formatLabel})
            </option>
          ))}
        </select>
      </label>
      <p className="mt-2 text-sm text-muted">
        Legacy Events use the eight-student roster and group assignment, not this name form.
      </p>
      <div className="mt-4 grid gap-3">
        {Array.from({ length: rows }, (_, index) => (
          <div key={index} className="grid gap-3 md:grid-cols-2">
            <label className="block text-sm font-semibold">
              {index === 0 ? "Student first name" : `Teammate ${index} first name`}
              <input name={`firstName-${index}`} required={index === 0} className={field} />
            </label>
            <label className="block text-sm font-semibold">
              {index === 0 ? "Student last name" : `Teammate ${index} last name`}
              <input name={`lastName-${index}`} required={index === 0} className={field} />
            </label>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {rows < 5 ? (
          <Button type="button" size="sm" variant="outline" onClick={() => setRows((value) => value + 1)}>
            Add another teammate
          </Button>
        ) : null}
        <Button type="submit" size="sm" loading={loading}>
          Submit event assignment
        </Button>
      </div>
    </form>
  );
}
