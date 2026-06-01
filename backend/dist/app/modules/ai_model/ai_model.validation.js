"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIModelValidator = void 0;
const zod_1 = require("zod");
const VALID_TONES = [
    "Dark",
    "Humorous",
    "Romantic",
    "Epic",
    "Mysterious",
    "Children's",
];
const aiModel = zod_1.z.object({
    body: zod_1.z.object({
        prompt: zod_1.z.string({ required_error: "Prompt is required!" }),
        language: zod_1.z.string().optional(),
        tone: zod_1.z
            .enum(VALID_TONES, {
            errorMap: () => ({
                message: `Tone must be one of: ${VALID_TONES.join(", ")}`,
            }),
        })
            .optional(),
    }),
});
const aiAlternateEndings = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: "Title is required!" }),
        content: zod_1.z.string({ required_error: "Content is required!" }),
        tag: zod_1.z.string({ required_error: "Tag is required!" }),
        language: zod_1.z.string().optional(),
    }),
});
const aiChat = zod_1.z.object({
    body: zod_1.z.object({
        message: zod_1.z.string({ required_error: "Message is required!" }),
        history: zod_1.z.array(zod_1.z.object({
            role: zod_1.z.enum(["user", "model"]),
            parts: zod_1.z.string(),
        })).optional(),
    }),
});
exports.AIModelValidator = {
    aiModel,
    aiAlternateEndings,
    aiChat,
};
