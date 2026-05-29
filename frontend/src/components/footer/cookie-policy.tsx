import React from "react";

const CookiePolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-6 py-24 pt-28 sm:pt-32">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-gray-400 text-lg">
            Learn how StorySpark AI uses cookies and related technologies to enhance your experience.
          </p>
          <p className="text-sm text-gray-500 mt-2">Last Updated: May 2026</p>
        </div>

        <div className="space-y-10">
          <section className="bg-[#1e293b] rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies?</h2>
            <p className="text-gray-300 leading-7">
              Cookies are small text files placed on your device by your browser when you visit a website.
              They help store information about your session, preferences, and interactions so we can provide a smoother experience.
            </p>
          </section>

          <section className="bg-[#1e293b] rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-3 leading-7">
              <li>Remember your login session so you can stay signed in securely.</li>
              <li>Keep track of your preferences and display settings.</li>
              <li>Personalize content and recommendations based on your activity.</li>
              <li>Measure and improve app performance, stability, and feature navigation.</li>
            </ul>
          </section>

          <section className="bg-[#1e293b] rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-[#334155] p-5 rounded-xl">
                <h3 className="font-semibold mb-2 text-lg">Essential Cookies</h3>
                <p className="text-gray-300 leading-7">
                  These cookies are necessary for basic platform functions, such as authentication and secure access.
                </p>
              </div>
              <div className="bg-[#334155] p-5 rounded-xl">
                <h3 className="font-semibold mb-2 text-lg">Performance Cookies</h3>
                <p className="text-gray-300 leading-7">
                  We use these cookies to collect anonymous usage data and monitor how the platform performs.
                </p>
              </div>
              <div className="bg-[#334155] p-5 rounded-xl">
                <h3 className="font-semibold mb-2 text-lg">Functional Cookies</h3>
                <p className="text-gray-300 leading-7">
                  These help remember your preferences, such as language and display settings, for a more tailored experience.
                </p>
              </div>
              <div className="bg-[#334155] p-5 rounded-xl">
                <h3 className="font-semibold mb-2 text-lg">Analytics Cookies</h3>
                <p className="text-gray-300 leading-7">
                  Analytics cookies help us understand usage trends so we can improve features and remove friction.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-[#1e293b] rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">4. How Cookies Improve Your Experience</h2>
            <p className="text-gray-300 leading-7">
              Cookies make StorySpark AI faster and more intuitive by remembering your session, customizing your content,
              and reducing repeated steps. They also help us fix issues quickly and provide the best storytelling tools.
            </p>
          </section>

          <section className="bg-[#1e293b] rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">5. Managing Cookies</h2>
            <p className="text-gray-300 leading-7">
              You can manage or disable cookies through your browser settings. Please note that disabling essential cookies may limit
              certain features and affect the overall performance of the platform.
            </p>
          </section>

          <section className="bg-[#1e293b] rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">6. Compliance & Your Rights</h2>
            <p className="text-gray-300 leading-7">
              StorySpark AI follows data protection and cookie compliance best practices. We only use cookies to support platform
              functionality, security, and analytics, and we do not sell your information to third parties.
            </p>
            <p className="text-gray-300 leading-7 mt-4">
              If you have questions about this Cookie Policy, please review our Privacy Policy or contact our support team.
            </p>
          </section>

          <section className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 shadow-lg text-center">
            <h2 className="text-3xl font-bold mb-4">Have Questions?</h2>
            <p className="text-lg text-white/90 mb-3">
              Reach out if you want more detail on how cookies are used on the platform.
            </p>
            <p className="font-semibold">support@storysparkai.com</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
