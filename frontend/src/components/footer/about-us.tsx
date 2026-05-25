import logo from "../../assets/logoNew.png";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 px-4 sm:px-6 py-10 flex items-center transition-colors duration-300 dark:bg-[#0b1329] dark:text-white">
      <div className="max-w-4xl mx-auto w-full text-center">
        <img
          src={logo}
          alt="StorySparkAI"
          className="h-16 sm:h-20 mx-auto mb-5 transition-transform duration-300 hover:scale-105"
        />

        <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 tracking-tight">
          About <span className="text-blue-500">StorySparkAI</span>
        </h1>

        <p className="text-slate-600 text-base sm:text-lg leading-7 sm:leading-8 max-w-2xl mx-auto dark:text-gray-300">
          StorySparkAI is an open-source platform that helps users generate,
          explore, and enhance AI-powered stories from a single creative prompt.
        </p>

        <div className="mt-8 bg-zinc-900/80 border border-zinc-800 shadow-2xl rounded-3xl p-6 sm:p-8 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/40 text-left dark:bg-zinc-900/80">
          <h2 className="text-2xl font-semibold mb-3 text-blue-400">
            Our Mission & Vision
          </h2>
          <p className="text-gray-300 text-base leading-relaxed mb-6">
            We believe that storytelling is a fundamental part of the human experience. Our mission is to empower writers of all levels by providing intuitive, AI-driven tools that spark creativity and help bring unique narratives to life.
          </p>

          <h2 className="text-2xl font-semibold mb-3 text-blue-400">
            Why StorySparkAI?
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            StorySparkAI bridges the gap between imagination and execution. We offer an environment where both beginners and seasoned writers can experiment, learn, and craft compelling stories effortlessly.
          </p>
        </div>

        <div className="mt-8 bg-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-6 sm:p-8 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/40 dark:bg-zinc-900/80 dark:border-zinc-800 dark:hover:border-blue-500/40">
          <h2 className="text-2xl font-semibold mb-5 text-blue-600 dark:text-blue-400">
            Features
          </h2>

          <ul className="grid grid-cols-1 justify-items-start sm:grid-cols-2 gap-4 text-slate-600 text-left max-w-xl mx-auto dark:text-gray-300">
            <li className="flex items-center gap-3">
              <span className="text-blue-400 text-xl">✨</span>
              AI Story Generation
            </li>

            <li className="flex items-center gap-3">
              <span className="text-blue-400 text-xl">📚</span>
              Multiple Story Variations
            </li>

            <li className="flex items-center gap-3">
              <span className="text-blue-400 text-xl">✍️</span>
              Story Editing & Publishing
            </li>

            <li className="flex items-center gap-3">
              <span className="text-blue-400 text-xl">🤖</span>
              AI Writing Assistance
            </li>

            <li className="flex items-center gap-3">
              <span className="text-blue-400 text-xl">💾</span>
              Save & Explore Stories
            </li>

            <li className="flex items-center gap-3">
              <span className="text-blue-400 text-xl">🎓</span>
              Creative Learning Support
            </li>
          </ul>
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

export default AboutUs;
