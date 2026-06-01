"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentValidator = void 0;
const zod_1 = require("zod");
const createComment = zod_1.z.object({
    body: zod_1.z.object({
        postId: zod_1.z.string({ required_error: "PostId is required!" }),
        parentCommentId: zod_1.z.string().optional(),
        comment: zod_1.z.string({ required_error: "Comment is required!" }).min(1, "Comment cannot be empty"),
    }),
});
exports.CommentValidator = {
    createComment,
};
