import express from "express";
import validateRequest from "../../middleware/validate.request";
import { StoryInspirationController } from "./story_inspiration.controller";
import { StoryInspirationValidation } from "./story_inspiration.validation";

const router = express.Router();

router.post(
  "/",
  validateRequest(StoryInspirationValidation.createStoryInspirationSchema),
  StoryInspirationController.createStoryInspiration
);

export const StoryInspirationRouter = router;
