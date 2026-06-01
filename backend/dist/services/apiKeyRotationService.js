"use strict";
/**
 * apiKeyRotationService.ts
 * ────────────────────────
 * Round-robin API key rotation for the AI provider.
 *
 * Setup (.env):
 *   AI_API_KEYS=sk-key1,sk-key2,sk-key3
 *
 * Backward-compatible: falls back to OPENAI_API_KEY or
 * GOOGLE_GEMINI_API_KEY if AI_API_KEYS is not set.
 *
 * Usage:
 *   import { getNextApiKey, availableKeyCount } from "./apiKeyRotationService";
 *   const key = getNextApiKey(); // use in your AI SDK call
 *
 * GSSoC 2026 | feat/rate-limiting-api-key-rotation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextApiKey = getNextApiKey;
exports.availableKeyCount = availableKeyCount;
exports.resetRotationIndex = resetRotationIndex;
let _index = 0;
/** Parse and return all configured AI API keys */
function loadKeys() {
    var _a, _b, _c;
    const raw = (_a = process.env.AI_API_KEYS) !== null && _a !== void 0 ? _a : "";
    const keys = raw
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
    if (keys.length > 0)
        return keys;
    // Backward-compat fallbacks (single-key setups)
    const fallback = (_c = (_b = process.env.OPENAI_API_KEY) !== null && _b !== void 0 ? _b : process.env.GOOGLE_GEMINI_API_KEY) !== null && _c !== void 0 ? _c : "";
    return fallback ? [fallback] : [];
}
/**
 * Returns the next API key in round-robin rotation.
 * Throws a descriptive error when no keys are configured.
 */
function getNextApiKey() {
    const keys = loadKeys();
    if (keys.length === 0) {
        throw new Error("[apiKeyRotationService] No AI API keys found.\n" +
            "Set AI_API_KEYS=key1,key2,key3 in your .env file.\n" +
            "Or set OPENAI_API_KEY / GOOGLE_GEMINI_API_KEY for single-key mode.");
    }
    const key = keys[_index % keys.length];
    _index = (_index + 1) % Number.MAX_SAFE_INTEGER; // prevent overflow
    return key;
}
/** Returns how many keys are currently loaded */
function availableKeyCount() {
    return loadKeys().length;
}
/** Reset rotation index — useful in tests */
function resetRotationIndex() {
    _index = 0;
}
