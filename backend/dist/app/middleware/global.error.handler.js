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
const globalErrorHandler = (err, req, res, next) => {
    config_1.default.env === "development"
        ? console.log("Global Error Handler", err)
        : console.error("Global Error Handler", err);
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
        stack: config_1.default.env != "production" ? err.stack : undefined,
    });
};
exports.default = globalErrorHandler;
