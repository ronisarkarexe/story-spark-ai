"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, RotateCcw, Copy, Check, Maximize2, Minimize2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Turnstile = dynamic(
  () => import("@marsidev/react-turnstile").then((mod) => mod.Turnstile),
  { ssr: false },
);

const INITIAL_MESSAGES = [
  {
    role: "assistant",
    content: "Hi! I'm your **AlgoBuddy Assistant** 🤖. I can help you understand algorithms, explain time complexities, walk through code line-by-line, or help you solve DSA problems in simple words.\n\nWhat are you learning today?",
  },
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);

  const messagesEndRef = useRef(null);
  const turnstileRef = useRef(null);

  const refreshCaptcha = () => {
    setCaptchaToken(null);
    try {
      turnstileRef.current?.reset?.();
      turnstileRef.current?.execute?.();
    } catch {
      // Best-effort: different Turnstile wrappers expose different imperative APIs.
    }
  };

  // Load chat history from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem("algobuddy_chat_history");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load chat history:", e);
      }
    }
  }, []);

  // Pre-fetch a Turnstile token so the first message doesn't require a reload.
  useEffect(() => {
    refreshCaptcha();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save chat history to sessionStorage
  useEffect(() => {
    if (messages.length > 1) {
      sessionStorage.setItem("algobuddy_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom on updates
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    // captcha skipped in development

    setError(null);
    if (!textToSend) setInput("");

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Map messages to the structure expected by OpenAI API (role and content only)
      const apiMessages = newMessages.map(({ role, content }) => ({
        role,
        content,
      }));

      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: apiMessages, captchaToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Please log in to use the AI assistant.");
        }
        if (res.status === 403) {
          refreshCaptcha();
        }
        throw new Error(data.error || "Failed to get AI response.");
      }

      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      } else {
        throw new Error("Invalid response format received from backend.");
      }
    } catch (err) {
      console.error("Error sending chat message:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      // Turnstile tokens are single-use; refresh after every attempt.
      refreshCaptcha();
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (confirm("Are you sure you want to clear your conversation?")) {
      setMessages(INITIAL_MESSAGES);
      sessionStorage.removeItem("algobuddy_chat_history");
      setError(null);
    }
  };

  const handleCopyCode = (codeText, blockId) => {
    navigator.clipboard.writeText(codeText);
    setCopiedId(blockId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      {/* Chat Window Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`fixed bottom-24 right-6 z-[9999] rounded-[var(--radius-lg)] border bg-white dark:bg-[var(--udemy-dark-surface)] border-[var(--color-border)] shadow-[var(--shadow-elevated)] flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
              isMaximized
                ? "w-[800px] h-[700px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-8rem)]"
                : "w-[380px] h-[530px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-8rem)]"
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#a435f0] to-[#7d2be0] p-4 text-white flex items-center justify-between shadow-sm select-none">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm border border-white/10 relative">
                  <Bot className="w-5.5 h-5.5 text-white" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#a435f0]"></span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm font-serif">AlgoBuddy Assistant</h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-purple-100">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                    <span>Online • Quick Help</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearChat}
                  title="Clear chat history"
                  className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-purple-100 hover:text-white"
                >
                  <RotateCcw className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  title={isMaximized ? "Minimize window" : "Maximize window"}
                  className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-purple-100 hover:text-white"
                >
                  {isMaximized ? (
                    <Minimize2 className="w-4.5 h-4.5" />
                  ) : (
                    <Maximize2 className="w-4.5 h-4.5" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-purple-100 hover:text-white"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50/50 dark:bg-[#222426] scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
              {messages.map((msg, index) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={index}
                    className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-full bg-[#a435f0] text-white flex-shrink-0 flex items-center justify-center text-sm shadow-sm">
                        🤖
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-[var(--radius-lg)] px-4 py-2.5 text-sm shadow-sm leading-relaxed ${
                        isUser
                          ? "bg-[#a435f0] text-white rounded-tr-none"
                          : "bg-white dark:bg-[var(--udemy-dark-bg)] text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)] border border-[var(--color-border)] rounded-tl-none"
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0 prose-pre:my-2 prose-pre:bg-neutral-900 prose-code:text-[#a435f0] dark:prose-code:text-[#c27cf7] prose-code:bg-neutral-100 dark:prose-code:bg-neutral-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none font-sans">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              code({ node, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || "");
                                const codeString = String(children).replace(/\n$/, "");
                                const isBlock = match || codeString.includes("\n");
                                const blockId = `${index}-${codeString.slice(0, 10)}`;

                                return isBlock ? (
                                  <div className="relative group/code my-2 rounded-[var(--radius-md)] overflow-hidden border border-neutral-800 dark:border-neutral-800">
                                    <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-800 text-neutral-400 text-[10px] font-mono select-none">
                                      <span className="uppercase">{match ? match[1] : "code"}</span>
                                      <button
                                        onClick={() => handleCopyCode(codeString, blockId)}
                                        className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                                      >
                                        {copiedId === blockId ? (
                                          <>
                                            <Check className="w-3.5 h-3.5 text-green-400" />
                                            <span>Copied</span>
                                          </>
                                        ) : (
                                          <>
                                            <Copy className="w-3.5 h-3.5" />
                                            <span>Copy</span>
                                          </>
                                        )}
                                      </button>
                                    </div>
                                    <pre className="m-0 p-3 bg-neutral-950 overflow-x-auto font-mono text-[11px] text-neutral-100 leading-normal">
                                      <code className={className} {...props}>
                                        {children}
                                      </code>
                                    </pre>
                                  </div>
                                ) : (
                                  <code className={`${className} font-mono`} {...props}>
                                    {children}
                                  </code>
                                );
                              },
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                    {isUser && (
                      <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 flex-shrink-0 flex items-center justify-center text-sm shadow-sm">
                        👤
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Loader */}
              {isLoading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-8 h-8 rounded-full bg-[#a435f0] text-white flex-shrink-0 flex items-center justify-center text-sm">
                    🤖
                  </div>
                  <div className="max-w-[80%] rounded-[var(--radius-lg)] rounded-tl-none px-4 py-3 bg-white dark:bg-[var(--udemy-dark-bg)] border border-[var(--color-border)] flex items-center gap-2 text-sm text-[var(--color-muted)] shadow-sm">
                    <span className="flex gap-1.5 items-center py-1">
                      <span className="w-2 h-2 bg-[#a435f0] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-2 h-2 bg-[#a435f0] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-2 h-2 bg-[#a435f0] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </span>
                  </div>
                </div>
              )}

              {/* Error Box */}
              {error && (
                <div className="p-3 rounded-[var(--radius-md)] bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs border border-red-200 dark:border-red-950/50 flex flex-col gap-1.5">
                  <p className="font-semibold">Request Failed</p>
                  <p className="opacity-90">{error}</p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white dark:bg-[var(--udemy-dark-surface)] border-t border-[var(--color-border)] flex gap-2 items-center"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about DSA algorithms..."
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-neutral-50 dark:bg-[var(--udemy-dark-bg)] text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)] placeholder-neutral-400 dark:placeholder-neutral-500 border border-[var(--color-border)] rounded-full text-sm focus:outline-none focus:border-[#a435f0] focus:ring-1 focus:ring-[#a435f0] transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-9 h-9 rounded-full bg-[#a435f0] hover:bg-[#7d2be0] text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Turnstile captcha (invisible) */}
      <div className="w-0 h-0 overflow-hidden" aria-hidden="true">
        <Turnstile
          ref={turnstileRef}
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          onSuccess={(token) => setCaptchaToken(token)}
          options={{ size: "invisible" }}
        />
      </div>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-gradient-to-tr from-[#a435f0] via-[#8f2cd6] to-[#c27cf7] text-white shadow-[var(--shadow-elevated)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer"
        aria-label="Toggle AI Assistant"
      >
        <div className="absolute inset-0 rounded-full bg-[#a435f0] animate-ping opacity-25 group-hover:opacity-0 transition-opacity"></div>
        {isOpen ? (
          <X className="w-6 h-6 transition-transform duration-300" />
        ) : (
          <Bot className="w-6 h-6 bot-wiggle transition-transform duration-300" />
        )}
      </button>
    </>
  );
}
