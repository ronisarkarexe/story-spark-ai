import express from "express";
import validateRequest from "../../middleware/validate.request";
import { StoryVisualizerController } from "./story_visualizer.controller";
import { StoryVisualizerValidator } from "./story_visualizer.validation";
import freeAiRateLimiter from "../../middleware/free-ai.rate-limiter";

const router = express.Router();

router.post(
  "/generate",
  freeAiRateLimiter,
  validateRequest(StoryVisualizerValidator.generateStoryboard),
  StoryVisualizerController.generateStoryboard
);

export const StoryVisualizerRouter = router;
