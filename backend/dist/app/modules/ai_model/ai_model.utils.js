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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWithGeminiStories = generateWithGeminiStories;
exports.generateAlternateEndingsWithGemini = generateAlternateEndingsWithGemini;
exports.generateWithGeminiStoriesStream = generateWithGeminiStoriesStream;
exports.generateRemixWithGemini = generateRemixWithGemini;
exports.translateStoryWithGemini = translateStoryWithGemini;
exports.chatWithGemini = chatWithGemini;
const generative_ai_1 = require("@google/generative-ai");
const image_generation_1 = require("../../../utils/image_generation");
const generation_timeout_1 = require("../../../utils/generation_timeout");
const config_1 = __importDefault(require("../../../config"));
const uuid_1 = require("uuid");
const api_error_1 = __importDefault(require("../../../errors/api_error"));
const http_status_1 = __importDefault(require("http-status"));
const geminiApiKey = (_b = (_a = config_1.default.gemini_api_key) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : "";
const genAI = new generative_ai_1.GoogleGenerativeAI(geminiApiKey);
const MISSING_GEMINI_API_KEY_MESSAGE = "Gemini API key is not configured. Set GEMINI_API_KEY before using Gemini generation features.";
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
});
const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};
const safetySettings = [
    {
        category: generative_ai_1.HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: generative_ai_1.HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
        category: generative_ai_1.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: generative_ai_1.HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
];
const assertGeminiApiKeyConfigured = () => {
    if (!geminiApiKey) {
        throw new api_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, MISSING_GEMINI_API_KEY_MESSAGE);
    }
};
// NEW: Map each tone label to a precise writing instruction injected into the AI prompt.
// Keeping these as concrete directives (not vague adjectives) gives Gemini clear stylistic targets.
const TONE_INSTRUCTIONS = {
    Dark: "Write in a dark, gritty, and emotionally heavy tone. Explore themes of shadow, loss, moral ambiguity, and consequence. Avoid happy resolutions — let tension linger.",
    Humorous: "Write in a light-hearted, witty, and comedic tone. Include clever wordplay, funny observations, and absurd situations. Keep the mood playful throughout.",
    Romantic: "Write in a warm, tender, and emotionally rich tone. Focus on connection, longing, vulnerability, and heartfelt moments between characters.",
    Epic: "Write in a grand, dramatic, and heroic tone. Use vivid, sweeping imagery, high stakes, and bold character actions. Every sentence should feel consequential.",
    Mysterious: "Write in a suspenseful, atmospheric, and unsettling tone. Leave things deliberately unsaid. Build intrigue through detail and implication rather than exposition.",
    "Children's": "Write in a simple, wholesome, imaginative, and age-appropriate tone. Use short sentences, gentle humour, and a sense of wonder. Suitable for readers aged 5–10.",
};
/**
 * Returns the tone instruction string for injection into the prompt,
 * or an empty string if no tone (or an unrecognised tone) is supplied.
 */
const GENRE_MODIFIER_INSTRUCTIONS = {
    fantasy: "Write in the style of epic fantasy fiction. Include vivid world-building, magic, and heroic themes.",
    horror: "Write in the style of psychological horror. Build dread slowly, use dark imagery, and leave an unsettling feeling.",
    romance: "Write in the style of contemporary romance. Focus on emotional tension, character chemistry, and satisfying resolution.",
    scifi: "Write in the style of science fiction. Ground the story in plausible technology or speculative concepts.",
    mystery: "Write in the style of a mystery thriller. Plant subtle clues, build suspense, and deliver a reveal.",
    childrens: "Write in the style of a children's picture book. Use simple language, a warm tone, and a clear moral.",
};
const buildGenreInstruction = (genre) => {
    if (!genre)
        return "";
    const instruction = GENRE_MODIFIER_INSTRUCTIONS[genre];
    if (!instruction)
        return "";
    return `Genre & Style Directive: ${instruction}\n\n`;
};
const buildToneInstruction = (tone) => {
    if (!tone)
        return "";
    const instruction = TONE_INSTRUCTIONS[tone];
    if (!instruction)
        return "";
    return `Tone & Style Directive: ${instruction}\n\n`;
};
const throwIfAborted = (signal) => {
    if (signal === null || signal === void 0 ? void 0 : signal.aborted) {
        throw new generation_timeout_1.GenerationAbortedError();
    }
};
const sanitizeJsonText = (rawText) => {
    const trimmed = rawText.trim();
    if (!trimmed.startsWith("```")) {
        return trimmed;
    }
    return trimmed
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();
};
function generateWithGeminiStories(prompt_1) {
    return __awaiter(this, arguments, void 0, function* (prompt, wordLength = 250, numStories = 2, language = "English", signal, tone, // NEW: optional tone parameter
    genre) {
        throwIfAborted(signal);
        assertGeminiApiKeyConfigured();
        try {
            const chatSession = model.startChat({
                generationConfig,
                safetySettings,
                history: [],
            });
            // NEW: Prepend the tone instruction block to the Gemini prompt when a tone is selected.
            const toneInstruction = buildToneInstruction(tone);
            const genreInstruction = buildGenreInstruction(genre);
            const response = yield chatSession.sendMessage(`${genreInstruction}${toneInstruction}You are an expert storyteller and emotion analyst. The user provided the following base prompt: "${prompt}".
      First, enhance this prompt to be more emotionally engaging and context-sensitive (e.g., add suspense, joy, or mystery).
      Then, generate ${numStories} different short stories based on this ENHANCED prompt.
      The stories MUST be written entirely in the ${language} language.
      For each story, also analyze and detect the primary emotional tones (e.g., ["Joy", "Suspense", "Motivation"]) and the specific genre.
      Each story should be in JSON format with fields: "title", "content", "tag" (the main topic), "emotions" (an array of strings), "genre" (a string), and "enhancedPrompt" (the improved prompt used).
      Ensure each story is approximately ${wordLength} words long.
      Return only valid JSON array output.`);
            throwIfAborted(signal);
            const text = response.response.text();
            const parsed = JSON.parse(sanitizeJsonText(text));
            const stories = Array.isArray(parsed) ? parsed : parsed === null || parsed === void 0 ? void 0 : parsed.stories;
            if (!Array.isArray(stories) || stories.length === 0) {
                throw new api_error_1.default(http_status_1.default.BAD_GATEWAY, "Invalid AI response: Expected a non-empty story array.");
            }
            // Fetch images for stories concurrently
            const imagePromises = stories.map((story) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                try {
                    const imageResponse = yield (0, image_generation_1.fetchImageURL)(String((_b = (_a = story === null || story === void 0 ? void 0 : story.tag) !== null && _a !== void 0 ? _a : story === null || story === void 0 ? void 0 : story.title) !== null && _b !== void 0 ? _b : ""));
                    return (imageResponse === null || imageResponse === void 0 ? void 0 : imageResponse.imageUrl) || "";
                }
                catch (e) {
                    return "";
                }
            }));
            const imageUrls = yield Promise.all(imagePromises);
            return stories.map((story, index) => (Object.assign(Object.assign({}, story), { language, imageURL: imageUrls[index], uuid: (0, uuid_1.v4)() })));
        }
        catch (error) {
            if (error instanceof api_error_1.default || error instanceof generation_timeout_1.GenerationAbortedError) {
                throw error;
            }
            const errorMsg = error instanceof Error ? error.message : String(error);
            throw new api_error_1.default(http_status_1.default.BAD_GATEWAY, `AI story generation failed: ${errorMsg}`);
        }
    });
}
function generateAlternateEndingsWithGemini(title_1, content_1, tag_1) {
    return __awaiter(this, arguments, void 0, function* (title, content, tag, language = "English") {
        assertGeminiApiKeyConfigured();
        try {
            const chatSession = model.startChat({
                generationConfig,
                safetySettings,
                history: [],
            });
            const response = yield chatSession.sendMessage(`You are a professional narrative editor. Analyze the following story (Title: "${title}", Genre/Tag: "${tag}", Language: "${language}"):
      Story Content:
      "${content}"
      
      Generate 5 alternate endings for this story corresponding to the following styles:
      1. "Happy Ending"
      2. "Dark Ending"
      3. "Plot Twist Ending"
      4. "Open Ending"
      5. "Cliffhanger Ending"
      
      The generated alternate endings and the rewritten stories MUST be written entirely in the ${language} language.
      For each alternate ending, provide:
      - "style": The style name exactly as listed above.
      - "ending": A short paragraph or two describing the alternate ending scene itself.
      - "fullStory": The complete rewritten story with this new ending seamlessly integrated. The new ending should replace the original ending of the story, preserving the original story's context, setup, character names, and writing tone.
      
      Return the output as a JSON array of objects with the fields: "style", "ending", and "fullStory".`);
            const text = response.response.text();
            let parsed;
            try {
                parsed = JSON.parse(sanitizeJsonText(text));
            }
            catch (parseError) {
                const parseErrorMsg = parseError instanceof Error ? parseError.message : String(parseError);
                throw new api_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, `Gemini returned invalid JSON for alternate endings: ${parseErrorMsg}`);
            }
            if (!Array.isArray(parsed) || parsed.length === 0) {
                throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "Invalid AI response: Expected a non-empty JSON array.");
            }
            const isValid = parsed.every((item) => item &&
                typeof item === "object" &&
                typeof item.style === "string" &&
                typeof item.ending === "string" &&
                typeof item.fullStory === "string");
            if (!isValid) {
                throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "Invalid AI response: Alternate endings are malformed.");
            }
            return parsed;
        }
        catch (error) {
            if (error instanceof api_error_1.default) {
                throw error;
            }
            const errorMsg = error instanceof Error ? error.message : String(error);
            throw new api_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, `AI generation of alternate endings failed: ${errorMsg}`);
        }
    });
}
function generateWithGeminiStoriesStream(prompt_1) {
    return __awaiter(this, arguments, void 0, function* (prompt, wordLength = 250, numStories = 2, onChunk, signal) {
        var _a, e_1, _b, _c;
        if (signal === null || signal === void 0 ? void 0 : signal.aborted) {
            throw new generation_timeout_1.GenerationAbortedError();
        }
        const streamingModel = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });
        const streamingConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 8192,
        };
        try {
            const result = yield streamingModel.generateContentStream({
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: `Generate ${numStories} different short stories based on the following prompt: "${prompt}".
              Each story should be in JSON format with fields: "title", "content", and "tag".
              Ensure each story is approximately ${wordLength} words long.
              Return the output as a JSON array.`,
                            },
                        ],
                    },
                ],
                generationConfig: streamingConfig,
                safetySettings,
            });
            try {
                for (var _d = true, _e = __asyncValues(result.stream), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                    _c = _f.value;
                    _d = false;
                    const chunk = _c;
                    if (signal === null || signal === void 0 ? void 0 : signal.aborted) {
                        throw new generation_timeout_1.GenerationAbortedError();
                    }
                    const chunkText = chunk.text();
                    if (chunkText) {
                        onChunk(chunkText);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        catch (error) {
            if (error instanceof api_error_1.default || error instanceof generation_timeout_1.GenerationAbortedError) {
                throw error;
            }
            const errorMsg = error instanceof Error ? error.message : String(error);
            throw new api_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, `AI streaming generation failed: ${errorMsg}`);
        }
    });
}
function generateRemixWithGemini(title_1, content_1, tag_1, remixType_1, remixOption_1) {
    return __awaiter(this, arguments, void 0, function* (title, content, tag, remixType, remixOption, language = "English") {
        const remixPrompts = {
            setting: `Rewrite this story keeping the same plot and characters but change the setting to: ${remixOption}. Keep the same story structure.`,
            perspective: `Rewrite this story from the perspective of: ${remixOption}. Keep the same events but show them from this character's point of view.`,
            time_period: `Rewrite this story keeping the same plot but set it in: ${remixOption}. Adjust all details to fit the time period.`,
            tone: `Rewrite this story keeping the same plot but change the tone to: ${remixOption}. Adjust the writing style accordingly.`,
            gender_swap: `Rewrite this story with all characters gender-swapped. Keep the same plot and events.`,
        };
        const remixInstruction = remixPrompts[remixType] || remixPrompts.tone;
        const prompt = `You are a creative writing assistant. Here is a story:

Title: ${title}
Content: ${content}
Genre: ${tag}

Task: ${remixInstruction}

Write the remixed story in ${language}. Return a JSON object with this exact structure:
{
  "title": "remixed story title",
  "content": "full remixed story content",
  "tag": "${tag}"
}`;
        try {
            const chatSession = model.startChat({
                generationConfig: Object.assign(Object.assign({}, generationConfig), { maxOutputTokens: 4096 }),
                safetySettings,
                history: [],
            });
            const result = yield chatSession.sendMessage(prompt);
            const rawText = result.response.text();
            const cleanText = sanitizeJsonText(rawText);
            const parsed = JSON.parse(cleanText);
            if (!parsed.title || !parsed.content) {
                throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "Invalid remix response from AI.");
            }
            return parsed;
        }
        catch (error) {
            if (error instanceof api_error_1.default)
                throw error;
            const errorMsg = error instanceof Error ? error.message : String(error);
            throw new api_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, `AI remix generation failed: ${errorMsg}`);
        }
    });
}
function translateStoryWithGemini(title, content, targetLanguage) {
    return __awaiter(this, void 0, void 0, function* () {
        const prompt = `You are a professional translator. Translate the following story into ${targetLanguage}.

Title: ${title}
Content: ${content}

Return a JSON object with this exact structure:
{
  "title": "translated title in ${targetLanguage}",
  "content": "translated content in ${targetLanguage}"
}

Preserve the story's tone, style and meaning. Only translate — do not modify the story.`;
        try {
            const chatSession = model.startChat({
                generationConfig: Object.assign(Object.assign({}, generationConfig), { maxOutputTokens: 4096 }),
                safetySettings,
                history: [],
            });
            const result = yield chatSession.sendMessage(prompt);
            const rawText = result.response.text();
            const cleanText = sanitizeJsonText(rawText);
            const parsed = JSON.parse(cleanText);
            if (!parsed.title || !parsed.content) {
                throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "Invalid translation response from AI.");
            }
            return parsed;
        }
        catch (error) {
            if (error instanceof api_error_1.default)
                throw error;
            const errorMsg = error instanceof Error ? error.message : String(error);
            throw new api_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, `AI translation failed: ${errorMsg}`);
        }
    });
}
function chatWithGemini(message_1) {
    return __awaiter(this, arguments, void 0, function* (message, history = []) {
        assertGeminiApiKeyConfigured();
        try {
            const chatSession = model.startChat({
                generationConfig: Object.assign(Object.assign({}, generationConfig), { responseMimeType: "text/plain" }),
                safetySettings,
                history,
            });
            const result = yield chatSession.sendMessage(message);
            return result.response.text();
        }
        catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            throw new api_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, `AI chat failed: ${errorMsg}`);
        }
    });
}
