import express from "express";
import { PostController } from "./post.controller";
import auth from "../../middleware/auth.middleware";
import checkRequestLimit from "../../middleware/check.request.limit";
import validateRequest from "../../middleware/validate.request";
import { PostValidator } from "./post.validation";
import { ENUM_USER_ROLE } from "../../../enums/user";

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

// All authenticated roles allowed to use AI variation features
const AI_VARIATION_ROLES = [
  ENUM_USER_ROLE.USER,
  ENUM_USER_ROLE.WRITER,
  ENUM_USER_ROLE.ADMIN,
  ENUM_USER_ROLE.SUPER_ADMIN,
] as const;

// AI variation routes
router.post("/remix", auth(...AI_VARIATION_ROLES), checkRequestLimit(), PostController.remixStory);
router.post("/translate", auth(...AI_VARIATION_ROLES), checkRequestLimit(), PostController.translateStory);

// Named GET routes must come before /:id to avoid the wildcard swallowing them
router.get("/tag/:tag", PostController.getPostsByTag);

// /latest-lists is a client-facing alias for /latest-posts (both serve the same handler)
router.get("/latest-posts", PostController.getLatestPosts);
router.get("/latest-lists", PostController.getLatestPosts);

// /feature-lists is a client-facing alias for /featured-posts (both serve the same handler)
router.get("/featured-posts", PostController.getFeaturedPosts);
router.get("/feature-lists", PostController.getFeaturedPosts);

router.patch(
  "/featured/:postId",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  PostController.doFeaturedPosts
);

router.patch(
  "/bookmark/:id",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  PostController.toggleBookmark
);

router.patch(
  "/:id",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  validateRequest(PostValidator.updatePost),
  PostController.updatePost
);

router.delete(
  "/:id",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  PostController.deletePost
);

// /:id must be last among GET routes — it matches any segment
router.get("/:id", PostController.getSinglePost);

export const PostRouter = router;
