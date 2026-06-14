import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.isOperational = true; 
    Error.captureStackTrace(this, this.constructor);
  }
}

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

interface MongoValidationError extends Error {
  name: "ValidationError";
  errors: Record<string, { message: string }>;
}

interface MongoCastError extends Error {
  name: "CastError";
  path?: string;
  value?: unknown;
}

function isMongoError(err: unknown): err is MongoError {
  return err instanceof Error && "code" in err;
}

function isValidationError(err: unknown): err is MongoValidationError {
  return err instanceof Error && err.name === "ValidationError";
}

function isCastError(err: unknown): err is MongoCastError {
  return err instanceof Error && err.name === "CastError";
}

function isJsonWebTokenError(err: unknown): err is Error {
  return (
    err instanceof Error &&
    (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError")
  );
}

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  
  _next: NextFunction
): void => {
  const isProd = process.env.NODE_ENV === "production";

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      ...(isProd ? {} : { stack: err.stack }),
    });
    return;
  }

  if (isMongoError(err) && err.code === 11000) {
    const duplicateField = err.keyValue
      ? Object.keys(err.keyValue)[0]
      : "field";

    res.status(409).json({
      success: false,
      error: `An account with this ${duplicateField} already exists. Please use a different ${duplicateField} or log in.`,
    });
    return;
  }
  
  if (isValidationError(err)) {
    const messages = Object.values(err.errors)
      .map((e) => e.message)
      .join(" ");

    res.status(400).json({
      success: false,
      error: `Validation failed: ${messages}`,
    });
    return;
  }
  if (isCastError(err)) {
    res.status(400).json({
      success: false,
      error: `Invalid value "${err.value}" for field "${err.path}".`,
    });
    return;
  }

  if (isJsonWebTokenError(err)) {
    const message =
      (err as Error).name === "TokenExpiredError"
        ? "Your session has expired. Please log in again."
        : "Invalid authentication token. Please log in again.";

    res.status(401).json({ success: false, error: message });
    return;
  }

  if (
    err instanceof Error &&
    "statusCode" in err &&
    typeof (err as Record<string, unknown>).statusCode === "number"
  ) {
    const razorErr = err as Error & { statusCode: number; error?: { description?: string } };
    const clientMessage = isProd
      ? "A payment processing error occurred. Please try again."
      : razorErr.message;

    res.status(razorErr.statusCode).json({
      success: false,
      error: clientMessage,
    });
    return;
  }

  console.error("[Unhandled Error]", {
    method: req.method,
    path: req.path,
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
    timestamp: new Date().toISOString(),
  });

  res.status(500).json({
    success: false,
    error: isProd
      ? "An unexpected error occurred. Please try again later."
      : err instanceof Error
        ? err.message
        : "Unknown error",
    ...(isProd ? {} : { stack: err instanceof Error ? err.stack : undefined }),
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found.`,
  });
};
