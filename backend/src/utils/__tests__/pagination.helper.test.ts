import paginationHelper from "../pagination_helper";

describe("paginationHelper", () => {
  it("returns default values when no options are provided", () => {
    expect(paginationHelper({})).toEqual({
      page: 1,
      limit: 10,
      skip: 0,
      cursor: undefined,
      sortBy: "createdAt",
      orderBy: "desc",
    });
  });

  it("accepts a custom page and limit", () => {
    expect(paginationHelper({ page: 3, limit: 20 })).toEqual({
      page: 3,
      limit: 20,
      skip: 40,
      cursor: undefined,
      sortBy: "createdAt",
      orderBy: "desc",
    });
  });

  it("uses page one when page is zero", () => {
    expect(paginationHelper({ page: 0 }).page).toBe(1);
  });

  it("accepts custom sorting options", () => {
    const result = paginationHelper({ sortBy: "title", sortOrder: "asc" });
    expect(result.sortBy).toBe("title");
    expect(result.orderBy).toBe("asc");
  });

  it("accepts orderBy as an alias", () => {
    expect(paginationHelper({ orderBy: "asc" }).orderBy).toBe("asc");
  });

  it("prefers sortOrder when both aliases are present", () => {
    expect(
      paginationHelper({ sortOrder: "asc", orderBy: "desc" }).orderBy
    ).toBe("asc");
  });

  it("preserves a string cursor", () => {
    expect(paginationHelper({ cursor: "abc123" }).cursor).toBe("abc123");
  });
});
