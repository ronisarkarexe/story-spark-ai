"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = __importDefault(require("../../../shared/catch_async"));
const send_response_1 = __importDefault(require("../../../shared/send_response"));
const review_service_1 = require("./review.service");
const token_1 = require("../../middleware/token");
const createReview = (0, catch_async_1.default)(async (req, res) => {
    const token = (0, token_1.getToken)(req);
    const result = await review_service_1.ReviewService.createReview(req.body, token);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Review created successfully!",
        data: result,
    });
});
const getPublishedReviews = (0, catch_async_1.default)(async (req, res) => {
    const result = await review_service_1.ReviewService.getPublishedReviews();
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Reviews fetched successfully!",
        data: result,
    });
});
const getPendingReviews = (0, catch_async_1.default)(async (req, res) => {
    const result = await review_service_1.ReviewService.getPendingReviews();
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Pending reviews fetched successfully!",
        data: result,
    });
});
const approveReview = (0, catch_async_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await review_service_1.ReviewService.approveReview(id);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Review approved successfully!",
        data: result,
    });
});
exports.ReviewController = {
    createReview,
    getPublishedReviews,
    getPendingReviews,
    approveReview,
};
