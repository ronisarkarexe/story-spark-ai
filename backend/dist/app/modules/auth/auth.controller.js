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
exports.AuthController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const auth_service_1 = require("./auth.service");
const send_response_1 = __importDefault(require("../../../shared/send_response"));
const catch_async_1 = __importDefault(require("../../../shared/catch_async"));
const cookie_util_1 = require("../../../utils/cookie.util");
const login = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const result = yield auth_service_1.AuthService.login(body);
    const { accessToken, refreshToken } = result;
    (0, cookie_util_1.setRefreshTokenCookie)(res, refreshToken);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User login successfully!",
        data: { accessToken },
    });
}));
const register = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const result = yield auth_service_1.AuthService.register(body);
    const { accessToken, refreshToken } = result;
    (0, cookie_util_1.setRefreshTokenCookie)(res, refreshToken);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User Register successfully!",
        data: { accessToken },
    });
}));
const refreshToken = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
    const result = yield auth_service_1.AuthService.refreshToken(token);
    const { accessToken, refreshToken: rotatedRefreshToken } = result;
    // Rotation: replace the cookie with the freshly issued refresh token.
    (0, cookie_util_1.setRefreshTokenCookie)(res, rotatedRefreshToken);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Got Access Token!",
        data: { accessToken },
    });
}));
const logout = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
    yield auth_service_1.AuthService.logout(token);
    (0, cookie_util_1.clearRefreshTokenCookie)(res);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Logged out successfully",
        data: null,
    });
}));
const googleLogin = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const result = yield auth_service_1.AuthService.googleLogin(body);
    const { accessToken, refreshToken } = result;
    (0, cookie_util_1.setRefreshTokenCookie)(res, refreshToken);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User logged in successfully with Google!",
        data: { accessToken },
    });
}));
const changePassword = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { oldPassword, newPassword } = req.body;
    yield auth_service_1.AuthService.changePassword(user, { oldPassword, newPassword });
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Password changed successfully. All previous sessions have been invalidated.",
        data: null,
    });
}));
const forgotPassword = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const result = yield auth_service_1.AuthService.forgotPassword(email);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "OTP sent to your email successfully!",
        data: result,
    });
}));
const resetPassword = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, confirmPassword, verificationToken } = req.body;
    const result = yield auth_service_1.AuthService.resetPassword({
        email,
        password,
        confirmPassword,
        verificationToken,
    });
    const { accessToken, refreshToken } = result;
    (0, cookie_util_1.setRefreshTokenCookie)(res, refreshToken);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Password reset successfully!",
        data: { accessToken },
    });
}));
exports.AuthController = {
    login,
    register,
    refreshToken,
    logout,
    googleLogin,
    changePassword,
    forgotPassword,
    resetPassword,
};
