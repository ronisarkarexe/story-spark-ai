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
exports.AnalyticsController = void 0;
const catch_async_1 = __importDefault(require("../../../shared/catch_async"));
const token_1 = require("../../middleware/token");
const send_response_1 = __importDefault(require("../../../shared/send_response"));
const http_status_1 = __importDefault(require("http-status"));
const analytics_service_1 = require("./analytics.service");
const getAnalyticsOverview = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let token = null;
    try {
        token = (0, token_1.getToken)(req);
    }
    catch (error) {
        token = null;
    }
    const result = yield analytics_service_1.AnalyticsService.getOverview(token);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Analytics overview fetched successfully!",
        data: result,
    });
}));
const getHeatmap = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let token = null;
    try {
        token = (0, token_1.getToken)(req);
    }
    catch (error) {
        token = null;
    }
    const result = yield analytics_service_1.AnalyticsService.getHeatmap(token);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Heatmap data fetched successfully!",
        data: result,
    });
}));
const getGenreDistribution = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let token = null;
    try {
        token = (0, token_1.getToken)(req);
    }
    catch (error) {
        token = null;
    }
    const result = yield analytics_service_1.AnalyticsService.getGenreDistribution(token);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Genre distribution fetched successfully!",
        data: result,
    });
}));
const getWordCloud = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let token = null;
    try {
        token = (0, token_1.getToken)(req);
    }
    catch (error) {
        token = null;
    }
    const result = yield analytics_service_1.AnalyticsService.getWordCloud(token);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Word cloud data fetched successfully!",
        data: result,
    });
}));
const getProductiveHours = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = (0, token_1.getToken)(req);
    const result = yield analytics_service_1.AnalyticsService.getProductiveHours(token);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Productive hours fetched successfully!",
        data: result,
    });
}));
const getEmotionDistribution = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = (0, token_1.getToken)(req);
    const result = yield analytics_service_1.AnalyticsService.getEmotionDistribution(token);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Emotion distribution fetched successfully!",
        data: result,
    });
}));
const getMoodTimeline = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = (0, token_1.getToken)(req);
    const result = yield analytics_service_1.AnalyticsService.getMoodTimeline(token);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Mood timeline fetched successfully!",
        data: result,
    });
}));
exports.AnalyticsController = {
    getAnalyticsOverview,
    getHeatmap,
    getGenreDistribution,
    getWordCloud,
    getProductiveHours,
    getEmotionDistribution,
    getMoodTimeline,
};
