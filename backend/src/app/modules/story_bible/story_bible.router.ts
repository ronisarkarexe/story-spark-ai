import express from "express";
import * as StoryBibleController from "./story_bible.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.get("/:storyId", auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.WRITER, USER_ROLE.USER), StoryBibleController.getStoryBible);
router.put("/:storyId", auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.WRITER, USER_ROLE.USER), StoryBibleController.updateStoryBible);
router.post("/:storyId/extract", auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.WRITER, USER_ROLE.USER), StoryBibleController.extractStoryBible);

export const StoryBibleRoutes = router;
