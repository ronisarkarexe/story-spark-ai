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
      title: "AI-Powered Story Generation",
      desc: "Create unique stories instantly using advanced AI models.",
    },
    {
      icon: "💡",
      title: "Prompt-Based Storytelling",
      desc: "Simply provide a prompt or idea and watch it come to life.",
    },
    {
      icon: "💾",
      title: "Story Bookmarks/History",
      desc: "Save your favorite generated stories and revisit your past creations.",
    },
    {
      icon: "📊",
      title: "AI Analysis Capabilities",
      desc: "Get AI insights, summaries, and critiques of your stories.",
    },
    {
      icon: "🤖",
      title: "Creative Writing Assistance",
      desc: "Overcome writer's block with intelligent suggestions and variations.",
    },
    {
      icon: "📱",
      title: "Responsive User Experience",
      desc: "Enjoy a seamless and beautiful interface across all devices.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#050816] text-gray-900 dark:text-white overflow-hidden transition-colors duration-300">
      
      <section className="relative px-6 py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/20 blur-3xl rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/20 blur-3xl rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <img
            src={logo}
            alt="StorySparkAI"
            className="h-20 mx-auto mb-6 transition-transform duration-500 hover:scale-110 hover:rotate-2"
          />
          <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight mb-6 transition-all duration-500">
            About{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              StorySparkAI
            </span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-8">
            An open-source platform designed for creative minds to generate and share multiple story variations from a single prompt.
          </p>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 text-center shadow-lg hover:shadow-blue-500/20 hover:-translate-y-2 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-500"></div>
              <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 bg-gray-50/50 dark:bg-zinc-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              The Story Behind the Spark
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Every great narrative has an origin. Here is ours.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-stretch">
            <div className="group relative bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full group-hover:bg-blue-500/20 transition-all duration-500"></div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">✨</span>
                What It Does
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg z-10 relative">
                StorySparkAi is designed to empower creative minds by generating and showcasing AI-crafted stories from user prompts in a simple, engaging way. Users can input an idea, explore multiple story variations, save their favorites, and leverage AI analysis to enhance their creative writing journey.
              </p>
            </div>

            <div className="group relative bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full group-hover:bg-purple-500/20 transition-all duration-500"></div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">🚀</span>
                Why We Built It
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg z-10 relative">
                Perfect for writers, creators, and enthusiasts exploring AI-powered storytelling, we built this platform to overcome writer's block with intelligent suggestions. StorySparkAi makes experimentation fast and fearless, acting as a collaborative partner rather than a replacement for human creativity.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
              Everything you need to create, explore, and enhance stories with AI.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-lg hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none"></div>
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300 origin-left">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-500 transition-colors duration-300">
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

      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-3xl"></div>
          <div className="relative bg-white dark:bg-zinc-900/90 border border-gray-200 dark:border-zinc-800 rounded-3xl p-10 sm:p-14 shadow-2xl backdrop-blur-sm text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              🌍 Driven by Community
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-8 max-w-3xl mx-auto">
              StorySparkAI is proudly <strong>100% open-source</strong>. We are constantly evolving thanks to a global community of developers, writers, and open-source programs like GSSoC. Every feature, bug fix, and UI enhancement is a testament to creative minds coming together to build something beautiful. 
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 p-10 sm:p-14 text-center text-white shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Create Your Story?
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
            Start exploring AI-powered storytelling and bring your imagination
            to life with StorySparkAI.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-full hover:bg-gray-50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            ✨ Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;