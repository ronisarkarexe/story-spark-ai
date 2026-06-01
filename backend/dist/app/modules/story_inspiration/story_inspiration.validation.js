"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryInspirationValidation = void 0;
const zod_1 = require("zod");
const createStoryInspirationSchema = zod_1.z.object({
    body: zod_1.z.object({
        intro: zod_1.z
            .string({
            required_error: "Story intro is required",
        })
            .trim()
            .min(1, "Story intro cannot be empty")
            .max(1000, "Story intro must be 1000 characters or less"),
    }),
});
exports.StoryInspirationValidation = {
    createStoryInspirationSchema,
};
