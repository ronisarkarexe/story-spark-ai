"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// -------------------------------------------------------------------
// Fix: Added missing FiChevronRight icon import.
// This resolves ReferenceError when rendering the "View all help articles"
// button in the Support Center tab.
// -------------------------------------------------------------------
import { FiX, FiMail, FiMessageSquare, FiSend, FiChevronRight } from "react-icons/fi"; // Added FiChevronRight import for Support Center icon
import dynamic from "next/dynamic";

const Turnstile = dynamic(
  () => import("@marsidev/react-turnstile").then((mod) => mod.Turnstile),
  { ssr: false },
);

const ContactSupportPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("contact");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    subject: "Support Request",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const popupRef = useRef(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!captchaToken) {
        throw new Error("Please complete the captcha");
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, captchaToken }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Failed to send message");
      }

      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        message: "",
        subject: "Support Request",
      });
      setCaptchaToken(null);

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setIsOpen(false);
      }, 3000);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Contact Us button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 font-semibold z-40 bg-udemy-purple hover:bg-udemy-purple-dark text-white px-6 py-3 rounded shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
      >
        <FiMail size={18} />
        <span>Contact Us</span>
      </motion.button>

      {/* Popup overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Popup content */}
            <motion.div
              ref={popupRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white dark:bg-udemy-dark-surface rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Header */}
              <div className="bg-udemy-purple p-4 text-white flex justify-between items-center">
                <h3 className="text-xl font-bold">
                  {activeTab === "contact" ? "Contact Us" : "Support Center"}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-white/80 transition-colors"
                  disabled={isLoading}
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {activeTab === "contact" ? (
                  <form onSubmit={handleSubmit}>
                    {isSubmitted ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-8"
                      >
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                        </div>
                        <h4 className="text-xl font-bold text-zinc-800 dark:text-white mb-2">
                          Message Sent!
                        </h4>
                        <p className="text-zinc-600 dark:text-zinc-400">
                          We'll get back to you soon.
                        </p>
                      </motion.div>
                    ) : (
                      <>
                        {error && (
                          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
                            {error}
                          </div>
                        )}
                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor="name"
                              className="block text-left text-sm font-semibold text-udemy-text dark:text-udemy-dark-text mb-1"
                            >
                              Your Name
                            </label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              disabled={isLoading}
                              className="w-full px-4 py-2 bg-udemy-surface dark:bg-udemy-dark-bg border border-udemy-border dark:border-udemy-dark-border rounded focus:outline-none focus:ring-2 focus:ring-udemy-purple focus:border-transparent disabled:opacity-70"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="email"
                              className="block text-left text-sm font-semibold text-udemy-text dark:text-udemy-dark-text mb-1"
                            >
                              Email Address
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              disabled={isLoading}
                              className="w-full px-4 py-2 bg-udemy-surface dark:bg-udemy-dark-bg border border-udemy-border dark:border-udemy-dark-border rounded focus:outline-none focus:ring-2 focus:ring-udemy-purple focus:border-transparent disabled:opacity-70"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="subject"
                              className="block text-left text-sm font-semibold text-udemy-text dark:text-udemy-dark-text mb-1"
                            >
                              Subject
                            </label>
                            <select
                              id="subject"
                              name="subject"
                              value={formData.subject}
                              onChange={handleInputChange}
                              disabled={isLoading}
                              className="w-full text-md px-4 py-2 bg-udemy-surface dark:bg-udemy-dark-bg border border-udemy-border dark:border-udemy-dark-border rounded focus:outline-none focus:ring-2 focus:ring-udemy-purple focus:border-transparent disabled:opacity-70"
                            >
                              <option>Support Request</option>
                              <option>Feedback</option>
                              <option>Bug Report</option>
                              <option>Feature Request</option>
                              <option>Other Inquiry</option>
                            </select>
                          </div>
                          <div>
                            <label
                              htmlFor="message"
                              className="block text-left text-sm font-semibold text-udemy-text dark:text-udemy-dark-text mb-1"
                            >
                              Message
                            </label>
                          <textarea
                              id="message"
                              name="message"
                              rows="4"
                              value={formData.message}
                              onChange={handleInputChange}
                              required
                              disabled={isLoading}
                              className="w-full px-4 py-2 bg-udemy-surface dark:bg-udemy-dark-bg border border-udemy-border dark:border-udemy-dark-border rounded focus:outline-none focus:ring-2 focus:ring-udemy-purple focus:border-transparent disabled:opacity-70"
                            ></textarea>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-center">
                          <Turnstile
                            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                            onSuccess={(token) => setCaptchaToken(token)}
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isLoading || !captchaToken}
                          className="mt-6 w-full bg-udemy-purple hover:bg-udemy-purple-dark text-white py-3 px-4 rounded font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Sending...
                            </>
                          ) : (
                            <>
                              <FiSend /> Send Message
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                      <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2">
                        Need immediate help?
                      </h4>
                      <p className="text-blue-700 dark:text-blue-300 text-sm">
                        Check out our{" "}
                        <a href="#" className="underline">
                          FAQs
                        </a>{" "}
                        or join our{" "}
                        <a href="#" className="underline">
                          community forum
                        </a>
                        .
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-800 dark:text-white mb-3">
                        Common Questions
                      </h4>
                      <div className="space-y-3">
                        {[
                          "How do I reset my password?",
                          "Where can I find documentation?",
                          "What are your business hours?",
                          "How do I cancel my subscription?",
                        ].map((question, index) => (
                          <a
                            key={index}
                            href="#"
                            className="block p-3 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-lg transition-colors"
                          >
                            {question}
                          </a>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2">
                      <button className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                        View all help articles <FiChevronRight />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ContactSupportPopup;
