import pick from "../pick";

describe("pick", () => {
  it("returns only the specified keys from an object", () => {
    const obj = { name: "Riko", age: 18, role: "student" };
    expect(pick(obj, ["name", "role"])).toEqual({
      name: "Riko",
      role: "student",
    });
  });

  it("returns an empty object when the keys array is empty", () => {
    expect(pick({ name: "Riko", age: 18 }, [])).toEqual({});
  });

  it("skips keys that are absent from the object", () => {
    const obj = { name: "Riko" } as { name: string; age?: number };
    expect(pick(obj, ["name", "age"])).toEqual({ name: "Riko" });
  });

  it("handles null and undefined input at runtime", () => {
    // @ts-expect-error exercising the runtime guard
    expect(pick(null, ["name"])).toEqual({});
    // @ts-expect-error exercising the runtime guard
    expect(pick(undefined, ["name"])).toEqual({});
  });

  it("skips an undefined key at runtime", () => {
    const obj = { name: "Riko", age: 18 };
    // @ts-expect-error exercising malformed runtime input
    expect(pick(obj, ["name", undefined])).toEqual({ name: "Riko" });
  });
});
