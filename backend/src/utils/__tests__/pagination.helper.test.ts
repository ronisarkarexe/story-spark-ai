<<<<<<< HEAD
import paginationHelper from "../pagination_helper";

describe("paginationHelper", () => {
  it("returns default values when no options provided", () => {
=======
import paginationHelper from "../../utils/pagination_helper";

describe("paginationHelper", () => {
  it("returns correct pagination for default values", () => {
>>>>>>> origin/main
    const result = paginationHelper({});
    expect(result).toEqual({
      page: 1,
      limit: 10,
      skip: 0,
<<<<<<< HEAD
      cursor: undefined,
=======
>>>>>>> origin/main
      sortBy: "createdAt",
      orderBy: "desc",
    });
  });

<<<<<<< HEAD
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
=======
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
>>>>>>> origin/main
});
