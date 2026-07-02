import handleDuplicateError from "../handle_duplicate_error";

describe("handleDuplicateError", () => {
  it("returns statusCode 400 for duplicate key error", () => {
    const err = {
      code: 11000,
      keyValue: { email: "test@example.com" },
    } as any;
    const result = handleDuplicateError(err);
    expect(result.statusCode).toBe(400);
  });

  it("returns 'Duplicate Key Error' as message", () => {
    const err = {
      code: 11000,
      keyValue: { email: "test@example.com" },
    } as any;
    const result = handleDuplicateError(err);
    expect(result.message).toBe("Duplicate Key Error");
  });

  it("formats errorMessages with path and duplicate value", () => {
    const err = {
      code: 11000,
      keyValue: { email: "test@example.com" },
    } as any;
    const result = handleDuplicateError(err);
    expect(result.errorMessages).toHaveLength(1);
    expect(result.errorMessages[0].path).toBe("email");
    expect(result.errorMessages[0].message).toBe("test@example.com is already in use");
  });

  it("handles multi-field duplicate key error", () => {
    const err = {
      code: 11000,
      keyValue: { email: "test@example.com", username: "testuser" },
    } as any;
    const result = handleDuplicateError(err);
    expect(result.errorMessages).toHaveLength(2);
    expect(result.errorMessages[0].path).toBe("email");
    expect(result.errorMessages[1].path).toBe("username");
  });

  it("returns empty errorMessages when keyValue is empty object", () => {
    const err = {
      code: 11000,
      keyValue: {},
    } as any;
    const result = handleDuplicateError(err);
    expect(result.errorMessages).toHaveLength(0);
  });

  it("returns a well-formed IGenericErrorResponse object", () => {
    const err = { code: 11000, keyValue: { name: "Existing" } } as any;
    const result = handleDuplicateError(err);
    expect(result).toHaveProperty("statusCode");
    expect(result).toHaveProperty("message");
    expect(result).toHaveProperty("errorMessages");
    expect(Array.isArray(result.errorMessages)).toBe(true);
  });
});
