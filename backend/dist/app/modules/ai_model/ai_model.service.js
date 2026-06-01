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
exports.AiModelService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const api_error_1 = __importDefault(require("../../../errors/api_error"));
const generation_timeout_1 = require("../../../utils/generation_timeout");
const ai_model_utils_1 = require("./ai_model.utils");
const quota_lifecycle_1 = require("./quota.lifecycle");
const AUTHENTICATED_GENERATION_TIMEOUT_MS = 60000;
const FREE_GENERATION_TIMEOUT_MS = 60000;
const GENERATION_FAILED_MESSAGE = "Story generation failed. Your request quota has been restored.";
const FREE_GENERATION_FAILED_MESSAGE = "Story generation failed. Your free generation quota has been restored.";
const ALTERNATE_ENDING_FAILED_MESSAGE = "Alternate ending generation failed. Your request quota has been restored.";
const FREE_ALTERNATE_ENDING_FAILED_MESSAGE = "Alternate ending generation failed. Your free generation quota has been restored.";
const normalizeStoryPayload = (payload) => {
    var _a, _b, _c, _d, _e;
    return ({
        prompt: payload.prompt,
        wordLength: (_a = payload.wordLength) !== null && _a !== void 0 ? _a : 250,
        numStories: (_b = payload.numStories) !== null && _b !== void 0 ? _b : 2,
        language: (_c = payload.language) !== null && _c !== void 0 ? _c : "English",
        tone: (_d = payload.tone) !== null && _d !== void 0 ? _d : undefined,
        genre: (_e = payload.genre) !== null && _e !== void 0 ? _e : undefined,
    });
};
const mapGenerationError = (error, message) => {
    if (error instanceof api_error_1.default) {
        throw error;
    }
    if (error instanceof generation_timeout_1.GenerationTimeoutError) {
        throw new api_error_1.default(http_status_1.default.GATEWAY_TIMEOUT, "AI generation timed out. Please try again.");
    }
    const errorMsg = error instanceof Error ? error.message : String(error);
    throw new api_error_1.default(http_status_1.default.BAD_GATEWAY, `${message} (${errorMsg})`);
};
// Bug fix 1: quota.lifecycle owns rollback — no manual User.updateOne needed.
// Bug fix 2: _token kept as unused param (quota handled upstream by middleware).
const aiModelGenerate = (payload, _token) => __awaiter(void 0, void 0, void 0, function* () {
    const { prompt, wordLength, numStories, language, tone, genre } = normalizeStoryPayload(payload);
    try {
        const result = yield (0, generation_timeout_1.raceGenerationWithTimeout)((signal) => (0, ai_model_utils_1.generateWithGeminiStories)(prompt, wordLength, numStories, language, signal, tone, genre), AUTHENTICATED_GENERATION_TIMEOUT_MS);
        (0, quota_lifecycle_1.assertSuccessfulGeneration)(result, GENERATION_FAILED_MESSAGE);
        return result;
    }
    catch (error) {
        mapGenerationError(error, GENERATION_FAILED_MESSAGE);
    }
});
const aiFreeModelGenerate = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { prompt, wordLength, numStories, language, tone, genre } = normalizeStoryPayload(payload);
    try {
        const result = yield (0, generation_timeout_1.raceGenerationWithTimeout)((signal) => (0, ai_model_utils_1.generateWithGeminiStories)(prompt, wordLength, numStories, language, signal, tone, genre), FREE_GENERATION_TIMEOUT_MS);
        (0, quota_lifecycle_1.assertSuccessfulGeneration)(result, FREE_GENERATION_FAILED_MESSAGE);
        return result;
    }
    catch (error) {
        mapGenerationError(error, FREE_GENERATION_FAILED_MESSAGE);
    }
});
// Bug fix 3: migrated from old inline quota pattern to quota.lifecycle,
// consistent with aiModelGenerate and all other authenticated functions.
const aiModelAlternateEndings = (payload, _token) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, tag, language = "English" } = payload;
    try {
        const result = yield (0, generation_timeout_1.raceGenerationWithTimeout)(() => (0, ai_model_utils_1.generateAlternateEndingsWithGemini)(title, content, tag, language), AUTHENTICATED_GENERATION_TIMEOUT_MS);
        (0, quota_lifecycle_1.assertSuccessfulGeneration)(result, ALTERNATE_ENDING_FAILED_MESSAGE);
        return result;
    }
    catch (error) {
        mapGenerationError(error, ALTERNATE_ENDING_FAILED_MESSAGE);
    }
});
const aiFreeModelAlternateEndings = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, tag, language = "English" } = payload;
    try {
        const result = yield (0, generation_timeout_1.raceGenerationWithTimeout)(() => (0, ai_model_utils_1.generateAlternateEndingsWithGemini)(title, content, tag, language), FREE_GENERATION_TIMEOUT_MS);
        (0, quota_lifecycle_1.assertSuccessfulGeneration)(result, FREE_ALTERNATE_ENDING_FAILED_MESSAGE);
        return result;
    }
    catch (error) {
        mapGenerationError(error, FREE_ALTERNATE_ENDING_FAILED_MESSAGE);
    }
});
const aiModelRemix = (payload, _token) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, tag, remixType, remixOption = "", language = "English" } = payload;
    try {
        const result = yield (0, generation_timeout_1.raceGenerationWithTimeout)(() => (0, ai_model_utils_1.generateRemixWithGemini)(title, content, tag, remixType, remixOption, language), AUTHENTICATED_GENERATION_TIMEOUT_MS);
        return result;
    }
    catch (error) {
        mapGenerationError(error, "Remix generation failed.");
    }
});
const aiFreeModelRemix = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, tag, remixType, remixOption = "", language = "English" } = payload;
    try {
        const result = yield (0, generation_timeout_1.raceGenerationWithTimeout)(() => (0, ai_model_utils_1.generateRemixWithGemini)(title, content, tag, remixType, remixOption, language), FREE_GENERATION_TIMEOUT_MS);
        return result;
    }
    catch (error) {
        mapGenerationError(error, "Remix generation failed.");
    }
});
const aiModelTranslate = (payload, _token) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, targetLanguage } = payload;
    try {
        const result = yield (0, generation_timeout_1.raceGenerationWithTimeout)(() => (0, ai_model_utils_1.translateStoryWithGemini)(title, content, targetLanguage), AUTHENTICATED_GENERATION_TIMEOUT_MS);
        return result;
    }
    catch (error) {
        mapGenerationError(error, "Translation failed.");
    }
});
const aiFreeModelTranslate = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, targetLanguage } = payload;
    try {
        const result = yield (0, generation_timeout_1.raceGenerationWithTimeout)(() => (0, ai_model_utils_1.translateStoryWithGemini)(title, content, targetLanguage), FREE_GENERATION_TIMEOUT_MS);
        return result;
    }
    catch (error) {
        mapGenerationError(error, "Translation failed.");
    }
});
const aiModelChat = (payload, _token) => __awaiter(void 0, void 0, void 0, function* () {
    const { message, history = [] } = payload;
    try {
        const formattedHistory = history.map((msg) => ({
            role: msg.role,
            parts: [{ text: msg.parts }],
        }));
        const result = yield (0, generation_timeout_1.raceGenerationWithTimeout)(() => (0, ai_model_utils_1.chatWithGemini)(message, formattedHistory), AUTHENTICATED_GENERATION_TIMEOUT_MS);
        return result;
    }
    catch (error) {
        mapGenerationError(error, "AI chat failed.");
    }
});
const aiFreeModelChat = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { message, history = [] } = payload;
    try {
        const formattedHistory = history.map((msg) => ({
            role: msg.role,
            parts: [{ text: msg.parts }],
        }));
        const result = yield (0, generation_timeout_1.raceGenerationWithTimeout)(() => (0, ai_model_utils_1.chatWithGemini)(message, formattedHistory), FREE_GENERATION_TIMEOUT_MS);
        return result;
    }
    catch (error) {
        mapGenerationError(error, "AI chat failed.");
    }
});
exports.AiModelService = {
    aiModelGenerate,
    aiFreeModelGenerate,
    aiModelAlternateEndings,
    aiFreeModelAlternateEndings,
    aiModelRemix,
    aiFreeModelRemix,
    aiModelTranslate,
    aiFreeModelTranslate,
    aiModelChat,
    aiFreeModelChat,
};
