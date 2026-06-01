import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middleware/auth.middleware";
import { BookmarkController } from "./bookmark.controller";

const router = express.Router();

// Toggle bookmark (add/remove)
router.post(
  "/:storyId",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  BookmarkController.toggleBookmark
);

// Get user's bookmarked stories
router.get(
  "/",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  BookmarkController.getBookmarks
);

// Check if a specific story is bookmarked
router.get(
  "/status/:storyId",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  BookmarkController.checkBookmarkStatus
);

// Delete bookmark directly
router.delete(
  "/:storyId",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  BookmarkController.deleteBookmark
);

export const BookmarkRouter = router;
