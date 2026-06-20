import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  FileText,
  Lock,
  AlertTriangle,
  Sparkles,
  Scale,
  Mail,
} from "lucide-react";

const sections = [
  {
    icon: FileText,
    title: "Introduction",
    content:
      "Welcome to StorySparkAI. By accessing or using our platform, you agree to be bound by these Terms and Conditions. Our platform provides AI-assisted storytelling tools to help you create, edit, and explore engaging narratives.",
  },
  {
    icon: ShieldCheck,
    title: "Acceptance of Terms",
    content:
      "By registering an account, accessing, or otherwise utilizing StorySparkAI, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree, please do not use the service.",
  },
  {
    icon: Lock,
    title: "User Responsibilities",
    content:
      "Users are responsible for safeguarding their account credentials and ensuring appropriate usage of the platform. You agree to provide accurate information and avoid misuse of StorySparkAI services.",
  },
  {
    icon: Sparkles,
    title: "Intellectual Property",
    content:
      "StorySparkAI respects intellectual property rights and expects users to do the same. Content generated using AI tools is subject to the policies of the respective AI providers.",
  },
  {
    icon: Scale,
    title: "Limitation of Liability",
    content:
      'The platform is provided "as is" without warranties of any kind. StorySparkAI shall not be liable for indirect or consequential damages resulting from the use of the service.',
  },
  {
    icon: ShieldCheck,
    title: "Privacy Policy Reference",
    content:
      "Your use of StorySparkAI is also governed by our Privacy Policy, which explains how we collect, use, and protect user data.",
  },
  {
    icon: AlertTriangle,
    title: "Prohibited Activities",
    content:
      "Users may not generate or distribute hateful, explicit, illegal, or abusive content. Violations may result in account suspension or termination.",
  },
  {
    icon: FileText,
    title: "Changes to Terms",
    content:
      "We reserve the right to modify these Terms at any time. Continued use of the platform after updates constitutes acceptance of the revised Terms.",
  },
  {
    icon: Mail,
    title: "Contact Information",
    content:
      "If you have any questions regarding these Terms, please contact us through our Contact page or at support@storyspark.ai.",
  },
];

const Terms = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900 transition-colors duration-300 dark:bg-[#050816] dark:text-white">
      {/* FLOATING BLOBS */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute right-0 top-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 px-6 py-24 pt-28 sm:pt-32">
        <div className="max-w-6xl mx-auto">

          {/* HERO */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300 backdrop-blur-md mb-6">
              <FileText size={15} />
              Terms &amp; Conditions
            </div>
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-tight">
              Terms of{" "}
              <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                Service
              </span>
            </h1>
            <p className="mt-8 max-w-3xl mx-auto text-lg sm:text-xl leading-8 text-slate-600 dark:text-slate-300">
              Please read these terms carefully before using StorySparkAI. By
              using our platform, you agree to be bound by these terms.
            </p>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Last Updated: May 2026
            </p>
          </div>

          {/* SECTIONS */}
          <div className="space-y-8">
            {sections.map((section, index) => {
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
                  <p className="text-slate-600 dark:text-slate-300 leading-7">
                    {section.content}
                  </p>
                </div>
              );
            })}
          </div>

          {/* FOOTER NOTE */}
          <div className="mt-16 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              For questions, visit our{" "}
              <Link to="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">
                Contact page
              </Link>{" "}
              or email{" "}
              <a href="mailto:support@storyspark.ai" className="text-blue-600 dark:text-blue-400 hover:underline">
                support@storyspark.ai
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Terms;