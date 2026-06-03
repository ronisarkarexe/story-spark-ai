import React, { useState, useRef, useEffect } from "react";
import { Send, MessageSquare, X, Minus, Trash2, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  chatWithAI,
  chatWithAIFree,
  IChatMessage,
} from "../../services/ai.service";
import { getUserInfo } from "../../services/auth.service";
import toast from "react-hot-toast";

const ChatComponent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = getUserInfo();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isMinimized]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage: IChatMessage = { role: "user", parts: message };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const chatFn = user ? chatWithAI : chatWithAIFree;
      const history = messages.slice(-10); // Send last 10 messages as history
      const response = await chatFn(message, history);

      const botMessage: IChatMessage = { role: "model", parts: response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error: unknown) {
      console.error("Chat error:", error);
      const message =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
          ? error.response.data.message
          : "Failed to get AI response";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat history?")) {
      setMessages([]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              height: isMinimized ? "64px" : "500px",
              width: "350px",
            }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col mb-4"
          >
            {/* Header */}
            <div className="p-4 bg-indigo-600 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">StorySpark AI</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    <span className="text-[10px] text-indigo-100">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Minus size={18} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50">
                  {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 opacity-60">
                      <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mb-2">
                        <MessageSquare size={24} className="text-slate-400" />
                      </div>
                      <p className="text-sm font-medium">
                        Hello! How can I help you today?
                      </p>
                      <p className="text-xs">
                        Ask me about story ideas, characters, or writing tips!
                      </p>
                    </div>
                  )}
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${
                            msg.role === "user"
                              ? "bg-indigo-100 text-indigo-600"
                              : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {msg.role === "user" ? (
                            <User size={16} />
                          ) : (
                            <Bot size={16} />
                          )}
                        </div>
                        <div
                          className={`p-3 rounded-2xl text-sm ${
                            msg.role === "user"
                              ? "bg-indigo-600 text-white rounded-tr-none"
                              : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-tl-none"
                          }`}
                        >
                          {msg.parts}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex gap-2 items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl rounded-tl-none">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
                  <form onSubmit={handleSend} className="flex gap-2">
                    <button
                      type="button"
                      onClick={clearChat}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      title="Clear chat"
                    >
                      <Trash2 size={20} />
                    </button>
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-grow p-2 text-sm bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!message.trim() || isLoading}
                      className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all"
                    >
                      <Send size={20} />
                    </button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setIsMinimized(false);
        }}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen
            ? "bg-slate-800 text-white rotate-90"
            : "bg-indigo-600 text-white"
        }`}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>
    </div>
  );
};

export default ChatComponent;
