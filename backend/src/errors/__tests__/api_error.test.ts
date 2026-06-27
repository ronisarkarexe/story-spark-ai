import ApiError from "../api_error";

describe("ApiError", () => {
  it("sets statusCode and message correctly", () => {
    const error = new ApiError(404, "Not Found");
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe("Not Found");
  });

  it("is an instance of Error", () => {
    const error = new ApiError(500, "Server Error");
    expect(error).toBeInstanceOf(Error);
  });

  it("sets custom stack when provided", () => {
    const customStack = "Custom stack trace";
    const error = new ApiError(400, "Bad Request", customStack);
    expect(error.stack).toBe(customStack);
  });

  it("generates stack trace when no stack provided", () => {
    const error = new ApiError(403, "Forbidden");
    expect(error.stack).toBeDefined();
  });

  it("does not throw with undefined message", () => {
    expect(() => new ApiError(500, undefined)).not.toThrow();
  });

  it("statusCode is accessible as a property on the error instance", () => {
    const error = new ApiError(418, "I'm a teapot");
    expect(error.statusCode).toBe(418);
  });
});
