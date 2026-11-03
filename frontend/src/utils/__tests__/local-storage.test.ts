/**
 * @jest-environment jsdom
 */
import {
  setToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
} from "../local-storage";

const LOCAL_STORAGE_MOCK = {
  store: {} as Record<string, string>,
  setItem: jest.fn((key: string, value: string) => {
    LOCAL_STORAGE_MOCK.store[key] = value;
  }),
  getItem: jest.fn((key: string) => LOCAL_STORAGE_MOCK.store[key] ?? null),
  removeItem: jest.fn((key: string) => {
    delete LOCAL_STORAGE_MOCK.store[key];
  }),
};

beforeEach(() => {
  jest.clearAllMocks();
  LOCAL_STORAGE_MOCK.store = {};
  Object.defineProperty(globalThis, "localStorage", {
    value: LOCAL_STORAGE_MOCK,
    writable: true,
  });
});

describe("setToLocalStorage", () => {
  it("returns empty string when key is falsy", () => {
    const result = setToLocalStorage("", "value");
    expect(result).toBe("");
    expect(LOCAL_STORAGE_MOCK.setItem).not.toHaveBeenCalled();
  });

  it("returns empty string when window is undefined (SSR)", () => {
    const originalWindow = (globalThis as any).window;
    delete (globalThis as any).window;
    const result = setToLocalStorage("key", "value");
    expect(result).toBe("");
    (globalThis as any).window = originalWindow;
  });

  it("calls localStorage.setItem and returns its result when window is defined", () => {
    const result = setToLocalStorage("theme", "dark");
    expect(LOCAL_STORAGE_MOCK.setItem).toHaveBeenCalledWith("theme", "dark");
    expect(LOCAL_STORAGE_MOCK.store["theme"]).toBe("dark");
  });
});

describe("getFromLocalStorage", () => {
  it("returns empty string when key is falsy", () => {
    const result = getFromLocalStorage("");
    expect(result).toBe("");
    expect(LOCAL_STORAGE_MOCK.getItem).not.toHaveBeenCalled();
  });

  it("returns empty string when window is undefined (SSR)", () => {
    const originalWindow = (globalThis as any).window;
    delete (globalThis as any).window;
    const result = getFromLocalStorage("token");
    expect(result).toBe("");
    (globalThis as any).window = originalWindow;
  });

  it("returns the stored value when key exists", () => {
    LOCAL_STORAGE_MOCK.store["token"] = "abc123";
    const result = getFromLocalStorage("token");
    expect(LOCAL_STORAGE_MOCK.getItem).toHaveBeenCalledWith("token");
    expect(result).toBe("abc123");
  });

  it("returns null converted to empty string when key does not exist", () => {
    const result = getFromLocalStorage("nonexistent");
    expect(result).toBe("");
  });
});

describe("removeFromLocalStorage", () => {
  it("returns empty string when key is falsy", () => {
    const result = removeFromLocalStorage("");
    expect(result).toBe("");
    expect(LOCAL_STORAGE_MOCK.removeItem).not.toHaveBeenCalled();
  });

  it("returns empty string when window is undefined (SSR)", () => {
    const originalWindow = (globalThis as any).window;
    delete (globalThis as any).window;
    const result = removeFromLocalStorage("key");
    expect(result).toBe("");
    (globalThis as any).window = originalWindow;
  });

  it("calls localStorage.removeItem when window is defined", () => {
    LOCAL_STORAGE_MOCK.store["draft"] = "some content";
    const result = removeFromLocalStorage("draft");
    expect(LOCAL_STORAGE_MOCK.removeItem).toHaveBeenCalledWith("draft");
    expect(LOCAL_STORAGE_MOCK.store).not.toHaveProperty("draft");
  });
});
