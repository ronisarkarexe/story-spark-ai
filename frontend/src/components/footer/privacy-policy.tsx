import { Link } from "react-router-dom";

const PrivacyPolicyComponent = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#090F24] via-[#080E22] to-[#060A18] text-white px-4 sm:px-6 py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{
          height: "380px",
          background: `
            radial-gradient(ellipse 75% 60% at 50% 0%,
              rgba(56, 108, 220, 0.22) 0%,
              rgba(79, 70, 229, 0.10) 45%,
              transparent 80%
            )
          `,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[10%] top-[12%] w-[320px] h-[320px]"
        style={{
          background: `
            radial-gradient(circle,
              rgba(56, 108, 220, 0.08) 0%,
              rgba(79, 70, 229, 0.03) 50%,
              transparent 75%
            )
          `,
          filter: "blur(40px)",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto w-full">
        <div className="flex flex-col gap-3">
          <p className="text-xs tracking-[0.22em] uppercase text-white/60">
            Legal
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Privacy <span className="text-blue-500">Policy</span>
          </h1>
          <p className="text-gray-300 text-sm sm:text-base leading-7 sm:leading-8">
            This Privacy Policy explains what information we collect, how we use
            it, and the choices you have when you use StorySparkAI.
          </p>
          <div className="mt-2 inline-flex w-fit items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12px] text-white/70">
            Last updated: May 24, 2026
          </div>
        </div>

        <div className="mt-8 bg-[#0D1630]/60 border border-white/[0.08] shadow-2xl rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
          <div className="space-y-8">
            <section aria-labelledby="info-we-collect">
              <h2
                id="info-we-collect"
                className="text-xl sm:text-2xl font-semibold text-blue-400"
              >
                Information We Collect
              </h2>
              <ul className="mt-3 space-y-3 text-gray-300 text-sm sm:text-base leading-7">
                <li>
                  <span className="font-semibold text-white">
                    Information you provide:
                  </span>{" "}
                  e.g., account details, profile information, messages, form
                  submissions, and any content you create or upload.
                </li>
                <li>
                  <span className="font-semibold text-white">
                    Usage information:
                  </span>{" "}
                  e.g., pages viewed, features used, clicks, and interaction
                  patterns.
                </li>
                <li>
                  <span className="font-semibold text-white">
                    Device and log data:
                  </span>{" "}
                  e.g., IP address, browser type, device identifiers, and
                  diagnostic logs.
                </li>
              </ul>
            </section>

            <section aria-labelledby="how-we-use-data">
              <h2
                id="how-we-use-data"
                className="text-xl sm:text-2xl font-semibold text-blue-400"
              >
                How We Use Your Data
              </h2>
              <ul className="mt-3 space-y-3 text-gray-300 text-sm sm:text-base leading-7">
                <li>Provide and maintain the platform and its features.</li>
                <li>Personalize content and improve user experience.</li>
                <li>Communicate with you about updates and support requests.</li>
                <li>Monitor for abuse, fraud, and security issues.</li>
                <li>Comply with legal obligations where applicable.</li>
              </ul>
            </section>

            <section aria-labelledby="cookies">
              <h2
                id="cookies"
                className="text-xl sm:text-2xl font-semibold text-blue-400"
              >
                Cookies & Tracking Technologies
              </h2>
              <p className="mt-3 text-gray-300 text-sm sm:text-base leading-7">
                We may use cookies or similar technologies to keep you signed
                in, remember preferences, understand site usage, and improve
                performance. You can control cookies through your browser
                settings, but some features may not function properly if
                disabled.
              </p>
            </section>

            <section aria-labelledby="third-parties">
              <h2
                id="third-parties"
                className="text-xl sm:text-2xl font-semibold text-blue-400"
              >
                Third-Party Services
              </h2>
              <p className="mt-3 text-gray-300 text-sm sm:text-base leading-7">
                We may rely on third-party services for hosting, analytics,
                email delivery, and payments. These providers may process
                information on our behalf in order to provide their services.
              </p>
            </section>

            <section aria-labelledby="security">
              <h2
                id="security"
                className="text-xl sm:text-2xl font-semibold text-blue-400"
              >
                Data Protection & Security
              </h2>
              <p className="mt-3 text-gray-300 text-sm sm:text-base leading-7">
                We take reasonable administrative, technical, and organizational
                measures to help protect your information. However, no method
                of transmission or storage is 100% secure, so we cannot
                guarantee absolute security.
              </p>
            </section>

            <section aria-labelledby="rights">
              <h2
                id="rights"
                className="text-xl sm:text-2xl font-semibold text-blue-400"
              >
                Your Rights & Choices
              </h2>
              <ul className="mt-3 space-y-3 text-gray-300 text-sm sm:text-base leading-7">
                <li>
                  Access, update, or correct your account information where
                  available.
                </li>
                <li>
                  Opt out of non-essential communications (e.g., marketing)
                  where provided.
                </li>
                <li>
                  Request deletion of your information, subject to legal and
                  operational requirements.
                </li>
              </ul>
            </section>

            <section aria-labelledby="contact">
              <h2
                id="contact"
                className="text-xl sm:text-2xl font-semibold text-blue-400"
              >
                Contact Us
              </h2>
              <p className="mt-3 text-gray-300 text-sm sm:text-base leading-7">
                For privacy-related questions or requests, contact us via{" "}
                <Link
                  to="/contact-us"
                  className="text-blue-300 hover:text-blue-200 underline underline-offset-4"
                >
                  Contact Us
                </Link>
                .
              </p>
            </section>
          </div>
        </div>

        <div className="mt-8">
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

export default PrivacyPolicyComponent;
