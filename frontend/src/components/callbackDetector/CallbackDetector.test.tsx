/**
 * @vitest-environment jsdom
 */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import CallbackDetector from "./CallbackDetector";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("CallbackDetector", () => {
  it("renders callback findings", () => {
    render(<CallbackDetector />);

    expect(screen.getByRole("heading", { name: "AI Story Callback Detector" })).toBeTruthy();
    expect(screen.getByText("Silver Necklace")).toBeTruthy();
    expect(screen.getByText("Old Letter")).toBeTruthy();
  });

  it("shows completion feedback when reanalysis is requested", () => {
    const alert = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<CallbackDetector />);
    fireEvent.click(screen.getByRole("button", { name: "Reanalyze" }));

    expect(alert).toHaveBeenCalledOnce();
    expect(alert).toHaveBeenCalledWith("Callback analysis completed.");
  });
});
