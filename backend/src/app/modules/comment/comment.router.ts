import express from "express";
import validateRequest from "../../middleware/validate.request";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middleware/auth.middleware";
import { CommentController } from "./comment.controller";
import { CommentValidator } from "./comment.validation";
const router = express.Router();

// Create a new comment
router.post(
  "/create",
  auth(
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.USER
  ),
  validateRequest(CommentValidator.createComment),
  CommentController.createComment
);

// Get comments by postId
router.get("/get-comments/:postId", CommentController.getCommentsByPostId);

// Toggle like on a comment
router.patch(
  "/toggle-like/commentId=:commentId",
  auth(
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.USER
  ),
  CommentController.toggleCommentLike
);

export const CommentRouter = router;
