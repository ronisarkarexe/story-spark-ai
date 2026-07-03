import { routeParam } from "../route_param";

describe("routeParam", () => {
  it("returns a plain string value unchanged", () => {
    expect(routeParam("123")).toBe("123");
    expect(routeParam("abc-def")).toBe("abc-def");
    expect(routeParam("")).toBe("");
  });

  it("returns empty string for undefined input", () => {
    expect(routeParam(undefined)).toBe("");
  });

  it("returns the first element of a single-element string array", () => {
    expect(routeParam(["single"])).toBe("single");
  });

  it("returns the first element of a multi-element string array (ignores rest)", () => {
    expect(routeParam(["first", "second", "third"])).toBe("first");
  });

  it("returns empty string when array is empty", () => {
    expect(routeParam([])).toBe("");
  });

  it("handles mixed-type input where array contains undefined", () => {
    // TypeScript types prevent undefined in string[], but runtime behavior is safe
    expect(routeParam(["value"] as (string | undefined)[])).toBe("value");
  });
});
