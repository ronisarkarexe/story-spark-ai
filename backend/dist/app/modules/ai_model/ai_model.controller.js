"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiModelController = void 0;
const cookie_util_1 = require("../../../utils/cookie.util");
const http_status_1 = __importDefault(require("http-status"));
const api_error_1 = __importDefault(require("../../../errors/api_error"));
const catch_async_1 = __importDefault(require("../../../shared/catch_async"));
const send_response_1 = __importDefault(require("../../../shared/send_response"));
const ai_model_service_1 = require("./ai_model.service");
const quota_service_1 = require("./quota.service");
const quota_lifecycle_1 = require("./quota.lifecycle");
const ai_model_utils_1 = require("./ai_model.utils");
const aiModelGenerate = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prompt = req.body;
    const guard = res.locals.quotaRefundGuard;
    if (!guard) {
        throw new api_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Quota guard missing — checkRequestLimit middleware required");
    }
    yield (0, quota_lifecycle_1.runWithQuotaCleanup)(guard, () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield ai_model_service_1.AiModelService.aiModelGenerate(prompt);
        (0, send_response_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Stories generated successfully!",
            data: result,
        });
    }));
}));
const aiFreeModelGenerate = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prompt = req.body;
    let userId = req.cookies.userId;
    if (!userId) {
        userId = Math.random().toString(36).substring(7);
        (0, cookie_util_1.setGuestUserIdCookie)(res, userId); // ✅ Fixed: now includes sameSite
    }
    const guard = (0, quota_lifecycle_1.createGuestQuotaGuard)(userId);
    yield (0, quota_lifecycle_1.runWithQuotaCleanup)(guard, () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, quota_service_1.reserveGuestQuota)(userId);
        const result = yield ai_model_service_1.AiModelService.aiFreeModelGenerate(prompt);
        (0, send_response_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Story generated successfully!",
            data: result,
        });
    }));
}));
const aiModelAlternateEndings = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const guard = res.locals.quotaRefundGuard;
    if (!guard) {
        throw new api_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Quota guard missing — checkRequestLimit middleware required");
    }
    yield (0, quota_lifecycle_1.runWithQuotaCleanup)(guard, () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield ai_model_service_1.AiModelService.aiModelAlternateEndings(payload);
        (0, send_response_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Alternate endings generated successfully!",
            data: result,
        });
    }));
}));
const aiFreeModelAlternateEndings = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    let userId = req.cookies.userId;
    if (!userId) {
        userId = Math.random().toString(36).substring(7);
        (0, cookie_util_1.setGuestUserIdCookie)(res, userId); // ✅ Fixed: now includes sameSite
    }
    const guard = (0, quota_lifecycle_1.createGuestQuotaGuard)(userId);
    yield (0, quota_lifecycle_1.runWithQuotaCleanup)(guard, () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, quota_service_1.reserveGuestQuota)(userId);
        const result = yield ai_model_service_1.AiModelService.aiFreeModelAlternateEndings(payload);
        (0, send_response_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Alternate endings generated successfully!",
            data: result,
        });
    }));
}));
const aiModelGenerateStream = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { prompt, wordLength, numStories } = req.body;
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();
    const controller = new AbortController();
    req.on("close", () => {
        controller.abort();
    });
    try {
        yield (0, ai_model_utils_1.generateWithGeminiStoriesStream)(prompt, wordLength !== null && wordLength !== void 0 ? wordLength : 250, numStories !== null && numStories !== void 0 ? numStories : 2, (chunk) => {
            res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
        }, controller.signal);
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
    }
    catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        res.write(`data: ${JSON.stringify({ error: errorMsg })}\n\n`);
        res.end();
    }
});
const aiModelRemix = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const guard = res.locals.quotaRefundGuard;
    if (!guard) {
        throw new api_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Quota guard missing — checkRequestLimit middleware required");
    }
    yield (0, quota_lifecycle_1.runWithQuotaCleanup)(guard, () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield ai_model_service_1.AiModelService.aiModelRemix(payload);
        (0, send_response_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Story remixed successfully!",
            data: result,
        });
    }));
}));
const aiFreeModelRemix = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    let userId = req.cookies.userId;
    if (!userId) {
        userId = Math.random().toString(36).substring(7);
        res.cookie("userId", userId, { maxAge: 30 * 24 * 60 * 60 * 1000 });
    }
    const guard = (0, quota_lifecycle_1.createGuestQuotaGuard)(userId);
    yield (0, quota_lifecycle_1.runWithQuotaCleanup)(guard, () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, quota_service_1.reserveGuestQuota)(userId);
        const result = yield ai_model_service_1.AiModelService.aiFreeModelRemix(payload);
        (0, send_response_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Story remixed successfully!",
            data: result,
        });
    }));
}));
const aiModelTranslate = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const guard = res.locals.quotaRefundGuard;
    if (!guard) {
        throw new api_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Quota guard missing — checkRequestLimit middleware required");
    }
    yield (0, quota_lifecycle_1.runWithQuotaCleanup)(guard, () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield ai_model_service_1.AiModelService.aiModelTranslate(payload);
        (0, send_response_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Story translated successfully!",
            data: result,
        });
    }));
}));
const aiFreeModelTranslate = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    let userId = req.cookies.userId;
    if (!userId) {
        userId = Math.random().toString(36).substring(7);
        res.cookie("userId", userId, { maxAge: 30 * 24 * 60 * 60 * 1000 });
    }
    const guard = (0, quota_lifecycle_1.createGuestQuotaGuard)(userId);
    yield (0, quota_lifecycle_1.runWithQuotaCleanup)(guard, () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, quota_service_1.reserveGuestQuota)(userId);
        const result = yield ai_model_service_1.AiModelService.aiFreeModelTranslate(payload);
        (0, send_response_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Story translated successfully!",
            data: result,
        });
    }));
}));
const aiModelChat = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const guard = res.locals.quotaRefundGuard;
    if (!guard) {
        throw new api_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Quota guard missing — checkRequestLimit middleware required");
    }
    yield (0, quota_lifecycle_1.runWithQuotaCleanup)(guard, () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield ai_model_service_1.AiModelService.aiModelChat(payload);
        (0, send_response_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Chat response generated successfully!",
            data: result,
        });
    }));
}));
const aiFreeModelChat = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    let userId = req.cookies.userId;
    if (!userId) {
        userId = Math.random().toString(36).substring(7);
        res.cookie("userId", userId, { maxAge: 30 * 24 * 60 * 60 * 1000 });
    }
    const guard = (0, quota_lifecycle_1.createGuestQuotaGuard)(userId);
    yield (0, quota_lifecycle_1.runWithQuotaCleanup)(guard, () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, quota_service_1.reserveGuestQuota)(userId);
        const result = yield ai_model_service_1.AiModelService.aiFreeModelChat(payload);
        (0, send_response_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Chat response generated successfully!",
            data: result,
        });
    }));
}));
exports.AiModelController = {
    aiModelGenerate,
    aiFreeModelGenerate,
    aiModelAlternateEndings,
    aiFreeModelAlternateEndings,
    aiModelGenerateStream,
    aiModelRemix,
    aiFreeModelRemix,
    aiModelTranslate,
    aiFreeModelTranslate,
    aiModelChat,
    aiFreeModelChat,
};
