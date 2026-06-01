"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRouter = void 0;
const express_1 = __importDefault(require("express"));
const validate_request_1 = __importDefault(require("../../middleware/validate.request"));
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
const user_1 = require("../../../enums/user");
const review_controller_1 = require("./review.controller");
const review_validation_1 = require("./review.validation");
const router = express_1.default.Router();
// Public published reviews
router.get("/lists", review_controller_1.ReviewController.getPublishedReviews);
// Pending reviews (Admin only)
router.get("/pending", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), review_controller_1.ReviewController.getPendingReviews);
// Create review
router.post("/create", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.WRITER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.USER), (0, validate_request_1.default)(review_validation_1.ReviewValidator.createReview), review_controller_1.ReviewController.createReview);
// Approve review (Admin only)
router.patch("/:id", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), review_controller_1.ReviewController.approveReview);
exports.ReviewRouter = router;
