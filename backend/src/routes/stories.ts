import express from "express";
import { z } from "zod";
import validateRequest from "../app/middleware/validate.request";
import { StoryBranchingController } from "../controllers/storyBranchingController";
import auth from "../app/middleware/auth.middleware";
import { ENUM_USER_ROLE } from "../enums/user";

const router = express.Router();

const branchingStorySchema = z.object({
  body: z.object({
    storyContext: z.string({ required_error: "storyContext is required!" }).max(8000),

    selectedChoice: z
      .string({ required_error: "selectedChoice is required!" })
      .max(500, "selectedChoice must not exceed 500 characters"),

    genre: z.string().max(120).optional(),
  }),
});

router.post(
  "/branching",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  validateRequest(branchingStorySchema),
  StoryBranchingController.createBranchingStory
);

export const StoriesRouter = router;