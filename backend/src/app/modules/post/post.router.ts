import express from "express";
import { PostController } from "./post.controller";
import { protect } from "../../middlewares/auth.middleware"; 
import { checkRequestLimit } from "../../middlewares/quota.middleware"; 

const router = express.Router();

/* ============================================================
   SYSTEM LAYOUT CONFIGURATIONS & CORE INBOUND PUBLIC ENTRIES
   ============================================================ */

router.post(
  "/create-post",
  protect,
  PostController.createPost
);

router.get(
  "/",
  PostController.getPosts
);

router.get(
  "/latest-posts",
  PostController.getLatestPosts
);

router.get(
  "/featured-posts",
  PostController.getFeaturedPosts
);

router.patch(
  "/featured/:postId",
  protect,
  PostController.doFeaturedPosts
);

router.get(
  "/:id",
  PostController.getSinglePost
);

router.get(
  "/tag/:tag",
  PostController.getPostsByTag
);

router.patch(
  "/bookmark/:id",
  protect,
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
  PostController.updatePost
);

router.delete(
  "/:id",
  protect,
  PostController.deletePost
);

/* ============================================================
   PATCHED MODULE ROUTES — GSSoC '26 RESOURCE MANAGEMENT
   ============================================================ */

/**
 * @route   POST /api/v1/post/remix
 * @desc    Remix an existing story prompt variant using AI models
 * @access  Private (Quota Monitored)
 */
router.post(
  "/remix",
  protect,
  checkRequestLimit, // <-- FIXED: Intercepts request if user exceeded monthly quota balance
  PostController.remixStory
);

/**
 * @route   POST /api/v1/post/translate
 * @desc    Translate generated story variations across languages
 * @access  Private (Quota Monitored)
 */
router.post(
  "/translate",
  protect,
  checkRequestLimit, // <-- FIXED: Intercepts request if user exceeded monthly quota balance
  PostController.translateStory
);

export const PostRouter = router;
