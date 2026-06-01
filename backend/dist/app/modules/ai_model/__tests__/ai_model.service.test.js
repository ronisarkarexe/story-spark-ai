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
const http_status_1 = __importDefault(require("http-status"));
const ai_model_utils_1 = require("../ai_model.utils");
const ai_model_service_1 = require("../ai_model.service");
const generation_timeout_1 = require("../../../../utils/generation_timeout");
jest.mock("../ai_model.utils", () => ({
    generateWithGeminiStories: jest.fn(),
}));
jest.mock("../../../../utils/generation_timeout", () => (Object.assign(Object.assign({}, jest.requireActual("../../../../utils/generation_timeout")), { raceGenerationWithTimeout: jest.fn() })));
// Mock User to avoid DATABASE_URL check in config
jest.mock("../../user/user.model", () => ({
    User: {
        findOne: jest.fn(),
        findOneAndUpdate: jest.fn(),
        updateOne: jest.fn(),
    },
}));
const mockedGenerate = ai_model_utils_1.generateWithGeminiStories;
const mockedRace = generation_timeout_1.raceGenerationWithTimeout;
const story = {
    title: "x",
    content: "body",
    tag: "adventure",
};
describe("AiModelService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedRace.mockImplementation((operation) => __awaiter(void 0, void 0, void 0, function* () { return operation({}); }));
    });
    it("returns stories on success without empty-array masking", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedGenerate.mockResolvedValue([story]);
        const result = yield ai_model_service_1.AiModelService.aiModelGenerate({ prompt: "test", wordLength: 100, numStories: 1 });
        expect(result).toHaveLength(1);
    }));
    it("passes the selected language through to story generation", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedGenerate.mockResolvedValue([story]);
        yield ai_model_service_1.AiModelService.aiModelGenerate({ prompt: "test", wordLength: 100, numStories: 1, language: "Spanish" });
        expect(mockedGenerate).toHaveBeenCalledWith("test", 100, 1, "Spanish", expect.anything(), undefined);
    }));
    it("throws BAD_GATEWAY when generation returns empty stories", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedGenerate.mockResolvedValue([]);
        yield expect(ai_model_service_1.AiModelService.aiModelGenerate({ prompt: "test", wordLength: 100, numStories: 1 })).rejects.toMatchObject({ statusCode: http_status_1.default.BAD_GATEWAY });
    }));
    it("throws BAD_GATEWAY when Gemini utility throws", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedGenerate.mockRejectedValue(new Error("Gemini API error"));
        yield expect(ai_model_service_1.AiModelService.aiModelGenerate({ prompt: "test", wordLength: 100, numStories: 1 })).rejects.toMatchObject({ statusCode: http_status_1.default.BAD_GATEWAY });
    }));
    it("throws GATEWAY_TIMEOUT on timeout", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedRace.mockRejectedValue(new generation_timeout_1.GenerationTimeoutError());
        yield expect(ai_model_service_1.AiModelService.aiModelGenerate({ prompt: "test", wordLength: 100, numStories: 1 })).rejects.toMatchObject({ statusCode: http_status_1.default.GATEWAY_TIMEOUT });
    }));
    it("guest path throws BAD_GATEWAY on empty stories", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedGenerate.mockResolvedValue([]);
        yield expect(ai_model_service_1.AiModelService.aiFreeModelGenerate({
            prompt: "test",
            wordLength: 150,
            numStories: 1,
        })).rejects.toMatchObject({ statusCode: http_status_1.default.BAD_GATEWAY });
    }));
    it("guest path throws GATEWAY_TIMEOUT on timeout", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedRace.mockRejectedValue(new generation_timeout_1.GenerationTimeoutError());
        yield expect(ai_model_service_1.AiModelService.aiFreeModelGenerate({
            prompt: "test",
            wordLength: 150,
            numStories: 1,
        })).rejects.toMatchObject({ statusCode: http_status_1.default.GATEWAY_TIMEOUT });
    }));
    // ── Tone selector tests ────────────────────────────────────────────────────
    it("passes tone to generateWithGeminiStories when provided (authenticated)", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedGenerate.mockResolvedValue([story]);
        yield ai_model_service_1.AiModelService.aiModelGenerate({ prompt: "test", wordLength: 100, numStories: 1, tone: "Dark" }, { email: "user@example.com" });
        // The 6th argument to generateWithGeminiStories should be the tone string
        expect(mockedGenerate).toHaveBeenCalledWith("test", // prompt
        100, // wordLength
        1, // numStories
        "English", // language default
        expect.any(Object), // AbortSignal
        "Dark" // tone
        );
    }));
    it("passes tone to generateWithGeminiStories when provided (free/guest)", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedGenerate.mockResolvedValue([story]);
        yield ai_model_service_1.AiModelService.aiFreeModelGenerate({
            prompt: "test",
            wordLength: 150,
            numStories: 1,
            tone: "Humorous",
        });
        expect(mockedGenerate).toHaveBeenCalledWith("test", 150, 1, "English", expect.any(Object), "Humorous");
    }));
    it("passes undefined tone when tone is omitted (authenticated)", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedGenerate.mockResolvedValue([story]);
        yield ai_model_service_1.AiModelService.aiModelGenerate({ prompt: "test", wordLength: 100, numStories: 1 }, { email: "user@example.com" });
        expect(mockedGenerate).toHaveBeenCalledWith("test", 100, 1, "English", expect.any(Object), undefined // no tone → undefined, so the util skips the directive
        );
    }));
    it("passes undefined tone when tone is omitted (free/guest)", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedGenerate.mockResolvedValue([story]);
        yield ai_model_service_1.AiModelService.aiFreeModelGenerate({
            prompt: "test",
            wordLength: 150,
            numStories: 1,
        });
        expect(mockedGenerate).toHaveBeenCalledWith("test", 150, 1, "English", expect.any(Object), undefined);
    }));
});
