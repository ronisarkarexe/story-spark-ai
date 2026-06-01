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
const review_router_1 = require("../app/modules/review/review.router");
const reaction_router_1 = require("../app/modules/reaction/reaction.router");
const contact_route_1 = require("../app/modules/contact/contact.route");
const stories_1 = require("../routes/stories");
const story_routes_1 = __importDefault(require("../routes/story.routes"));
const report_router_1 = require("../app/modules/report/report.router");
const newsletter_route_1 = require("../app/modules/newsletter/newsletter.route");
const payment_route_1 = __importDefault(require("../router/payment.route"));
const bookmark_router_1 = require("../app/modules/bookmark/bookmark.router");
const story_version_router_1 = require("../app/modules/story_version/story_version.router");
const analytics_router_1 = require("../app/modules/analytics/analytics.router");
const bug_report_router_1 = require("../app/modules/bug_report/bug_report.router");
const recommendation_router_1 = require("../app/modules/recommendation/recommendation.router");
const writer_application_route_1 = require("../app/modules/writer_application/writer_application.route");
const story_inspiration_router_1 = require("../app/modules/story_inspiration/story_inspiration.router");
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
        path: "/review",
        router: review_router_1.ReviewRouter,
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
        path: "/notifications",
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
    {
        path: "/newsletter",
        router: newsletter_route_1.NewsletterRouter,
    },
    {
        path: "/bookmarks",
        router: bookmark_router_1.BookmarkRouter,
    },
    {
        path: "/payment",
        router: payment_route_1.default,
    },
    {
        path: "/story",
        router: story_version_router_1.StoryVersionRouter,
    },
    {
        path: "/analytics",
        router: analytics_router_1.AnalyticsRouter,
    },
    {
        path: "/stories",
        router: stories_1.StoriesRouter,
    },
    {
        path: "/story-continuation",
        router: story_routes_1.default,
    },
    {
        path: "/story-inspiration",
        router: story_inspiration_router_1.StoryInspirationRouter,
    },
    {
        path: "/contact",
        router: contact_route_1.ContactRoutes,
    },
    {
        path: "/reports",
        router: report_router_1.ReportRouter,
    },
    {
        path: "/bug-reports",
        router: bug_report_router_1.BugReportRouter,
    },
    {
        path: "/recommendations",
        router: recommendation_router_1.RecommendationRouter,
    },
    {
        path: "/writer-applications",
        router: writer_application_route_1.WriterApplicationRoutes,
    },
];
modules.forEach((route) => router.use(route.path, route.router));
exports.Routers = router;
