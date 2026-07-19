import React from "react";
import { Link } from "react-router-dom";

const privacySections = [
  {
    title: "1. Information We Collect",
    body: [
      "Account details such as name, email address, profile information, and authentication identifiers used to create and protect your StorySparkAI account.",
      "Story prompts, generated drafts, saved stories, comments, bookmarks, and other creative content you choose to submit or store on the platform.",
      "Technical data such as browser type, device information, IP-derived region, error logs, and usage events that help us keep the service reliable.",
    ],
  },
  {
    title: "2. Authentication and Account Privacy",
    body: [
      "We use authentication tokens, encrypted credentials, and session data to keep users signed in and to prevent unauthorized account access.",
      "You are responsible for keeping your login credentials private. If you believe your account was accessed without permission, contact support promptly.",
      "Role-based access controls may be used for writer, user, and admin areas so that account features are shown only to authorized users.",
    ],
  },
  {
    title: "3. Cookies and Local Storage",
    body: [
      "StorySparkAI may use cookies, local storage, and similar browser storage for sign-in sessions, cookie preferences, theme settings, saved drafts, and feature personalization.",
      "Some browser storage is necessary for core platform functionality. Optional analytics or personalization storage can be limited through browser settings where supported.",
    ],
  },
  {
    title: "4. How We Use Data",
    body: [
      "We use data to operate the platform, generate and save stories, personalize writing workflows, troubleshoot bugs, prevent abuse, and communicate important product or policy updates.",
      "We do not sell your personal information. Where third-party services are used, they are limited to functions such as hosting, authentication, analytics, email delivery, payments, or AI processing.",
    ],
  },
  {
    title: "5. User Content Handling",
    body: [
      "Your prompts, drafts, and stories remain associated with your account unless you delete them or publish them through platform features.",
      "Content may be processed by application services to provide story generation, editing, collaboration, export, moderation, and recovery features.",
      "Avoid adding private, sensitive, or confidential information to prompts or shared stories unless you are comfortable with that information being processed by the platform.",
    ],
  },
  {
    title: "6. Security and Retention",
    body: [
      "We apply reasonable safeguards to protect personal data, including access controls, secure transport, and abuse monitoring.",
      "We retain account and content data only as long as needed for platform operation, legal obligations, dispute resolution, or legitimate security purposes.",
    ],
  },
  {
    title: "7. Your Choices and Rights",
    body: [
      "You may request access, correction, export, or deletion of personal information associated with your account.",
      "You can manage cookies through your browser and update communication preferences from available account or email controls.",
    ],
  },
];

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-6 py-24 pt-28 sm:pt-32">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-blue-300 text-sm font-semibold uppercase tracking-[0.28em] mb-3">
            Legal Center
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-8">
            This policy explains how StorySparkAI collects, uses, stores, and protects information while users create, save, and share AI-assisted stories.
          </p>
          <p className="text-sm text-gray-500 mt-3">Last Updated: July 2026</p>
        </div>

        <div className="grid gap-6">
          {privacySections.map((section) => (
            <section key={section.title} className="bg-[#1e293b] rounded-2xl p-6 sm:p-8 shadow-lg border border-white/5">
              <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
              <ul className="list-disc pl-5 text-gray-300 space-y-3 leading-7">
                {section.body.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}

          <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 shadow-lg text-center">
            <h2 className="text-3xl font-bold mb-4">Contact and Support</h2>
            <p className="text-lg text-white/90 mb-5 leading-8">
              For privacy questions, account requests, or data concerns, contact the StorySparkAI team through the support page or email support@storyspark.ai.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/contact-us" className="rounded-full bg-white text-slate-900 px-5 py-2.5 font-semibold hover:bg-blue-50 transition-colors">
                Contact Support
              </Link>
              <Link to="/terms" className="rounded-full border border-white/50 px-5 py-2.5 font-semibold hover:bg-white/10 transition-colors">
                View Terms
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
