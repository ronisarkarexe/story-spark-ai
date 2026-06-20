import React from "react";
import {
  ShieldCheck,
  Lock,
  Database,
  Cookie,
  Sparkles,
  Mail,
  Eye,
  Server,
} from "lucide-react";

const privacySections = [
  {
    icon: ShieldCheck,
    title: "Introduction",
    content:
      "Welcome to StorySpark AI. We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data while you use our platform and services.",
  },
  {
    icon: Database,
    title: "Information We Collect",
    list: [
      "Name and email address during account creation",
      "Story prompts, generated content, and uploaded media",
      "Usage analytics and interaction data",
      "Device and browser information",
      "Cookies and session tracking information",
    ],
  },
  {
    icon: Sparkles,
    title: "How We Use Your Information",
    cards: [
      {
        title: "Platform Improvement",
        description:
          "We use data to improve AI story generation, user experience, and overall platform performance.",
      },
      {
        title: "Personalization",
        description:
          "Your preferences help us generate better and more relevant stories and recommendations.",
      },
      {
        title: "Security",
        description:
          "We monitor suspicious activity and protect accounts from unauthorized access.",
      },
      {
        title: "Communication",
        description:
          "We may send important updates, policy changes, and service announcements.",
      },
    ],
  },
  {
    icon: Cookie,
    title: "Cookies & Tracking Technologies",
    content:
      "StorySpark AI uses cookies and similar technologies to improve functionality, analyze traffic, and enhance user experience. You can disable cookies through your browser settings if preferred.",
  },
  {
    icon: Lock,
    title: "Data Protection",
    content:
      "We implement industry-standard security measures to protect your personal information from unauthorized access, misuse, or disclosure.",
  },
  {
    icon: Server,
    title: "Third-Party Services",
    content:
      "We may use trusted third-party tools and analytics services to improve our platform. These services may collect limited technical information in accordance with their own privacy policies.",
  },
  {
    icon: Eye,
    title: "Your Rights",
    list: [
      "Request access to your personal data",
      "Request correction or deletion of your data",
      "Withdraw consent at any time",
      "Request account deletion",
    ],
  },
];

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900 transition-colors duration-300 dark:bg-[#050816] dark:text-white">
      {/* FLOATING BLOBS */}
      <div className="absolute top-0 left-0 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl animate-pulse"></div>
      <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl"></div>

      <div className="relative z-10 px-6 py-24 pt-28 sm:pt-32">
        <div className="max-w-6xl mx-auto">

          {/* HERO */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300 backdrop-blur-md mb-6">
              <ShieldCheck size={15} />
              Privacy &amp; Data Protection
            </div>
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-tight">
              Privacy{" "}
              <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            <p className="mt-8 max-w-3xl mx-auto text-lg sm:text-xl leading-8 text-slate-600 dark:text-slate-300">
              Your privacy matters to us at StorySpark AI. Learn how we collect,
              use, and protect your data while providing a safe and creative
              storytelling experience.
            </p>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Last Updated: May 2026
            </p>
          </div>

          {/* SECTIONS */}
          <div className="space-y-8">
            {privacySections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200/60 bg-white/60 p-8 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04]"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <Icon size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {index + 1}. {section.title}
                    </h2>
                  </div>

                  {"content" in section && section.content && (
                    <p className="text-slate-600 dark:text-slate-300 leading-7">
                      {section.content}
                    </p>
                  )}

                  {"list" in section && section.list && (
                    <ul className="space-y-2">
                      {section.list.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {"cards" in section && section.cards && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {section.cards.map((card, i) => (
                        <div
                          key={i}
                          className="rounded-xl border border-slate-200/60 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[0.04]"
                        >
                          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                            {card.title}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            {card.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* CONTACT */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300 backdrop-blur-md mb-4">
              <Mail size={15} />
              Contact Us
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Questions about this policy? Reach us at{" "}
              <a
                href="mailto:privacy@storyspark.ai"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                privacy@storyspark.ai
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;