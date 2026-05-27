import logo from "../../assets/logoNew.png";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 py-10 flex items-center">
      <div className="max-w-4xl mx-auto w-full text-center">
        {/* Logo */}
        <img
          src={logo}
          alt="StorySparkAI"
          className="h-16 sm:h-20 mx-auto mb-5 transition-transform duration-300 hover:scale-105"
        />

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 tracking-tight">
          About <span className="text-blue-500">StorySparkAI</span>
        </h1>

        {/* Description */}
        <p className="text-gray-300 text-base sm:text-lg leading-7 sm:leading-8 max-w-2xl mx-auto">
          StorySparkAI is an open-source platform that helps users generate,
          explore, and enhance AI-powered stories from a single creative prompt.
        </p>

        {/* Mission & Vision Card */}
        <div className="mt-8 bg-zinc-900/80 border border-zinc-800 shadow-2xl rounded-3xl p-6 sm:p-8 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/40 text-left">
          <h2 className="text-2xl font-semibold mb-3 text-blue-400">
            Our Mission & Vision
          </h2>
          <p className="text-gray-300 text-base leading-relaxed mb-6">
            We believe that storytelling is a fundamental part of the human experience. Our mission is to empower writers of all levels by providing intuitive, AI-driven tools that spark creativity, overcome writer's block, and help bring unique narratives to life.
          </p>

          <h2 className="text-2xl font-semibold mb-3 text-blue-400">
            Why StorySparkAI?
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Writing shouldn't be a solitary struggle. StorySparkAI bridges the gap between imagination and execution. We offer an environment where both beginners and seasoned writers can experiment, learn, and craft compelling stories effortlessly.
          </p>
        </div>

        {/* Features Card */}
        <div className="mt-8 bg-zinc-900/80 border border-zinc-800 shadow-2xl rounded-3xl p-6 sm:p-8 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/40">
          <h2 className="text-2xl font-semibold mb-5 text-blue-400">
            Features
          </h2>

          <ul className="grid grid-cols-1 justify-items-start sm:grid-cols-2 gap-4 text-gray-300 text-left max-w-xl mx-auto">
            <li className="flex items-center gap-3">
              <span className="text-blue-400 text-xl">✨</span>
              AI Story Generation
            </li>
            <li className="flex items-center gap-3">
              <span className="text-blue-400 text-xl">📚</span>
              Multiple Story Variations
            </li>
            <li className="flex items-center gap-3">
              <span className="text-blue-400 text-xl">📖</span>
              Writing Resources
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

        {/* Community & Open Source Card */}
        <div className="mt-8 bg-zinc-900/80 border border-zinc-800 shadow-2xl rounded-3xl p-6 sm:p-8 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/40 text-left">
          <h2 className="text-2xl font-semibold mb-3 text-blue-400">
            Community & Open Source
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            StorySparkAI thrives on collaboration. As an open-source platform, we invite developers, writers, and enthusiasts to contribute, share ideas, and help build a stronger community. Together, we can shape the future of AI-assisted creativity.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-8">
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

export default AboutUs;
