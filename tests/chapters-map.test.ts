import { describe, expect, it } from "vitest";
import { chapterLocation, chapterPin, STATE_SHAPES, MAP_WIDTH } from "../lib/content/us-geo";
import { publicStatusLabel } from "../lib/content/chapters";

describe("chapter map pins", () => {
  it("places North Carolina on the eastern half of the country", () => {
    const pin = chapterLocation(null, "North Carolina");
    expect(pin).toBeTruthy();
    expect(pin!.lng).toBeGreaterThan(-85);
    expect(pin!.lat).toBeGreaterThan(33);
    expect(pin!.lat).toBeLessThan(37);
  });

  it("uses the recorded city when one is known", () => {
    const pin = chapterLocation("Huntersville", "North Carolina");
    expect(pin).toEqual({ lat: 35.4107, lng: -80.8429 });
  });

  it("offsets two schools in the same city", () => {
    const first = chapterLocation("Huntersville", "North Carolina", 0, 2);
    const second = chapterLocation("Huntersville", "North Carolina", 1, 2);
    expect(first && second).toBeTruthy();
    expect(first).not.toEqual(second);
  });

  it("still places a fallback pin on the drawn state map", () => {
    const pin = chapterPin("North Carolina", 0, 1);
    expect(pin).toBeTruthy();
    expect(STATE_SHAPES["North Carolina"]?.abbr).toBe("NC");
    expect(pin!.x).toBeGreaterThan(MAP_WIDTH * 0.55);
  });

  it("labels public chapter statuses for the map filter", () => {
    expect(publicStatusLabel("FOUNDING")).toBe("Founding");
    expect(publicStatusLabel("FLAGSHIP_ELIGIBLE")).toBe("Flagship-Eligible");
  });
});
