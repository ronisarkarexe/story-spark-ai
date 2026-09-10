import paginationHelper from "../pagination_helper";

describe("paginationHelper", () => {
  it("should return default values when no options provided", () => {
    const result = paginationHelper({});
    expect(result).toEqual({
      page: 1,
      limit: 10,
      skip: 0,
      sortBy: "createdAt",
      orderBy: "desc",
    });
  });

  it("should calculate skip correctly", () => {
    const result = paginationHelper({ page: 3, limit: 20 });
    expect(result.page).toBe(3);
    expect(result.limit).toBe(20);
    expect(result.skip).toBe(40);
  });

  it("should accept sortBy and sortOrder", () => {
    const result = paginationHelper({
      page: 1,
      limit: 5,
      sortBy: "title",
      sortOrder: "asc",
    });
    expect(result.sortBy).toBe("title");
    expect(result.orderBy).toBe("asc");
  });

  it("should fall back to orderBy when sortOrder is missing", () => {
    const result = paginationHelper({
      page: 1,
      limit: 10,
      orderBy: "asc",
    });
    expect(result.orderBy).toBe("asc");
  });

  it("should orderBy take precedence when both sortOrder and orderBy are provided", () => {
    const result = paginationHelper({
      page: 1,
      limit: 10,
      sortOrder: "desc",
      orderBy: "asc",
    });
    expect(result.orderBy).toBe("desc");
  });

  it("should parse string page and limit to numbers", () => {
    const result = paginationHelper({
      page: "2" as any,
      limit: "15" as any,
    });
    expect(result.page).toBe(2);
    expect(result.limit).toBe(15);
    expect(result.skip).toBe(15);
  });

  it("should include cursor when provided as string", () => {
    const result = paginationHelper({
      page: 1,
      limit: 10,
      cursor: "abc123",
    });
    expect(result.cursor).toBe("abc123");
  });

  it("should exclude cursor when it is not a string", () => {
    const result = paginationHelper({
      page: 1,
      limit: 10,
      cursor: 123 as any,
    });
    expect(result.cursor).toBeUndefined();
  });

  it("should default to page 1 when page is 0", () => {
    const result = paginationHelper({ page: 0 });
    expect(result.page).toBe(1);
    expect(result.skip).toBe(0);
  });
});
