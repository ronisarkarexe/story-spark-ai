import express from "express";
import { EngagementController } from "./engagement.controller";
import freeAiRateLimiter from "../../middleware/free-ai.rate-limiter";

const router = express.Router();

router.post("/analyze", freeAiRateLimiter, EngagementController.analyzeChapter);

export const EngagementRouter = router;
