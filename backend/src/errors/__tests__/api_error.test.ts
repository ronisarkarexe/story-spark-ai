import ApiError from "../api_error";

describe("ApiError", () => {
  it("sets statusCode and message correctly", () => {
    const error = new ApiError(404, "Not found");
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe("Not found");
  });

  it("is an instance of Error", () => {
    const error = new ApiError(500, "Server error");
    expect(error).toBeInstanceOf(Error);
  });

  it("is an instance of ApiError", () => {
    const error = new ApiError(400, "Bad request");
    expect(error).toBeInstanceOf(ApiError);
  });

  it("generates a stack trace when no stack provided", () => {
    const error = new ApiError(400, "Bad request");
    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe("string");
    expect(error.stack!.length).toBeGreaterThan(0);
    expect(error.stack).toContain("api_error.test.ts");
  });

  it("uses custom stack when provided", () => {
    const customStack = "Error: Custom stack\n    at Test (test.ts:1:1)";
    const error = new ApiError(401, "Unauthorized", customStack);
    expect(error.stack).toBe(customStack);
  });

  it("handles undefined message without throwing", () => {
    expect(() => new ApiError(500, undefined)).not.toThrow();
    const error = new ApiError(500, undefined);
    expect(error.statusCode).toBe(500);
  });

  it("has statusCode accessible as a property", () => {
    const error = new ApiError(403, "Forbidden");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const code: number = error.statusCode;
    expect(code).toBe(403);
  });

  it("stack is a non-empty string when created without custom stack", () => {
    const error = new ApiError(422, "Unprocessable entity");
    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe("string");
    expect(error.stack!.length).toBeGreaterThan(0);
  });

  it("works with various HTTP status codes", () => {
    const codes = [400, 401, 403, 404, 409, 422, 500, 502, 503];
    codes.forEach((code) => {
      const error = new ApiError(code, `Error ${code}`);
      expect(error.statusCode).toBe(code);
    });
  });
});
