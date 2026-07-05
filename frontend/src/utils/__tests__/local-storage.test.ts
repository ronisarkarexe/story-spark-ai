import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  setToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
} from "../local-storage";

const TEST_KEY = "test_storage_key";

describe("local-storage utility", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("setToLocalStorage", () => {
    it("stores a value in localStorage", () => {
      const result = setToLocalStorage(TEST_KEY, "hello world");
      expect(localStorage.getItem(TEST_KEY)).toBe("hello world");
    });

    it("returns the value on success (localStorage.setItem return)", () => {
      // setItem returns void but the function returns localStorage.setItem(...)
      // The implementation returns the result of localStorage.setItem (void)
      // So we just verify the value was set
      setToLocalStorage(TEST_KEY, "test value");
      expect(getFromLocalStorage(TEST_KEY)).toBe("test value");
    });

    it("returns empty string when key is falsy", () => {
      const result = setToLocalStorage("", "value");
      expect(result).toBe("");
    });

    it("returns empty string when key is null-like", () => {
      const result = setToLocalStorage(null as unknown as string, "value");
      expect(result).toBe("");
    });
  });

  describe("getFromLocalStorage", () => {
    it("returns stored value", () => {
      localStorage.setItem(TEST_KEY, "stored value");
      expect(getFromLocalStorage(TEST_KEY)).toBe("stored value");
    });

    it("returns empty string when key does not exist", () => {
      expect(getFromLocalStorage("nonexistent_key")).toBe("");
    });

    it("returns empty string when key is falsy", () => {
      expect(getFromLocalStorage("")).toBe("");
    });
  });

  describe("removeFromLocalStorage", () => {
    it("removes the key from localStorage", () => {
      localStorage.setItem(TEST_KEY, "to be removed");
      removeFromLocalStorage(TEST_KEY);
      expect(localStorage.getItem(TEST_KEY)).toBeNull();
    });

    it("does not throw when removing a non-existent key", () => {
      expect(() => removeFromLocalStorage("nonexistent")).not.toThrow();
    });

    it("returns empty string when key is falsy", () => {
      const result = removeFromLocalStorage("");
      expect(result).toBe("");
    });
  });

  it("round-trip: set then get returns the same value", () => {
    setToLocalStorage(TEST_KEY, "round trip value");
    expect(getFromLocalStorage(TEST_KEY)).toBe("round trip value");
  });
});
