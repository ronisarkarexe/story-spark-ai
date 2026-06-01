"use strict";
// backend/src/services/ai.service.ts
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
exports.generateStory = generateStory;
const openai_1 = __importDefault(require("openai"));
const generative_ai_1 = require("@google/generative-ai");
const openai = new openai_1.default({ apiKey: process.env.OPEN_AI_KEY });
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
// ─── OpenAI call ─────────────────────────────────────────────────────────────
function generateWithOpenAI(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const response = yield openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1000,
        }, { timeout: 10000 });
        const text = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content;
        if (!text)
            throw new Error("OpenAI returned an empty response");
        return text;
    });
}
// ─── Gemini call ─────────────────────────────────────────────────────────────
function generateWithGemini(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = yield model.generateContent(prompt);
        const text = result.response.text();
        if (!text)
            throw new Error("Gemini returned an empty response");
        return text;
    });
}
// ─── Helper: is this error worth falling back on? ────────────────────────────
function isRetryableError(error) {
    if (!(error instanceof Error))
        return true;
    const msg = error.message.toLowerCase();
    // Rate limits, timeouts, server errors → fallback
    if (msg.includes("rate limit"))
        return true;
    if (msg.includes("timeout"))
        return true;
    if (msg.includes("503") ||
        msg.includes("502") ||
        msg.includes("500"))
        return true;
    if (msg.includes("empty response"))
        return true;
    // Bad API key → don't bother falling back (won't help)
    if (msg.includes("401") ||
        msg.includes("invalid api key"))
        return false;
    return true; // fallback by default
}
// ─── Main exported function ───────────────────────────────────────────────────
function generateStory(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        // ── Try OpenAI first ──────────────────────────────────────────────────────
        try {
            const story = yield generateWithOpenAI(prompt);
            console.log("[AI] Story generated successfully via OpenAI");
            return { story, provider: "openai", fallbackUsed: false };
        }
        catch (openAIError) {
            console.warn("[AI] OpenAI failed:", openAIError instanceof Error ? openAIError.message : openAIError);
            // Only fall back if the error type warrants it
            if (!isRetryableError(openAIError)) {
                throw new Error("OpenAI request failed with a non-retryable error. Please check your API key.");
            }
            console.log("[AI] Falling back to Gemini...");
        }
        // ── Try Gemini as fallback ────────────────────────────────────────────────
        try {
            const story = yield generateWithGemini(prompt);
            console.log("[AI] Story generated successfully via Gemini (fallback)");
            return { story, provider: "gemini", fallbackUsed: true };
        }
        catch (geminiError) {
            console.error("[AI] Gemini also failed:", geminiError instanceof Error ? geminiError.message : geminiError);
            // Both failed — throw a clean user-facing error
            throw new Error("Story generation failed. Both AI providers are currently unavailable. Please try again later.");
        }
    });
}
