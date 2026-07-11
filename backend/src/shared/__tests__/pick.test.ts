/**
 * pick.test.ts
 * Unit tests for the pick shared utility.
 */
import pick from "../pick";

describe("pick", () => {
  it("returns only the specified keys from an object", () => {
    const obj = { name: "Riko", age: 18, role: "student" };
    const result = pick(obj, ["name", "role"]);
    expect(result).toEqual({ name: "Riko", role: "student" });
  });

  it("returns empty object when keys array is empty", () => {
    const obj = { name: "Riko", age: 18 };
    const result = pick(obj, []);
    expect(result).toEqual({});
  });

  it("handles missing keys gracefully (skips them)", () => {
    const obj = { name: "Riko" } as { name: string; age?: number };
    const result = pick(obj, ["name", "age"]);
    expect(result).toEqual({ name: "Riko" });
  });

  it("handles null/undefined input object", () => {
    // @ts-expect-error intentionally passing null to test runtime guard
    expect(pick(null, ["name"])).toEqual({});
    // @ts-expect-error intentionally passing undefined to test runtime guard
    expect(pick(undefined, ["name"])).toEqual({});
  });

  it("handles undefined individual keys in the keys array", () => {
    const obj = { name: "Riko", age: 18 };
    // @ts-expect-error intentionally including an undefined key
    const result = pick(obj, ["name", undefined]);
    expect(result).toEqual({ name: "Riko" });
  });
});
