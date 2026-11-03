import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useWorkspacePreferences, { getSavedWorkspacePreferences } from "../useWorkspacePreferences";

describe("getSavedWorkspacePreferences", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("returns defaults when localStorage is empty", () => {
    const prefs = getSavedWorkspacePreferences();
    expect(prefs.aiProvider).toBe("gemini");
    expect(prefs.defaultGenre).toBe("Drama");
    expect(prefs.targetLength).toBe("Medium (~600)");
    expect(prefs.autoSave).toBe(true);
  });

  it("returns stored aiProvider when set", () => {
    localStorage.setItem("pref_aiProvider", "claude");
    const prefs = getSavedWorkspacePreferences();
    expect(prefs.aiProvider).toBe("claude");
  });

  it("returns stored defaultGenre when set", () => {
    localStorage.setItem("pref_defaultGenre", "Comedy");
    const prefs = getSavedWorkspacePreferences();
    expect(prefs.defaultGenre).toBe("Comedy");
  });

  it("returns stored targetLength when set", () => {
    localStorage.setItem("pref_targetLength", "Short (~300)");
    const prefs = getSavedWorkspacePreferences();
    expect(prefs.targetLength).toBe("Short (~300)");
  });

  it("returns autoSave false when pref_autoSave is 'false'", () => {
    localStorage.setItem("pref_autoSave", "false");
    const prefs = getSavedWorkspacePreferences();
    expect(prefs.autoSave).toBe(false);
  });

  it("returns autoSave true when pref_autoSave is 'true'", () => {
    localStorage.setItem("pref_autoSave", "true");
    const prefs = getSavedWorkspacePreferences();
    expect(prefs.autoSave).toBe(true);
  });
});

describe("useWorkspacePreferences hook", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("returns preferences from getSavedWorkspacePreferences on mount", () => {
    localStorage.setItem("pref_aiProvider", "claude");
    const { result } = renderHook(() => useWorkspacePreferences());
    expect(result.current.aiProvider).toBe("claude");
  });

  it("returns default values when localStorage is empty", () => {
    const { result } = renderHook(() => useWorkspacePreferences());
    expect(result.current.aiProvider).toBe("gemini");
    expect(result.current.defaultGenre).toBe("Drama");
    expect(result.current.autoSave).toBe(true);
  });

  it("detects changes when another tab writes to localStorage", async () => {
    const { result } = renderHook(() => useWorkspacePreferences());
    expect(result.current.aiProvider).toBe("gemini");

    // Simulate storage event from another tab
    act(() => {
      localStorage.setItem("pref_aiProvider", "openai");
      window.dispatchEvent(new StorageEvent("storage", {
        key: "pref_aiProvider",
        newValue: "openai",
      }));
    });

    expect(result.current.aiProvider).toBe("openai");
  });

  it("does not trigger updates for unrelated keys", async () => {
    const { result } = renderHook(() => useWorkspacePreferences());
    act(() => {
      localStorage.setItem("some_other_key", "value");
      window.dispatchEvent(new StorageEvent("storage", {
        key: "some_other_key",
        newValue: "value",
      }));
    });
    // aiProvider should still be the default
    expect(result.current.aiProvider).toBe("gemini");
  });
});
