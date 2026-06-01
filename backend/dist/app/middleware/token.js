"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = void 0;
const api_error_1 = __importDefault(require("../../errors/api_error"));
const http_status_1 = __importDefault(require("http-status"));
const jwt_helper_1 = require("../../utils/jwt.helper");
const config_1 = __importDefault(require("../../config"));
const getToken = (req) => {
    const authHeader = req.headers.authorization;
    const token = (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer "))
        ? authHeader.slice(7)
        : authHeader;
    if (!token) {
        throw new api_error_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized to access");
    }
    try {
        const verifiedUser = jwt_helper_1.JwtHalers.verifyToken(token, config_1.default.jwt.secret);
        const user = {
            _id: verifiedUser._id,
            email: verifiedUser.email,
            role: verifiedUser.role,
            subscriptionType: verifiedUser.subscriptionType,
            name: verifiedUser.name,
            postsCount: verifiedUser.postsCount,
        };
        return user;
    }
    catch (err) {
        throw new api_error_1.default(http_status_1.default.UNAUTHORIZED, "Invalid token");
    }
};
exports.getToken = getToken;
