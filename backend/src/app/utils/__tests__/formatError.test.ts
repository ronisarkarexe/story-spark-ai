import { ZodError, z } from "zod";
import ApiError from "../../../errors/api_error";
import { formatError } from "../formatError";

describe("formatError", () => {
  describe("ZodError handling", () => {
    it("returns statusCode 400 for ZodError", () => {
      const schema = z.string().email();
      const result = schema.safeParse("not-an-email");
      const zodError = (result as any).error as ZodError;
      const formatted = formatError(zodError);
      expect(formatted.statusCode).toBe(400);
    });

    it("returns 'Validation Error' message for ZodError", () => {
      const schema = z.string().min(1);
      const result = schema.safeParse("");
      const zodError = (result as any).error as ZodError;
      const formatted = formatError(zodError);
      expect(formatted.message).toBe("Validation Error");
    });

    it("maps ZodError issues to errorMessages", () => {
      const schema = z.object({ email: z.string().email() });
      const result = schema.safeParse({ email: "not-an-email" });
      const zodError = (result as any).error as ZodError;
      const formatted = formatError(zodError);
      expect(formatted.errorMessages.length).toBeGreaterThan(0);
      expect(formatted.errorMessages[0].message).toBeTruthy();
    });

    it("returns empty path for root-level ZodError issues", () => {
      const result = z.string().min(5).safeParse("hi");
      const zodError = (result as any).error as ZodError;
      const formatted = formatError(zodError);
      expect(formatted.errorMessages[0].path).toBe("");
    });
  });

  describe("ApiError handling", () => {
    it("returns ApiError statusCode", () => {
      const apiError = new ApiError(404, "Resource not found");
      const result = formatError(apiError);
      expect(result.statusCode).toBe(404);
    });

    it("returns ApiError message", () => {
      const apiError = new ApiError(401, "Unauthorized access");
      const result = formatError(apiError);
      expect(result.message).toBe("Unauthorized access");
    });

    it("returns generic message when ApiError has empty message", () => {
      const apiError = new ApiError(500, "");
      const result = formatError(apiError);
      expect(result.message).toBe("An error occurred");
    });

    it("returns errorMessages with empty path when ApiError has message", () => {
      const apiError = new ApiError(400, "Bad request");
      const result = formatError(apiError);
      expect(result.errorMessages).toEqual([
        { path: "", message: "Bad request" },
      ]);
    });
  });

  describe("generic Error handling", () => {
    it("returns statusCode 500 for generic Error", () => {
      const error = new Error("Database unavailable");
      const result = formatError(error);
      expect(result.statusCode).toBe(500);
    });

    it("returns the Error message", () => {
      const error = new Error("Timeout connecting to server");
      const result = formatError(error);
      expect(result.message).toBe("Timeout connecting to server");
    });

    it("returns 'Something went wrong' for Error with empty message", () => {
      const error = new Error("");
      const result = formatError(error);
      expect(result.message).toBe("Something went wrong");
    });

    it("returns errorMessages for generic Error with message", () => {
      const error = new Error("Something broke");
      const result = formatError(error);
      expect(result.errorMessages).toEqual([
        { path: "", message: "Something broke" },
      ]);
    });
  });

  describe("unknown input handling", () => {
    it("returns statusCode 500 for null input", () => {
      const result = formatError(null as unknown as Error);
      expect(result.statusCode).toBe(500);
    });

    it("returns statusCode 500 for undefined input", () => {
      const result = formatError(undefined as unknown as Error);
      expect(result.statusCode).toBe(500);
    });

    it("returns statusCode 500 for non-Error objects", () => {
      const result = formatError({ reason: "unknown" });
      expect(result.statusCode).toBe(500);
    });

    it("returns 'Something went wrong' message for unknown input", () => {
      const result = formatError({});
      expect(result.message).toBe("Something went wrong");
    });

    it("returns empty errorMessages for unknown input", () => {
      const result = formatError("string error");
      expect(result.errorMessages).toEqual([]);
    });
  });
});
