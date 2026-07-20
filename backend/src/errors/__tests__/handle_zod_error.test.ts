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
