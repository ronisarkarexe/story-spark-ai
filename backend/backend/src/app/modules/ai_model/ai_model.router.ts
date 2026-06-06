import express from "express";
import { AiModelController } from "./ai_model.controller";
import validateRequest from "../../middleware/validate.request";
import { AIModelValidator } from "./ai_model.validation";
import checkRequestLimit from "../../middleware/check.request.limit";
import auth from "../../middleware/auth.middleware";
import freeAiRateLimiter from "../../middleware/free-ai.rate-limiter";
import {
  aiGenerationRateLimiter,
} from "../../middleware/ip.rate-limiter";
const router = express.Router();

// ========== GENERATE STORIES ==========

// Generate Model - PROTECTED (authenticated users only)
router.post(
  "/generate-model",
  aiGenerationRateLimiter,
  auth(),
  validateRequest(AIModelValidator.aiModel),
  checkRequestLimit(),
  AiModelController.aiModelGenerate
);

// Generate Free Model - PUBLIC (guests allowed)
router.post(
  "/generate-free-model",
  validateRequest(AIModelValidator.aiModel),
  freeAiRateLimiter,
  AiModelController.aiFreeModelGenerate
);

// Generate Model Stream - PROTECTED
router.post(
  "/generate-model-stream",
  auth(),
  validateRequest(AIModelValidator.aiModel),
  AiModelController.aiModelGenerateStream
);

// ========== ALTERNATE ENDINGS ==========

// Generate Alternate Endings - PROTECTED (authenticated users only)
router.post(
  "/generate-alternate-endings",
  aiGenerationRateLimiter,
  auth(),
  validateRequest(AIModelValidator.aiAlternateEndings),
  checkRequestLimit(),
  AiModelController.aiModelAlternateEndings
);

// Generate Free Alternate Endings - PUBLIC (guests allowed)
router.post(
  "/generate-free-alternate-endings",
  validateRequest(AIModelValidator.aiAlternateEndings),
  freeAiRateLimiter,
  AiModelController.aiFreeModelAlternateEndings
);

// ========== REMIX ==========

// Remix Story - PROTECTED
router.post(
  "/remix",
  aiGenerationRateLimiter,
  auth(),
  checkRequestLimit(),
  validateRequest(AIModelValidator.aiRemix),
  AiModelController.aiModelRemix
);

// Remix Story Free - PUBLIC
router.post(
  "/remix-free",
  freeAiRateLimiter,
  validateRequest(AIModelValidator.aiRemix),
  AiModelController.aiFreeModelRemix
);

// ========== TRANSLATE ==========

// Translate Story - PROTECTED
router.post(
  "/translate",
  aiGenerationRateLimiter,
  auth(),
  checkRequestLimit(),
  validateRequest(AIModelValidator.aiTranslate),
  AiModelController.aiModelTranslate
);

// Translate Story Free - PUBLIC
router.post(
  "/translate-free",
  freeAiRateLimiter,
  validateRequest(AIModelValidator.aiTranslate),
  AiModelController.aiFreeModelTranslate
);

// ========== AI CHAT ==========

// AI Chat - PROTECTED
router.post(
  "/chat",
  auth(),
  validateRequest(AIModelValidator.aiChat),
  checkRequestLimit(),
  AiModelController.aiModelChat
);

// AI Chat Free - PUBLIC
router.post(
  "/chat-free",
  validateRequest(AIModelValidator.aiChat),
  freeAiRateLimiter,
  AiModelController.aiFreeModelChat
);

export const AIModelRouter = router;
