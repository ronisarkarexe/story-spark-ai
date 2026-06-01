"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactValidation = void 0;
const zod_1 = require("zod");
const contactFeedbackTypes = [
    "bug-report",
    "feature-request",
    "general-feedback",
];
const optionalTrimmedString = zod_1.z.preprocess((value) => {
    if (typeof value !== "string") {
        return undefined;
    }
    const trimmedValue = value.trim();
    return trimmedValue ? trimmedValue : undefined;
}, zod_1.z.string().optional());
const optionalEmail = zod_1.z.preprocess((value) => {
    if (typeof value !== "string") {
        return undefined;
    }
    const trimmedValue = value.trim();
    return trimmedValue ? trimmedValue : undefined;
}, zod_1.z.string().email("Invalid email address").optional());
const requiredTrimmedString = (label) => zod_1.z.preprocess((value) => {
    if (typeof value !== "string") {
        return value;
    }
    return value.trim();
}, zod_1.z.string().min(1, `${label} is required`));
const contactValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        fullname: optionalTrimmedString,
        email: optionalEmail,
        feedbackType: zod_1.z.enum(contactFeedbackTypes),
        subject: requiredTrimmedString("Subject"),
        message: requiredTrimmedString("Message"),
    }),
});
exports.ContactValidation = {
    contactValidationSchema,
};
