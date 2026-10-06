"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/States";
import type { EventChoiceRow } from "@/lib/competition/choices";

const field = "mt-1 w-full rounded-md border border-border px-3 py-2 font-normal";

function ChoiceCard({ choice }: { choice: EventChoiceRow }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState<"approve" | "decline" | null>(null);
  const [teammates, setTeammates] = useState(0);

  async function review(decision: "approve" | "decline", form?: HTMLFormElement) {
    setError(null);
    setOk(null);
    setLoading(decision);
    const extras: Array<{ firstName: string; lastName: string }> = [];
    if (form && decision === "approve") {
      const data = new FormData(form);
      for (let index = 0; index < teammates; index += 1) {
        const firstName = String(data.get(`firstName-${index}`) || "").trim();
        const lastName = String(data.get(`lastName-${index}`) || "").trim();
        if (firstName || lastName) extras.push({ firstName, lastName });
      }
    }
    try {
      const response = await fetch("/api/competitions/choices/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          choiceId: choice.id,
          decision,
          teammates: extras,
        }),
      });
      const json = await response.json();
      if (json.error) {
        setError(json.error.message);
        return;
      }
      setOk(
        decision === "approve"
          ? `${choice.studentName} is now entered in ${choice.eventName}.`
          : `${choice.studentName}'s choice was not entered.`,
      );
      router.refresh();
    } catch {
      setError("That choice could not be saved. Try again.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <article className="rounded-[var(--radius)] bg-white p-5">
      <p className="kicker">
        {choice.eventTier === "NORMAL" ? "Normal Event" : "Legacy Event"} · {choice.formatLabel}
      </p>
      <h3 className="mt-1 font-semibold">{choice.eventName}</h3>
      <p className="mt-1 text-sm">
        {choice.studentName}
        {choice.studentEmail ? ` · ${choice.studentEmail}` : ""}
      </p>
      {choice.intent ? (
        <p className="mt-3 text-sm">What they want to do: {choice.intent}</p>
      ) : (
        <p className="mt-3 text-sm text-muted">They did not add a note.</p>
      )}
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
        className="mt-4 space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          void review("approve", event.currentTarget);
        }}
      >
        {choice.eventTier === "NORMAL" ? (
          <div className="space-y-3">
            {Array.from({ length: teammates }, (_, index) => (
              <div key={index} className="grid gap-3 md:grid-cols-2">
                <label className="block text-sm font-semibold">
                  Teammate {index + 1} first name
                  <input name={`firstName-${index}`} className={field} />
                </label>
                <label className="block text-sm font-semibold">
                  Teammate {index + 1} last name
                  <input name={`lastName-${index}`} className={field} />
                </label>
              </div>
            ))}
            {teammates < 4 ? (
              <Button type="button" size="sm" variant="outline" onClick={() => setTeammates((value) => value + 1)}>
                Add a teammate
              </Button>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-muted">
            Putting this in saves the choice. If your four-person Legacy roster is already set and includes this
            student, the event is entered. If not, finish the roster on Competitions.
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <Button type="submit" size="sm" loading={loading === "approve"}>
            Enter this student
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            loading={loading === "decline"}
            onClick={() => void review("decline")}
          >
            Do not enter
          </Button>
        </div>
      </form>
    </article>
  );
}

export function EventChoiceInbox({ choices }: { choices: EventChoiceRow[] }) {
  const pending = choices.filter((row) => row.status === "PENDING");
  const recent = choices.filter((row) => row.status !== "PENDING").slice(0, 8);
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Student event choices</h2>
        <p className="mt-1 text-sm text-muted">
          Students send these from Competitions. Enter a student to save the official assignment. They will see the
          event on Competitions, and Projects will fill with what they need to develop and submit. Every official
          rubric is on Resources.
        </p>
      </div>
      {pending.length ? (
        pending.map((choice) => <ChoiceCard key={choice.id} choice={choice} />)
      ) : (
        <div className="rounded-[var(--radius)] bg-white p-5 text-sm text-muted">
          No student has sent a new event choice. When they do, it will land here for you to enter.
        </div>
      )}
      {recent.length ? (
        <ul className="space-y-2 text-sm">
          {recent.map((choice) => (
            <li key={choice.id} className="rounded-[var(--radius)] bg-white px-4 py-3">
              <strong>{choice.studentName}</strong> · {choice.eventName} · {choice.status.toLowerCase()}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
