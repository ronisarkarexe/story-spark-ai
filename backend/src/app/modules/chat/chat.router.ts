import express from "express";
import { ChatController } from "./chat.controller";
import { flexibleChatRateLimiter } from "./chat.middleware";
import validateRequest from "../../middleware/validate.request";
import { ChatValidation } from "./chat.validation";

const router = express.Router();

router.post(
  "/",
  flexibleChatRateLimiter,
  validateRequest(ChatValidation.chatWithAi),
  ChatController.chatWithAi
);

export const ChatRouter = router;
