"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIModelRouter = void 0;
const express_1 = __importDefault(require("express"));
const ai_model_controller_1 = require("./ai_model.controller");
const validate_request_1 = __importDefault(require("../../middleware/validate.request"));
const ai_model_validation_1 = require("./ai_model.validation");
const check_request_limit_1 = __importDefault(require("../../middleware/check.request.limit"));
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
const free_ai_rate_limiter_1 = __importDefault(require("../../middleware/free-ai.rate-limiter"));
const router = express_1.default.Router();
// ========== GENERATE STORIES ==========
// Generate Model - PROTECTED (authenticated users only)
router.post("/generate-model", (0, auth_middleware_1.default)(), (0, validate_request_1.default)(ai_model_validation_1.AIModelValidator.aiModel), (0, check_request_limit_1.default)(), ai_model_controller_1.AiModelController.aiModelGenerate);
// Generate Free Model - PUBLIC (guests allowed)
router.post("/generate-free-model", (0, validate_request_1.default)(ai_model_validation_1.AIModelValidator.aiModel), free_ai_rate_limiter_1.default, ai_model_controller_1.AiModelController.aiFreeModelGenerate);
// Generate Model Stream - PROTECTED
router.post("/generate-model-stream", (0, auth_middleware_1.default)(), (0, validate_request_1.default)(ai_model_validation_1.AIModelValidator.aiModel), ai_model_controller_1.AiModelController.aiModelGenerateStream);
// ========== ALTERNATE ENDINGS ==========
// Generate Alternate Endings - PROTECTED (authenticated users only)
router.post("/generate-alternate-endings", (0, auth_middleware_1.default)(), (0, validate_request_1.default)(ai_model_validation_1.AIModelValidator.aiAlternateEndings), (0, check_request_limit_1.default)(), ai_model_controller_1.AiModelController.aiModelAlternateEndings);
// Generate Free Alternate Endings - PUBLIC (guests allowed)
router.post("/generate-free-alternate-endings", (0, validate_request_1.default)(ai_model_validation_1.AIModelValidator.aiAlternateEndings), free_ai_rate_limiter_1.default, ai_model_controller_1.AiModelController.aiFreeModelAlternateEndings);
// ========== REMIX ==========
// Remix Story - PROTECTED
router.post("/remix", (0, auth_middleware_1.default)(), (0, check_request_limit_1.default)(), ai_model_controller_1.AiModelController.aiModelRemix);
// Remix Story Free - PUBLIC
router.post("/remix-free", free_ai_rate_limiter_1.default, ai_model_controller_1.AiModelController.aiFreeModelRemix);
// ========== TRANSLATE ==========
// Translate Story - PROTECTED
router.post("/translate", (0, auth_middleware_1.default)(), (0, check_request_limit_1.default)(), ai_model_controller_1.AiModelController.aiModelTranslate);
// Translate Story Free - PUBLIC
router.post("/translate-free", free_ai_rate_limiter_1.default, ai_model_controller_1.AiModelController.aiFreeModelTranslate);
// ========== AI CHAT ==========
// AI Chat - PROTECTED
router.post("/chat", (0, auth_middleware_1.default)(), (0, validate_request_1.default)(ai_model_validation_1.AIModelValidator.aiChat), (0, check_request_limit_1.default)(), ai_model_controller_1.AiModelController.aiModelChat);
// AI Chat Free - PUBLIC
router.post("/chat-free", (0, validate_request_1.default)(ai_model_validation_1.AIModelValidator.aiChat), free_ai_rate_limiter_1.default, ai_model_controller_1.AiModelController.aiFreeModelChat);
exports.AIModelRouter = router;
