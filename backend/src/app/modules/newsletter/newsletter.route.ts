import { Router } from "express";
import { subscribe, verify, unsubscribeByToken } from "./newsletter.controller";
const router = Router();
router.post("/subscribe", subscribe);
router.get("/verify/:token", verify);
router.get("/unsubscribe/:token", unsubscribeByToken);
export const NewsletterRouter = router;
