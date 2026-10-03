import { describe, it, expect } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach } from "vitest";
import { fireEvent } from "@testing-library/react";
import SkillsList from "./SkillsList";

afterEach(cleanup);

describe("SkillsList", () => {
  it("handles batched repeated clicks without a stale open state", () => {
    render(<SkillsList />);
    const button = screen.getByRole("button", { name: "Web Development" });
    act(() => {
      button.click();
      button.click();
    });
    expect(button).toHaveAttribute("aria-expanded", "false");
  });
  it("exposes only the expanded category to assistive technology", () => {
    render(<SkillsList />);
    const web = screen.getByRole("button", { name: "Web Development" });
    const mobile = screen.getByRole("button", { name: "Mobile Development" });
    fireEvent.click(web);
    expect(
      document.getElementById(web.getAttribute("aria-controls")!),
    ).toHaveAttribute("aria-hidden", "false");
    fireEvent.click(mobile);
    expect(web).toHaveAttribute("aria-expanded", "false");
    expect(
      document.getElementById(web.getAttribute("aria-controls")!),
    ).toHaveAttribute("aria-hidden", "true");
    expect(mobile).toHaveAttribute("aria-expanded", "true");
  });
  it("opens and closes a category", () => {
    render(<SkillsList />);
    const header = screen.getByText("Web Development");
    const details = header.parentElement!.parentElement!.parentElement!
      .nextElementSibling as HTMLElement;
    expect(details.className).toContain("max-h-0");
    fireEvent.click(header);
    expect(details.className).toContain("max-h-[500px]");
    fireEvent.click(header);
    expect(details.className).toContain("max-h-0");
  });
});
