import express from "express";
import { StoryConsistencyController } from "./story_consistency.controller";
import auth from "../../middleware/auth.middleware";
import freeAiRateLimiter from "../../middleware/free-ai.rate-limiter";
import storyGenerationRateLimiter from "../../middleware/story.rate-limiter";
import validateRequest from "../../middleware/validate.request";
import { StoryConsistencyValidation } from "./story_consistency.validation";

const router = express.Router();

router.post(
  "/analyze",
  freeAiRateLimiter,
  validateRequest(StoryConsistencyValidation.analyzeSchema),
  StoryConsistencyController.analyze
);

router.post(
  "/analyze-auth",
  auth(),
  storyGenerationRateLimiter,
  validateRequest(StoryConsistencyValidation.analyzeSchema),
  StoryConsistencyController.analyze
);

router.post(
  "/track-facts",
  freeAiRateLimiter,
  StoryConsistencyController.trackFacts
);

router.post(
  "/track-facts-auth",
  auth(),
  storyGenerationRateLimiter,
  StoryConsistencyController.trackFacts
);


export const StoryConsistencyRouter = router;