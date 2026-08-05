import express from "express";
import { EngagementController } from "./engagement.controller";
import { EngagementValidation } from "./engagement.validation";
import freeAiRateLimiter from "../../middleware/free-ai.rate-limiter";
import validateRequest from "../../middleware/validate.request";

const router = express.Router();

router.post(
  "/analyze",
  freeAiRateLimiter,
  validateRequest(EngagementValidation.analyzeChapter),
  EngagementController.analyzeChapter
);

export const EngagementRouter = router;
