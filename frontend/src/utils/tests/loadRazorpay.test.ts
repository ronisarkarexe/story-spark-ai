import { describe, it, expect, vi, beforeEach } from "vitest";
import { loadRazorpayScript } from "../loadRazorpay";

describe("loadRazorpayScript", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Clean up any previously injected scripts
    const existing = document.getElementById("razorpay-script");
    if (existing) {
      existing.remove();
    }
    vi.clearAllMocks();
  });

  it("returns false immediately when window is undefined (SSR)", async () => {
    const result = await loadRazorpayScript();
    expect(result).toBe(false);
  });

  it("returns true if razorpay-script already exists in DOM", async () => {
    const script = document.createElement("script");
    script.id = "razorpay-script";
    document.body.appendChild(script);

    const result = await loadRazorpayScript();
    expect(result).toBe(true);
  });

  it("resolves true when script loads successfully", async () => {
    const loadPromise = loadRazorpayScript();

    // Advance timers to let the promise settle
    await vi.advanceTimersByTimeAsync(0);

    // Trigger the onload handler
    const script = document.getElementById("razorpay-script") as HTMLScriptElement;
    expect(script).not.toBeNull();
    script.onload?.({} as Event);

    const result = await loadPromise;
    expect(result).toBe(true);
  });

  it("resolves false when script errors", async () => {
    const loadPromise = loadRazorpayScript();

    await vi.advanceTimersByTimeAsync(0);

    const script = document.getElementById("razorpay-script") as HTMLScriptElement;
    expect(script).not.toBeNull();
    script.onerror?.({} as Event);

    const result = await loadPromise;
    expect(result).toBe(false);
  });

  it("sets the correct script src attribute", async () => {
    loadRazorpayScript();
    await vi.advanceTimersByTimeAsync(0);

    const script = document.getElementById("razorpay-script") as HTMLScriptElement;
    expect(script.src).toBe("https://checkout.razorpay.com/v1/checkout.js");
  });

  it("appends script to document body", async () => {
    loadRazorpayScript();
    await vi.advanceTimersByTimeAsync(0);

    const script = document.getElementById("razorpay-script");
    expect(document.body.contains(script)).toBe(true);
  });
});
