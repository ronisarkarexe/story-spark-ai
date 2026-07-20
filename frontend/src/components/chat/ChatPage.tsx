import React, { useState, useRef, useEffect, useCallback } from "react";
import { Send, MessageSquare, Trash2, Bot, User, Sparkles, RefreshCw, AlertCircle, HelpCircle, BookOpen, Compass, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { chatWithSparky, ISparkyMessage } from "../../services/ai.service";
import toast from "react-hot-toast";

const STARTER_PROMPTS = [
  {
    text: "Help me brainstorm a sci-fi mystery plot",
    icon: Compass,
    color: "from-blue-500 to-indigo-500",
  },
  {
    text: "How do I create branching storylines in StorySpark?",
    icon: HelpCircle,
    color: "from-violet-500 to-purple-500",
  },
  {
    text: "Give me 5 unique names for a fantasy rogue character",
    icon: Sparkles,
    color: "from-fuchsia-500 to-pink-500",
  },
  {
    text: "Explain how to collaborate on a story",
    icon: BookOpen,
    color: "from-emerald-500 to-teal-500",
  },
];

const ChatPage: React.FC = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ISparkyMessage[]>(() => {
    const saved = localStorage.getItem("sparky_chat_history");
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isChatEmpty = messages.length === 0;

  // Persist chat history
  useEffect(() => {
    try {
      localStorage.setItem("sparky_chat_history", JSON.stringify(messages));
    } catch (e) {
      if (e instanceof DOMException && e.name === "QuotaExceededError") {
        toast.error("Chat history could not be saved because storage is full.");
      } else {
        console.warn("Failed to persist chat history:", e);
      }
    }
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (textToSend: string, existingMessages?: ISparkyMessage[]) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    setErrorState(null);
    const userMessage: ISparkyMessage = { role: "user", content: trimmed };
    const baseMessages = existingMessages ?? messages;
    const updatedMessages = [...baseMessages, userMessage];
    setMessages(updatedMessages);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await chatWithSparky(updatedMessages);
      const botMessage: ISparkyMessage = { role: "model", content: response.content };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error(err);
      const errMsg = err.message || "Failed to communicate with Sparky AI service.";
      setErrorState(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(message);
    }
  };

  const handleRetry = () => {
    if (messages.length === 0) return;
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage.role === "user") {
      const trimmedMessages = messages.slice(0, -1);
      setMessages(trimmedMessages);
      handleSend(lastUserMessage.content, trimmedMessages);
    }
  };

  const clearChat = () => {
    if (isChatEmpty) return;
    setIsConfirmingClear(true);
  };

  const confirmClear = () => {
    setMessages([]);
    setIsConfirmingClear(false);
    try {
      localStorage.removeItem("sparky_chat_history");
    } catch (e) {
      console.warn("Failed to clear chat history from storage:", e);
    }
    toast.success("Conversation cleared");
  };

  // Simple Markdown-to-HTML parser for basic bolding, code, list rendering
  const renderMessageContent = (content: string) => {
    return content.split("\n").map((line, idx) => {
      let formatted = line;

      // Handle simple headers
      if (formatted.startsWith("### ")) {
        return <h4 key={idx} className="text-sm font-bold text-slate-900 dark:text-white mt-3 mb-1">{formatted.replace("### ", "")}</h4>;
      }
      if (formatted.startsWith("## ")) {
        return <h3 key={idx} className="text-base font-bold text-slate-900 dark:text-white mt-4 mb-1">{formatted.replace("## ", "")}</h3>;
      }
      if (formatted.startsWith("# ")) {
        return <h2 key={idx} className="text-lg font-extrabold text-slate-900 dark:text-white mt-4 mb-2">{formatted.replace("# ", "")}</h2>;
      }

      // Handle list items
      const isBullet = formatted.startsWith("- ") || formatted.startsWith("* ");
      if (isBullet) {
        formatted = formatted.replace(/^[-*]\s+/, "");
      }

      // Handle bold text (**text**)
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;
      while ((match = boldRegex.exec(formatted)) !== null) {
        if (match.index > lastIndex) {
          parts.push(formatted.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="font-bold text-indigo-600 dark:text-indigo-400">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < formatted.length) {
        parts.push(formatted.substring(lastIndex));
      }

      const contentNode = parts.length > 0 ? parts : formatted;

      if (isBullet) {
        return (
          <li key={idx} className="ml-4 list-disc text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {contentNode}
          </li>
        );
      }

      return (
        <p key={idx} className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 min-h-[1rem]">
          {contentNode}
        </p>
      );
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Title */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl flex items-center justify-center sm:justify-start gap-3">
          <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 p-2 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
            <Bot className="h-8 w-8" />
          </span>
          Chat with Sparky
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Your creative co-writer and assistant. Brainstorm plots, refine characters, and get instant feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Info Panel (Hidden on Mobile) */}
        <div className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="rounded-3xl border border-slate-200/80 bg-white/60 p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.06] backdrop-blur-xl">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />
              Meet Sparky
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Sparky is specifically trained on StorySparkAI features. He can help you navigate the editor, construct branching choices, suggest complex story prompts, or simply co-write alongside you!
            </p>
            <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-white/5 space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                <Zap className="h-4 w-4 text-violet-500 shrink-0 mt-0.5" />
                <span>Supports context-aware history (remembers up to 10 messages)</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                <BookOpen className="h-4 w-4 text-pink-500 shrink-0 mt-0.5" />
                <span>Markdown output format for clear readouts</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white/60 p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.06] backdrop-blur-xl">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Suggested Topics</h2>
            <div className="space-y-2">
              {STARTER_PROMPTS.map((prompt, idx) => {
                const Icon = prompt.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt.text)}
                    disabled={isLoading}
                    className="w-full text-left text-xs p-2.5 rounded-xl border border-slate-200/60 dark:border-white/5 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 text-slate-600 dark:text-slate-300 transition-all duration-200 flex items-start gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 shrink-0 mt-0.5" />
                    <span>{prompt.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Central Chat Panel */}
        <div className="col-span-1 lg:col-span-3 flex flex-col h-[650px] rounded-3xl border border-slate-200/80 bg-white/60 shadow-xl dark:border-white/10 dark:bg-slate-950/40 backdrop-blur-2xl overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-slate-950/50 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                  <Bot size={22} />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-950"></span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Sparky</h3>
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">StorySpark AI Assistant</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isConfirmingClear ? (
                <div className="flex items-center gap-1.5 bg-red-50 dark:bg-red-950/20 p-1 rounded-xl border border-red-200 dark:border-red-900/30">
                  <span className="text-[10px] font-bold text-red-600 dark:text-red-400 px-1">Clear chat?</span>
                  <button
                    onClick={confirmClear}
                    className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setIsConfirmingClear(false)}
                    className="px-2 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={clearChat}
                  disabled={isChatEmpty || isLoading}
                  className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Clear chat history"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="grow overflow-y-auto p-6 space-y-6 bg-slate-50/20 dark:bg-slate-950/10">
            {isChatEmpty && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-lg mx-auto space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm animate-bounce duration-1000">
                  <MessageSquare size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Start a Conversation</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                    Ask Sparky anything about writing. You can try the quick starting suggestions on the left, or type your own question below.
                  </p>
                </div>

                {/* Suggested Topics for Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full pt-4 lg:hidden">
                  {STARTER_PROMPTS.map((prompt, idx) => {
                    const Icon = prompt.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSend(prompt.text)}
                        className="text-left text-xs p-3 rounded-2xl border border-slate-200/60 dark:border-white/5 hover:border-indigo-500 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 transition-all flex items-center gap-2"
                      >
                        <Icon className="h-4 w-4 text-indigo-500 shrink-0" />
                        <span className="truncate">{prompt.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm ${
                    msg.role === "user"
                      ? "bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}>
                    {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm space-y-2 shadow-sm ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-tr-none"
                      : "bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-tl-none text-slate-900 dark:text-slate-100"
                  }`}>
                    {msg.role === "user" ? (
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      renderMessageContent(msg.content)
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start animate-pulse">
                <div className="flex gap-3 max-w-[75%]">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">Sparky is typing</span>
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0s]"></span>
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {errorState && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                    <AlertCircle size={16} />
                  </div>
                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 p-4 rounded-2xl rounded-tl-none space-y-3 shadow-sm">
                    <p className="text-xs text-red-700 dark:text-red-400 font-semibold leading-relaxed">
                      {errorState}
                    </p>
                    <button
                      onClick={handleRetry}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      <RefreshCw size={12} className="animate-spin-hover" />
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Panel */}
          <div className="p-4 border-t border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-slate-950/50 shrink-0">
            <form onSubmit={handleSubmit} className="flex gap-3 items-end">
              <div className="grow relative">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message to Sparky..."
                  className="w-full resize-none max-h-32 px-4 py-3 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none pr-10 shadow-inner text-slate-800 dark:text-slate-100"
                  style={{ height: "auto" }}
                />
              </div>
              <button
                type="submit"
                disabled={!message.trim() || isLoading}
                className="h-11 w-11 shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform active:scale-95"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </form>
            <div className="mt-1.5 flex justify-between text-[10px] text-slate-400 dark:text-slate-500 px-1">
              <span>Press Enter to send, Shift + Enter for new line</span>
              <span>Always verify key details</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
