import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { StrictMode } from "react";
import LetterGlitch from "./LetterGlitch";

const props = {
  glitchColors: ["#000000"],
  glitchSpeed: 50,
  centerVignette: false,
  outerVignette: false,
  smooth: true,
};
let frames: Map<number, FrameRequestCallback>;
let id: number;
let context: {
  setTransform: ReturnType<typeof vi.fn>;
  clearRect: ReturnType<typeof vi.fn>;
  fillText: ReturnType<typeof vi.fn>;
  fillStyle: string;
};
beforeEach(() => {
  frames = new Map();
  id = 0;
  context = {
    setTransform: vi.fn(),
    clearRect: vi.fn(),
    fillText: vi.fn(),
    fillStyle: "",
  };
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn((callback: FrameRequestCallback) => {
      frames.set(++id, callback);
      return id;
    }),
  );
  vi.stubGlobal(
    "cancelAnimationFrame",
    vi.fn((key: number) => frames.delete(key)),
  );
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    context as unknown as CanvasRenderingContext2D,
  );
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    width: 100,
    height: 80,
    x: 0,
    y: 0,
    top: 0,
    bottom: 80,
    left: 0,
    right: 100,
    toJSON() {},
  });
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("LetterGlitch lifecycle", () => {
  it("renders canvas without scheduling useless work when drawing is unavailable", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    const { container } = render(<LetterGlitch {...props} />);
    expect(container.querySelector("canvas")).not.toBeNull();
    expect(requestAnimationFrame).not.toHaveBeenCalled();
  });
  it("keeps a single animation loop through StrictMode and cancels it on unmount", () => {
    const { unmount } = render(
      <StrictMode>
        <LetterGlitch {...props} />
      </StrictMode>,
    );
    expect(frames.size).toBe(1);
    unmount();
    expect(frames.size).toBe(0);
  });
  it("does not resurrect the animation from a pending resize after unmount", () => {
    vi.useFakeTimers();
    const { unmount } = render(<LetterGlitch {...props} />);
    act(() => window.dispatchEvent(new Event("resize")));
    unmount();
    act(() => vi.advanceTimersByTime(200));
    expect(frames.size).toBe(0);
  });
  it("uses changed palette props and handles an empty palette", () => {
    const { rerender } = render(<LetterGlitch {...props} />);
    expect(context.fillStyle).toBe("#000000");
    rerender(<LetterGlitch {...props} glitchColors={["#ffffff"]} />);
    expect(context.fillStyle).toBe("#ffffff");
    rerender(<LetterGlitch {...props} glitchColors={[]} />);
    expect(context.fillStyle).toBeTruthy();
    expect(frames.size).toBe(1);
  });
});
