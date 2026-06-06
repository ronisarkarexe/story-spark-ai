import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
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

          <section className="bg-[#1e293b] rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-300 leading-7">
              Welcome to StorySpark AI. We value your privacy and are committed
              to protecting your personal information. This Privacy Policy
              explains how we collect, use, and safeguard your data while you
              use our platform and services.
            </p>
          </section>

          <section className="bg-[#1e293b] rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">
              2. Information We Collect
            </h2>

            <ul className="list-disc list-inside text-gray-300 space-y-3 leading-7">
              <li>Name and email address during account creation</li>
              <li>Story prompts, generated content, and uploaded media</li>
              <li>Usage analytics and interaction data</li>
              <li>Device and browser information</li>
              <li>Cookies and session tracking information</li>
            </ul>
          </section>

          <section className="bg-[#1e293b] rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">
              3. How We Use Your Information
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-[#334155] p-5 rounded-xl">
                <h3 className="font-semibold mb-2 text-lg">
                  Platform Improvement
                </h3>
                <p className="text-gray-300">
                  We use data to improve AI story generation, user experience,
                  and overall platform performance.
                </p>
              </div>

              <div className="bg-[#334155] p-5 rounded-xl">
                <h3 className="font-semibold mb-2 text-lg">
                  Personalization
                </h3>
                <p className="text-gray-300">
                  Your preferences help us generate better and more relevant
                  stories and recommendations.
                </p>
              </div>

              <div className="bg-[#334155] p-5 rounded-xl">
                <h3 className="font-semibold mb-2 text-lg">
                  Security
                </h3>
                <p className="text-gray-300">
                  We monitor suspicious activity and protect accounts from
                  unauthorized access.
                </p>
              </div>

              <div className="bg-[#334155] p-5 rounded-xl">
                <h3 className="font-semibold mb-2 text-lg">
                  Communication
                </h3>
                <p className="text-gray-300">
                  We may send important updates, policy changes, and service
                  announcements.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-[#1e293b] rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">
              4. Cookies & Tracking Technologies
            </h2>

            <p className="text-gray-300 leading-7">
              StorySpark AI uses cookies and similar technologies to improve
              functionality, analyze traffic, and enhance user experience. You
              can disable cookies through your browser settings if preferred.
            </p>
          </section>

          <section className="bg-[#1e293b] rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">
              5. Data Protection
            </h2>

            <p className="text-gray-300 leading-7">
              We implement industry-standard security measures to protect your
              personal information from unauthorized access, misuse, or
              disclosure.
            </p>
          </section>

          <section className="bg-[#1e293b] rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">
              6. Third-Party Services
            </h2>

            <p className="text-gray-300 leading-7">
              We may use trusted third-party tools and analytics services to
              improve our platform. These services may collect limited technical
              information in accordance with their own privacy policies.
            </p>
          </section>

          <section className="bg-[#1e293b] rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">
              7. Your Rights
            </h2>

            <ul className="list-disc list-inside text-gray-300 space-y-3 leading-7">
              <li>Request access to your personal data</li>
              <li>Request correction or deletion of your data</li>
              <li>Withdraw consent at any time</li>
              <li>Request account deletion</li>
            </ul>
          </section>

          <section className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 shadow-lg text-center">
            <h2 className="text-3xl font-bold mb-4">
              Contact Us
            </h2>

            <p className="text-lg text-white/90 mb-3">
              If you have any questions regarding this Privacy Policy,
              feel free to contact us.
            </p>

            <p className="font-semibold">
              support@storysparkai.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;