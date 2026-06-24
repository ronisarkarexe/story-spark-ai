import { Link, useParams } from "react-router-dom";

const BlogPost = () => {
  const { id } = useParams();

  let title = "Blog Post";
  let content =
    "This is a placeholder for the full blog post content. Coming soon!";

  if (id === "1") {
    title = "Introducing StorySparkAI v2.0";
    content =
      "Welcome to the new era of StorySparkAI! We've completely revamped our AI models, added real-time collaboration, and improved our UI. Stay tuned as we roll out these features to everyone over the next few weeks.";
  } else if (id === "2") {
    title = "How to Overcome Writer's Block with AI";
    content =
      "Writer's block is tough, but AI can help! By generating quick prompts and exploring alternative story branches, you can get past the blank page syndrome. In this post, we explore 5 strategies to co-write with our AI.";
  } else if (id === "3") {
    title = "Community Spotlight: Outstanding Stories";
    content =
      "Our community has been generating amazing stories! From high-fantasy epics to gritty sci-fi thrillers, we are showcasing the top 10 stories written this month by our users.";
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-white px-6 py-12">
      <div className="max-w-2xl mx-auto">

        {/* BACK LINK */}
        <Link
          to="/blog"
          className="text-blue-500 hover:underline mb-8 inline-block"
        >
          ← Back to Blog
        </Link>

        {/* TITLE */}
        <h1 className="text-4xl font-bold mb-4 leading-tight">
          {title}
        </h1>

        {/* META */}
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          5 min read • StorySpark AI Editorial Team
        </div>

        {/* CONTENT CARD */}
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-md border border-gray-200 dark:border-zinc-800">
          <p className="text-lg leading-relaxed text-slate-700 dark:text-gray-300 whitespace-pre-line">
            {content}
          </p>
        </div>

        {/* SHARE SECTION */}
        <div className="mt-8 flex gap-3 text-sm">
          <button className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition">
            Share
          </button>
          <button className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-zinc-800 transition">
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;