"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WriterApplicationValidation = void 0;
const zod_1 = require("zod");
const submitApplicationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        portfolioLink: zod_1.z.string({
            required_error: "Portfolio link is required",
        }).url("Must be a valid URL"),
        reason: zod_1.z.string({
            required_error: "Reason is required",
        }).min(10, "Reason must be at least 10 characters long"),
    }),
});
const updateApplicationStatusZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(["approved", "rejected"], {
            required_error: "Status must be 'approved' or 'rejected'",
        }),
    }),
});
exports.WriterApplicationValidation = {
    submitApplicationZodSchema,
    updateApplicationStatusZodSchema,
};
