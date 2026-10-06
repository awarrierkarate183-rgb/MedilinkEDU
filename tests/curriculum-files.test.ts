import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { attachedCurriculumFiles, tracks } from "../lib/content/curriculum";

describe("starting curriculum files", () => {
  it("attaches the Module 1.1 slideshow and Task 1 overview", () => {
    const module = tracks[0]?.modules[0];
    expect(module?.code).toBe("1.1");
    expect(attachedCurriculumFiles().map((file) => file.href)).toEqual([
      "/docs/curriculum/module-1.1.pdf",
      "/docs/curriculum/task-1-overview.pdf",
    ]);
    for (const file of module?.files || []) {
      expect(existsSync(`public${file.href}`)).toBe(true);
    }
  });
});
