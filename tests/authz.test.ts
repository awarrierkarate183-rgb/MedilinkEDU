import { describe, expect, it } from "vitest";
import {
  canAccessAdminPortal,
  canApproveMembers,
  canManageChapter,
  canReadProfile,
  homeForRole,
} from "../lib/auth/roles";

const student = { id: "s1", role: "STUDENT" as const, chapterId: "c1" };
const other = { id: "s2", role: "STUDENT" as const, chapterId: "c1" };
const advisor = { id: "a1", role: "CHAPTER_ADVISOR" as const, chapterId: "c1" };
const otherAdvisor = { id: "a2", role: "CHAPTER_ADVISOR" as const, chapterId: "c2" };
const admin = { id: "x1", role: "SUPER_ADMIN" as const, chapterId: null };

describe("authorization helpers", () => {
  it("sends roles to the correct portal", () => {
    expect(homeForRole("STUDENT")).toBe("/portal/student");
    expect(homeForRole("CHAPTER_ADVISOR")).toBe("/portal/advisor");
    expect(homeForRole("SUPER_ADMIN")).toBe("/portal/admin");
    expect(homeForRole("STATE_ADMIN")).toBe("/portal/admin");
    expect(
      homeForRole("CHAPTER_ADVISOR", { status: "PENDING", advisor_status: "PENDING" }),
    ).toBe("/portal/pending");
  });

  it("lets a student read only their own profile", () => {
    expect(canReadProfile(student, { id: "s1", chapterId: "c1" })).toBe(true);
    expect(canReadProfile(student, { id: "s2", chapterId: "c1" })).toBe(false);
  });

  it("lets an advisor read chapter members but not another chapter", () => {
    expect(canReadProfile(advisor, other)).toBe(true);
    expect(canReadProfile(otherAdvisor, other)).toBe(false);
    expect(canManageChapter(advisor, { id: "c1" })).toBe(true);
    expect(canManageChapter(advisor, { id: "c2" })).toBe(false);
  });

  it("does not let students approve members or open admin", () => {
    expect(canApproveMembers(student)).toBe(false);
    expect(canApproveMembers(advisor)).toBe(true);
    expect(canAccessAdminPortal("STUDENT")).toBe(false);
    expect(canAccessAdminPortal("SUPER_ADMIN")).toBe(true);
    expect(canManageChapter(admin, { id: "c9" })).toBe(true);
  });
});
