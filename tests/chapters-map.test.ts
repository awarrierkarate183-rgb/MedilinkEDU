import { describe, expect, it } from "vitest";
import { chapterPin, projectState, stateCenter } from "../lib/content/us-geo";
import { publicStatusLabel } from "../lib/content/chapters";

describe("chapter map pins", () => {
  it("places North Carolina on the eastern half of the map", () => {
    const center = stateCenter("North Carolina");
    expect(center).toBeTruthy();
    const pin = projectState(center!.lat, center!.lng);
    expect(pin.x).toBeGreaterThan(200);
    expect(pin.y).toBeGreaterThan(40);
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
