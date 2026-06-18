import logo from "../../assets/logoNew.png";
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

      <div className="absolute top-40 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 px-4 sm:px-6 py-24 pt-28 sm:pt-32">

        <div className="max-w-6xl mx-auto">

          {/* HERO SECTION */}
          <div className="text-center mb-16">

            <Link to="/" className="inline-block">
              <img
                src={logo}
                alt="StorySparkAI"
                className="h-20 sm:h-24 mx-auto mb-8 transition-transform duration-300 hover:scale-105"
              />
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300 backdrop-blur-md mb-6">
              <Sparkles size={15} />
              Legal & Policies
            </div>

            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-tight">
              Terms &{" "}
              <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                Conditions
              </span>
            </h1>

            <p className="mt-8 max-w-3xl mx-auto text-lg sm:text-xl leading-8 text-slate-600 dark:text-slate-300">
              Please read these terms carefully before using StorySparkAI to
              ensure a safe, creative, and collaborative experience for everyone.
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white px-4 sm:px-6 py-24 pt-28 sm:pt-32 flex items-start transition-colors duration-300">
      <div className="max-w-4xl mx-auto w-full text-center lg:text-left">

        {/* Logo */}
        <Link to="/" className="inline-block">
          <img
            src={logo}
            alt="StorySparkAI"
            className="h-16 sm:h-20 mx-auto mb-5 transition-transform duration-300 hover:scale-105"
          />
        </Link>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 tracking-tight">
          Terms & <span className="text-blue-600 dark:text-blue-500">Conditions</span>
        </h1>

        {/* Intro */}
        <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-7 sm:leading-8 max-w-2xl mx-auto mb-8">
          Please read these Terms carefully before using StorySparkAI. By accessing our platform,
          you agree to these Terms and Conditions.
        </p>

        {/* Content Box */}
        <div className="bg-gray-50 dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-800 shadow-2xl rounded-3xl p-6 sm:p-8 sm:px-10 text-left">

          {/* 1 */}
          <section className="mb-8 mt-2">
            <h2 className="text-2xl font-semibold mb-3 text-blue-600 dark:text-blue-400">
              1. Introduction
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              StorySparkAI provides AI-powered storytelling tools for creative, educational,
              and personal use. By using the platform, you agree to follow these Terms.
            </p>
          </section>

          {/* 2 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 text-blue-600 dark:text-blue-400">
              2. Acceptance of Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              By accessing or using StorySparkAI, you confirm that you have read,
              understood, and agree to these Terms. If you do not agree, you must not use the service.
            </p>
          </section>

          {/* 3 - ACCEPTABLE USE (FIXED) */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 text-blue-600 dark:text-blue-400">
              3. Acceptable Use
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              You may use StorySparkAI for lawful, personal, educational, and creative purposes.
              You agree not to misuse the platform or use it for any illegal, harmful, or abusive activities.
            </p>
          </section>

          {/* 4 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 text-blue-600 dark:text-blue-400">
              4. User Responsibilities
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account,
              ensuring the accuracy of your information, and all activities conducted under your account.
            </p>
          </section>

          {/* 5 - CONTENT OWNERSHIP FIXED */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 text-blue-600 dark:text-blue-400">
              5. Content Ownership & Rights
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              You retain ownership of content you create using StorySparkAI.
              By using the platform, you grant us a limited license to process, store,
              and display your content solely for providing and improving our services.
              The platform, including its code, design, and branding, remains the property of StorySparkAI.
            </p>
          </section>

          {/* 6 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 text-blue-600 dark:text-blue-400">
              6. Intellectual Property
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              All platform assets, including design, branding, and software, are protected by intellectual property laws.
              Users may not copy or redistribute platform elements without permission.
            </p>
          </section>

          {/* 7 - LIABILITY */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 text-blue-600 dark:text-blue-400">
              7. Limitation of Liability
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              StorySparkAI is provided "as is" without warranties. We are not responsible for
              any indirect, incidental, or consequential damages resulting from your use of the platform.
            </p>
          </section>

          {/* 8 - COMMUNITY RULES FIXED */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 text-blue-600 dark:text-blue-400">
              8. Account & Community Guidelines
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              You agree to use the platform respectfully. Harassment, abuse, spam, harmful content,
              or illegal activities are strictly prohibited. We reserve the right to suspend or
              terminate accounts that violate these rules.
            </p>
          </section>

          {/* 9 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 text-blue-600 dark:text-blue-400">
              9. Privacy Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Your use of StorySparkAI is also governed by our Privacy Policy,
              which explains how we collect and use your data.
            </p>
          </section>

          {/* 10 */}
          <section className="mb-2">
            <h2 className="text-2xl font-semibold mb-3 text-blue-600 dark:text-blue-400">
              10. Contact Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              If you have any questions about these Terms, contact us at:
              <br />
              <span className="font-semibold">support@storyspark.ai</span>
            </p>
          </div>

          {/* TERMS GRID */}
          <div className="grid gap-8 md:grid-cols-2">

            {sections.map(({ icon: Icon, title, content }, index) => (
              <div
                key={index}
                className="
                  group relative overflow-hidden
                  rounded-[2rem]
                  border border-white/20
                  bg-white/70 dark:bg-white/[0.05]
                  p-8
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
                <h2 className="relative z-10 text-2xl font-bold mb-4">
                  {index + 1}. {title}
                </h2>

                {/* CONTENT */}
                <p className="relative z-10 text-slate-600 dark:text-slate-300 leading-8 text-base">
                  {content}
                </p>
              </div>
            ))}
          </div>

          {/* BOTTOM CTA */}
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

              {/* INNER GLOW */}
              <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-sm"></div>

              <div className="relative z-10">

                <p className="text-sm uppercase tracking-[0.25em] text-blue-200 font-bold mb-4">
                  StorySparkAI Policies
                </p>

                <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
                  Transparency builds trust.
                </h2>

                <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-blue-100">
                  We are committed to maintaining a safe, creative, and open
                  environment for all creators and contributors.
                </p>

                <div className="mt-10 flex flex-wrap justify-center gap-4">

                  <Link
                    to="/"
                    className="
                      inline-flex items-center gap-2
                      rounded-2xl
                      bg-white
                      px-7 py-4
                      font-semibold
                      text-blue-700
                      shadow-lg
                      transition-all duration-300
                      hover:scale-105
                    "
                  >
                    ⬅ Back to Home
                  </Link>

                  <Link
                    to="/contact"
                    className="
                      inline-flex items-center gap-2
                      rounded-2xl
                      border border-white/20
                      bg-white/10
                      px-7 py-4
                      font-semibold
                      text-white
                      backdrop-blur-md
                      transition-all duration-300
                      hover:bg-white/20
                    "
                  >
                    Contact Support
                  </Link>

                </div>
              </div>
            </div>

          </div>

        {/* CTA */}
        <div className="mt-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
          >
            ⬅ Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Terms;
