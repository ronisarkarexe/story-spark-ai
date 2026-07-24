import express from "express";
import { AuthRouter } from "../app/modules/auth/auth.router";
import { UserRouter } from "../app/modules/user/user.router";
import { AIModelRouter } from "../app/modules/ai_model/ai_model.router";
import { VerifyEmailRouter } from "../app/modules/verify_email/verify_email.router";
import { PostRouter } from "../app/modules/post/post.router";
import { NotificationRouter } from "../app/modules/notification/notification.router";
import { CommentRouter } from "../app/modules/comment/comment.router";
import { AnalysisRouter } from "../app/modules/analysis/analysis.router";
import { ReviewRouter } from "../app/modules/review/review.router";
import { ReactionRouter } from "../app/modules/reaction/reaction.router";
import { ContactRoutes } from "../app/modules/contact/contact.route";
import { ReportRouter } from "../app/modules/report/report.router";
import { NewsletterRouter } from "../app/modules/newsletter/newsletter.route";
import paymentRouter from "../router/payment.route";
import { AIEditorRouter } from "../app/modules/ai_editor/ai_editor.router";
import { BookmarkRouter } from "../app/modules/bookmark/bookmark.router";
import { StoryVersionRouter } from "../app/modules/story_version/story_version.router";
import { AnalyticsRouter } from "../app/modules/analytics/analytics.router";
import { BugReportRouter } from "../app/modules/bug_report/bug_report.router";
import { RecommendationRouter } from "../app/modules/recommendation/recommendation.router";

import { PlotHoleRouter } from "../app/modules/plot_hole_detector/plot_hole.router";
import { StoryRatingRouter } from "../app/modules/story_rating/story_rating.router";
import PromptAnalysisRouter from "../app/modules/prompt_analysis/prompt_analysis.router";
import { StoryConsistencyRouter } from "../app/modules/story_consistency/story_consistency.router";
import { UsageRouter } from "../app/modules/usage/usage.router";
import characterRouter from "./character.routes";


const router = express.Router();

const modules = [
  {
    path: "/auth",
    router: AuthRouter,
  },
  {
    path: "/user",
    router: UserRouter,
  },
  {
    path: "/users",
    router: UserRouter,
  },
  {
    path: "/review",
    router: ReviewRouter,
  },
  {
    path: "/ai_model",
    router: AIModelRouter,
  },
  {
    path: "/otp_validation",
    router: VerifyEmailRouter,
  },
  {
    path: "/post",
    router: PostRouter,
  },
  {
    path: "/notifications",
    router: NotificationRouter,
  },
  {
    path: "/comment",
    router: CommentRouter,
  },
  {
    path: "/analysis",
    router: AnalysisRouter,
  },
  {
    path: "/reaction",
    router: ReactionRouter,
  },
  {
    path: "/newsletter",
    router: NewsletterRouter,
  },
  {
    path: "/bookmarks",
    router: BookmarkRouter,
  },
  {
    path: "/story-consistency",
    router: StoryConsistencyRouter,
  },
  {
    path: "/prompt-analysis",
    router: PromptAnalysisRouter,
  },
  {
    path: "/story-rating",
    router: StoryRatingRouter,
  },
  {
    path: "/plot-holes",
    router: PlotHoleRouter,
  },
  {
    path: "/characters",
    router: characterRouter,
  },
  {
    path: "/usage",
    router: UsageRouter,
  },
];

modules.forEach((route) => router.use(route.path, route.router));

export const Routers = router;