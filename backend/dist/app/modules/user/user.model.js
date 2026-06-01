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
exports.User = exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("../../../config"));
const user_1 = require("../../../enums/user");
const subscription_type_1 = require("../../../enums/subscription_type");
const user_status_1 = require("../../../enums/user_status");
exports.UserSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String, maxlength: 100, minlength: 3 },
    password: { type: String, required: false, default: "" },
    role: {
        type: String,
        required: true,
        enum: [
            user_1.ENUM_USER_ROLE.ADMIN,
            user_1.ENUM_USER_ROLE.SUPER_ADMIN,
            user_1.ENUM_USER_ROLE.USER,
            user_1.ENUM_USER_ROLE.WRITER,
        ],
        default: user_1.ENUM_USER_ROLE.USER,
    },
    status: {
        type: String,
        enum: [user_status_1.USER_STATUS.ACTIVE, user_status_1.USER_STATUS.INACTIVE, user_status_1.USER_STATUS.BLOCKED],
        default: user_status_1.USER_STATUS.ACTIVE,
    },
    profile: {
        avatar: { type: String, default: "" },
        bio: { type: String, default: "" },
        social: {
            facebook: { type: String, default: "" },
            twitter: { type: String, default: "" },
            linkedin: { type: String, default: "" },
            instagram: { type: String, default: "" },
        },
    },
    subscriptionType: {
        type: String,
        enum: [
            subscription_type_1.SUBSCRIPTION_TYPE.FREE,
            subscription_type_1.SUBSCRIPTION_TYPE.PRO,
            subscription_type_1.SUBSCRIPTION_TYPE.PREMIUM,
        ],
        default: subscription_type_1.SUBSCRIPTION_TYPE.FREE,
    },
    postsCount: { type: Number, default: 0 },
    followers: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    requestsThisMonth: { type: Number, default: 0 },
    lastRequestDate: { type: Date, default: null },
    posts: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Post" }],
    isApplyForWriter: { type: Boolean, default: false },
    tokenVersion: { type: Number, default: 0 },
    gamification: {
        xp: { type: Number, default: 0 },
        level: { type: Number, default: 1 },
        streak: { type: Number, default: 0 },
        lastActiveDate: { type: Date, default: null },
        badges: [{ type: String }],
    },
    readingPreferences: {
        favoriteGenres: [
            {
                name: { type: String },
                count: { type: Number, default: 0 },
            },
        ],
        favoriteEmotions: [
            {
                name: { type: String },
                count: { type: Number, default: 0 },
            },
        ],
    },
    readingHistory: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Post" }],
}, {
    timestamps: true,
});
exports.UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (!user.isModified("password")) {
            return next();
        }
        // Only hash password if it exists, is not empty, and has been modified (for password-based auth)
        // Skip for Google OAuth users who don't have passwords
        if (user.isModified("password") && user.password && user.password.trim() !== "") {
            user.password = yield bcryptjs_1.default.hash(user.password, config_1.default.bcrypt_salt_rounds);
        }
        next();
    });
});
exports.UserSchema.pre("save", function (next) {
    if (this.readingHistory && this.readingHistory.length > 500) {
        this.readingHistory = this.readingHistory.slice(-500);
    }
    next();
});
exports.User = (0, mongoose_1.model)("User", exports.UserSchema);
