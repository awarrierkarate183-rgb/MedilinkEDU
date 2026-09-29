"use client";

import { useMemo, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { getPublicSchoolChapters, getStateListings } from "@/lib/content/chapters";
import { actionHref } from "@/lib/content/forms";

export function ChapterExplorer() {
  const states = getStateListings();
  const schools = getPublicSchoolChapters();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return schools.filter((chapter) => {
      const hay = `${chapter.name} ${chapter.location} ${chapter.stateName}`.toLowerCase();
      const matchesQuery = !q || hay.includes(q);
      const matchesStatus =
        status === "all" || (chapter.status || "").toLowerCase() === status;
      return matchesQuery && matchesStatus;
    });
  }, [query, schools, status]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <label className="block text-sm font-semibold" htmlFor="chapter-search">
          Find a chapter
        </label>
        <input
          id="chapter-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by school or state"
          className="mt-2 w-full rounded-md border border-border px-3 py-2"
        />
        <label className="mt-4 block text-sm font-semibold" htmlFor="status">
          Filter by status
        </label>
        <select
          id="status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="mt-2 w-full rounded-md border border-border px-3 py-2"
        >
          <option value="all">All recorded statuses</option>
          <option value="founding">Founding</option>
          <option value="established">Established</option>
          <option value="flagship-eligible">Flagship-Eligible</option>
        </select>
        <div className="mt-6 space-y-3">
          {filtered.length === 0 ? (
            <p className="rounded-[var(--radius)] border border-dashed border-border p-6 text-sm text-muted">
              No confirmed school chapters match this search. State networks
              currently listed: {states.map((state) => state.name).join(", ")}.
            </p>
          ) : (
            filtered.map((chapter) => (
              <article key={chapter.id} className="rounded-[var(--radius)] border border-border p-5">
                <h3 className="font-semibold">{chapter.name}</h3>
                <p className="text-sm text-muted">{chapter.stateName}</p>
                {chapter.status ? (
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wider">
                    {chapter.status}
                  </p>
                ) : null}
              </article>
            ))
          )}
        </div>
      </div>
      <aside className="rounded-[var(--radius)] bg-navy p-6 text-white">
        <p className="kicker">Chapter map</p>
        <h2 className="text-2xl font-semibold">Built chapter by chapter.</h2>
        <p className="mt-3 text-sm text-white/70">
          Pins mark state networks that are listed. School pins appear when the
          board records a chapter. This map does not invent locations.
        </p>
        <svg viewBox="0 0 320 220" className="mt-6 w-full" role="img" aria-label="Southeast United States with North Carolina and Georgia markers">
          <rect width="320" height="220" fill="#071525" rx="12" />
          <circle cx="210" cy="70" r="8" fill="#C9A227" />
          <text x="224" y="74" fill="white" fontSize="12">
            North Carolina
          </text>
          <circle cx="170" cy="130" r="8" fill="#C9A227" />
          <text x="184" y="134" fill="white" fontSize="12">
            Georgia
          </text>
        </svg>
        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink href="/start-a-chapter" size="sm">
            Start a chapter
          </ButtonLink>
          <ButtonLink href={actionHref("reactivateChapter", "Chapter Reactivation")} size="sm" variant="outline" className="border-white text-white hover:bg-white/10">
            Reactivate
          </ButtonLink>
        </div>
      </aside>
    </div>
  );
}
