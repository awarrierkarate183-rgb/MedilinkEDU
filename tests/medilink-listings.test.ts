import { describe, expect, it } from "vitest";
import { listingVisibleTo } from "../lib/data/medilink-listings";

const org = {
  scope: "ORGANIZATION" as const,
  chapter_id: null,
  status: "published",
};

const chapter = {
  scope: "CHAPTER" as const,
  chapter_id: "ch-1",
  status: "published",
};

describe("MediLink listing visibility", () => {
  it("shows administrator listings to every chapter and the public board", () => {
    expect(listingVisibleTo(org, { viewer: "public" })).toBe(true);
    expect(listingVisibleTo(org, { viewer: "student", chapterId: "ch-1" })).toBe(true);
    expect(listingVisibleTo(org, { viewer: "advisor", chapterId: "ch-2" })).toBe(true);
  });

  it("keeps advisor listings inside that chapter", () => {
    expect(listingVisibleTo(chapter, { viewer: "public" })).toBe(false);
    expect(listingVisibleTo(chapter, { viewer: "student", chapterId: "ch-1" })).toBe(true);
    expect(listingVisibleTo(chapter, { viewer: "advisor", chapterId: "ch-1" })).toBe(true);
    expect(listingVisibleTo(chapter, { viewer: "student", chapterId: "ch-2" })).toBe(false);
    expect(listingVisibleTo(chapter, { viewer: "advisor", chapterId: "ch-2" })).toBe(false);
  });

  it("hides unpublished listings", () => {
    expect(listingVisibleTo({ ...org, status: "unpublished" }, { viewer: "student", chapterId: "ch-1" })).toBe(false);
  });
});
