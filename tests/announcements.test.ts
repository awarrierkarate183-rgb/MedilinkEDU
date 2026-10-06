import { describe, expect, it } from "vitest";
import { announcementVisibleTo, isOrganizationAnnouncement } from "../lib/data/announcements";

describe("organization announcements", () => {
  const org = {
    id: "1",
    title: "Season open",
    body: "Read this.",
    message: "Read this.",
    created_at: "2024-01-01T00:00:00.000Z",
    scope: "ORGANIZATION",
    audience: "ALL",
    audience_type: "all",
    status: "published",
    chapter_id: null,
  };

  it("marks administrator posts as organization-wide", () => {
    expect(isOrganizationAnnouncement(org)).toBe(true);
    expect(isOrganizationAnnouncement({ ...org, scope: "CHAPTER", chapter_id: "ch-1" })).toBe(false);
  });

  it("keeps organization posts visible to new students and advisors", () => {
    expect(announcementVisibleTo(org, "student")).toBe(true);
    expect(announcementVisibleTo(org, "advisor")).toBe(true);
    expect(announcementVisibleTo({ ...org, expires_at: "2024-02-01T00:00:00.000Z" }, "student")).toBe(true);
  });

  it("hides advisor-only chapter posts from students", () => {
    expect(
      announcementVisibleTo(
        {
          ...org,
          scope: "CHAPTER",
          chapter_id: "ch-1",
          audience: "ADVISORS",
          audience_type: "advisors",
        },
        "student",
      ),
    ).toBe(false);
  });
});
