import express from "express";
import { AiModelController } from "./ai_model.controller";
import validateRequest from "../../middleware/validate.request";
import { AIModelValidator } from "./ai_model.validation";
import checkRequestLimit from "../../middleware/check.request.limit";
import freeAiRateLimiter from "../../middleware/free-ai.rate-limiter";
const router = express.Router();

// Generate Model
router.post(
  "/generate-model",
  validateRequest(AIModelValidator.aiModel),
  checkRequestLimit(),
  AiModelController.aiModelGenerate
);

// Generate Free Model
router.post(
  "/generate-free-model",
  validateRequest(AIModelValidator.aiModel),
  freeAiRateLimiter,
  AiModelController.aiFreeModelGenerate
);

// Generate Model Stream
router.post(
  "/generate-model-stream",
  validateRequest(AIModelValidator.aiModel),
  AiModelController.aiModelGenerateStream
);

// Generate Alternate Endings
router.post(
  "/generate-alternate-endings",
  validateRequest(AIModelValidator.aiAlternateEndings),
  checkRequestLimit(),
  AiModelController.aiModelAlternateEndings
);

// Generate Free Alternate Endings
router.post(
  "/generate-free-alternate-endings",
  validateRequest(AIModelValidator.aiAlternateEndings),
  freeAiRateLimiter,
  AiModelController.aiFreeModelAlternateEndings
);

// Remix Story
router.post(
  "/remix",
  checkRequestLimit(),
  AiModelController.aiModelRemix
);
// Remix Story Free
router.post(
  "/remix-free",
  freeAiRateLimiter,
  AiModelController.aiFreeModelRemix
);
// Translate Story
router.post(
  "/translate",
  checkRequestLimit(),
  AiModelController.aiModelTranslate
);
// Translate Story Free
router.post(
  "/translate-free",
  freeAiRateLimiter,
  AiModelController.aiFreeModelTranslate
);

// AI Chat
router.post(
  "/chat",
  validateRequest(AIModelValidator.aiChat),
  checkRequestLimit(),
  AiModelController.aiModelChat
);

// AI Chat Free
router.post(
  "/chat-free",
  validateRequest(AIModelValidator.aiChat),
  freeAiRateLimiter,
  AiModelController.aiFreeModelChat
);

export const AIModelRouter = router;
