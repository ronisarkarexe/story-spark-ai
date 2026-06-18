import logo from "../../assets/logoNew.png";
import { Link } from "react-router-dom";

const AboutUs = () => {
  const stats = [
    { number: "200K+", label: "Creative Writers" },
    { number: "50K+", label: "Stories Generated" },
    { number: "24/7", label: "AI Assistance" },
    { number: "100%", label: "Open Source" },
  ];

  const features = [
    {
      icon: "✨",
      title: "AI Story Generation",
      desc: "Generate creative stories instantly from simple prompts.",
    },
    {
      icon: "📚",
      title: "Story Variations",
      desc: "Explore multiple story paths and creative outcomes.",
    },
    {
      icon: "🤖",
      title: "AI Writing Assistant",
      desc: "Get smart writing suggestions and inspiration.",
    },
    {
      icon: "💾",
      title: "Save & Explore",
      desc: "Store, revisit, and improve your favorite stories.",
    },
    {
      icon: "📖",
      title: "Writing Resources",
      desc: "Access helpful guides and storytelling techniques.",
    },
    {
      icon: "🎓",
      title: "Creative Learning",
      desc: "Learn storytelling while building amazing narratives.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#050816] text-gray-900 dark:text-white overflow-hidden transition-colors duration-300">

      {/* HERO SECTION */}
      <section className="relative px-6 py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/20 blur-3xl rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/20 blur-3xl rounded-full"></div>
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          {/* LOGO */}
          <img
            src={logo}
            alt="StorySparkAI"
            className="h-20 mx-auto mb-6 transition-transform duration-300 hover:scale-105"
          />

          {/* HEADING */}
          <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight mb-6">
            About{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              StorySparkAI
            </span>
          </h1>

          {/* SUBTITLE */}
          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-8">
            StorySparkAI is an open-source AI storytelling platform designed to
            help creators transform imagination into engaging stories through
            intelligent writing assistance and collaborative creativity.
          </p>

          {/* BUTTONS */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              to="/"
              className="px-7 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-semibold shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
            >
              🚀 Start Creating
            </Link>

            <Link
              to="/stories"
              className="px-7 py-3 border border-gray-300 dark:border-gray-700 rounded-full font-semibold hover:bg-gray-100 dark:hover:bg-zinc-900 transition-all duration-300"
            >
              📚 Explore Stories
            </Link>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="px-6 pb-10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 text-center shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300"
            >
              <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {stat.number}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* OUR STORY SECTION */}
      <section className="px-6 py-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">

          {/* LEFT CONTENT */}
          <div className="bg-gray-50 dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl backdrop-blur-sm hover:border-blue-500/40 transition-all duration-300">
            <h2 className="text-3xl font-bold mb-5 text-blue-600 dark:text-blue-400">
              Our Mission & Vision
            </h2>

            <p className="text-gray-700 dark:text-gray-300 text-lg leading-8 mb-6">
              We believe storytelling is one of humanity’s most powerful forms
              of expression. Our mission is to empower writers of all levels
              with intelligent AI tools that spark creativity, overcome writer’s
              block, and transform ideas into meaningful stories.
            </p>

            <p className="text-gray-700 dark:text-gray-300 text-lg leading-8">
              StorySparkAI bridges imagination and execution by creating a space
              where creators can experiment, learn, collaborate, and build
              unforgettable narratives effortlessly.
            </p>
          </div>

          {/* RIGHT SIDE CARD */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-3xl opacity-20 rounded-3xl"></div>

            <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-10 text-white shadow-2xl">
              <h3 className="text-3xl font-bold mb-4">
                Why StorySparkAI?
              </h3>

              <p className="text-lg leading-8 text-blue-100">
                Writing should never feel like a lonely struggle. StorySparkAI
                helps creators generate ideas, expand imagination, and craft
                compelling stories using the power of AI-assisted creativity.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚡</span>
                  Fast AI-powered creativity
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌍</span>
                  Global storytelling community
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚀</span>
                  Open-source innovation
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Powerful Features
            </h2>

            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
              Everything you need to create, explore, and enhance stories with AI.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-lg hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="text-4xl mb-4">
                  {feature.icon}
                </div>

                <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-500 transition">
                  {feature.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 leading-7">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY SECTION */}
      <section className="px-6 py-10">
        <div className="max-w-5xl mx-auto bg-gray-50 dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-sm hover:border-blue-500/40 transition-all duration-300 text-center">
          <h2 className="text-3xl font-bold mb-5 text-blue-600 dark:text-blue-400">
            Community & Open Source
          </h2>

          <p className="text-gray-700 dark:text-gray-300 text-lg leading-8 max-w-3xl mx-auto">
            StorySparkAI thrives on collaboration. We welcome developers,
            writers, and storytellers from around the world to contribute,
            innovate, and help shape the future of AI-assisted creativity.
          </p>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 p-10 sm:p-14 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Create Your Story?
          </h2>

          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
            Start exploring AI-powered storytelling and bring your imagination
            to life with StorySparkAI.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            ✨ Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;