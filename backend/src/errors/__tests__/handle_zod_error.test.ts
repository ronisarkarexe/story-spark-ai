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
import { z } from "zod";
import handleZodError from "../handle_zod_error";

describe("handleZodError", () => {
  it("returns correct shape for single Zod issue", () => {
    const schema = z.object({ email: z.string().email("Invalid email") });
    const result = schema.safeParse({ email: "not-an-email" });

    if (!result.error) throw new Error("Expected parse error");

    const output = handleZodError(result.error);

    expect(output.statusCode).toBe(400);
    expect(output.message).toBe("Zod Error");
    expect(output.errorMessages.length).toBeGreaterThan(0);
    expect(output.errorMessages[0]).toMatchObject({
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
  it("returns all errors when multiple fields fail validation", () => {
    const schema = z.object({
      name: z.string().min(1, "name is required"),
      email: z.string().email("email must be valid"),
      age: z.number().min(0, "age must be non-negative"),
    });
    const result = schema.safeParse({ name: "", email: "bad", age: -5 });

    if (!result.error) throw new Error("Expected parse error");

    const output = handleZodError(result.error);

    expect(output.statusCode).toBe(400);
    expect(output.message).toBe("Zod Error");
    expect(output.errorMessages.length).toBeGreaterThanOrEqual(3);
  });

  it("always returns statusCode 400", () => {
    const schema = z.string().min(5);
    const result = schema.safeParse("hi");

    if (!result.error) throw new Error("Expected parse error");

    const output = handleZodError(result.error);

    expect(output.statusCode).toBe(400);
  });

  it("uses last element of path for nested fields", () => {
    const schema = z.object({
      profile: z.object({
        email: z.string().email("invalid nested email"),
      }),
    });
    const result = schema.safeParse({ profile: { email: "bad" } });

    if (!result.error) throw new Error("Expected parse error");

    const output = handleZodError(result.error);

    // handleZodError uses issue.path[issue.path.length - 1]
    // which is the last element (the field name)
    const paths = output.errorMessages.map((e) => e.path);
    expect(paths).toContain("email");
  });

  it("handles deeply nested paths", () => {
    const schema = z.object({
      a: z.object({
        b: z.object({
          c: z.string().min(1, "c is required"),
        }),
      }),
    });
    const result = schema.safeParse({ a: { b: { c: "" } } });

    if (!result.error) throw new Error("Expected parse error");

    const output = handleZodError(result.error);

    // The last element of the path array should be "c"
    const paths = output.errorMessages.map((e) => e.path);
    expect(paths).toContain("c");
  });

  it("maps message from ZodIssue correctly", () => {
    const schema = z.string().min(3, "must be at least 3 characters");
    const result = schema.safeParse("ab");

    if (!result.error) throw new Error("Expected parse error");

    const output = handleZodError(result.error);

    expect(output.errorMessages[0].message).toBe("must be at least 3 characters");
  });
});
