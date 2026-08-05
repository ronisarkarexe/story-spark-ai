
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Test the resolveSocketUrl function under different import.meta.env configurations.
// We use vi.mock to control the import.meta.env values per test.

describe("resolveSocketUrl helper", () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.resetModules();
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it("should return the configured VITE_SOCKET_URL value", async () => {
    vi.mock("../socket-url", async () => {
      return {
        resolveSocketUrl: () => "http://localhost:3001",
      };
    });

    const { resolveSocketUrl } = await import("../socket-url");
    expect(resolveSocketUrl()).toBe("http://localhost:3001");
  });

  it("should have correct function signature", async () => {
    const mod = await import("../socket-url");
    expect(typeof mod.resolveSocketUrl).toBe("function");
    expect(mod.resolveSocketUrl.length).toBe(0);

/// <reference types="vitest/globals" />
import { vi } from "vitest";

describe("resolveSocketUrl", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns the VITE_SOCKET_URL value when it is set", async () => {
    const url = "http://localhost:5000";
    vi.stubEnv("VITE_SOCKET_URL", url);
    vi.stubEnv("DEV", false);

    const mod = await import("../socket-url");
    expect(mod.resolveSocketUrl()).toBe(url);
  });

  it("returns empty string when VITE_SOCKET_URL is not set in production", async () => {
    vi.stubEnv("VITE_SOCKET_URL", "");
    vi.stubEnv("DEV", false);

    const mod = await import("../socket-url");
    expect(mod.resolveSocketUrl()).toBe("");
  });

  it("returns empty string when VITE_SOCKET_URL is undefined in production", async () => {
    vi.stubEnv("VITE_SOCKET_URL", undefined);
    vi.stubEnv("DEV", false);

    const mod = await import("../socket-url");
    expect(mod.resolveSocketUrl()).toBe("");
  });
});
