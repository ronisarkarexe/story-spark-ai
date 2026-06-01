"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostValidator = void 0;
const zod_1 = require("zod");
const TopicSchema = zod_1.z.object({
    title: zod_1.z.string({ required_error: "Topic title is required!" }),
    color: zod_1.z.string({ required_error: "Topic color is required!" }),
    selected: zod_1.z.boolean({
        required_error: "Topic selection status is required!",
    }),
});
const createPost = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string({ required_error: "Title is required!" })
            .min(3, "Title must be at least 3 characters long"),
        content: zod_1.z
            .string({ required_error: "Content is required!" })
            .min(10, "Content must be at least 10 characters long"),
        tag: zod_1.z.string({ required_error: "Tag is required!" }),
        imageURL: zod_1.z
            .string({ required_error: "Image URL is required!" })
            .url("Invalid image URL format"),
        topic: zod_1.z
            .array(TopicSchema)
            .min(2, { message: "At least two topics are required!" }),
        language: zod_1.z.string().optional(),
    }),
});
const updatePost = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3).optional(),
        content: zod_1.z.string().min(10).optional(),
        tag: zod_1.z.string().optional(),
        imageURL: zod_1.z.string().url().optional(),
        topic: zod_1.z.array(TopicSchema).min(2).optional(),
        language: zod_1.z.string().optional(),
        isPublished: zod_1.z.boolean().optional(),
    }),
});
exports.PostValidator = {
    createPost,
    updatePost,
};
