import { ZodError, ZodIssue } from "zod";
import handleZodError from "../handle_zod_error";

describe("handleZodError", () => {
  it("returns statusCode 400 for any ZodError", () => {
    const zodError = new ZodError([
      { path: ["name"], message: "Name is required", code: "custom", fatal: false },
    ]);
    const result = handleZodError(zodError);
    expect(result.statusCode).toBe(400);
  });

  it("returns message 'Zod Error'", () => {
    const zodError = new ZodError([
      { path: ["email"], message: "Invalid email", code: "custom", fatal: false },
    ]);
    const result = handleZodError(zodError);
    expect(result.message).toBe("Zod Error");
  });

  it("returns single error message for single issue", () => {
    const zodError = new ZodError([
      { path: ["name"], message: "Name is required", code: "custom", fatal: false },
    ]);
    const result = handleZodError(zodError);
    expect(result.errorMessages).toHaveLength(1);
    expect(result.errorMessages[0]).toEqual({
      path: "name",
      message: "Name is required",
    });
  });

  it("returns all error messages for multiple issues", () => {
    const zodError = new ZodError([
      { path: ["name"], message: "Name is required", code: "custom", fatal: false },
      { path: ["age"], message: "Age must be a number", code: "custom", fatal: false },
      { path: ["email"], message: "Invalid email", code: "custom", fatal: false },
    ]);
    const result = handleZodError(zodError);
    expect(result.errorMessages).toHaveLength(3);
    expect(result.errorMessages).toContainEqual({
      path: "name",
      message: "Name is required",
    });
    expect(result.errorMessages).toContainEqual({
      path: "age",
      message: "Age must be a number",
    });
    expect(result.errorMessages).toContainEqual({
      path: "email",
      message: "Invalid email",
    });
  });

  it("uses last element of nested path as path field", () => {
    const zodError = new ZodError([
      {
        path: ["user", "profile", "name"],
        message: "Name is required",
        code: "custom",
        fatal: false,
      },
    ]);
    const result = handleZodError(zodError);
    expect(result.errorMessages[0].path).toBe("name");
  });

  it("handles empty path array by returning undefined path", () => {
    const issue: ZodIssue = {
      path: [],
      message: "Root level error",
      code: "custom",
      fatal: false,
    };
    const zodError = new ZodError([issue]);
    const result = handleZodError(zodError);
    expect(result.errorMessages[0].path).toBeUndefined();
    expect(result.errorMessages[0].message).toBe("Root level error");
  });

  it("preserves custom Zod error messages", () => {
    const zodError = new ZodError([
      { path: ["field"], message: "Custom validation failed", code: "custom", fatal: false },
      { path: ["count"], message: "Must be at least 1", code: "custom", fatal: false },
    ]);
    const result = handleZodError(zodError);
    const messages = result.errorMessages.map((e) => e.message);
    expect(messages).toContain("Custom validation failed");
    expect(messages).toContain("Must be at least 1");
  });

  it("returns object with correct shape", () => {
    const zodError = new ZodError([
      { path: ["field"], message: "Error", code: "custom", fatal: false },
    ]);
    const result = handleZodError(zodError);
    expect(result).toHaveProperty("statusCode", 400);
    expect(result).toHaveProperty("message", "Zod Error");
    expect(result).toHaveProperty("errorMessages");
    expect(Array.isArray(result.errorMessages)).toBe(true);
  });
});
