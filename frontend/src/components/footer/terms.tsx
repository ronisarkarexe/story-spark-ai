import logo from "../../assets/logoNew.png";
import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 py-10 flex items-center">
      <div className="max-w-4xl mx-auto w-full text-center mt-10 lg:mt-0">
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
          Terms & <span className="text-blue-500">Conditions</span>
        </h1>

        {/* Description */}
        <p className="text-gray-300 text-base sm:text-lg leading-7 sm:leading-8 max-w-2xl mx-auto mb-8">
          Please read these terms carefully before using StorySparkAI to ensure a safe and inspiring community.
        </p>

        {/* Content Section */}
        <div className="bg-zinc-900/80 border border-zinc-800 shadow-2xl rounded-3xl p-6 sm:p-8 sm:px-10 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/40 text-left">
          
          <section className="mb-8 mt-2">
            <h2 className="text-2xl font-semibold mb-3 text-blue-400">1. Introduction</h2>
            <p className="text-gray-300 text-base leading-relaxed">
              Welcome to StorySparkAI. By accessing or using our platform, you agree to be bound by these Terms and Conditions. Our platform provides AI-assisted storytelling tools to help you create, edit, and explore engaging narratives.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 text-blue-400">2. Acceptance of Terms</h2>
            <p className="text-gray-300 text-base leading-relaxed">
              By registering an account, accessing, or otherwise utilizing StorySparkAI, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree, please do not use the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 text-blue-400">3. User Responsibilities</h2>
            <p className="text-gray-300 text-base leading-relaxed">
              As a user, you agree not to misuse our services. You are responsible for safeguarding your account information and for any activities or actions under your account. You agree to provide accurate information when registering.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 text-blue-400">4. Intellectual Property</h2>
            <p className="text-gray-300 text-base leading-relaxed">
              StorySparkAI respects intellectual property rights and expects users to do the same. Any content generated using our AI tools is subject to the licensing and usage policies defined by the respective underlying AI models. The platform itself, including its original code, design, and branding, is owned by StorySparkAI.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 text-blue-400">5. Limitation of Liability</h2>
            <p className="text-gray-300 text-base leading-relaxed">
              StorySparkAI and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform. The service is provided "as is" without representations or warranties of any kind.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 text-blue-400">6. Privacy Policy Reference</h2>
            <p className="text-gray-300 text-base leading-relaxed">
              Your usage of the platform is also governed by our Privacy Policy, which outlines how we collect, use, and protect your personal information. Please review it carefully to understand our data practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 text-blue-400">7. Prohibited Activities</h2>
            <p className="text-gray-300 text-base leading-relaxed">
              You agree not to use the platform to generate or distribute hateful, explicit, illegal, or abusive content. We reserve the right to suspend or terminate accounts that violate these guidelines without prior notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 text-blue-400">8. Changes to Terms</h2>
            <p className="text-gray-300 text-base leading-relaxed">
              We reserve the right to modify these Terms & Conditions at any time. We will notify users of any significant changes by posting the updated terms on this page. Your continued use of the platform after changes have been made constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-2">
            <h2 className="text-2xl font-semibold mb-3 text-blue-400">9. Contact Information</h2>
            <p className="text-gray-300 text-base leading-relaxed">
              If you have any questions or concerns regarding these Terms, please contact us through our dedicated Contact page or at support@storyspark.ai.
            </p>
          </section>

        </div>

        {/* CTA */}
        <div className="mt-12">
          <Link
            to="/"
            className="
                inline-flex items-center gap-2
                px-6 py-3
                bg-blue-500 hover:bg-blue-600
                text-white font-semibold
                rounded-full
                shadow-lg hover:shadow-blue-500/30
                transition-all duration-300
                hover:scale-105
            "
          >
            ⬅ Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Terms;
