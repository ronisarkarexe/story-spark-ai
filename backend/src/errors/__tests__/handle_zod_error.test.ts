import { ZodError } from "zod";
import handleZodError from "../handle_zod_error";

describe("handleZodError", () => {
  it("single Zod issue returns statusCode 400 and correct path/message", () => {
    const zodError = new ZodError([
      {
        path: ["name"],
        message: "Name is required",
        code: "invalid_type",
        expected: "string",
        received: "undefined",
      },
    ]);
    const result = handleZodError(zodError);
    expect(result.statusCode).toBe(400);
    expect(result.message).toBe("Zod Error");
    expect(result.errorMessages).toHaveLength(1);
    expect(result.errorMessages[0].path).toBe("name");
    expect(result.errorMessages[0].message).toBe("Name is required");
  });

  it("multiple Zod issues return all error messages in errorMessages array", () => {
    const zodError = new ZodError([
      {
        code: "invalid_type",
        expected: "string",
        received: "undefined",
        path: ["name"],
        message: "Name is required",
      },
      {
        code: "invalid_type",
        expected: "number",
        received: "string",
        path: ["age"],
        message: "Age must be a number",
      },
    ]);
    const result = handleZodError(zodError);
    expect(result.statusCode).toBe(400);
    expect(result.errorMessages).toHaveLength(2);
    expect(result.errorMessages[0].path).toBe("name");
    expect(result.errorMessages[0].message).toBe("Name is required");
    expect(result.errorMessages[1].path).toBe("age");
    expect(result.errorMessages[1].message).toBe("Age must be a number");
  });

  it("nested path returns the last path element as the path field", () => {
    const zodError = new ZodError([
      {
        code: "invalid_type",
        expected: "string",
        received: "undefined",
        path: ["user", "address", "city"],
        message: "City is required",
      },
    ]);
    const result = handleZodError(zodError);
    expect(result.errorMessages[0].path).toBe("city");
  });

  it("custom Zod error messages are preserved in errorMessages", () => {
    const zodError = new ZodError([
      {
        code: "invalid_string",
        validation: "email",
        path: ["email"],
        message: "Email must be a valid email address",
      },
    ]);
    const result = handleZodError(zodError);
    expect(result.errorMessages[0].message).toBe(
      "Email must be a valid email address"
    );
  });

  it("message field is always 'Zod Error'", () => {
    const zodError = new ZodError([
      {
        code: "invalid_type",
        expected: "string",
        received: "undefined",
        path: ["name"],
        message: "Invalid name",
      },
    ]);
    const result = handleZodError(zodError);
    expect(result.message).toBe("Zod Error");
  });
});
