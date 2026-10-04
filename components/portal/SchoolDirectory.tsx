import Link from "next/link";
import type { Route } from "next";
import type { SchoolRow } from "@/lib/data/admin-proceedings";

export function SchoolDirectory({
  schools,
  seasonLabel,
}: {
  schools: SchoolRow[];
  seasonLabel?: string | null;
}) {
  return (
    <section className="overflow-x-auto rounded-[var(--radius)] bg-white p-5">
      <h2 className="font-semibold">Every school</h2>
      <p className="mt-1 text-sm text-muted">
        Season {seasonLabel || "not opened"}. Click a school to open its
        workbook: roster, events, teammates, and Legacy groups. New chapter
        requests appear here as soon as they come through.
      </p>
      <table className="mt-4 w-full min-w-[44rem] text-left text-sm">
        <thead>
          <tr className="text-muted">
            <th className="py-2 pr-3 font-semibold">School</th>
            <th className="py-2 pr-3 font-semibold">Location</th>
            <th className="py-2 pr-3 font-semibold">Status</th>
            <th className="py-2 pr-3 font-semibold">Students</th>
            <th className="py-2 pr-3 font-semibold">Events entered</th>
            <th className="py-2 font-semibold">Legacy roster</th>
          </tr>
        </thead>
        <tbody>
          {schools.length ? (
            schools.map((school) => (
              <tr key={school.id} className="border-t border-border">
                <td className="py-2 pr-3">
                  <Link href={`/portal/admin/competitions/${school.id}` as Route} className="font-semibold underline">
                    {school.school}
                  </Link>
                  <p className="text-xs text-muted">{school.chapterCode}</p>
                </td>
                <td className="py-2 pr-3">{[school.city, school.state].filter(Boolean).join(", ") || "Not set"}</td>
                <td className="py-2 pr-3">{school.status.replaceAll("_", " ")}</td>
                <td className="py-2 pr-3">{school.studentCount}</td>
                <td className="py-2 pr-3">{school.eventCount}</td>
                <td className="py-2">{school.legacyReady ? "Set" : "Not set"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="py-4 text-muted" colSpan={6}>
                No schools have come through yet. When a chapter is requested or
                approved, it will list here automatically.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
