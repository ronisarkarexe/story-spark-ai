/// <reference types="vitest/globals" />
import { vi } from "vitest";

describe("config helpers", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("API_V1 is constructed from API_BASE and /api/v1 suffix", async () => {
    vi.stubEnv("VITE_BASE_URL", "http://localhost:5000");
    const { API_V1 } = await import("../config");
    expect(API_V1).toBe("http://localhost:5000/api/v1");
  });

  it("API_BASE strips trailing slash from VITE_BASE_URL", async () => {
    vi.stubEnv("VITE_BASE_URL", "http://localhost:5000/");
    const { API_BASE } = await import("../config");
    expect(API_BASE).toBe("http://localhost:5000");
  });

  it("getBaseUrl returns the API_BASE value", async () => {
    vi.stubEnv("VITE_BASE_URL", "http://localhost:5000/");
    const { getBaseUrl } = await import("../config");
    expect(getBaseUrl()).toBe("http://localhost:5000");
  });

  it("getBaseUrl returns empty string when VITE_BASE_URL is empty", async () => {
    vi.stubEnv("VITE_BASE_URL", "");
    const { getBaseUrl } = await import("../config");
    expect(getBaseUrl()).toBe("");
  });

  it("API_V1 is empty string when VITE_BASE_URL is empty", async () => {
    vi.stubEnv("VITE_BASE_URL", "");
    const { API_V1 } = await import("../config");
    expect(API_V1).toBe("/api/v1");
  });
});
