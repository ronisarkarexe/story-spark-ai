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

import { NewsletterRouter } from "../app/modules/newsletter/newsletter.route";



// alongside the other routes:


import { BookmarkRouter } from "../app/modules/bookmark/bookmark.router";
import { AnalyticsRouter } from "../app/modules/analytics/analytics.router";

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
    path: "/analytics",
    router: AnalyticsRouter,
  },
  {
    path: "/contact",
    router: ContactRoutes,
  },
];
modules.forEach((route) => router.use(route.path, route.router));

export const Routers = router;
