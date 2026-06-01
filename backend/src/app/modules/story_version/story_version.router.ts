import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middleware/auth.middleware";
import { StoryVersionController } from "./story_version.controller";

const router = express.Router();

// Retrieve all versions of a story
router.get(
  "/:id/versions",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  StoryVersionController.getVersionsByStoryId
);

// Retrieve a specific version snapshot
router.get(
  "/version/:versionId",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  StoryVersionController.getVersionById
);

// Restore to a specific version snapshot
router.post(
  "/version/:versionId/restore",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  StoryVersionController.restoreVersion
);

// Enhance a story prompt using AI
router.post(
  "/enhance-prompt",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  StoryVersionController.enhancePrompt
);

export const StoryVersionRouter = router;