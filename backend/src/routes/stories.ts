import express from "express";
import { z } from "zod";
import validateRequest from "../app/middleware/validate.request";
import { StoryBranchingController } from "../controllers/storyBranchingController";

const router = express.Router();

const branchingStorySchema = z.object({
  body: z.object({
    storyContext: z.string({ required_error: "storyContext is required!" }).max(8000),
    selectedChoice: z.string({ required_error: "selectedChoice is required!" }),
    genre: z.string().max(120).optional(),
  }),
});

router.post(
  "/branching",
  validateRequest(branchingStorySchema),
  StoryBranchingController.createBranchingStory
);

export const StoriesRouter = router;