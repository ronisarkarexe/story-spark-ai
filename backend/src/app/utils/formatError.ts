import { ZodError } from "zod";
import ApiError from "../../errors/api_error";
import { IGenericErrorMessage } from "../../interfaces/error";

export interface FormattedError {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
}

/**
 * Formats an Error-like object into a consistent structured response shape.
 * Handles Error, ApiError, and ZodError instances uniformly.
 */
export const formatError = (err: unknown): FormattedError => {
  if (err instanceof ZodError) {
    return {
      statusCode: 400,
      message: "Validation Error",
      errorMessages: err.issues.map((issue) => ({
        path: issue.path.length > 0 ? String(issue.path[issue.path.length - 1]) : "",
        message: issue.message,
      })),
    };
  }

  if (err instanceof ApiError) {
    return {
      statusCode: err.statusCode,
      message: err.message || "An error occurred",
      errorMessages: err.message
        ? [{ path: "", message: err.message }]
        : [],
    };
  }

  if (err instanceof Error) {
    return {
      statusCode: 500,
      message: err.message || "Something went wrong",
      errorMessages: err.message
        ? [{ path: "", message: err.message }]
        : [],
    };
  }

  return {
    statusCode: 500,
    message: "Something went wrong",
    errorMessages: [],
  };
};
