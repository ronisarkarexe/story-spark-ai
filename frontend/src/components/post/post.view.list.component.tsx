import React from "react";
import { useNavigate } from "react-router-dom";
import { Post } from "../../models/post";

interface IExploreViewListComponentProps {
  posts: Post[];
  isLoading: boolean;
}

const ExploreViewListComponent: React.FC<IExploreViewListComponentProps> = ({
  posts,
  isLoading,
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-[#f8fafc]/90 border border-slate-200/60 shadow-lg rounded-[2.5rem] overflow-hidden flex flex-col h-[520px] dark:bg-slate-900/40 dark:border-white/5 dark:shadow-2xl"
          >
            {/* Image Placeholder */}
            <div className="relative aspect-video bg-slate-200/80 dark:bg-slate-800/50">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-100 to-transparent dark:from-[#03050C] opacity-60"></div>
              {/* Tag Badges Skeleton */}
              <div className="absolute top-6 left-6 h-7 w-20 bg-slate-300/50 rounded-full border border-slate-300/30 dark:bg-blue-500/10 dark:border-blue-500/10" />
            </div>

            {/* Body Content Placeholder */}
            <div className="p-6 flex-1 flex flex-col">
              {/* Title Line */}
              <div className="h-6 bg-slate-300/60 rounded-lg w-3/4 mb-4 dark:bg-slate-800/60" />

              {/* Excerpt Lines */}
              <div className="space-y-3 mb-8 flex-1">
                <div className="h-3.5 bg-slate-200/70 rounded-lg w-full dark:bg-slate-800/40" />
                <div className="h-3.5 bg-slate-200/70 rounded-lg w-full dark:bg-slate-800/40" />
                <div className="h-3.5 bg-slate-200/70 rounded-lg w-5/6 dark:bg-slate-800/40" />
              </div>

              {/* Footer Metadata */}
              <div className="border-t border-slate-200 dark:border-white/5 pt-6 mt-auto flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-300/50 dark:bg-slate-800/60" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 bg-slate-300/60 rounded-md w-1/3 dark:bg-slate-800/60" />
                  <div className="h-2 bg-slate-200/50 rounded-md w-1/4 dark:bg-slate-800/30" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {posts.length > 0 ? (
          posts.map((story) => (
            <div
              key={story._id}
              onClick={() => navigate(`/post/${story._id}`)}
              className="cursor-pointer bg-gray-50 text-slate-900 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col h-full dark:bg-slate-900/50 dark:text-white dark:border-none"
            >
              <div className="relative overflow-hidden">
                <img
                  src={story.imageURL}
                  alt={`Cover image for ${story.title}`}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-gray-100 to-transparent opacity-70 pointer-events-none dark:from-slate-900 dark:to-transparent dark:opacity-60"></div>

                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md border border-gray-200 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg dark:bg-slate-900/80 dark:border-slate-600 dark:text-blue-300">
                  {story.tag}
                </span>
                {/* Deep Gradient Wash */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#03050C] via-[#03050C]/20 to-transparent opacity-90" />
                
                {/* Floating Tags - Premium Styling */}
                <div className="absolute top-6 left-6 flex gap-2">
                  <span className="px-5 py-2 bg-blue-600/20 backdrop-blur-2xl border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-[0.25em] rounded-full shadow-2xl">
                    {story.tag}
                  </span>
                  <span className="px-5 py-2 bg-indigo-600/20 backdrop-blur-2xl border border-indigo-500/30 text-indigo-400 text-[10px] font-black uppercase tracking-[0.25em] rounded-full shadow-2xl">
                    🌐 {story.language || "English"}
                  </span>
                </div>

                {/* Subtle Resting Border Glow */}
                <div className="absolute inset-0 border border-white/5 rounded-[2.5rem] pointer-events-none" />
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-lg mb-2 text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 dark:text-white dark:group-hover:text-blue-400">
                  {story.title}
                </h3>

                <p className="text-sm text-slate-600 mb-6 line-clamp-2 flex-1 leading-relaxed dark:text-slate-400">
                  {story.content.slice(0, 100)}...
                </p>

                <div className="flex items-center justify-between text-sm text-slate-500 border-t border-gray-200 pt-4 mt-auto dark:border-slate-700/50 dark:text-slate-500">
                  <div className="flex items-center gap-4">
                    <span>Author</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No posts available</div>
        )}
      </div>
    </div>
  );
};

export default ExploreViewListComponent;
