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
exports.StoryVersionController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = __importDefault(require("../../../shared/catch_async"));
const send_response_1 = __importDefault(require("../../../shared/send_response"));
const story_version_service_1 = require("./story_version.service");
const api_error_1 = __importDefault(require("../../../errors/api_error"));
const route_param_1 = require("../../../shared/route_param");
const getVersionsByStoryId = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, route_param_1.routeParam)(req.params.id);
    const user = req.user;
    if (!user) {
        throw new api_error_1.default(http_status_1.default.UNAUTHORIZED, "User is not authorized");
    }
    const result = yield story_version_service_1.StoryVersionService.getVersionsByStoryId(id, user._id);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Story version timeline retrieved successfully!",
        data: result,
    });
}));
const getVersionById = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const versionId = (0, route_param_1.routeParam)(req.params.versionId);
    const user = req.user;
    if (!user) {
        throw new api_error_1.default(http_status_1.default.UNAUTHORIZED, "User is not authorized");
    }
    const result = yield story_version_service_1.StoryVersionService.getVersionById(versionId, user._id);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Story version snapshot retrieved successfully!",
        data: result,
    });
}));
const restoreVersion = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const versionId = (0, route_param_1.routeParam)(req.params.versionId);
    const user = req.user;
    if (!user) {
        throw new api_error_1.default(http_status_1.default.UNAUTHORIZED, "User is not authorized");
    }
    const result = yield story_version_service_1.StoryVersionService.restoreVersion(versionId, user._id);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Story restored to selected version successfully!",
        data: result,
    });
}));
const enhancePrompt = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "prompt is required and must be at least 3 characters.");
    }
    const enhancedPrompt = yield story_version_service_1.StoryVersionService.enhancePrompt(prompt.trim());
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Prompt enhanced successfully!",
        data: { enhancedPrompt },
    });
}));
exports.StoryVersionController = {
    getVersionsByStoryId,
    getVersionById,
    restoreVersion,
    enhancePrompt,
};
