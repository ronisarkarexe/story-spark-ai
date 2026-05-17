import express from "express";
import { PostController } from "./post.controller";
import validateRequest from "../../middleware/validate.request";
import { PostValidator } from "./post.validation";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middleware/auth.middleware";
const router = express.Router();

// Create a new post
router.post(
  "/create",
  auth(
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.USER
  ),
  validateRequest(PostValidator.createPost),
  PostController.createPost
);

// Get Posts

router.get("/lists", PostController.getPosts);
router.get("/platform-stats", PostController.getPlatformStats);
router.get("/latest-lists", PostController.getLatestPosts);
router.get("/feature-lists", PostController.getFeaturedPosts);

router.post(
  "/:postId",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  PostController.doFeaturedPosts
);

router.get("/:id", PostController.getSinglePost);
router.get("/tag/:tag", PostController.getPostsByTag);

export const PostRouter = router;
