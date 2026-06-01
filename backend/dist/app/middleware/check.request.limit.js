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
const api_error_1 = __importDefault(require("../../errors/api_error"));
const jwt_helper_1 = require("../../utils/jwt.helper");
const config_1 = __importDefault(require("../../config"));
const quota_service_1 = require("../modules/ai_model/quota.service");
const quota_lifecycle_1 = require("../modules/ai_model/quota.lifecycle");
// Note: Actual quota/limit enforcement is handled by reserveUserQuota
// to allow for atomic MongoDB operations and rollback on failure.
// This middleware ensures the user is authenticated, reserves the quota atomically,
// and binds the QuotaRefundGuard to res.locals.quotaRefundGuard.
const checkRequestLimit = () => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        const token = (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer "))
            ? authHeader.slice(7)
            : authHeader;
        if (!token) {
            throw new api_error_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized to access");
        }
        const verifiedUser = jwt_helper_1.JwtHalers.verifyToken(token, config_1.default.jwt.secret);
        const { email: userEmail } = verifiedUser;
        // Atomically reserve the monthly quota for the user
        yield (0, quota_service_1.reserveUserQuota)(userEmail);
        // Create and attach the quota refund guard to res.locals
        res.locals.quotaRefundGuard = (0, quota_lifecycle_1.createUserQuotaGuard)(userEmail);
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.default = checkRequestLimit;
