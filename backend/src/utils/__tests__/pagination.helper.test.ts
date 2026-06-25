import paginationHelper from "../pagination_helper";

describe("paginationHelper", () => {
  it("returns default values when no options provided", () => {
    const result = paginationHelper({});
    expect(result).toEqual({
      page: 1,
      limit: 10,
      skip: 0,
      cursor: undefined,
      sortBy: "createdAt",
      orderBy: "desc",
    });
  });

  it("accepts custom page and limit", () => {
    const result = paginationHelper({ page: 3, limit: 25 });
    expect(result.page).toBe(3);
    expect(result.limit).toBe(25);
    expect(result.skip).toBe(50);
  });

  it("defaults negative or zero page to 1", () => {
    expect(paginationHelper({ page: 0 }).page).toBe(1);
    expect(paginationHelper({ page: -5 }).page).toBe(1);
  });

  it("accepts custom sortBy and sortOrder", () => {
    const result = paginationHelper({
      sortBy: "title",
      sortOrder: "asc",
    });
    expect(result.sortBy).toBe("title");
    expect(result.orderBy).toBe("asc");
  });

  it("accepts orderBy alias", () => {
    const resultAsc = paginationHelper({ orderBy: "asc" });
    expect(resultAsc.orderBy).toBe("asc");

    const resultDesc = paginationHelper({ orderBy: "desc" });
    expect(resultDesc.orderBy).toBe("desc");
  });

  it("prefers sortOrder over orderBy when both provided", () => {
    const result = paginationHelper({
      sortOrder: "asc",
      orderBy: "desc",
    });
    expect(result.orderBy).toBe("asc");
  });

  it("parses cursor-based pagination option", () => {
    const result = paginationHelper({ cursor: "abc123" });
    expect(result.cursor).toBe("abc123");
  });

  it("ignores cursor when it is not a string", () => {
    const result = paginationHelper({ cursor: undefined as any });
    expect(result.cursor).toBeUndefined();
  });
});
