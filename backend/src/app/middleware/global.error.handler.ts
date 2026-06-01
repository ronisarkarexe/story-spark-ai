/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import config from "../../config";
import { ZodError } from "zod";
import { IGenericErrorMessage } from "../../interfaces/error";
import handleValidationError from "../../errors/handle_validation_error";
import handleCastError from "../../errors/handle_cast_error";
import handleZodError from "../../errors/handle_zod_error";
import handleDuplicateError from "../../errors/handle_duplicate_error";
import ApiError from "../../errors/api_error";
import logger from "../../utils/logger.util";

const globalErrorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (config.env === "development") {
    logger.info(`Global Error Handler: ${err instanceof Error ? err.message : "Unknown error"}`);
  } else {
    logger.error(`Global Error Handler: ${err instanceof Error ? err.message : "Unknown error"}`);
  }

  let statusCode = 500;
  let message = "Something went wrong!";
  let errorMessage: IGenericErrorMessage[] = [];

  if (err && err.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessage = simplifiedError.errorMessages;
  } else if (err && err.name === "CastError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessage = simplifiedError.errorMessages;
  } else if (err && err.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessage = simplifiedError.errorMessages;
  } else if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessage = simplifiedError.errorMessages;
  } else if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errorMessage = err?.message
      ? [
          {
            path: "",
            message: err.message,
          },
        ]
      : [];
  } else if (err instanceof Error) {
    message = err.message;
    errorMessage = err?.message
      ? [
          {
            path: "",
            message: err.message,
          },
        ]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessage,
    // Expose stack only in explicit development; hide by default so any
    // non-development environment (including an unset NODE_ENV) stays safe.
    stack: config.env === "development" ? err.stack : undefined,
  });
};

export default globalErrorHandler;
