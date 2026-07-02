import { Link } from "react-router-dom";

const Blog = () => {
  const blogPosts = [
    {
      title: "AI-Powered Storytelling",
      description: "Learn how AI can help generate engaging stories.",
      link: "https://openai.com",
    },
    {
      title: "Creative Writing Tips",
      description: "Improve your storytelling with practical techniques.",
      link: "https://blog.reedsy.com",
    },
    {
      title: "Open Source Updates",
      description: "Latest improvements and community contributions.",
      link: "https://github.blog",
    },
  ];

  return (
    <div className="relative min-h-screen bg-white text-slate-900 px-6 py-16 transition-colors duration-300 dark:bg-[#0b1329] dark:text-white overflow-hidden">
      <div className="absolute top-10 left-16 w-3 h-3 rounded-full bg-yellow-400 opacity-70" />
      <div className="absolute top-24 right-24 w-2 h-2 rounded-full bg-pink-400 opacity-60" />
      <div className="absolute bottom-32 right-16 w-3 h-3 rounded-full bg-purple-400 opacity-60" />

      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">
          Explore{" "}
          <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
            Creative Insights
          </span>
        </h1>

        <p className="text-lg text-slate-600 leading-8 dark:text-gray-300">
          Explore articles, updates, and creative insights from the StorySparkAI community.
        </p>

        <div className="mt-10 bg-gray-50 p-6 rounded-2xl border border-gray-200 dark:bg-zinc-900 dark:border-zinc-800">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
            Latest Topics
          </h2>
          <ul className="space-y-2 text-slate-600 dark:text-gray-300">
            <li>📖 AI-powered storytelling</li>
            <li>✍️ Creative writing tips</li>
            <li>🚀 Open-source updates</li>
          </ul>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {blogPosts.map((post, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl shadow-lg hover:scale-105 transition-transform duration-200 text-white ${
                index === 0
                  ? "bg-gradient-to-br from-blue-600 to-indigo-700"
                  : index === 1
                  ? "bg-gradient-to-br from-violet-600 to-purple-700"
                  : "bg-gradient-to-br from-pink-500 to-rose-600"
              }`}
            >
              <h3 className="text-xl font-semibold mb-2 text-white">{post.title}</h3>
              <p className="text-white/80">{post.description}</p>
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition"
              >
                Read More
              </a>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            to="/"
            className="px-6 py-3 bg-blue-500 text-white font-semibold text-lg rounded-full shadow-md hover:bg-blue-600 active:scale-95 transition-all duration-150"
          >
            ⬅ Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Blog;