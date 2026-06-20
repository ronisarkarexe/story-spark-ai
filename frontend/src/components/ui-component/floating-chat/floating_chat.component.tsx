

import React, { useState, useEffect, useRef } from "react";
import { useChatWithAiMutation } from "../../../redux/apis/chat.api";
import { isLoggedIn } from "../../../services/auth.service";
import toast from "react-hot-toast";

interface IMessage {
  role: "user" | "model" | "system";
  content: string;
}

const STARTER_PROMPTS = [
  { label: "Plot Twist", text: "Suggest a sudden plot twist for a mystery story.", emoji: "🎭" },
  { label: "Character Name", text: "Suggest 5 unique names and short descriptions for a fantasy antagonist.", emoji: "🧙" },
  { label: "Critique Draft", text: "Critique my opening sentence: 'The sky was the color of a bruised plum.' How can I make it more engaging?", emoji: "✍️" },
];

export const FloatingChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [hasNewMessage, setHasNewMessage] = useState<boolean>(false);
  
  const [chatWithAi, { isLoading }] = useChatWithAiMutation();
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const isAuth = isLoggedIn();

  // Load chat history from localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("story_spark_chat_history");
      if (savedHistory) {
        setMessages(JSON.parse(savedHistory));
      } else {
        // Initial welcoming message
        setMessages([
          {
            role: "model",
            content: "Hi! I'm **Sparky**, your creative writing co-pilot. ✍️\n\nHow can I help you with your story today? You can ask me to brainstorm plot ideas, develop characters, or polish your writing style!",
          },
        ]);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem("story_spark_chat_history", JSON.stringify(messages));
      } catch {
        // Ignore storage quota errors
      }
    }
  }, [messages]);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: IMessage = { role: "user", content: textToSend };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText("");

    try {
      // Filter out system messages when sending to backend
      const backendPayload = updatedMessages
        .filter((msg) => msg.role !== "system")
        .map((msg) => ({
          role: msg.role === "model" ? ("model" as const) : ("user" as const),
          content: msg.content,
        }));

      const response = await chatWithAi({ messages: backendPayload }).unwrap();
      
      if (response && response.success) {
        setMessages((prev) => [
          ...prev,
          { role: "model", content: response.data.content },
        ]);
      }
    } catch (err: any) {
      // Capture rate limit or API errors
      let errMsg = "Oops! Something went wrong. Please try again.";
      if (err?.data) {
        if (Array.isArray(err.data) && err.data.length > 0) {
          errMsg = err.data[0].message || errMsg;
        } else if (typeof err.data === "object" && err.data.message) {
          errMsg = err.data.message;
        }
      } else if (err?.message) {
        errMsg = err.message;
      }
      setMessages((prev) => [
        ...prev,
        { role: "system", content: `⚠️ ${errMsg}` },
      ]);
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear your conversation history?")) {
      const initialMessage: IMessage = {
        role: "model",
        content: "Conversation cleared! What story idea shall we brainstorm next? 🚀",
      };
      setMessages([initialMessage]);
      localStorage.removeItem("story_spark_chat_history");
    }
  };

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewMessage(false);
    }
  };

  // Simple Markdown parser for Bold and Line Breaks
  const renderMessageContent = (content: string) => {
    // Regex parsing
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      // Parse Bold (**text**)
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        parts.push(
          <strong key={match.index} className="font-extrabold text-slate-900 dark:text-white">
            {match[1]}
          </strong>
        );
        lastIndex = boldRegex.lastIndex;
      }

      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      return (
        <p key={idx} className="min-h-[1em] mb-1.5 leading-relaxed break-words">
          {parts.length > 0 ? parts : line}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={toggleWidget}
          aria-label="Open Sparky Chat Assistant"
          className="relative group flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-[0_4px_20px_rgba(79,70,229,0.4)] border border-indigo-500/30 hover:scale-110 active:scale-95 transition-all duration-300 transform-gpu cursor-pointer"
        >
          <i className="fa-regular fa-comment-dots text-xl animate-pulse"></i>
          
          {/* Notification pulse badge */}
          {hasNewMessage && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[9px] font-bold text-white items-center justify-center">1</span>
            </span>
          )}

          {/* Hover tooltips */}
          <span className="absolute right-16 scale-0 group-hover:scale-100 bg-slate-900/90 text-white text-[11px] font-semibold tracking-wide py-1.5 px-3 rounded-lg border border-slate-800 shadow-xl whitespace-nowrap transition-all duration-200 backdrop-blur-md">
            Chat with Sparky Co-Pilot
          </span>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="flex flex-col h-[560px] w-[380px] rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-[0_12px_40px_rgba(2,6,23,0.3)] animate-in slide-in-from-bottom-5 duration-300 transform-gpu overflow-hidden">
          
          {/* Chat Window Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-r from-blue-600/5 to-purple-600/5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
                <i className="fa-solid fa-robot text-sm"></i>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-extrabold text-slate-800 dark:text-white leading-tight">Sparky Co-Pilot</span>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Ready to brainstorm</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleClearChat}
                title="Clear conversation history"


                className="text-slate-400 hover:text-rose-500 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-trash-can text-xs"></i>
              </button>
              <button
                onClick={toggleWidget}
                title="Collapse Assistant"

                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>
          </div>

          {/* Chat Message Board */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => {
              if (msg.role === "system") {
                return (
                  <div key={idx} className="flex justify-center my-2 animate-fade-in">
                    <span className="text-xs font-semibold py-1.5 px-3.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl leading-snug max-w-[85%] text-center">
                      {msg.content}
                    </span>
                  </div>
                );
              }

              const isModel = msg.role === "model";
              return (
                <div key={idx} className={`flex items-start gap-2.5 ${isModel ? "" : "flex-row-reverse"} animate-fade-in`}>
                  {/* Avatar */}
                  <div className={`flex items-center justify-center h-7 w-7 rounded-full text-white text-[11px] shrink-0 shadow-md ${
                    isModel ? "bg-indigo-600" : "bg-slate-600 dark:bg-slate-800"
                  }`}>
                    {isModel ? <i className="fa-solid fa-robot"></i> : <i className="fa-solid fa-user"></i>}
                  </div>

                  {/* Message Bubble */}
                  <div className="flex flex-col max-w-[75%]">
                    <div className={`px-4 py-2.5 rounded-2xl text-xs shadow-sm border ${
                      isModel
                        ? "bg-slate-100 text-slate-800 border-slate-200/50 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-800"
                        : "bg-indigo-600 text-white border-indigo-500"
                    }`}>
                      {renderMessageContent(msg.content)}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* AI Response Loader */}
            {isLoading && (
              <div className="flex items-start gap-2.5 animate-fade-in">
                <div className="flex items-center justify-center h-7 w-7 rounded-full bg-indigo-600 text-white text-[11px] shrink-0 shadow-md">
                  <i className="fa-solid fa-robot animate-bounce"></i>
                </div>
                <div className="bg-slate-100 border border-slate-200/50 px-4 py-3 rounded-2xl dark:bg-slate-900 dark:border-slate-800">
                  <div className="flex gap-1.5 items-center">
                    <span className="h-2 w-2 bg-indigo-400/80 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="h-2 w-2 bg-indigo-400/80 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="h-2 w-2 bg-indigo-400/80 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Footer Input Area */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
            {/* Display Suggestion Pills on empty thread / welcome */}
            {messages.length <= 1 && !isLoading && (
              <div className="mb-3">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">Quick Brainstorm:</span>
                <div className="flex flex-wrap gap-1.5">
                  {STARTER_PROMPTS.map((pill) => (
                    <button
                      key={pill.label}
                      onClick={() => handleSendMessage(pill.text)}
                      className="inline-flex items-center gap-1.5 text-[10px] font-semibold py-1.5 px-3 border border-slate-200 dark:border-slate-800 rounded-full bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-400 hover:scale-105 transition-all duration-200 cursor-pointer shadow-sm"
                    >
                      <span>{pill.emoji}</span>
                      <span>{pill.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Warning Limit message for guests */}
            {!isAuth && (
              <div className="text-[10px] text-slate-500 dark:text-slate-400 text-center mb-2 font-medium tracking-wide">
                💡 Guest sessions are limited.{" "}
                <a href="/login" className="text-indigo-500 dark:text-indigo-400 hover:underline font-semibold">Sign in</a> for unlimited chat.
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value.slice(0, 500))}
                disabled={isLoading}
                placeholder="Ask your creative co-pilot..."

                className="flex-1 bg-white border border-slate-200 !text-gray-900 font-medium dark:bg-slate-900 dark:border-slate-800 dark:!text-gray-100 rounded-xl py-2 px-3.5 text-xs focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-all !placeholder-gray-600 dark:!placeholder-gray-400 shadow-inner"

              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                aria-label="Send message"
                className="flex items-center justify-center h-8.5 w-8.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 transition-colors shadow-md cursor-pointer"
              >
                <i className="fa-solid fa-paper-plane text-xs"></i>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

