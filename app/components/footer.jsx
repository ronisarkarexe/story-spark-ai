"use client";
import React from "react";
import { useState } from "react";
import PrivacyPolicyModal from "@/app/components/PrivacyPolicyModal";
import TermsOfServiceModal from "@/app/components/termsOfServicesModal";
import CookiePolicyModal from "@/app/components/cookie";

const Footer = () => {
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showCookieModal, setShowCookieModal] = useState(false);

  return (
    <footer className="bg-udemy-dark-bg text-udemy-dark-muted">
      <div className="border-t border-udemy-dark-surface" />

      <div className="container-app section-app flex flex-col items-center text-center space-y-6">
        <span className="text-xl font-bold font-serif text-udemy-dark-text tracking-tight">
          Algo<span className="text-primary">Buddy</span>
        </span>

        <p className="text-sm text-udemy-dark-muted max-w-xs leading-relaxed">
          Interactive visualization tools for mastering data structures and
          algorithms.
        </p>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/PankajSingh34"
            aria-label="GitHub"
            className="w-10 h-10 rounded-full border border-udemy-dark-border flex items-center justify-center text-udemy-dark-muted hover:text-udemy-dark-text hover:border-udemy-dark-text transition-colors focus-ring"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
          </a>

          <a
            href="https://www.linkedin.com/in/pankaj-singh-2a968b212/"
            aria-label="LinkedIn"
            className="w-10 h-10 rounded-full border border-udemy-dark-border flex items-center justify-center text-udemy-dark-muted hover:text-udemy-dark-text hover:border-udemy-dark-text transition-colors focus-ring"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>

          <a
            href="mailto:singhps588@gmail.com"
            aria-label="Email"
            className="w-10 h-10 rounded-full border border-udemy-dark-border flex items-center justify-center text-udemy-dark-muted hover:text-udemy-dark-text hover:border-udemy-dark-text transition-colors focus-ring"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </a>
        </div>

        <div className="w-full border-t border-udemy-dark-surface" />

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-xs text-udemy-dark-muted w-full justify-between">
          <span>
            &copy; {new Date().getFullYear()} AlgoBuddy. All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowPolicyModal(true)}
              aria-label="Privacy Policy"
              className="hover:text-primary transition focus-ring"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setShowTermsModal(true)}
              aria-label="Terms of Service"
              className="hover:text-primary transition focus-ring"
            >
              Terms
            </button>
            <button
              onClick={() => setShowCookieModal(true)}
              aria-label="Cookie Policy"
              className="hover:text-primary transition focus-ring"
            >
              Cookies
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PrivacyPolicyModal
        isOpen={showPolicyModal}
        onClose={() => setShowPolicyModal(false)}
      />
      <TermsOfServiceModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
      <CookiePolicyModal
        isOpen={showCookieModal}
        onClose={() => setShowCookieModal(false)}
      />
    </footer>
  );
};

export default Footer;
