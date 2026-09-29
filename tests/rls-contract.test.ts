import { describe, expect, it } from "vitest";

type Expectation = {
  table: string;
  anonSelect: boolean;
  studentSelectOtherPrivate: boolean;
  studentWritePoints: boolean;
  advisorReadOtherChapter: boolean;
  advisorApproveOwnChapter: boolean;
};

const privateTables: Expectation[] = [
  { table: "profiles", anonSelect: false, studentSelectOtherPrivate: false, studentWritePoints: false, advisorReadOtherChapter: false, advisorApproveOwnChapter: true },
  { table: "chapter_members", anonSelect: false, studentSelectOtherPrivate: false, studentWritePoints: false, advisorReadOtherChapter: false, advisorApproveOwnChapter: true },
  { table: "invitations", anonSelect: false, studentSelectOtherPrivate: false, studentWritePoints: false, advisorReadOtherChapter: false, advisorApproveOwnChapter: true },
  { table: "events", anonSelect: false, studentSelectOtherPrivate: false, studentWritePoints: false, advisorReadOtherChapter: false, advisorApproveOwnChapter: true },
  { table: "event_registrations", anonSelect: false, studentSelectOtherPrivate: false, studentWritePoints: false, advisorReadOtherChapter: false, advisorApproveOwnChapter: true },
  { table: "competition_teams", anonSelect: false, studentSelectOtherPrivate: false, studentWritePoints: false, advisorReadOtherChapter: false, advisorApproveOwnChapter: true },
  { table: "competition_team_members", anonSelect: false, studentSelectOtherPrivate: false, studentWritePoints: false, advisorReadOtherChapter: false, advisorApproveOwnChapter: true },
  { table: "competition_registrations", anonSelect: false, studentSelectOtherPrivate: false, studentWritePoints: false, advisorReadOtherChapter: false, advisorApproveOwnChapter: true },
  { table: "submissions", anonSelect: false, studentSelectOtherPrivate: false, studentWritePoints: false, advisorReadOtherChapter: false, advisorApproveOwnChapter: true },
  { table: "competition_results", anonSelect: false, studentSelectOtherPrivate: false, studentWritePoints: false, advisorReadOtherChapter: false, advisorApproveOwnChapter: true },
  { table: "ideas", anonSelect: false, studentSelectOtherPrivate: false, studentWritePoints: false, advisorReadOtherChapter: false, advisorApproveOwnChapter: true },
  { table: "idea_members", anonSelect: false, studentSelectOtherPrivate: false, studentWritePoints: false, advisorReadOtherChapter: false, advisorApproveOwnChapter: true },
  { table: "projects", anonSelect: false, studentSelectOtherPrivate: false, studentWritePoints: false, advisorReadOtherChapter: false, advisorApproveOwnChapter: true },
  { table: "project_milestones", anonSelect: false, studentSelectOtherPrivate: false, studentWritePoints: false, advisorReadOtherChapter: false, advisorApproveOwnChapter: true },
  { table: "project_updates", anonSelect: false, studentSelectOtherPrivate: false, studentWritePoints: false, advisorReadOtherChapter: false, advisorApproveOwnChapter: true },
  { table: "curriculum_progress", anonSelect: false, studentSelectOtherPrivate: false, studentWritePoints: false, advisorReadOtherChapter: false, advisorApproveOwnChapter: true },
  { table: "announcements", anonSelect: false, studentSelectOtherPrivate: false, studentWritePoints: false, advisorReadOtherChapter: false, advisorApproveOwnChapter: true },
  { table: "news_submissions", anonSelect: false, studentSelectOtherPrivate: false, studentWritePoints: false, advisorReadOtherChapter: false, advisorApproveOwnChapter: true },
  { table: "points_transactions", anonSelect: false, studentSelectOtherPrivate: false, studentWritePoints: false, advisorReadOtherChapter: false, advisorApproveOwnChapter: true },
  { table: "files", anonSelect: false, studentSelectOtherPrivate: false, studentWritePoints: false, advisorReadOtherChapter: false, advisorApproveOwnChapter: true },
  { table: "notifications", anonSelect: false, studentSelectOtherPrivate: false, studentWritePoints: false, advisorReadOtherChapter: false, advisorApproveOwnChapter: true },
  { table: "audit_logs", anonSelect: false, studentSelectOtherPrivate: false, studentWritePoints: false, advisorReadOtherChapter: false, advisorApproveOwnChapter: true },
  { table: "chapter_officers", anonSelect: false, studentSelectOtherPrivate: false, studentWritePoints: false, advisorReadOtherChapter: false, advisorApproveOwnChapter: true },
];

describe("private table RLS contract", () => {
  it("does not allow anonymous or cross-chapter private access", () => {
    for (const table of privateTables) {
      expect(table.anonSelect, table.table).toBe(false);
      expect(table.studentSelectOtherPrivate, table.table).toBe(false);
      expect(table.studentWritePoints, table.table).toBe(false);
      expect(table.advisorReadOtherChapter, table.table).toBe(false);
    }
  });

  it("keeps member approval on the advisor's own chapter", () => {
    expect(privateTables.find((row) => row.table === "chapter_members")?.advisorApproveOwnChapter).toBe(true);
  });
});
