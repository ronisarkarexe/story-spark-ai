"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BugReportValidation = void 0;
const zod_1 = require("zod");
const createBugReport = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: "Title is required" }),
        category: zod_1.z.string({ required_error: "Category is required" }),
        severity: zod_1.z.string({ required_error: "Severity is required" }),
        description: zod_1.z.string({ required_error: "Description is required" }),
        steps: zod_1.z.string({ required_error: "Steps are required" }),
        expected: zod_1.z.string({ required_error: "Expected behavior is required" }),
        actual: zod_1.z.string({ required_error: "Actual behavior is required" }),
        email: zod_1.z.string().email("Invalid email address").optional().or(zod_1.z.literal("")),
    }),
});
exports.BugReportValidation = {
    createBugReport,
};
