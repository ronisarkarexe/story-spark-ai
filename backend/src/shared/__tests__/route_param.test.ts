import { routeParam } from "../route_param";

describe("routeParam", () => {
  it("returns a plain string value unchanged", () => {
    expect(routeParam("story-123")).toBe("story-123");
  });

  it("returns an empty string for undefined", () => {
    expect(routeParam(undefined)).toBe("");
  });

  it("returns the first value from a single-element array", () => {
    expect(routeParam(["story-123"])).toBe("story-123");
  });

  it("returns only the first value from a multi-element array", () => {
    expect(routeParam(["story-123", "ignored"])).toBe("story-123");
  });

  it("returns an empty string for an empty array", () => {
    expect(routeParam([])).toBe("");
  });
});
