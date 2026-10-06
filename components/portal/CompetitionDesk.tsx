"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/States";
import { catalogEvents, legacyEvents, normalEvents } from "@/lib/content/competition-system";

const field = "mt-1 w-full rounded-md border border-border px-3 py-2 font-normal";

type Person = { id: string; full_name?: string | null; display_name?: string | null; email?: string | null };
type Props = {
  mode: "student" | "officer" | "admin";
  profileId: string;
  chapterId?: string | null;
  seasonLabel?: string | null;
  rosterLocked?: boolean;
  nominationsOpen?: boolean;
  roster: Person[];
  myEventIds: string[];
  delegation: { groupA: string[]; groupB: string[] };
  entries: Array<{ catalog_event_id: string; group_label: string }>;
  results: Array<{ catalog_event_id: string; round: string; placement: number; points: number; published: boolean }>;
  annual: Array<{ national_rank?: number | null; chapters?: { name?: string } | { name?: string }[] | null }>;
  apex: Array<{ chapters?: { name?: string } | { name?: string }[] | null }>;
  invitees: Array<{ profiles?: { full_name?: string; display_name?: string } | Array<{ full_name?: string; display_name?: string }> | null }>;
  candidates: Array<{
    profile_id: string;
    chapter_id: string;
    confidential_score?: number | null;
    nominated?: boolean;
    profiles?: { full_name?: string; display_name?: string } | Array<{ full_name?: string; display_name?: string }> | null;
    chapters?: { name?: string } | Array<{ name?: string }> | null;
  }>;
  chapters: Array<{ id: string; name: string; school?: string; state?: string | null }>;
  cutoffs: { regionalAdvance: string[]; stateAdvance: string[] };
};

function nameOf(person?: Person | null) {
  return person?.display_name || person?.full_name || person?.email || "Member";
}

function nestedName(value: unknown) {
  const row = Array.isArray(value) ? value[0] : value;
  if (!row || typeof row !== "object") return "";
  const record = row as { name?: string; display_name?: string; full_name?: string };
  return record.display_name || record.full_name || record.name || "";
}

async function postJson(url: string, body: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return response.json();
}

export function CompetitionDesk(props: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const people = useMemo(() => new Map(props.roster.map((row) => [row.id, row])), [props.roster]);
  const [chapterId, setChapterId] = useState(props.chapterId || "");
  const activeChapterId = chapterId || props.chapterId || undefined;

  async function run(url: string, body: unknown, success: string) {
    setError(null);
    setOk(null);
    setLoading(true);
    try {
      const json = await postJson(url, body);
      if (json.error) {
        setError(json.error.message);
        return;
      }
      setOk(success);
      router.refresh();
    } catch {
      setError("That request could not be saved. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Competitions</h2>
        <p className="mt-1 text-sm text-muted">
          Season {props.seasonLabel || "not opened"}. Normal Events cap at six.
          Legacy uses one team of four. That team may enter one, two, or all three Triad events.
        </p>
      </div>
      {error ? <Alert title="Not saved" tone="danger">{error}</Alert> : null}
      {ok ? <Alert title="Saved" tone="navy">{ok}</Alert> : null}
      {props.mode === "admin" && props.chapters.length ? (
        <label className="block text-sm font-semibold">
          Working chapter
          <select
            className={field}
            value={chapterId}
            onChange={(event) => setChapterId(event.target.value)}
          >
            <option value="">Choose a chapter</option>
            {props.chapters.map((chapter) => (
              <option key={chapter.id} value={chapter.id}>
                {chapter.school || chapter.name}
                {chapter.state ? ` · ${chapter.state}` : ""}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <section className="rounded-[var(--radius)] bg-white p-5">
        <h3 className="font-semibold">Normal Events</h3>
        <p className="mt-1 text-sm text-muted">
          You are in {props.myEventIds.length} of 6. Regional is required. Everyone
          who competes at Regional goes to State.
        </p>
        <form
          className="mt-4 grid gap-3 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const teammates = data.getAll("teammates").map(String).filter(Boolean);
            const self = props.mode === "student" ? [props.profileId] : [];
            const profileIds = [...new Set([...self, ...teammates])];
            if (props.mode !== "student") {
              const lead = String(data.get("lead") || "");
              if (lead) profileIds.unshift(lead);
            }
            run(
              "/api/competitions/register",
              {
                eventId: String(data.get("eventId") || ""),
                profileIds: [...new Set(profileIds)],
                chapterId: activeChapterId,
              },
              "Registration saved.",
            );
          }}
        >
          <label className="block text-sm font-semibold">
            Event
            <select name="eventId" required className={field} defaultValue="">
              <option value="" disabled>
                Choose a Normal Event
              </option>
              {normalEvents.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.number}. {event.name} ({event.formatLabel})
                </option>
              ))}
            </select>
          </label>
          {props.mode !== "student" ? (
            <label className="block text-sm font-semibold">
              Student
              <select name="lead" required className={field} defaultValue="">
                <option value="" disabled>
                  Choose a student
                </option>
                {props.roster.map((row) => (
                  <option key={row.id} value={row.id}>
                    {nameOf(row)}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <label className="block text-sm font-semibold md:col-span-2">
            Teammates if the event allows a team
            <select name="teammates" multiple className={`${field} min-h-32`}>
              {props.roster
                .filter((row) => row.id !== props.profileId)
                .map((row) => (
                  <option key={row.id} value={row.id}>
                    {nameOf(row)}
                  </option>
                ))}
            </select>
          </label>
          <div>
            <Button type="submit" size="sm" loading={loading}>
              Register
            </Button>
          </div>
        </form>
        {props.myEventIds.length ? (
          <ul className="mt-4 space-y-1 text-sm">
            {props.myEventIds.map((id) => (
              <li key={id}>{catalogEvents.find((event) => event.id === id)?.name || id}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted">No Normal Event registrations yet.</p>
        )}
      </section>

      <section className="rounded-[var(--radius)] bg-white p-5">
        <h3 className="font-semibold">Legacy delegation</h3>
        <p className="mt-1 text-sm text-muted">
          {props.rosterLocked
            ? "This season roster is locked. Only a documented exception can change it."
            : "Exactly four students. The same four are the chapter Legacy delegation. They may enter one, two, or all three events."}
        </p>
        {props.mode === "student" ? (
          <p className="mt-3 text-sm">
            {props.delegation.groupA.includes(props.profileId)
              ? "You are one of the four Legacy delegates."
              : "You are not on this season's Legacy roster."}
          </p>
        ) : (
          <form
            className="mt-4 grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              run(
                "/api/competitions/legacy-roster",
                {
                  groupA: data.getAll("groupA").map(String),
                  groupB: [],
                  chapterId: activeChapterId,
                },
                "Legacy roster saved.",
              );
            }}
          >
            <label className="block text-sm font-semibold">
              Four Legacy delegates
              <select name="groupA" multiple className={`${field} min-h-40`}>
                {props.roster.map((row) => (
                  <option key={row.id} value={row.id}>
                    {nameOf(row)}
                  </option>
                ))}
              </select>
            </label>
            <div>
              <Button type="submit" size="sm" loading={loading} disabled={props.rosterLocked && props.mode !== "admin"}>
                Save roster
              </Button>
            </div>
          </form>
        )}
        <div className="mt-4 text-sm">
          <p>
            Delegation: {props.delegation.groupA.map((id) => nameOf(people.get(id))).filter(Boolean).join(", ") || "Empty"}
          </p>
        </div>
        {props.mode !== "student" ? (
          <form
            className="mt-4 grid gap-3 md:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              run(
                "/api/competitions/legacy-entry",
                {
                  eventId: String(data.get("eventId") || ""),
                  groupLabel: "A",
                  chapterId: activeChapterId,
                },
                "Legacy event assigned.",
              );
            }}
          >
            <label className="block text-sm font-semibold">
              Legacy event
              <select name="eventId" required className={field} defaultValue="">
                <option value="" disabled>
                  Choose an event
                </option>
                {legacyEvents.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-end">
              <Button type="submit" size="sm" loading={loading}>
                Enter the team
              </Button>
            </div>
          </form>
        ) : null}
        <ul className="mt-3 space-y-1 text-sm">
          {props.entries.map((entry) => (
            <li key={entry.catalog_event_id}>
              {catalogEvents.find((event) => event.id === entry.catalog_event_id)?.name || entry.catalog_event_id}
            </li>
          ))}
        </ul>
      </section>

      {props.mode === "officer" && props.nominationsOpen ? (
        <section className="rounded-[var(--radius)] bg-white p-5">
          <h3 className="font-semibold">Invitational nominations</h3>
          <p className="mt-1 text-sm text-muted">
            Up to two Legacy roster members. A nomination is consideration, not an invite.
          </p>
          <form
            className="mt-4 grid gap-3 md:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              run(
                "/api/competitions/nominate",
                { profileId: String(data.get("profileId") || ""), chapterId: activeChapterId },
                "Nomination saved.",
              );
            }}
          >
            <label className="block text-sm font-semibold">
              Student
              <select name="profileId" required className={field} defaultValue="">
                <option value="" disabled>
                  Choose a Legacy roster member
                </option>
                {[...props.delegation.groupA, ...props.delegation.groupB].map((id) => (
                  <option key={id} value={id}>
                    {nameOf(people.get(id))}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-end">
              <Button type="submit" size="sm" loading={loading}>
                Nominate
              </Button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="rounded-[var(--radius)] bg-white p-5">
        <h3 className="font-semibold">Results and public lists</h3>
        <ul className="mt-3 space-y-1 text-sm">
          {props.results.length ? (
            props.results.map((row, index) => (
              <li key={`${row.catalog_event_id}-${row.round}-${index}`}>
                {catalogEvents.find((event) => event.id === row.catalog_event_id)?.name} · {row.round} · {row.placement} · {row.points} pts
              </li>
            ))
          ) : (
            <li className="text-muted">No published results yet.</li>
          )}
        </ul>
        <p className="mt-4 text-sm text-muted">
          Annual Top 10 and Road to Apex are different lists. Legacy Regional
          keeps {props.cutoffs.regionalAdvance.length} advancing entries in the
          current computed cutoff. State keeps {props.cutoffs.stateAdvance.length}.
          The invitational invitee list is public only after it is announced.
          Students never see the confidential metric.
        </p>
        <ol className="mt-3 space-y-1 text-sm">
          {props.annual.slice(0, 10).map((row) => (
            <li key={`${nestedName(row.chapters)}-${row.national_rank}`}>
              {row.national_rank}. {nestedName(row.chapters)}
            </li>
          ))}
        </ol>
        {props.invitees.length ? (
          <ul className="mt-3 space-y-1 text-sm">
            {props.invitees.map((row, index) => (
              <li key={index}>{nestedName(row.profiles)}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted">No announced invitational invitees yet.</p>
        )}
      </section>

      {props.mode === "admin" ? (
        <AdminTools
          loading={loading}
          chapters={props.chapters}
          candidates={props.candidates}
          rosterLocked={props.rosterLocked}
          nominationsOpen={props.nominationsOpen}
          run={run}
        />
      ) : null}
    </div>
  );
}

function AdminTools({
  loading,
  chapters,
  candidates,
  rosterLocked,
  nominationsOpen,
  run,
}: {
  loading: boolean;
  chapters: Props["chapters"];
  candidates: Props["candidates"];
  rosterLocked?: boolean;
  nominationsOpen?: boolean;
  run: (url: string, body: unknown, success: string) => void;
}) {
  return (
    <div className="space-y-6">
      <section className="rounded-[var(--radius)] bg-white p-5">
        <h3 className="font-semibold">Season controls</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            size="sm"
            loading={loading}
            onClick={() => run("/api/competitions/season", { rosterLocked: !rosterLocked }, "Season lock updated.")}
          >
            {rosterLocked ? "Unlock roster" : "Lock Legacy roster"}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            loading={loading}
            onClick={() =>
              run(
                "/api/competitions/season",
                { invitationalNominationsOpen: !nominationsOpen },
                "Nomination window updated.",
              )
            }
          >
            {nominationsOpen ? "Close nominations" : "Open nominations"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            loading={loading}
            onClick={() => run("/api/competitions/rankings", { publish: true }, "Rankings published.")}
          >
            Compute and publish rankings
          </Button>
        </div>
        <form
          className="mt-4 grid gap-3 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            run(
              "/api/competitions/legacy-exception",
              {
                chapterId: data.get("chapterId") || undefined,
                profileOut: String(data.get("profileOut") || ""),
                profileIn: String(data.get("profileIn") || ""),
                reason: String(data.get("reason") || "NATIONALLY_APPROVED"),
                notes: String(data.get("notes") || ""),
              },
              "Roster exception applied.",
            );
          }}
        >
          <p className="md:col-span-2 text-sm text-muted">
            After lock, swap one student only for withdrawal, medical leave, or a nationally approved reason.
          </p>
          <label className="block text-sm font-semibold">
            Chapter
            <select name="chapterId" required className={field} defaultValue="">
              <option value="" disabled>
                Choose a chapter
              </option>
              {chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.school || chapter.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold">
            Reason
            <select name="reason" className={field} defaultValue="NATIONALLY_APPROVED">
              <option value="WITHDRAWAL_FROM_SCHOOL">Withdrawal from school</option>
              <option value="MEDICAL">Serious medical unavailability</option>
              <option value="NATIONALLY_APPROVED">Nationally approved</option>
            </select>
          </label>
          <label className="block text-sm font-semibold">
            Student leaving
            <input name="profileOut" required className={field} placeholder="Student id" />
          </label>
          <label className="block text-sm font-semibold">
            Student entering
            <input name="profileIn" required className={field} placeholder="Student id" />
          </label>
          <div>
            <Button type="submit" size="sm" loading={loading}>
              Apply exception
            </Button>
          </div>
        </form>
      </section>

      <section className="rounded-[var(--radius)] bg-white p-5">
        <h3 className="font-semibold">Enter a result</h3>
        <p className="mt-1 text-sm text-muted">
          Normal Events still use placement. Legacy uses the raw 1,000-point score.
          Regional keeps the top 3 in each pool. State advances the one highest
          35 / 65 cumulative standing.
        </p>
        <form
          className="mt-4 grid gap-3 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            run(
              "/api/competitions/results",
              {
                eventId: String(data.get("eventId") || ""),
                round: String(data.get("round") || "REGIONAL"),
                chapterId: String(data.get("chapterId") || ""),
                placement: Number(data.get("placement") || 1),
                rawScore: data.get("rawScore") ? Number(data.get("rawScore")) : undefined,
                published: true,
              },
              "Result saved.",
            );
          }}
        >
          <label className="block text-sm font-semibold md:col-span-2">
            Event
            <select name="eventId" required className={field} defaultValue="">
              <option value="" disabled>
                Choose an event
              </option>
              {catalogEvents.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.tier === "LEGACY" ? "Legacy" : "Normal"} · {event.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold">
            Round
            <select name="round" className={field} defaultValue="REGIONAL">
              <option value="REGIONAL">Regional</option>
              <option value="STATE">State</option>
              <option value="NATIONAL">National</option>
            </select>
          </label>
          <label className="block text-sm font-semibold">
            Placement
            <input name="placement" type="number" min={1} max={50} defaultValue={1} className={field} />
          </label>
          <label className="block text-sm font-semibold">
            Legacy raw score / 1000
            <input name="rawScore" type="number" min={0} max={1000} step="0.1" className={field} />
          </label>
          <label className="block text-sm font-semibold md:col-span-2">
            Chapter
            <select name="chapterId" required className={field} defaultValue="">
              <option value="" disabled>
                Choose a chapter
              </option>
              {chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.school || chapter.name}
                  {chapter.state ? ` · ${chapter.state}` : ""}
                </option>
              ))}
            </select>
          </label>
          <div>
            <Button type="submit" size="sm" loading={loading}>
              Save result
            </Button>
          </div>
        </form>
      </section>

      <section className="rounded-[var(--radius)] bg-white p-5">
        <h3 className="font-semibold">Invitational, admin only</h3>
        <p className="mt-1 text-sm text-muted">
          The confidential score stays on this page. Students never see it.
        </p>
        <form
          className="mt-4 grid gap-3 md:grid-cols-3"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            run(
              "/api/competitions/invitational",
              {
                profileId: String(data.get("profileId") || ""),
                chapterId: String(data.get("chapterId") || ""),
                score: Number(data.get("score") || 0),
              },
              "Confidential score saved.",
            );
          }}
        >
          <label className="block text-sm font-semibold">
            Candidate
            <select name="profileId" required className={field} defaultValue="">
              <option value="" disabled>
                Choose a candidate
              </option>
              {candidates.map((row) => (
                <option key={row.profile_id} value={row.profile_id}>
                  {nestedName(row.profiles)} {row.nominated ? "(nominated)" : ""}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold">
            Chapter
            <select name="chapterId" required className={field} defaultValue="">
              <option value="" disabled>
                Chapter
              </option>
              {chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold">
            Confidential score
            <input name="score" type="number" min={0} max={100} step="0.1" required className={field} />
          </label>
          <div>
            <Button type="submit" size="sm" loading={loading}>
              Save score
            </Button>
          </div>
        </form>
        <form
          className="mt-4"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            run(
              "/api/competitions/invitational",
              { profileIds: data.getAll("profileIds").map(String) },
              "Invitee list published.",
            );
          }}
        >
          <label className="block text-sm font-semibold">
            Publish invitees
            <select name="profileIds" multiple className={`${field} min-h-32`}>
              {candidates.map((row) => (
                <option key={row.profile_id} value={row.profile_id}>
                  {nestedName(row.profiles)} · score {row.confidential_score ?? "n/a"}
                </option>
              ))}
            </select>
          </label>
          <div className="mt-3">
            <Button type="submit" size="sm" loading={loading}>
              Announce invitees
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
