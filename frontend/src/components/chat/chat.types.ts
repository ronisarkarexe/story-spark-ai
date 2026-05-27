export type ChatRole = "user" | "ai";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}
