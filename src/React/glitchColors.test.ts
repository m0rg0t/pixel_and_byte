import { describe, expect, it } from "vitest";
import { colorToRgb, normalizePalette } from "./glitchColors";

describe("glitch color interpolation input", () => {
  it("accepts intermediate rgb frames instead of stopping after the first transition", () => {
    expect(colorToRgb("rgb(12, 34, 56)")).toEqual({ r: 12, g: 34, b: 56 });
    expect(colorToRgb("rgb( 0, 255, 128 )")).toEqual({ r: 0, g: 255, b: 128 });
  });
  it("retains short and full hex support", () => {
    expect(colorToRgb("#abc")).toEqual({ r: 170, g: 187, b: 204 });
    expect(colorToRgb("#FFFFFF")).toEqual({ r: 255, g: 255, b: 255 });
  });
  it.each(["rgb(256, 0, 0)", "invalid", "", "#ab"])(
    "rejects unsupported color %s",
    (value) => expect(colorToRgb(value)).toBeNull(),
  );
  it("provides a usable palette for empty or invalid inputs", () => {
    expect(normalizePalette([]).length).toBeGreaterThan(0);
    expect(normalizePalette(["invalid"])).toEqual(normalizePalette([]));
    expect(normalizePalette(["invalid", "#123"])).toEqual(["#123"]);
  });
});
