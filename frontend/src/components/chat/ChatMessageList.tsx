import type { RefObject } from "react";
import ChatBubble from "./ChatBubble";
import TypingIndicator from "./TypingIndicator";
import type { ChatMessage } from "./chat.types";

interface ChatMessageListProps {
  messages: ChatMessage[];
  loading: boolean;
  bottomRef: RefObject<HTMLDivElement | null>;
}

const ChatMessageList = ({
  messages,
  loading,
  bottomRef,
}: ChatMessageListProps) => {
  return (
    <section
      className="flex-1 overflow-y-auto px-3 py-4 sm:px-5"
      aria-label="Chat messages"
      aria-live="polite"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3">
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </section>
  );
};

export default ChatMessageList;
