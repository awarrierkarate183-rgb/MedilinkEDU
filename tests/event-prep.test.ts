import { describe, expect, it } from "vitest";
import { eventPrepBlueprint } from "../lib/content/event-prep";

describe("event prep blueprint", () => {
  it("fills submit and develop items from the official packet", () => {
    const items = eventPrepBlueprint("triage-protocol");
    expect(items.some((item) => item.kind === "SUBMIT")).toBe(true);
    expect(items.some((item) => item.kind === "DEVELOP")).toBe(true);
    expect(items.every((item) => item.title.length > 0 && item.title.length <= 160)).toBe(true);
  });

  it("splits the required work product into separate submit pieces", () => {
    const submit = eventPrepBlueprint("triage-protocol").filter((item) => item.kind === "SUBMIT");
    expect(submit.length).toBeGreaterThan(1);
    expect(submit.some((item) => /action board/i.test(item.title))).toBe(true);
  });
});
