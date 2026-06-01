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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const google_auth_library_1 = require("google-auth-library");
const user_model_1 = require("../user/user.model");
const jwt_helper_1 = require("../../../utils/jwt.helper");
const logger_util_1 = __importDefault(require("../../../utils/logger.util"));
const config_1 = __importDefault(require("../../../config"));
const api_error_1 = __importDefault(require("../../../errors/api_error"));
const otp_model_1 = require("../verify_email/otp.model");
const refresh_session_model_1 = require("./refresh_session.model");
const verify_email_service_1 = require("../verify_email/verify_email.service");
const gamification_service_1 = require("../gamification/gamification.service");
const googleClient = new google_auth_library_1.OAuth2Client(config_1.default.google_client_id);
// Token claims; tokenVersion enables global session revocation.
const buildClaims = (user) => {
    var _a;
    return ({
        _id: user._id,
        email: user.email,
        role: user.role,
        subscriptionType: user.subscriptionType,
        name: user.name,
        postsCount: user.postsCount,
        tokenVersion: (_a = user.tokenVersion) !== null && _a !== void 0 ? _a : 0,
    });
};
const issueAccessToken = (user, expiresIn) => jwt_helper_1.JwtHalers.createToken(buildClaims(user), config_1.default.jwt.secret, expiresIn !== null && expiresIn !== void 0 ? expiresIn : config_1.default.jwt.expires_in);
// Issues a refresh token with a unique jti and records its session for rotation.
const issueRefreshToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const jti = crypto_1.default.randomBytes(16).toString("hex");
    const token = jwt_helper_1.JwtHalers.createToken(Object.assign(Object.assign({}, buildClaims(user)), { jti }), config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    const decoded = jsonwebtoken_1.default.decode(token);
    const expiresAt = (decoded === null || decoded === void 0 ? void 0 : decoded.exp)
        ? new Date(decoded.exp * 1000)
        : new Date(Date.now() + 120 * 24 * 60 * 60 * 1000);
    yield refresh_session_model_1.RefreshSession.create({ jti, userId: user._id, expiresAt });
    return token;
});
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email: userEmail, password, rememberMe } = payload;
    const isExistUser = yield user_model_1.User.findOne({ email: userEmail });
    if (!isExistUser) {
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    // Check if user has password (Google users might not)
    if (!isExistUser.password) {
        throw new api_error_1.default(http_status_1.default.UNAUTHORIZED, "Please use Google login for this account!");
    }
    const match = yield bcryptjs_1.default.compare(password, isExistUser.password);
    if (!match) {
        throw new api_error_1.default(http_status_1.default.UNAUTHORIZED, "Password is not valid!");
    }
    const accessToken = issueAccessToken(isExistUser, rememberMe ? "30d" : "15m");
    const refreshToken = yield issueRefreshToken(isExistUser);
    gamification_service_1.GamificationService.updateDailyStreak(String(isExistUser._id)).catch(console.error);
    return {
        accessToken,
        refreshToken,
    };
});
const register = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email: userEmail, verificationToken } = payload;
    // FIX #4: Verify that email was verified via OTP before allowing registration
    if (!verificationToken) {
        throw new api_error_1.default(http_status_1.default.UNAUTHORIZED, "Email verification required. Please verify your email with OTP before registering.");
    }
    // Check if verification token is valid
    const otpRecord = yield otp_model_1.OTPModel.findOne({
        email: userEmail,
        isVerified: true,
        verificationToken,
    });
    if (!otpRecord) {
        throw new api_error_1.default(http_status_1.default.UNAUTHORIZED, "Invalid or expired verification token. Please verify your email again.");
    }
    // Check if verification token has expired
    if (!otpRecord.verificationTokenExpires ||
        new Date() > otpRecord.verificationTokenExpires) {
        throw new api_error_1.default(http_status_1.default.UNAUTHORIZED, "Verification token has expired. Please verify your email again.");
    }
    const isExistUser = yield user_model_1.User.findOne({ email: userEmail });
    if (isExistUser) {
        throw new api_error_1.default(http_status_1.default.CONFLICT, "User already exists!");
    }
    const { verificationToken: _ } = payload, userPayload = __rest(payload, ["verificationToken"]);
    const result = yield user_model_1.User.create(userPayload);
    // Clean up OTP record after successful registration
    yield otp_model_1.OTPModel.deleteOne({ email: userEmail });
    const accessToken = issueAccessToken(result);
    const refreshToken = yield issueRefreshToken(result);
    return {
        accessToken,
        refreshToken,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        throw new api_error_1.default(http_status_1.default.UNAUTHORIZED, "No refresh token provided");
    }
    let verifiedToken = null;
    try {
        verifiedToken = jwt_helper_1.JwtHalers.verifyToken(token, config_1.default.jwt.refresh_secret);
    }
    catch (error) {
        throw new api_error_1.default(http_status_1.default.FORBIDDEN, "Invalid refresh token");
    }
    const { email: userEmail } = verifiedToken;
    const jti = verifiedToken.jti;
    const user = yield user_model_1.User.findOne({ email: userEmail });
    if (!user) {
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    if (user.tokenVersion !== verifiedToken.tokenVersion) {
        throw new api_error_1.default(http_status_1.default.UNAUTHORIZED, "Invalid or expired refresh token");
    }
    if (!jti) {
        throw new api_error_1.default(http_status_1.default.UNAUTHORIZED, "Invalid refresh token");
    }
    const session = yield refresh_session_model_1.RefreshSession.findOne({ jti });
    if (!session || session.revoked) {
        throw new api_error_1.default(http_status_1.default.UNAUTHORIZED, "Invalid or expired refresh token");
    }
    // Reuse of an already-used token signals theft: revoke the family and bump tokenVersion.
    if (session.used) {
        yield refresh_session_model_1.RefreshSession.updateMany({ userId: user._id }, { revoked: true });
        yield user_model_1.User.updateOne({ _id: user._id }, { $inc: { tokenVersion: 1 } });
        throw new api_error_1.default(http_status_1.default.UNAUTHORIZED, "Refresh token reuse detected. Please sign in again.");
    }
    // Atomically claim the token so only one concurrent request can rotate it.
    const claimed = yield refresh_session_model_1.RefreshSession.findOneAndUpdate({ jti, used: false, revoked: false }, { used: true }, { new: true });
    if (!claimed) {
        throw new api_error_1.default(http_status_1.default.UNAUTHORIZED, "Invalid or expired refresh token");
    }
    const accessToken = issueAccessToken(user);
    const newRefreshToken = yield issueRefreshToken(user);
    return {
        accessToken,
        refreshToken: newRefreshToken,
    };
});
const logout = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token)
        return;
    try {
        const verified = jwt_helper_1.JwtHalers.verifyToken(token, config_1.default.jwt.refresh_secret);
        const jti = verified.jti;
        if (jti) {
            yield refresh_session_model_1.RefreshSession.updateOne({ jti }, { revoked: true });
        }
    }
    catch (error) {
        // Ignore invalid tokens on logout; the cookie is cleared either way.
    }
});
const googleLogin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!config_1.default.google_client_id) {
            throw new api_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Google OAuth not configured");
        }
        const ticket = yield googleClient.verifyIdToken({
            idToken: payload.token,
            audience: config_1.default.google_client_id,
        });
        const payload_data = ticket.getPayload();
        if (!payload_data || !payload_data.email) {
            throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "Invalid Google token");
        }
        // Reject unverified Google emails to prevent account takeover (CWE-287).
        if (!payload_data.email_verified) {
            throw new api_error_1.default(http_status_1.default.UNAUTHORIZED, "Google email is not verified");
        }
        const { email, name: googleName, picture } = payload_data;
        let user = yield user_model_1.User.findOne({ email });
        // If user doesn't exist, create a new user
        if (!user) {
            const newUser = {
                email: email,
                name: (googleName || email || "Google User").slice(0, 100),
                profile: {
                    avatar: picture || "",
                    bio: "",
                    social: {
                        facebook: "",
                        twitter: "",
                        linkedin: "",
                        instagram: "",
                    },
                },
            };
            user = yield user_model_1.User.create(newUser);
        }
        const accessToken = issueAccessToken(user);
        const refreshTokenData = yield issueRefreshToken(user);
        gamification_service_1.GamificationService.updateDailyStreak(String(user._id)).catch(console.error);
        return {
            accessToken,
            refreshToken: refreshTokenData,
        };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger_util_1.default.error(`Google login error: ${errorMessage}`);
        // If it's already an ApiError, re-throw it
        if (error instanceof api_error_1.default) {
            throw error;
        }
        throw new api_error_1.default(http_status_1.default.UNAUTHORIZED, error.message || "Google login failed");
    }
});
const changePassword = (userPayload, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = payload;
    const user = yield user_model_1.User.findById(userPayload._id);
    if (!user) {
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (!user.password) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "User does not have a password set");
    }
    const isPasswordMatch = yield bcryptjs_1.default.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
        throw new api_error_1.default(http_status_1.default.UNAUTHORIZED, "Old password is incorrect");
    }
    user.password = newPassword;
    if (user.tokenVersion !== undefined) {
        user.tokenVersion += 1;
    }
    else {
        user.tokenVersion = 1;
    }
    yield user.save();
});
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    if (!email) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "Email is required!");
    }
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    // Send OTP using VerifyEmailService
    const result = yield verify_email_service_1.VerifyEmailService.VerifyEmail({
        email: user.email,
        name: user.name || "User",
    });
    return result;
});
const resetPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, password, confirmPassword, verificationToken } = payload;
    if (!email || !password || !confirmPassword || !verificationToken) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "All fields are required!");
    }
    if (password !== confirmPassword) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "Passwords do not match!");
    }
    // Validate password strength using Zod schema's rules manually to return user-friendly errors
    const getPasswordError = (pwd) => {
        if (pwd.length < 8)
            return "Password must be at least 8 characters long";
        if (!/[A-Z]/.test(pwd))
            return "Password must contain at least one uppercase letter";
        if (!/[a-z]/.test(pwd))
            return "Password must contain at least one lowercase letter";
        if (!/[0-9]/.test(pwd))
            return "Password must contain at least one number";
        if (!/[^A-Za-z0-9]/.test(pwd))
            return "Password must contain at least one special character";
        return "";
    };
    const passwordError = getPasswordError(password);
    if (passwordError) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, passwordError);
    }
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    // Verify token against OTPModel
    const otpRecord = yield otp_model_1.OTPModel.findOne({
        email,
        isVerified: true,
        verificationToken,
    });
    if (!otpRecord) {
        throw new api_error_1.default(http_status_1.default.UNAUTHORIZED, "Invalid or expired verification token. Please verify your email again.");
    }
    if (!otpRecord.verificationTokenExpires ||
        new Date() > otpRecord.verificationTokenExpires) {
        throw new api_error_1.default(http_status_1.default.UNAUTHORIZED, "Verification token has expired. Please verify your email again.");
    }
    // Bump tokenVersion and revoke sessions so the reset invalidates old logins.
    user.password = password;
    user.tokenVersion = ((_a = user.tokenVersion) !== null && _a !== void 0 ? _a : 0) + 1;
    yield user.save();
    yield refresh_session_model_1.RefreshSession.updateMany({ userId: user._id }, { revoked: true });
    // Clean up OTP record
    yield otp_model_1.OTPModel.deleteOne({ email });
    // Generate JWT tokens for auto-login with the new tokenVersion.
    const accessToken = issueAccessToken(user);
    const refreshToken = yield issueRefreshToken(user);
    return {
        accessToken,
        refreshToken,
    };
});
exports.AuthService = {
    login,
    register,
    refreshToken,
    logout,
    googleLogin,
    changePassword,
    forgotPassword,
    resetPassword,
};
