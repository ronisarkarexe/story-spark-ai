import express from "express";
import { AiModelController } from "./ai_model.controller";
import validateRequest from "../../middleware/validate.request";
import { AIModelValidator } from "./ai_model.validation";
import checkRequestLimit from "../../middleware/check.request.limit";
import { enforceQuota } from "../../middleware/enforceQuota.middleware";
import auth from "../../middleware/auth.middleware";
import freeAiRateLimiter from "../../middleware/free-ai.rate-limiter";
import { aiGenerationRateLimiter } from "../../middleware/ip.rate-limiter";
import storyGenerationRateLimiter from "../../middleware/story.rate-limiter";
import { apiRateLimiter } from "../../middleware/rateLimit.middleware";

const router = express.Router();

// GENERATE STORIES
router.post("/generate-model", apiRateLimiter, auth(), storyGenerationRateLimiter, validateRequest(AIModelValidator.aiModel), enforceQuota("story_generate"), AiModelController.aiModelGenerate);

router.post("/generate-free-model", apiRateLimiter, validateRequest(AIModelValidator.aiModel), freeAiRateLimiter, AiModelController.aiFreeModelGenerate);

// Generate Model Stream - PROTECTED
router.post(
  "/generate-model-stream",
  apiRateLimiter,
  auth(),
  storyGenerationRateLimiter,
  validateRequest(AIModelValidator.aiModel),
  enforceQuota("story_generate"),
  AiModelController.aiModelGenerateStream
);

// ALTERNATE ENDINGS
router.post("/generate-alternate-endings", apiRateLimiter, auth(), storyGenerationRateLimiter, validateRequest(AIModelValidator.aiAlternateEndings), enforceQuota("story_generate"), AiModelController.aiModelAlternateEndings);

router.post("/generate-free-alternate-endings", apiRateLimiter, validateRequest(AIModelValidator.aiAlternateEndings), freeAiRateLimiter, AiModelController.aiFreeModelAlternateEndings);

// REMIX
router.post("/remix", apiRateLimiter, auth(), storyGenerationRateLimiter, enforceQuota("story_generate"), validateRequest(AIModelValidator.aiRemix), AiModelController.aiModelRemix);

router.post("/remix-free", apiRateLimiter, freeAiRateLimiter, validateRequest(AIModelValidator.aiRemix), AiModelController.aiFreeModelRemix);

// TRANSLATE
router.post("/translate", apiRateLimiter, auth(), storyGenerationRateLimiter, enforceQuota("story_generate"), validateRequest(AIModelValidator.aiTranslate), AiModelController.aiModelTranslate);

router.post("/translate-free", apiRateLimiter, freeAiRateLimiter, validateRequest(AIModelValidator.aiTranslate), AiModelController.aiFreeModelTranslate);

// STORY CONTINUATION
router.post("/continue-story", apiRateLimiter, auth(), storyGenerationRateLimiter, validateRequest(AIModelValidator.aiStoryContinuation), enforceQuota("story_continue"), AiModelController.aiStoryContinuation);

router.post("/continue-story-free", apiRateLimiter, validateRequest(AIModelValidator.aiStoryContinuation), freeAiRateLimiter, AiModelController.aiFreeStoryContinuation);

// AI CHAT
router.post("/chat", apiRateLimiter, auth(), storyGenerationRateLimiter, validateRequest(AIModelValidator.aiChat), checkRequestLimit(), AiModelController.aiModelChat);

router.post("/chat-free", apiRateLimiter, validateRequest(AIModelValidator.aiChat), freeAiRateLimiter, AiModelController.aiFreeModelChat);

export const AIModelRouter = router;
