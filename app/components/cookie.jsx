import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";

const cookieSections = [
  {
    id: "1",
    title: "What Are Cookies",
    data: "Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.",
  },
  {
    id: "2",
    title: "Types of Cookies We Use",
    points: [
      "Essential Cookies: Required for basic site functionality and security",
      "Performance Cookies: Help us understand how visitors interact with our website",
      "Functionality Cookies: Remember your preferences and settings",
      "Analytics Cookies: Collect information about your usage patterns",
    ],
  },
  {
    id: "3",
    title: "How We Use Cookies",
    points: [
      "To authenticate users and prevent fraudulent use",
      "Remember your preferences and settings",
      "Analyze site traffic and usage patterns",
      "Improve our website performance and user experience",
      "Provide personalized content when available",
    ],
  },
  {
    id: "4",
    title: "Third-Party Cookies",
    data: "We may also use cookies from trusted third-party services for analytics, performance monitoring, and other functionality. These third parties have their own privacy policies governing cookie usage.",
  },
  {
    id: "5",
    title: "Cookie Management",
    points: [
      "You can control cookie settings through your browser preferences",
      "Most browsers allow you to refuse or delete cookies",
      "Disabling essential cookies may affect website functionality",
      "You can opt-out of analytics cookies using our cookie preferences tool",
    ],
  },
  {
    id: "6",
    title: "Your Choices",
    data: "You have the right to accept or reject cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. However, this may prevent you from taking full advantage of the website.",
  },
  {
    id: "7",
    title: "Updates to Cookie Policy",
    data: "We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our operations. We encourage you to periodically review this page for the latest information.",
  },
  {
    id: "8",
    title: "Contact Information",
    data: "If you have any questions about our use of cookies, please contact us at",
    contact: "hello@algobuddy.in",
  },
];

const CookiePolicyModal = ({ isOpen, onClose }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop with fade-in animation */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal container with slide-up animation */}
      <div className="relative bg-white dark:bg-udemy-dark-surface text-udemy-text dark:text-udemy-dark-text max-w-3xl w-full rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 max-h-[90vh] flex flex-col border border-udemy-border dark:border-udemy-dark-border">
        {/* Header with close button */}
        <div className="sticky top-0 bg-white dark:bg-udemy-dark-surface border-b border-udemy-border dark:border-udemy-dark-border p-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-udemy-purple to-udemy-purple-dark dark:from-udemy-purple-light dark:to-udemy-purple">
            Cookie Policy
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-purple-50 dark:hover:bg-udemy-dark-bg transition-colors text-udemy-muted dark:text-udemy-dark-muted hover:text-udemy-purple dark:hover:text-udemy-purple-light"
            aria-label="Close"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto p-6 scrollbar-thin">
          <p className="mb-6 text-udemy-muted dark:text-udemy-dark-muted leading-relaxed">
            This Cookie Policy explains how we use cookies and similar
            technologies on our website. It describes the types of cookies we
            use, their purposes, and how you can manage your cookie preferences.
          </p>

          {/* Cookie policy sections */}
          <div className="space-y-6">
            <ul>
              {cookieSections.map((item, index) => (
                <li key={index} className="mb-4">
                  <div className="bg-purple-50/25 dark:bg-udemy-dark-bg/50 p-5 rounded-xl border border-purple-100/40 dark:border-udemy-dark-border hover:border-udemy-purple/20 dark:hover:border-udemy-purple-light/10 transition-all duration-300">
                    <div className="flex items-start">
                      <span className="w-6 h-6 flex-shrink-0 font-poppins font-semibold bg-purple-100 dark:bg-udemy-purple/20 rounded-full flex items-center justify-center text-udemy-purple dark:text-udemy-purple-light mr-3 mt-0.5">
                        {item.id}
                      </span>
                      <h3 className="text-xl font-bold font-serif text-udemy-text dark:text-udemy-dark-text mb-2">
                        {item.title}
                      </h3>
                    </div>
                    {item.points && (
                      <ul className="space-y-2 text-udemy-muted dark:text-udemy-dark-muted pl-9 mb-2">
                        {item.points.map((subitem, subindex) => (
                          <li
                            key={subindex}
                            className="list-disc text-udemy-purple dark:text-udemy-purple-light pl-1"
                          >
                            <span className="text-udemy-muted dark:text-udemy-dark-muted">
                              {subitem}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {item.data && (
                      <p className="text-udemy-muted dark:text-udemy-dark-muted pl-9 leading-relaxed">
                        {item.data}
                      </p>
                    )}
                    {item.contact && (
                      <div className="pl-9 mt-2">
                        <a
                          href={`mailto:${item.contact}`}
                          className="font-semibold text-udemy-purple dark:text-udemy-purple-light hover:text-udemy-purple-dark dark:hover:text-udemy-purple hover:underline transition-colors duration-200"
                        >
                          {item.contact}
                        </a>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Additional cookie information */}
          <div className="mt-6 p-4 bg-purple-50/30 dark:bg-udemy-purple/10 rounded-lg border border-purple-100/30 dark:border-udemy-purple/20">
            <h4 className="font-bold text-udemy-purple dark:text-udemy-purple-light mb-2">
              🍪 Cookie Duration
            </h4>
            <p className="text-sm text-udemy-muted dark:text-udemy-dark-muted leading-relaxed">
              Session cookies are temporary and expire when you close your
              browser. Persistent cookies remain on your device for a set period
              or until you delete them.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-udemy-border dark:border-udemy-dark-border">
            <p className="text-xs text-udemy-muted dark:text-udemy-dark-muted">
              Last updated: May 17, 2025
            </p>
          </div>
        </div>

        {/* Footer with close button */}
        <div className="sticky bottom-0 bg-white dark:bg-udemy-dark-surface border-t border-udemy-border dark:border-udemy-dark-border p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-udemy-purple hover:bg-udemy-purple-dark text-white font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 text-sm"
          >
            Accept & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyModal;
