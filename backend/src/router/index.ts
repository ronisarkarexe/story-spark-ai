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
import { StoriesRouter } from "../routes/stories";
import storyRoutes from "../routes/story.routes";
import { ReportRouter } from "../app/modules/report/report.router";
import { NewsletterRouter } from "../app/modules/newsletter/newsletter.route";
import paymentRouter from "../router/payment.route";
import { BookmarkRouter } from "../app/modules/bookmark/bookmark.router";
import { StoryVersionRouter } from "../app/modules/story_version/story_version.router";
import { AnalyticsRouter } from "../app/modules/analytics/analytics.router";
import { BugReportRouter } from "../app/modules/bug_report/bug_report.router";
import { RecommendationRouter } from "../app/modules/recommendation/recommendation.router";
import { WriterApplicationRoutes } from "../app/modules/writer_application/writer_application.route";
import { StoryVisualizerRouter } from "../app/modules/story_visualizer/story_visualizer.router";
import { StoryInspirationRouter } from "../app/modules/story_inspiration/story_inspiration.router";
import { EngagementRouter } from "../app/modules/engagement/engagement.router";
import { ChatRouter } from "../app/modules/chat/chat.router";

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
    path: "/payment",
    router: paymentRouter,
  },
  {
    path: "/story",
    router: StoryVersionRouter,
  },
  {
    path: "/analytics",
    router: AnalyticsRouter,
  },
  {
    path: "/stories",
    router: StoriesRouter,
  },
  {
    path: "/story-continuation",
    router: storyRoutes,
  },
  {
    path: "/story-inspiration",
    router: StoryInspirationRouter,
  },
  {
    path: "/engagement",
    router: EngagementRouter,
  },
  {
    path: "/contact",
    router: ContactRoutes,
  },
  {
    path: "/reports",
    router: ReportRouter,
  },
  {
    path: "/bug-reports",
    router: BugReportRouter,
  },
  {
    path: "/recommendations",
    router: RecommendationRouter,
  },
  {
    path: "/writer-applications",
    router: WriterApplicationRoutes,
  },
  {
    path: "/chat",
    router: ChatRouter,
  },
];

modules.forEach((route) => router.use(route.path, route.router));

export const Routers = router;