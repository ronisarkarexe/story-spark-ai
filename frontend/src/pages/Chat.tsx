import { useEffect, useMemo, useRef, useState } from "react";
import ChatInput from "../components/chat/ChatInput";
import ChatMessageList from "../components/chat/ChatMessageList";
import type { ChatMessage } from "../components/chat/chat.types";

const MOCK_RESPONSES = [
  "Try raising the stakes in your next scene by adding an irreversible choice for your protagonist.",
  "Great premise. Add one sensory detail in every paragraph to make it more immersive.",
  "You can make this character feel more grounded by giving them a private fear that conflicts with their goal.",
  "If you want a stronger hook, open with dialogue and reveal context in the second beat.",
  "Consider splitting this into three beats: setup, tension shift, and emotional payoff.",
];

const Chat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "ai-welcome",
      role: "ai",
      content:
        "Hi, I am StorySpark AI. Share your story idea, a draft excerpt, or ask for writing help.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const nextResponseIndex = useMemo(() => {
    const userMessageCount = messages.filter((item) => item.role === "user").length;
    return userMessageCount % MOCK_RESPONSES.length;
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || loading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    timeoutRef.current = setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "ai",
        content: MOCK_RESPONSES[nextResponseIndex],
      };
      setMessages((prev) => [...prev, aiMessage]);
      setLoading(false);
    }, 900);
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex h-[calc(100vh-72px)] w-full max-w-5xl flex-col px-0 sm:px-4">
        <header className="border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur dark:border-white/10 dark:bg-slate-950/90 sm:px-5">
          <h1 className="text-lg font-semibold sm:text-xl">Chat with AI</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Ask for plot ideas, rewrites, or writing feedback. Responses are mocked for now.
          </p>
        </header>

        <ChatMessageList messages={messages} loading={loading} bottomRef={bottomRef} />

        <ChatInput
          value={input}
          loading={loading}
          onChange={setInput}
          onSend={handleSend}
        />
      </div>
    </main>
  );
};

export default Chat;
