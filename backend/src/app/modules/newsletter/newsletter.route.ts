import { Router } from "express";
import { subscribe, verify, unsubscribe, generateUnsubscribeToken, unsubscribeByToken } from "./newsletter.controller";
const router = Router();
router.post("/subscribe", subscribe);
router.get("/verify/:token", verify);
router.post("/unsubscribe", unsubscribe);
router.post("/unsubscribe-token", generateUnsubscribeToken);
router.get("/unsubscribe/:token", unsubscribeByToken);
export const NewsletterRouter = router;
