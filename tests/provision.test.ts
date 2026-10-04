import { describe, expect, it } from "vitest";
import { generatePortalPassword, generatePublicCode, slugFromName } from "../lib/auth/passwords";
import { addStudentSchema, startChapterSchema } from "../lib/api/schemas";
import { studentInviteMessage } from "../lib/email/student-invite";

describe("chapter automation helpers", () => {
  it("creates a password that can be shown once", () => {
    const password = generatePortalPassword();
    expect(password.length).toBeGreaterThanOrEqual(12);
    expect(password).toMatch(/[A-Z]/);
    expect(password).toMatch(/[0-9]/);
  });

  it("builds unique looking chapter codes", () => {
    expect(generatePublicCode("ML")).toMatch(/^ML-[A-F0-9]{6}$/);
    expect(slugFromName("East High School")).toBe("east-high-school");
  });

  it("accepts a complete high school application", () => {
    const parsed = startChapterSchema.safeParse({
      schoolName: "Lincoln High School",
      city: "Charlotte",
      state: "North Carolina",
      advisorFirstName: "Ada",
      advisorLastName: "Advisor",
      advisorEmail: "ada.advisor@example.com",
      advisorPhone: "7045550100",
      advisorTitle: "Teacher",
      principalName: "Pat Principal",
      estimatedStudents: 18,
      statement: "Students asked for a healthcare problem-solving chapter.",
      password: "ChapterPass12",
      confirmPassword: "ChapterPass12",
      highSchool: "yes",
      website: "",
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects mismatched portal passwords", () => {
    const parsed = startChapterSchema.safeParse({
      schoolName: "Lincoln High School",
      city: "Charlotte",
      state: "North Carolina",
      advisorFirstName: "Ada",
      advisorLastName: "Advisor",
      advisorEmail: "ada.advisor@example.com",
      password: "ChapterPass12",
      confirmPassword: "DifferentPass12",
      highSchool: "yes",
    });
    expect(parsed.success).toBe(false);
  });

  it("builds a student invite email with a create-account button", () => {
    const message = studentInviteMessage({
      firstName: "Sam",
      inviteUrl: "https://medilink-edu.vercel.app/portal/invite/abc",
      expiresAt: "2026-10-16T00:00:00.000Z",
    });
    expect(message.subject).toContain("student account");
    expect(message.text).toContain("https://medilink-edu.vercel.app/portal/invite/abc");
    expect(message.html).toContain("Create your student account");
  });

  it("requires a student name, email, and grade to invite", () => {
    const parsed = addStudentSchema.safeParse({
      firstName: "Sam",
      lastName: "Student",
      email: "sam.student@example.com",
      grade: "10",
    });
    expect(parsed.success).toBe(true);
    expect(
      addStudentSchema.safeParse({
        firstName: "Sam",
        lastName: "Student",
        email: "sam.student@example.com",
      }).success,
    ).toBe(false);
  });

  it("rejects a missing high school confirmation", () => {
    const parsed = startChapterSchema.safeParse({
      schoolName: "Lincoln High School",
      city: "Charlotte",
      state: "North Carolina",
      advisorFirstName: "Ada",
      advisorLastName: "Advisor",
      advisorEmail: "ada.advisor@example.com",
      highSchool: "no",
    });
    expect(parsed.success).toBe(false);
  });
});
