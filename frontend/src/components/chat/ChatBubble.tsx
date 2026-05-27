import type { ChatMessage } from "./chat.types";

interface ChatBubbleProps {
  message: ChatMessage;
}

const ChatBubble = ({ message }: ChatBubbleProps) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
      aria-label={isUser ? "Your message" : "AI message"}
    >
      <article
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm sm:max-w-[75%] ${
          isUser
            ? "rounded-br-md bg-blue-600 text-white"
            : "rounded-bl-md border border-slate-200 bg-white text-slate-800 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
        }`}
      >
        {message.content}
      </article>
    </div>
  );
};

export default ChatBubble;
