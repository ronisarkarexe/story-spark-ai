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
    chatWithGemini: jest.fn(),
}));
jest.mock("../../../../utils/generation_timeout", () => (Object.assign(Object.assign({}, jest.requireActual("../../../../utils/generation_timeout")), { raceGenerationWithTimeout: jest.fn() })));
jest.mock("../../user/user.model", () => ({
    User: {
        findOne: jest.fn(),
        findOneAndUpdate: jest.fn(),
        updateOne: jest.fn(),
    },
}));
const mockedChat = ai_model_utils_1.chatWithGemini;
const mockedRace = generation_timeout_1.raceGenerationWithTimeout;
describe("AiModelService - Chat", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedRace.mockImplementation((operation) => __awaiter(void 0, void 0, void 0, function* () { return operation({}); }));
    });
    it("returns chat response on success for authenticated user", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedChat.mockResolvedValue("Hello there!");
        const result = yield ai_model_service_1.AiModelService.aiModelChat({ message: "Hi", history: [] });
        expect(result).toBe("Hello there!");
        expect(mockedChat).toHaveBeenCalledWith("Hi", []);
    }));
    it("returns chat response for guest user", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedChat.mockResolvedValue("Hi guest!");
        const result = yield ai_model_service_1.AiModelService.aiFreeModelChat({ message: "Hi", history: [] });
        expect(result).toBe("Hi guest!");
        expect(mockedChat).toHaveBeenCalledWith("Hi", []);
    }));
    it("throws gateway timeout on timeout", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedRace.mockRejectedValue(new generation_timeout_1.GenerationTimeoutError());
        yield expect(ai_model_service_1.AiModelService.aiFreeModelChat({ message: "Hi", history: [] })).rejects.toMatchObject({ statusCode: http_status_1.default.GATEWAY_TIMEOUT });
    }));
});
