import { Router } from "express";
import { newsletterRateLimiter } from "../../middleware/ip.rate-limiter";
import { subscribe, verify, unsubscribeByToken } from "./newsletter.controller";
const router = Router();
router.post("/subscribe", newsletterRateLimiter, subscribe);
router.get("/verify/:token", verify);
router.get("/unsubscribe/:token", unsubscribeByToken);
export const NewsletterRouter = router;
