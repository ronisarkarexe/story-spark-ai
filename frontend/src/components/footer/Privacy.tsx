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

      {/* MAIN CONTENT */}
      <div className="relative z-10 px-6 py-24 pt-28 sm:pt-32">

        <div className="max-w-6xl mx-auto">

          {/* HERO SECTION */}
          <div className="text-center mb-20">

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300 backdrop-blur-md mb-6">
              <ShieldCheck size={15} />
              Privacy & Data Protection
    <div className="min-h-screen bg-[#0f172a] text-white px-6 py-24 pt-28 sm:pt-32">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-lg">
            Your privacy matters to us at StorySpark AI.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last Updated: May 2026
          </p>
        </div>

        <div className="space-y-10">

          {/* 1 */}
          <section className="bg-[#1e293b] rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-gray-300 leading-7">
              StorySpark AI is committed to protecting your privacy. This policy explains
              how we collect, use, and safeguard your information when you use our platform.
            </p>
          </section>

          {/* 2 */}
          <section className="bg-[#1e293b] rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 leading-7">
              <li>Name and email address during signup</li>
              <li>Authentication details (securely hashed passwords or OAuth login data)</li>
              <li>Story prompts, generated content, and uploaded media</li>
              <li>Usage data, analytics, and interaction behavior</li>
              <li>Device, browser, and IP-related information</li>
              <li>Cookies and local/session storage data</li>
            </ul>
          </section>

          {/* 3 */}
          <section className="bg-[#1e293b] rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">3. Authentication & Security</h2>
            <p className="text-gray-300 leading-7">
              We use secure authentication systems including email/password and may support
              third-party login providers. Passwords are never stored in plain text and are
              securely hashed. Session tokens are used to maintain login security and prevent
              unauthorized access.
            </p>
          </section>

          {/* 4 */}
          <section className="bg-[#1e293b] rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">4. How We Use Your Data</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-[#334155] p-5 rounded-xl">
                <h3 className="font-semibold mb-2">Platform Improvement</h3>
                <p className="text-gray-300">
                  Enhancing AI performance and user experience.
                </p>
              </div>

              <div className="bg-[#334155] p-5 rounded-xl">
                <h3 className="font-semibold mb-2">Personalization</h3>
                <p className="text-gray-300">
                  Delivering relevant and customized story outputs.
                </p>
              </div>

              <div className="bg-[#334155] p-5 rounded-xl">
                <h3 className="font-semibold mb-2">Security</h3>
                <p className="text-gray-300">
                  Preventing fraud, abuse, and unauthorized access.
                </p>
              </div>

              <div className="bg-[#334155] p-5 rounded-xl">
                <h3 className="font-semibold mb-2">Communication</h3>
                <p className="text-gray-300">
                  Sending updates and important service notifications.
                </p>
              </div>
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
          {/* 5 */}
          <section className="bg-[#1e293b] rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">5. Cookies & Local Storage</h2>
            <p className="text-gray-300 leading-7">
              We use cookies and local storage to maintain sessions, remember preferences,
              and improve performance. You may disable cookies or clear stored data through
              your browser settings at any time.
            </p>

            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Last Updated: May 2026
          {/* 6 */}
          <section className="bg-[#1e293b] rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
            <p className="text-gray-300 leading-7">
              We retain personal data only as long as necessary to provide services and meet
              legal obligations. Users may request deletion of their account and associated
              data at any time.
            </p>
          </div>

          {/* PRIVACY CARDS */}
          <div className="grid gap-8">

            {privacySections.map(({ icon: Icon, title, content, list, cards }, index) => (
              <div
                key={index}
                className="
                  group relative overflow-hidden
                  rounded-[2rem]
                  border border-white/20
                  bg-white/70 dark:bg-white/[0.05]
                  p-8 sm:p-10
                  shadow-2xl
                  backdrop-blur-xl
                  transition-all duration-500
                  hover:-translate-y-2
                  hover:border-blue-500/30
                  hover:shadow-blue-500/10
                "
              >

                {/* CARD GLOW */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5"></div>

                {/* ICON */}
                <div className="
                  relative z-10
                  mb-6
                  inline-flex
                  rounded-2xl
                  bg-blue-500/10
                  p-4
                  text-blue-600 dark:text-blue-300
                  transition-all duration-300
                  group-hover:scale-110
                  group-hover:bg-blue-600
                  group-hover:text-white
                ">
                  <Icon size={28} />
                </div>

                {/* TITLE */}
                <h2 className="relative z-10 text-3xl font-bold mb-6">
                  {index + 1}. {title}
                </h2>

                {/* CONTENT */}
                {content && (
                  <p className="relative z-10 text-slate-600 dark:text-slate-300 leading-8 text-lg">
                    {content}
                  </p>
                )}

                {/* LIST */}
                {list && (
                  <ul className="relative z-10 mt-4 space-y-4">
                    {list.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-slate-600 dark:text-slate-300 leading-7"
                      >
                        <span className="mt-2 h-2 w-2 rounded-full bg-blue-500"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {/* INNER CARDS */}
                {cards && (
                  <div className="relative z-10 mt-8 grid gap-5 md:grid-cols-2">
                    {cards.map((card, idx) => (
                      <div
                        key={idx}
                        className="
                          rounded-2xl
                          border border-white/10
                          bg-white/40 dark:bg-white/[0.04]
                          p-6
                          backdrop-blur-md
                          transition-all duration-300
                          hover:border-blue-500/30
                          hover:-translate-y-1
                        "
                      >
                        <h3 className="text-xl font-semibold mb-3">
                          {card.title}
                        </h3>

                        <p className="text-slate-600 dark:text-slate-300 leading-7">
                          {card.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            ))}
          </div>

          {/* CONTACT CTA */}
          <div className="mt-20">

            <div className="
              relative overflow-hidden
              rounded-[2.5rem]
              bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900
              p-10 sm:p-14
              text-center
              text-white
              shadow-2xl
            ">

              {/* INNER OVERLAY */}
              <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-sm"></div>

              <div className="relative z-10">

                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
                  <Mail size={34} />
                </div>

                <p className="text-sm uppercase tracking-[0.25em] text-blue-200 font-bold mb-4">
                  Need Assistance?
                </p>

                <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
                  We care about your privacy.
                </h2>

                <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-blue-100">
                  If you have any questions regarding this Privacy Policy or
                  your personal data, feel free to contact our support team.
                </p>

                <div className="mt-10 inline-flex items-center gap-3 rounded-2xl bg-white px-7 py-4 font-semibold text-blue-700 shadow-lg">
                  <Mail size={20} />
                  support@storysparkai.com
                </div>

              </div>
            </div>

          </div>
          {/* 7 */}
          <section className="bg-[#1e293b] rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">7. Data Sharing</h2>
            <p className="text-gray-300 leading-7">
              We do not sell, rent, or trade your personal data. Limited data may be shared
              with trusted third-party service providers (such as hosting or analytics tools)
              strictly to operate the platform.
            </p>
          </section>

          {/* 8 */}
          <section className="bg-[#1e293b] rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">8. Your Rights</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 leading-7">
              <li>Access your personal data</li>
              <li>Request correction or deletion</li>
              <li>Withdraw consent anytime</li>
              <li>Request full account deletion</li>
            </ul>
          </section>

          {/* 9 */}
          <section className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 shadow-lg text-center">
            <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
            <p className="text-white/90 mb-3">
              If you have any questions about this Privacy Policy:
            </p>
            <p className="font-semibold">support@storysparkai.com</p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
