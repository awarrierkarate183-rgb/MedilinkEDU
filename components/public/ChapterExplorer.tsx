"use client";

import { useMemo, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { getStateListings, publicStatusLabel, type PublicChapter } from "@/lib/content/chapters";
import { MAP_HEIGHT, MAP_WIDTH, chapterPin } from "@/lib/content/us-geo";
import { actionHref } from "@/lib/content/forms";

function statusKey(status: string) {
  return status.toLowerCase().replace(/_/g, "-");
}

export function ChapterExplorer({ chapters }: { chapters: PublicChapter[] }) {
  const states = getStateListings();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(chapters[0]?.id ?? null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return chapters.filter((chapter) => {
      const hay = `${chapter.school} ${chapter.city || ""} ${chapter.state || ""}`.toLowerCase();
      const matchesQuery = !q || hay.includes(q);
      const matchesStatus = status === "all" || statusKey(chapter.status) === status;
      return matchesQuery && matchesStatus;
    });
  }, [chapters, query, status]);

  const pins = useMemo(() => {
    const counts = new Map<string, number>();
    const seen = new Map<string, number>();
    for (const chapter of filtered) {
      const key = chapter.state || "unknown";
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    return filtered.map((chapter) => {
      const key = chapter.state || "unknown";
      const index = seen.get(key) || 0;
      seen.set(key, index + 1);
      return {
        chapter,
        pin: chapterPin(chapter.state, index, counts.get(key) || 1),
      };
    });
  }, [filtered]);

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
              {chapters.length
                ? "No accepted school chapters match this search."
                : "No accepted school chapters are on the map yet. A school appears here after it uses Start a Chapter and MediLink accepts the request."}{" "}
              State networks currently listed: {states.map((state) => state.name).join(", ")}.
            </p>
          ) : (
            filtered.map((chapter) => (
              <article
                key={chapter.id}
                id={`chapter-${chapter.id}`}
                className={`rounded-[var(--radius)] border p-5 ${
                  selectedId === chapter.id ? "border-navy bg-surface" : "border-border"
                }`}
              >
                <button
                  type="button"
                  className="w-full text-left"
                  onClick={() => setSelectedId(chapter.id)}
                >
                  <h3 className="font-semibold">{chapter.school}</h3>
                  <p className="text-sm text-muted">
                    {[chapter.city, chapter.state].filter(Boolean).join(", ")}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wider">
                    {publicStatusLabel(chapter.status)}
                  </p>
                </button>
              </article>
            ))
          )}
        </div>
      </div>
      <aside className="rounded-[var(--radius)] bg-navy p-6 text-white">
        <p className="kicker">Chapter map</p>
        <h2 className="text-2xl font-semibold">Built chapter by chapter.</h2>
        <p className="mt-3 text-sm text-white/70">
          Pins come from accepted Start a Chapter forms. Each pin marks the
          state entered on the form, not a street address. This map does not
          invent school names or locations.
        </p>
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className="mt-6 w-full"
          role="img"
          aria-label="United States map with accepted MediLink chapter pins"
        >
          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="#071525" rx="12" />
          {pins.length === 0 ? (
            <text x={MAP_WIDTH / 2} y={MAP_HEIGHT / 2} fill="white" fontSize="12" textAnchor="middle">
              Pins appear after a chapter is accepted
            </text>
          ) : (
            pins.map(({ chapter, pin }) => {
              if (!pin) return null;
              const active = selectedId === chapter.id;
              return (
                <g key={chapter.id}>
                  <circle
                    cx={pin.x}
                    cy={pin.y}
                    r={active ? 10 : 8}
                    fill="#C9A227"
                    className="cursor-pointer"
                    onClick={() => setSelectedId(chapter.id)}
                  >
                    <title>{`${chapter.school}, ${chapter.state || ""}`}</title>
                  </circle>
                  <text
                    x={pin.x + 14}
                    y={pin.y + 4}
                    fill="white"
                    fontSize="11"
                    className="cursor-pointer"
                    onClick={() => setSelectedId(chapter.id)}
                  >
                    {chapter.school}
                  </text>
                </g>
              );
            })
          )}
        </svg>
        {selectedId ? (
          <p className="mt-4 text-sm text-white/80">
            Selected: {chapters.find((chapter) => chapter.id === selectedId)?.school}
          </p>
        ) : null}
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
