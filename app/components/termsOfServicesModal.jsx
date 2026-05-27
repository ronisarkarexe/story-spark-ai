import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";

const termsSections = [
  {
    id: "1",
    title: "Acceptance of Terms",
    data: "By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.",
  },
  {
    id: "2",
    title: "Use License",
    points: [
      "Permission is granted to temporarily use the materials on this website for personal, non-commercial transitory viewing only",
      "This is the grant of a license, not a transfer of title",
      "You may not modify or copy the materials, use them for any commercial purpose, or remove any copyright or proprietary notations",
    ],
  },
  {
    id: "3",
    title: "User Responsibilities",
    points: [
      "Provide accurate and complete information when required",
      "Maintain the confidentiality of your account credentials",
      "Notify us immediately of any unauthorized use of your account",
      "Use the service in compliance with all applicable laws and regulations",
    ],
  },
  {
    id: "4",
    title: "Intellectual Property",
    data: "All content, features, and functionality on this website, including but not limited to text, graphics, logos, and software, are the exclusive property of the company and are protected by international copyright, trademark, and other intellectual property laws.",
  },
  {
    id: "5",
    title: "Limitation of Liability",
    data: "In no event shall the company, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.",
  },
  {
    id: "6",
    title: "Governing Law",
    data: "These Terms shall be governed and construed in accordance with the laws of the applicable jurisdiction, without regard to its conflict of law provisions.",
  },
  {
    id: "7",
    title: "Changes to Terms",
    data: "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.",
  },
  {
    id: "8",
    title: "Contact Information",
    data: "If you have any questions about these Terms, please contact us at",
    contact: "hello@algobuddy.in",
  },
];

const TermsOfServiceModal = ({ isOpen, onClose }) => {
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
            Terms of Service
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
            Please read these terms and conditions carefully before using our
            website and services. Your access to and use of the service is
            conditioned on your acceptance of and compliance with these terms.
          </p>

          {/* Terms sections */}
          <div className="space-y-6">
            <ul>
              {termsSections.map((item, index) => (
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
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServiceModal;
