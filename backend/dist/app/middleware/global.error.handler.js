"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config"));
const zod_1 = require("zod");
const handle_validation_error_1 = __importDefault(require("../../errors/handle_validation_error"));
const handle_cast_error_1 = __importDefault(require("../../errors/handle_cast_error"));
const handle_zod_error_1 = __importDefault(require("../../errors/handle_zod_error"));
const handle_duplicate_error_1 = __importDefault(require("../../errors/handle_duplicate_error"));
const api_error_1 = __importDefault(require("../../errors/api_error"));
const logger_util_1 = __importDefault(require("../../utils/logger.util"));
const globalErrorHandler = (err, req, res, next) => {
    if (config_1.default.env === "development") {
        logger_util_1.default.info(`Global Error Handler: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
    else {
        logger_util_1.default.error(`Global Error Handler: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
    let statusCode = 500;
    let message = "Something went wrong!";
    let errorMessage = [];
    if (err && err.name === "ValidationError") {
        const simplifiedError = (0, handle_validation_error_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessage = simplifiedError.errorMessages;
    }
    else if (err && err.name === "CastError") {
        const simplifiedError = (0, handle_cast_error_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessage = simplifiedError.errorMessages;
    }
    else if (err && err.code === 11000) {
        const simplifiedError = (0, handle_duplicate_error_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessage = simplifiedError.errorMessages;
    }
    else if (err instanceof zod_1.ZodError) {
        const simplifiedError = (0, handle_zod_error_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessage = simplifiedError.errorMessages;
    }
    else if (err instanceof api_error_1.default) {
        statusCode = err.statusCode;
        message = err.message;
        errorMessage = (err === null || err === void 0 ? void 0 : err.message)
            ? [
                {
                    path: "",
                    message: err.message,
                },
            ]
            : [];
    }
    else if (err instanceof Error) {
        message = err.message;
        errorMessage = (err === null || err === void 0 ? void 0 : err.message)
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
        stack: config_1.default.env === "development" ? err.stack : undefined,
    });
};
exports.default = globalErrorHandler;
