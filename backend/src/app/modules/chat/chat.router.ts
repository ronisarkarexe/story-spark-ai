import express from "express";
import { ChatController } from "./chat.controller";
import { flexibleChatRateLimiter } from "./chat.middleware";

const router = express.Router();

router.post("/", flexibleChatRateLimiter, ChatController.chatWithAi);

export const ChatRouter = router;
