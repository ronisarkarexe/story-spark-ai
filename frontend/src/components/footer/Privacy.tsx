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
          </section>

          {/* 5 */}
          <section className="bg-[#1e293b] rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">5. Cookies & Local Storage</h2>
            <p className="text-gray-300 leading-7">
              We use cookies and local storage to maintain sessions, remember preferences,
              and improve performance. You may disable cookies or clear stored data through
              your browser settings at any time.
            </p>
          </section>

          {/* 6 */}
          <section className="bg-[#1e293b] rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
            <p className="text-gray-300 leading-7">
              We retain personal data only as long as necessary to provide services and meet
              legal obligations. Users may request deletion of their account and associated
              data at any time.
            </p>
          </section>

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
