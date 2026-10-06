"use client";

import { useMemo, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { getStateListings, publicStatusLabel, type PublicChapter } from "@/lib/content/chapters";
import { MAP_HEIGHT, MAP_OFFSET, MAP_WIDTH, STATE_SHAPES, chapterPin } from "@/lib/content/us-geo";

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

  const activeStates = useMemo(() => {
    return new Set(filtered.map((chapter) => chapter.state).filter(Boolean) as string[]);
  }, [filtered]);

  const selected = chapters.find((chapter) => chapter.id === selectedId) || null;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <label className="block text-sm font-semibold" htmlFor="chapter-search">
          Find a chapter
          <input
            id="chapter-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by school or state"
            className="mt-2 w-full rounded-md border border-border bg-cream-card px-3 py-3"
          />
        </label>
        <label className="block text-sm font-semibold" htmlFor="status">
          Filter by status
          <select
            id="status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="mt-2 w-full rounded-md border border-border bg-cream-card px-3 py-3"
          >
            <option value="all">All recorded statuses</option>
            <option value="founding">Founding</option>
            <option value="established">Established</option>
            <option value="flagship-eligible">Flagship-Eligible</option>
          </select>
        </label>
      </div>

      <div className="grid items-start gap-10 xl:grid-cols-[minmax(17rem,22rem)_minmax(0,1fr)]">
        <div className="space-y-3">
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
                  selectedId === chapter.id ? "border-navy bg-surface" : "border-border bg-cream-card"
                }`}
              >
                <button type="button" className="w-full text-left" onClick={() => setSelectedId(chapter.id)}>
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

        <aside className="rounded-[var(--radius)] bg-navy p-6 text-white md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="kicker">United States</p>
              <h2 className="text-2xl font-semibold md:text-3xl">Built chapter by chapter.</h2>
            </div>
            <p className="max-w-sm text-sm text-white/70">
              Every state is drawn. A gold pin marks an accepted school in that
              state, not a street address. This map does not invent school names
              or locations.
            </p>
          </div>

          <svg
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            className="mt-8 w-full"
            role="img"
            aria-label="United States map with accepted MediLink chapter pins"
          >
            <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="#071525" rx="12" />
            <g transform={`translate(${MAP_OFFSET.x} ${MAP_OFFSET.y})`}>
              {Object.entries(STATE_SHAPES).map(([name, shape]) => {
                const active = activeStates.has(name);
                return (
                  <path
                    key={name}
                    d={shape.path}
                    fill={active ? "#1a3a63" : "#102844"}
                    stroke={active ? "#C9A227" : "#6f8198"}
                    strokeWidth={active ? 1.5 : 0.75}
                  >
                    <title>{name}</title>
                  </path>
                );
              })}
              {Object.entries(STATE_SHAPES).map(([name, shape]) => (
                <text
                  key={`${name}-label`}
                  x={shape.cx}
                  y={shape.cy + 2}
                  fill={activeStates.has(name) ? "#F6EFD8" : "rgba(255,255,255,0.55)"}
                  fontSize={name === "North Carolina" || activeStates.has(name) ? 8.5 : 6.4}
                  fontWeight={activeStates.has(name) ? 700 : 600}
                  textAnchor="middle"
                >
                  {shape.abbr}
                </text>
              ))}
              {pins.map(({ chapter, pin }) => {
                if (!pin) return null;
                const active = selectedId === chapter.id;
                return (
                  <g
                    key={chapter.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedId(chapter.id)}
                  >
                    <circle cx={pin.x} cy={pin.y} r={active ? 8 : 6} fill="#C9A227" />
                    <circle
                      cx={pin.x}
                      cy={pin.y}
                      r={active ? 13 : 10}
                      fill="none"
                      stroke="#C9A227"
                      strokeOpacity="0.45"
                    />
                    <title>{`${chapter.school}, ${chapter.state || ""}`}</title>
                  </g>
                );
              })}
            </g>
          </svg>

          <div className="mt-6 grid gap-4 border-t border-white/10 pt-5 md:grid-cols-[1fr_auto] md:items-center">
            <p className="text-sm text-white/80">
              {selected
                ? `Selected: ${selected.school}, ${[selected.city, selected.state].filter(Boolean).join(", ")}`
                : pins.length === 0
                  ? "Pins appear after a chapter is accepted."
                  : "Select a school on the left or a pin on the map."}
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/start-a-chapter/apply" size="sm">
                Start a chapter
              </ButtonLink>
              <ButtonLink
                href="/start-a-chapter/reactivate"
                size="sm"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Reactivate
              </ButtonLink>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
