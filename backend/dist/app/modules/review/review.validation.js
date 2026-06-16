"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewValidator = void 0;
const zod_1 = require("zod");
const createReview = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "Name is required!",
        }),
        role: zod_1.z.string({
            required_error: "Role is required!",
        }),
        feedback: zod_1.z
            .string({
            required_error: "Feedback is required!",
        })
            .min(10, "Feedback must be at least 10 characters long"),
        imgSrc: zod_1.z.string().optional(),
        rating: zod_1.z.number().min(1).max(5).optional(),
    }),
});
exports.ReviewValidator = {
    createReview,
};
