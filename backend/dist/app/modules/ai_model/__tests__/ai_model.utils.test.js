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
jest.mock("@google/generative-ai", () => ({
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
        getGenerativeModel: jest.fn().mockReturnValue({
            startChat: jest.fn(),
        }),
    })),
    HarmBlockThreshold: {
        BLOCK_LOW_AND_ABOVE: "BLOCK_LOW_AND_ABOVE",
    },
    HarmCategory: {
        HARM_CATEGORY_HARASSMENT: "HARM_CATEGORY_HARASSMENT",
        HARM_CATEGORY_HATE_SPEECH: "HARM_CATEGORY_HATE_SPEECH",
    },
}));
jest.mock("../../../../config", () => ({
    __esModule: true,
    default: {
        gemini_api_key: "",
    },
}));
describe("ai_model.utils Gemini configuration", () => {
    it("fails story generation when GEMINI_API_KEY is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, ai_model_utils_1.generateWithGeminiStories)("space")).rejects.toMatchObject({
            statusCode: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: expect.stringContaining("Gemini API key is not configured"),
        });
    }));
    it("fails alternate endings when GEMINI_API_KEY is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, ai_model_utils_1.generateAlternateEndingsWithGemini)("Title", "Story body", "Adventure")).rejects.toMatchObject({
            statusCode: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: expect.stringContaining("Gemini API key is not configured"),
        });
    }));
});
