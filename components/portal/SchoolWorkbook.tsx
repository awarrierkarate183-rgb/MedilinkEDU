import Link from "next/link";
import type { Route } from "next";
import { AssignEventForm } from "@/components/portal/AssignEventForm";
import type { SchoolRow, SchoolStudentRow } from "@/lib/data/admin-proceedings";

export function SchoolWorkbook({
  school,
  students,
  seasonLabel,
  backHref = "/portal/admin/competitions",
  backLabel = "All schools",
}: {
  school: SchoolRow;
  students: SchoolStudentRow[];
  seasonLabel?: string | null;
  backHref?: string | null;
  backLabel?: string;
}) {
  return (
    <div className="space-y-6">
      <div>
        {backHref ? (
          <p className="text-sm">
            <Link href={backHref as Route} className="font-semibold underline">
              {backLabel}
            </Link>
          </p>
        ) : null}
        <h2 className="mt-2 text-xl font-semibold">{school.school}</h2>
        <p className="text-sm text-muted">
          {[school.city, school.state].filter(Boolean).join(", ")} · {school.status} · {school.chapterCode} ·
          season {seasonLabel || "not opened"}
        </p>
      </div>

      <AssignEventForm chapterId={school.id} school={school.school} />

      <section className="overflow-x-auto rounded-[var(--radius)] bg-white p-5">
        <h3 className="font-semibold">School workbook</h3>
        <p className="mt-1 text-sm text-muted">
          Every student on this roster. Names, events, teammates, and Legacy
          group assignments update when an administrator or officer submits them.
        </p>
        <table className="mt-4 w-full min-w-[52rem] text-left text-sm">
          <thead>
            <tr className="text-muted">
              <th className="py-2 pr-3 font-semibold">Student</th>
              <th className="py-2 pr-3 font-semibold">Email</th>
              <th className="py-2 pr-3 font-semibold">Grade</th>
              <th className="py-2 pr-3 font-semibold">Normal Events</th>
              <th className="py-2 pr-3 font-semibold">Teammates</th>
              <th className="py-2 pr-3 font-semibold">Legacy group</th>
              <th className="py-2 font-semibold">Legacy events</th>
            </tr>
          </thead>
          <tbody>
            {students.length ? (
              students.map((row) => (
                <tr key={row.id} className="border-t border-border align-top">
                  <td className="py-2 pr-3 font-semibold">
                    {row.name}
                    {row.status !== "ACTIVE" ? (
                      <span className="ml-2 text-xs font-normal text-muted">{row.status}</span>
                    ) : null}
                  </td>
                  <td className="py-2 pr-3">{row.email || "None"}</td>
                  <td className="py-2 pr-3">{row.grade || "None"}</td>
                  <td className="py-2 pr-3">{row.normalEvents.join(", ") || "None yet"}</td>
                  <td className="py-2 pr-3">{row.teammates.join(", ") || "Solo or none"}</td>
                  <td className="py-2 pr-3">{row.legacyGroup || "Not on roster"}</td>
                  <td className="py-2">{row.legacyEvents.join(", ") || "None yet"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-4 text-muted" colSpan={7}>
                  No students are on this roster yet. Add them from Chapters or
                  the advisor Members page first, then enter them in an event.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
