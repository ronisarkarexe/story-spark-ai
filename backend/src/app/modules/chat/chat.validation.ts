import { z } from "zod";

const chatMessageSchema = z.object({
  role: z.enum(["user", "model", "system"]),
  content: z.string().min(1, "Message content is required").max(10000, "Message content is too long"),
});

const chatWithAi = z.object({
  body: z.object({
    messages: z.array(chatMessageSchema).min(1, "Messages array must contain at least one message"),
  }),
});

export const ChatValidation = {
  chatWithAi,
};
