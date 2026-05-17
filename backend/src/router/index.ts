import express from "express";
import { AuthRouter } from "../app/modules/auth/auth.router";
import { UserRouter } from "../app/modules/user/user.router";
import { AIModelRouter } from "../app/modules/ai_model/ai_model.router";
import { VerifyEmailRouter } from "../app/modules/verify_email/verify_email.router";
import { PostRouter } from "../app/modules/post/post.router";
import { NotificationRouter } from "../app/modules/notification/notification.router";
import { CommentRouter } from "../app/modules/comment/comment.router";
import { AnalysisRouter } from "../app/modules/analysis/analysis.router";
import { ReactionRouter } from "../app/modules/reaction/reaction.router";
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
    path: "/notification",
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
];

modules.forEach((route) => router.use(route.path, route.router));

export const Routers = router;
