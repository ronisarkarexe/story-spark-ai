import logo from "../../assets/logoNew.png";
import { Link } from "react-router-dom";

const Terms = () => {
  return (
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
          </section>

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
