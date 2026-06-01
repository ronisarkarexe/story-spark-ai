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
const config_1 = __importDefault(require("../../config"));
const api_error_1 = __importDefault(require("../../errors/api_error"));
const jwt_helper_1 = require("../../utils/jwt.helper");
const user_model_1 = require("../modules/user/user.model");
const auth = (...requiredRole) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = (req.headers.authorization || '');
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.slice(7).trim()
            : authHeader.trim();
        if (!token) {
            throw new api_error_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized to access");
        }
        // verify token
        const verifiedUser = jwt_helper_1.JwtHalers.verifyToken(token, config_1.default.jwt.secret);
        const user = yield user_model_1.User.findById(verifiedUser._id);
        if (!user) {
            throw new api_error_1.default(http_status_1.default.UNAUTHORIZED, "User not found");
        }
        if (user.tokenVersion !== verifiedUser.tokenVersion) {
            throw new api_error_1.default(http_status_1.default.UNAUTHORIZED, "Token is invalid or expired");
        }
        if (requiredRole.length && !requiredRole.includes(verifiedUser.role)) {
            throw new api_error_1.default(http_status_1.default.FORBIDDEN, "Forbidden");
        }
        req.user = verifiedUser;
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.default = auth;
