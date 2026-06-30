/**
 * pick.test.ts
 * Unit tests for the pick utility in backend/src/shared/pick.ts
 */
import pick from "../pick";

describe("pick utility", () => {
  it("returns only the specified keys from an object", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = pick(obj, ["a", "c"] as any);
    expect(result).toEqual({ a: 1, c: 3 });
  });

  it("returns empty object when keys array is empty", () => {
    const obj = { a: 1, b: 2 };
    const result = pick(obj, [] as any);
    expect(result).toEqual({});
  });

  it("skips keys that are not present in the object", () => {
    const obj = { a: 1, b: 2 };
    const result = pick(obj, ["a", "z"] as any);
    expect(result).toEqual({ a: 1 });
  });

  it("handles null input object gracefully", () => {
    const result = pick(null as any, ["a"] as any);
    expect(result).toEqual({});
  });

  it("handles undefined input object gracefully", () => {
    const result = pick(undefined as any, ["a"] as any);
    expect(result).toEqual({});
  });

  it("returns all specified keys when all exist in the object", () => {
    const obj = { name: "Alice", age: 30, city: "NYC" };
    const result = pick(obj, ["name", "age", "city"] as any);
    expect(result).toEqual({ name: "Alice", age: 30, city: "NYC" });
  });
});
