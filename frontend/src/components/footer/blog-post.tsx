import { Link, useParams } from "react-router-dom";

const BlogPost = () => {
  const { id } = useParams();

  let title = "Blog Post";
  let content = "This is a placeholder for the full blog post content. Coming soon!";

  if (id === "1") {
    title = "Introducing StorySparkAI v2.0";
    content = "Welcome to the new era of StorySparkAI! We've completely revamped our AI models, added real-time collaboration, and improved our UI. Stay tuned as we roll out these features to everyone over the next few weeks.";
  } else if (id === "2") {
    title = "How to Overcome Writer's Block with AI";
    content = "Writer's block is tough, but AI can help! By generating quick prompts and exploring alternative story branches, you can get past the blank page syndrome. In this post, we explore 5 strategies to co-write with our AI.";
  } else if (id === "3") {
    title = "Community Spotlight: Outstanding Stories";
    content = "Our community has been generating amazing stories! From high-fantasy epics to gritty sci-fi thrillers, we are showcasing the top 10 stories written this month by our users.";
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 px-6 py-12 transition-colors duration-300 dark:bg-slate-900 dark:text-white">
      <div className="max-w-3xl mx-auto">
        <Link to="/blog" className="text-blue-500 hover:underline mb-8 inline-block">
          &larr; Back to Blog
        </Link>
        <h1 className="text-4xl font-bold mb-6">{title}</h1>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 dark:bg-zinc-900 dark:border-zinc-800">
          <p className="text-lg leading-relaxed text-slate-700 dark:text-gray-300">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
