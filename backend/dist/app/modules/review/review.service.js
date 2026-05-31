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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const review_model_1 = require("./review.model");
const createReview = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_model_1.Review.create(payload);
    return result;
});
const getPublishedReviews = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_model_1.Review.find({
        isPublished: true,
    }).sort({ sortOrder: 1, createdAt: -1 });
    return result;
});
const getPendingReviews = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_model_1.Review.find({
        isPublished: false,
    }).sort({ createdAt: -1 });
    return result;
});
const approveReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_model_1.Review.findByIdAndUpdate(id, {
        isPublished: true,
    }, {
        new: true,
    });
    return result;
});
exports.ReviewService = {
    createReview,
    getPublishedReviews,
    getPendingReviews,
    approveReview,
};
