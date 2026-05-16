"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleDuplicateError = (err) => {
    const errors = Object.keys(err.keyValue).map((key) => {
        return {
            path: key,
            message: `${err.keyValue[key]} is already in use`,
        };
    });
    return {
        statusCode: 400,
        message: "Duplicate Key Error",
        errorMessages: errors,
    };
};
exports.default = handleDuplicateError;
