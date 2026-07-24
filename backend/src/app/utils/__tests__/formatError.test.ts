import { ZodError } from "zod";
import { formatError } from "../formatError";
import ApiError from "../../../errors/api_error";

describe("formatError", () => {
  describe("ZodError handling", () => {
    it("formats ZodError with 400 status and validation issues", () => {
      const zodError = new ZodError([
        { code: "custom", path: ["email"], message: "Invalid email address" },
        { code: "custom", path: ["username"], message: "Username is required" },
      ]);

      const result = formatError(zodError);

      expect(result.statusCode).toBe(400);
      expect(result.message).toBe("Validation Error");
      expect(result.errorMessages).toHaveLength(2);
      expect(result.errorMessages[0]).toEqual({
        path: "email",
        message: "Invalid email address",
      });
      expect(result.errorMessages[1]).toEqual({
        path: "username",
        message: "Username is required",
      });
    });

    it("maps empty path issue to empty string path", () => {
      const zodError = new ZodError([
        { code: "custom", path: [], message: "Required field" },
      ]);

      const result = formatError(zodError);

      expect(result.errorMessages[0].path).toBe("");
    });

    it("maps nested path to last segment", () => {
      const zodError = new ZodError([
        { code: "custom", path: ["body", "name", 0], message: "Invalid" },
      ]);

      const result = formatError(zodError);

      expect(result.errorMessages[0].path).toBe("0");
    });
  });

  describe("ApiError handling", () => {
    it("preserves statusCode and message from ApiError", () => {
      const apiError = new ApiError(404, "Story not found");

      const result = formatError(apiError);

      expect(result.statusCode).toBe(404);
      expect(result.message).toBe("Story not found");
      expect(result.errorMessages).toEqual([
        { path: "", message: "Story not found" },
      ]);
    });

    it("handles ApiError with undefined message", () => {
      const apiError = new ApiError(500, undefined);

      const result = formatError(apiError);

      expect(result.statusCode).toBe(500);
      expect(result.message).toBe("An error occurred");
      expect(result.errorMessages).toEqual([]);
    });

    it("preserves custom status codes", () => {
      const apiError = new ApiError(403, "Access denied");

      const result = formatError(apiError);

      expect(result.statusCode).toBe(403);
      expect(result.message).toBe("Access denied");
    });
  });

  describe("generic Error handling", () => {
    it("formats generic Error with 500 status", () => {
      const error = new Error("Database connection failed");

      const result = formatError(error);

      expect(result.statusCode).toBe(500);
      expect(result.message).toBe("Database connection failed");
      expect(result.errorMessages).toEqual([
        { path: "", message: "Database connection failed" },
      ]);
    });

    it("uses fallback message for Error with empty message", () => {
      const error = new Error("");

      const result = formatError(error);

      expect(result.statusCode).toBe(500);
      expect(result.message).toBe("Something went wrong");
      expect(result.errorMessages).toEqual([]);
    });
  });

  describe("unknown input handling", () => {
    it("returns 500 with generic message for string input", () => {
      const result = formatError("not an error" as unknown as Error);

      expect(result.statusCode).toBe(500);
      expect(result.message).toBe("Something went wrong");
      expect(result.errorMessages).toEqual([]);
    });

    it("handles null input", () => {
      const result = formatError(null);

      expect(result.statusCode).toBe(500);
      expect(result.message).toBe("Something went wrong");
      expect(result.errorMessages).toEqual([]);
    });

    it("handles undefined input", () => {
      const result = formatError(undefined);

      expect(result.statusCode).toBe(500);
      expect(result.message).toBe("Something went wrong");
      expect(result.errorMessages).toEqual([]);
    });

    it("handles plain object without Error properties", () => {
      const result = formatError({ code: 500, msg: "oops" } as unknown as Error);

      expect(result.statusCode).toBe(500);
      expect(result.message).toBe("Something went wrong");
      expect(result.errorMessages).toEqual([]);
    });
  });
});
