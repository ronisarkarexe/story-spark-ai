"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routers = void 0;
const express_1 = __importDefault(require("express"));
const auth_router_1 = require("../app/modules/auth/auth.router");
const user_router_1 = require("../app/modules/user/user.router");
const ai_model_router_1 = require("../app/modules/ai_model/ai_model.router");
const verify_email_router_1 = require("../app/modules/verify_email/verify_email.router");
const post_router_1 = require("../app/modules/post/post.router");
const notification_router_1 = require("../app/modules/notification/notification.router");
const comment_router_1 = require("../app/modules/comment/comment.router");
const analysis_router_1 = require("../app/modules/analysis/analysis.router");
const reaction_router_1 = require("../app/modules/reaction/reaction.router");
const router = express_1.default.Router();
const modules = [
    {
        path: "/auth",
        router: auth_router_1.AuthRouter,
    },
    {
        path: "/user",
        router: user_router_1.UserRouter,
    },
    {
        path: "/ai_model",
        router: ai_model_router_1.AIModelRouter,
    },
    {
        path: "/otp_validation",
        router: verify_email_router_1.VerifyEmailRouter,
    },
    {
        path: "/post",
        router: post_router_1.PostRouter,
    },
    {
        path: "/notification",
        router: notification_router_1.NotificationRouter,
    },
    {
        path: "/comment",
        router: comment_router_1.CommentRouter,
    },
    {
        path: "/analysis",
        router: analysis_router_1.AnalysisRouter,
    },
    {
        path: "/reaction",
        router: reaction_router_1.ReactionRouter,
    },
];
modules.forEach((route) => router.use(route.path, route.router));
exports.Routers = router;
