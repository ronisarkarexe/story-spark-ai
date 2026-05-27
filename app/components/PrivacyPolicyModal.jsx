import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";

const policySections = [
  {
    id: "1",
    title: "Information We Collect",
    data: "We collect personal information like name, email address, and usage data (IP, browser, etc.) to provide and improve our services.",
  },
  {
    id: "2",
    title: "How We Use Your Information",
    points: [
      "To provide and maintain our services",
      "Improve user experience and service quality",
      "Send important updates or support emails",
    ],
  },
  {
    id: "3",
    title: "Your Rights",
    data: "You have the right to request access, correction, or deletion of your personal data at any time by contacting us.",
  },
  {
    id: "4",
    title: "Contact Information",
    data: "For any privacy-related questions, please contact us at",
    contact: "hello@algobuddy.in",
  },
];

const PrivacyPolicyModal = ({ isOpen, onClose }) => {
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
            Privacy Policy
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
            Your privacy is important to us. This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you
            visit our website or use our services.
          </p>

          {/* Policy sections */}
          <div className="space-y-6">
            <ul>
              {policySections.map((item, index) => (
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
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
