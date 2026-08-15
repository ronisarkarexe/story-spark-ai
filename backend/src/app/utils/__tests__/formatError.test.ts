import { ZodError, ZodIssueCode } from "zod";
import { formatError } from "../formatError";
import ApiError from "../../../errors/api_error";

describe("formatError", () => {
  describe("ZodError handling", () => {
    it("returns statusCode 400 for ZodError", () => {
      const zodError = new ZodError([
        {
          code: ZodIssueCode.invalid_type,
          expected: "string",
          received: "number",
          path: ["username"],
          message: "Expected string, received number",
        },
      ]);
      const result = formatError(zodError);
      expect(result.statusCode).toBe(400);
      expect(result.message).toBe("Validation Error");
    });

    it("maps ZodError issues to errorMessages with path and message", () => {
      const zodError = new ZodError([
        {
          code: ZodIssueCode.too_small,
          minimum: 3,
          type: "string",
          path: ["name"],
          message: "String must contain at least 3 character(s)",
          inclusive: true,
        },
      ]);
      const result = formatError(zodError);
      expect(result.errorMessages).toEqual([
        { path: "name", message: "String must contain at least 3 character(s)" },
      ]);
    });

    it("uses the last path segment as the path string", () => {
      const zodError = new ZodError([
        { code: ZodIssueCode.custom, path: ["body", "name", 0], message: "Invalid" },
      ]);
      const result = formatError(zodError);
      expect(result.errorMessages[0].path).toBe("0");
    });

    it("uses empty path string when path array is empty", () => {
      const zodError = new ZodError([
        { code: ZodIssueCode.custom, path: [], message: "Root-level error" },
      ]);
      const result = formatError(zodError);
      expect(result.errorMessages).toEqual([{ path: "", message: "Root-level error" }]);
    });

    it("maps multiple issues in order", () => {
      const zodError = new ZodError([
        { code: ZodIssueCode.custom, path: ["email"], message: "Invalid email" },
        { code: ZodIssueCode.custom, path: ["password"], message: "Too short" },
      ]);
      const result = formatError(zodError);
      expect(result.errorMessages).toHaveLength(2);
      expect(result.errorMessages[1]).toEqual({ path: "password", message: "Too short" });
    });
  });

  describe("ApiError handling", () => {
    it("preserves statusCode and message from ApiError", () => {
      const apiError = new ApiError(404, "Story not found");
      const result = formatError(apiError);
      expect(result.statusCode).toBe(404);
      expect(result.message).toBe("Story not found");
    });

    it("includes the message in errorMessages", () => {
      const apiError = new ApiError(401, "Unauthorized");
      const result = formatError(apiError);
      expect(result.errorMessages).toEqual([{ path: "", message: "Unauthorized" }]);
    });

    it("preserves custom status codes", () => {
      const apiError = new ApiError(403, "Access denied");
      const result = formatError(apiError);
      expect(result.statusCode).toBe(403);
    });

    it("uses default message when ApiError message is undefined", () => {
      const apiError = new ApiError(500, undefined);
      const result = formatError(apiError);
      expect(result.message).toBe("An error occurred");
      expect(result.errorMessages).toEqual([]);
    });
  });

  describe("generic Error handling", () => {
    it("returns statusCode 500 for generic Error", () => {
      const error = new Error("Something went wrong");
      const result = formatError(error);
      expect(result.statusCode).toBe(500);
    });

    it("returns the error message in the message field", () => {
      const error = new Error("Database connection failed");
      const result = formatError(error);
      expect(result.message).toBe("Database connection failed");
    });

    it("includes the error message in errorMessages", () => {
      const error = new Error("Network timeout");
      const result = formatError(error);
      expect(result.errorMessages).toEqual([{ path: "", message: "Network timeout" }]);
    });

    it("uses fallback message for Error with empty message", () => {
      const error = new Error("");
      const result = formatError(error);
      expect(result.message).toBe("Something went wrong");
      expect(result.errorMessages).toEqual([]);
    });
  });

  describe("unknown input handling", () => {
    it("returns 500 with generic message for string input", () => {
      const result = formatError("not an error");
      expect(result.statusCode).toBe(500);
      expect(result.message).toBe("Something went wrong");
      expect(result.errorMessages).toEqual([]);
    });

    it("returns statusCode 500 for null", () => {
      const result = formatError(null);
      expect(result.statusCode).toBe(500);
    });

    it("returns statusCode 500 for undefined", () => {
      const result = formatError(undefined);
      expect(result.statusCode).toBe(500);
    });

    it("returns statusCode 500 for non-Error objects", () => {
      const result = formatError({ code: "ERR_123", details: "something" });
      expect(result.statusCode).toBe(500);
    });

    it("returns generic message and empty errorMessages for unknown input", () => {
      const result = formatError("just a string");
      expect(result.message).toBe("Something went wrong");
      expect(result.errorMessages).toEqual([]);
    });
  });
});
