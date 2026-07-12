/**
 * @jest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import useWorkspacePreferences, { getSavedWorkspacePreferences } from "../useWorkspacePreferences";

const LOCAL_STORAGE_MOCK = {
  store: {} as Record<string, string>,
  setItem: vi.fn((key: string, value: string) => {
    LOCAL_STORAGE_MOCK.store[key] = value;
  }),
  getItem: vi.fn((key: string) => LOCAL_STORAGE_MOCK.store[key] ?? null),
  removeItem: vi.fn((key: string) => {
    delete LOCAL_STORAGE_MOCK.store[key];
  }),
  clear: vi.fn(() => {
    LOCAL_STORAGE_MOCK.store = {};
  }),
};

beforeEach(() => {
  vi.clearAllMocks();
  LOCAL_STORAGE_MOCK.store = {};
  Object.defineProperty(globalThis, "localStorage", {
    value: LOCAL_STORAGE_MOCK,
    writable: true,
  });
});

describe("getSavedWorkspacePreferences", () => {
  it("returns correct defaults when no preferences are stored", () => {
    const prefs = getSavedWorkspacePreferences();
    expect(prefs.aiProvider).toBe("gemini");
    expect(prefs.defaultGenre).toBe("\uD83C\uDFAD Drama");
    expect(prefs.targetLength).toBe("Medium (~600)");
    expect(prefs.autoSave).toBe(true);
  });

  it("returns stored aiProvider when set", () => {
    LOCAL_STORAGE_MOCK.store["pref_aiProvider"] = "claude";
    const prefs = getSavedWorkspacePreferences();
    expect(prefs.aiProvider).toBe("claude");
  });

  it("returns stored defaultGenre when set", () => {
    LOCAL_STORAGE_MOCK.store["pref_defaultGenre"] = "Sci-Fi";
    const prefs = getSavedWorkspacePreferences();
    expect(prefs.defaultGenre).toBe("Sci-Fi");
  });

  it("returns stored targetLength when set", () => {
    LOCAL_STORAGE_MOCK.store["pref_targetLength"] = "Short (~300)";
    const prefs = getSavedWorkspacePreferences();
    expect(prefs.targetLength).toBe("Short (~300)");
  });

  it("returns autoSave false when pref_autoSave is explicitly false", () => {
    LOCAL_STORAGE_MOCK.store["pref_autoSave"] = "false";
    const prefs = getSavedWorkspacePreferences();
    expect(prefs.autoSave).toBe(false);
  });

  it("returns autoSave true when pref_autoSave is any other value", () => {
    LOCAL_STORAGE_MOCK.store["pref_autoSave"] = "true";
    const prefs = getSavedWorkspacePreferences();
    expect(prefs.autoSave).toBe(true);
  });
});

describe("useWorkspacePreferences", () => {
  it("initializes with current localStorage preferences", () => {
    LOCAL_STORAGE_MOCK.store["pref_aiProvider"] = "claude";
    LOCAL_STORAGE_MOCK.store["pref_defaultGenre"] = "Horror";
    LOCAL_STORAGE_MOCK.store["pref_targetLength"] = "Long (~1200)";
    LOCAL_STORAGE_MOCK.store["pref_autoSave"] = "false";

    const { result } = renderHook(() => useWorkspacePreferences());
    expect(result.current.aiProvider).toBe("claude");
    expect(result.current.defaultGenre).toBe("Horror");
    expect(result.current.targetLength).toBe("Long (~1200)");
    expect(result.current.autoSave).toBe(false);
  });

  it("initializes with defaults when no localStorage values are set", () => {
    const { result } = renderHook(() => useWorkspacePreferences());
    expect(result.current.aiProvider).toBe("gemini");
    expect(result.current.defaultGenre).toBe("\uD83C\uDFAD Drama");
    expect(result.current.targetLength).toBe("Medium (~600)");
    expect(result.current.autoSave).toBe(true);
  });
});
