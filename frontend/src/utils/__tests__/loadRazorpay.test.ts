/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { loadRazorpayScript } from "../loadRazorpay";

// Store original window to restore after SSR test
const originalWindow = globalThis.window;

describe("loadRazorpayScript", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Ensure the razorpay script is not already in the DOM
    const existing = document.getElementById("razorpay-script");
    if (existing) existing.remove();
  });

  afterEach(() => {
    // Restore window if it was mocked away
    if (!("window" in globalThis)) {
      Object.defineProperty(globalThis, "window", {
        value: originalWindow,
        writable: true,
      });
    }
    const existing = document.getElementById("razorpay-script");
    if (existing) existing.remove();
  });

  it("returns false immediately when window is undefined (SSR)", async () => {
    // Temporarily remove window to simulate SSR
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fakeWindow = undefined as any;
    Object.defineProperty(globalThis, "window", {
      value: fakeWindow,
      writable: true,
      configurable: true,
    });
    try {
      const result = await loadRazorpayScript();
      expect(result).toBe(false);
    } finally {
      Object.defineProperty(globalThis, "window", {
        value: originalWindow,
        writable: true,
        configurable: true,
      });
    }
  });

  it("returns true if razorpay-script element already exists", async () => {
    const mockScript = document.createElement("script");
    mockScript.id = "razorpay-script";
    document.head.appendChild(mockScript);

    const result = await loadRazorpayScript();
    expect(result).toBe(true);

    mockScript.remove();
  });

  it("resolves true after appending a new script element", async () => {
    const appendSpy = vi.spyOn(document.body, "appendChild");

    const promise = loadRazorpayScript();

    // The script element should have been created and appended
    expect(appendSpy).toHaveBeenCalled();
    const appendedScript = appendSpy.mock.calls[0][0] as HTMLScriptElement;
    expect(appendedScript.id).toBe("razorpay-script");
    expect(appendedScript.src).toBe("https://checkout.razorpay.com/v1/checkout.js");

    // Trigger onload to resolve the promise
    appendedScript.onload?.({} as Event);

    const result = await promise;
    expect(result).toBe(true);
  });

  it("resolves false when script loading fails", async () => {
    const appendSpy = vi.spyOn(document.body, "appendChild");

    const promise = loadRazorpayScript();

    const appendedScript = appendSpy.mock.calls[0][0] as HTMLScriptElement;
    appendedScript.onerror?.({} as Event);

    const result = await promise;
    expect(result).toBe(false);
  });
});
