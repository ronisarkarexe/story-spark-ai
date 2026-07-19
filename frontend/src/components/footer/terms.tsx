import logo from "../../assets/logoNew.png";
import { Link } from "react-router-dom";

const termsSections = [
  {
    title: "1. Acceptance of Terms",
    body: "By accessing or using StorySparkAI, you agree to these Terms & Conditions and any related policies referenced from the platform. If you do not agree, do not use the service.",
  },
  {
    title: "2. Acceptable Platform Usage",
    body: "Use StorySparkAI for lawful, respectful, and creative storytelling activities. Do not use the platform to create, upload, or distribute illegal, hateful, harassing, exploitative, infringing, deceptive, or harmful content.",
  },
  {
    title: "3. User Responsibilities",
    body: "You are responsible for your account activity, the prompts you submit, the stories you publish, and the information you choose to share. Keep credentials secure and provide accurate account information.",
  },
  {
    title: "4. Content Ownership and Copyright",
    body: "You retain responsibility for the original content you provide and the stories you choose to save or publish. You must have the rights needed for any submitted material and must respect copyrights, trademarks, and third-party intellectual property.",
  },
  {
    title: "5. AI-Generated Content",
    body: "AI-assisted outputs may require human review. You are responsible for checking generated stories for accuracy, originality, suitability, and compliance before publishing or sharing them outside the platform.",
  },
  {
    title: "6. Account and Community Guidelines",
    body: "Accounts may be limited, suspended, or removed when users abuse platform features, attempt unauthorized access, spam other users, violate community expectations, or repeatedly submit prohibited content.",
  },
  {
    title: "7. Privacy and Data Practices",
    body: "Use of StorySparkAI is also governed by the Privacy Policy, which explains how account data, authentication details, cookies, local storage, and user-generated content are handled.",
  },
  {
    title: "8. Limitations of Liability",
    body: "StorySparkAI is provided on an as-is and as-available basis. The platform team is not liable for indirect, incidental, special, consequential, or punitive damages resulting from use of the service.",
  },
  {
    title: "9. Changes to These Terms",
    body: "We may update these terms as the platform evolves. Continued use after updated terms are posted means you accept the revised terms.",
  },
];

const Terms = () => {
  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 py-24 pt-28 sm:pt-32 flex items-start">
      <div className="max-w-4xl mx-auto w-full text-center lg:text-left">
        <Link to="/" className="inline-block">
          <img
            src={logo}
            alt="StorySparkAI"
            className="h-16 sm:h-20 mx-auto mb-5 transition-transform duration-300 hover:scale-105"
          />
        </Link>

        <p className="text-blue-300 text-sm font-semibold uppercase tracking-[0.28em] mb-3">
          Legal Center
        </p>
        <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 tracking-tight">
          Terms & <span className="text-blue-500">Conditions</span>
        </h1>
        <p className="text-gray-300 text-base sm:text-lg leading-7 sm:leading-8 max-w-2xl mx-auto lg:mx-0 mb-3">
          These terms define acceptable use, content responsibilities, ownership expectations, and account rules for the StorySparkAI community.
        </p>
        <p className="text-sm text-gray-500 mb-8">Last Updated: July 2026</p>

        <div className="bg-zinc-900/80 border border-zinc-800 shadow-2xl rounded-3xl p-6 sm:p-8 sm:px-10 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/40 text-left">
          {termsSections.map((section) => (
            <section key={section.title} className="mb-8 last:mb-2">
              <h2 className="text-2xl font-semibold mb-3 text-blue-400">{section.title}</h2>
              <p className="text-gray-300 text-base leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-3 justify-center lg:justify-start">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
          >
            Back to Home
          </Link>
          <Link
            to="/privacy-policy"
            className="inline-flex items-center gap-2 px-6 py-3 border border-blue-500/60 text-blue-200 hover:bg-blue-500/10 font-semibold rounded-full transition-all duration-300"
          >
            View Privacy Policy
          </Link>
          <Link
            to="/contact-us"
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-gray-200 hover:bg-white/10 font-semibold rounded-full transition-all duration-300"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Terms;
