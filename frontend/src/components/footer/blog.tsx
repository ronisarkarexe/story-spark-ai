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
        <div className="min-h-screen bg-white text-slate-900 px-6 py-12 transition-colors duration-300 dark:bg-[#0b1329] dark:text-white"> <div className="max-w-4xl mx-auto text-center">

            <h1 className="text-4xl font-bold mb-6">
                Blog
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
                  className="p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition"
                >
                  <h3 className="text-xl font-semibold mb-2">
                     {post.title}
                  </h3>

                  <p className="text-slate-600">
                     {post.description}
                  </p>
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Read More
                  </a>
                </div>
            ))}
            </div>
            <div>
                <br></br>
                <Link
                    to="/"
                    className="px-6 py-3 bg-blue-500 text-white font-semibold text-lg rounded-full shadow-md hover:bg-blue-600 transition"
                >
                    ⬅ Back to Home
                </Link>
            </div>
        </div>
        </div>
    );
};

export default Blog;
