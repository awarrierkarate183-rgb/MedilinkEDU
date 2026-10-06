import { describe, expect, it } from "vitest";
import { MAP_WIDTH, STATE_SHAPES, chapterPin } from "../lib/content/us-geo";
import { publicStatusLabel } from "../lib/content/chapters";

describe("chapter map pins", () => {
  it("places North Carolina on the eastern half of the map", () => {
    const pin = chapterPin("North Carolina", 0, 1);
    expect(pin).toBeTruthy();
    expect(STATE_SHAPES["North Carolina"]?.abbr).toBe("NC");
    expect(pin!.x).toBeGreaterThan(MAP_WIDTH * 0.55);
    expect(pin!.y).toBeGreaterThan(80);
  });

  it("offsets two schools in the same state", () => {
    const first = chapterPin("North Carolina", 0, 2);
    const second = chapterPin("North Carolina", 1, 2);
    expect(first && second).toBeTruthy();
    expect(first).not.toEqual(second);
  });

  it("labels public chapter statuses for the map filter", () => {
    expect(publicStatusLabel("FOUNDING")).toBe("Founding");
    expect(publicStatusLabel("FLAGSHIP_ELIGIBLE")).toBe("Flagship-Eligible");
  });
});
