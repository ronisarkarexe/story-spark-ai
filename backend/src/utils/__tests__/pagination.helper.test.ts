import paginationHelper from "../../utils/pagination_helper";

describe("paginationHelper", () => {
  it("returns correct pagination for default values", () => {
    const result = paginationHelper({});
    expect(result).toEqual({
      page: 1,
      limit: 10,
      skip: 0,
      sortBy: "createdAt",
      orderBy: "desc",
    });
  });

  it("returns correct pagination for custom page and limit", () => {
    const result = paginationHelper({ page: 3, limit: 20 });
    expect(result).toEqual({
      page: 3,
      limit: 20,
      skip: 40,
      sortBy: "createdAt",
      orderBy: "desc",
    });
  });

  it("returns skip of 0 when page is 1", () => {
    const result = paginationHelper({ page: 1, limit: 25 });
    expect(result.skip).toBe(0);
  });

  it("respects custom sortBy field", () => {
    const result = paginationHelper({ sortBy: "updatedAt" });
    expect(result.sortBy).toBe("updatedAt");
  });

  it("respects custom sortOrder", () => {
    const result = paginationHelper({ sortOrder: "asc" as const });
    expect(result.orderBy).toBe("asc");
  });

  it("accepts orderBy as alias for sortOrder", () => {
    const result = paginationHelper({ orderBy: "asc" as const });
    expect(result.orderBy).toBe("asc");
  });

  it("sortOrder takes precedence over orderBy when both are set", () => {
    const result = paginationHelper({
      orderBy: "asc" as const,
      sortOrder: "desc" as const,
    });
    expect(result.orderBy).toBe("desc");
  });

  it("calculates skip correctly for page 2 with limit 10", () => {
    const result = paginationHelper({ page: 2, limit: 10 });
    expect(result.skip).toBe(10);
  });

  it("handles cursor option", () => {
    const result = paginationHelper({ cursor: "abc123" });
    expect(result.cursor).toBe("abc123");
  });
});
