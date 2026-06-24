import express from "express";
import { AiEditorController } from "./ai_editor.controller";
import freeAiRateLimiter from "../../middleware/free-ai.rate-limiter";

const router = express.Router();

// Publicly available to support both guest authors and registered writers
router.post("/analyze",freeAiRateLimiter , AiEditorController.analyzeStory);

export const AIEditorRouter = router;
