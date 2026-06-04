import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Post } from "../../models/post";
import BookmarkButton from "../BookmarkButton";
import SSProfile from "../ui-component/ss-profile/ss-profile";
import { formatReadingStats } from "../../utils/story-utils";

interface IExploreViewListComponentProps {
  posts: Post[];
  isLoading: boolean;
}

const ExploreViewListComponent: React.FC<IExploreViewListComponentProps> = ({
  posts,
  isLoading,
}) => {
  const navigate = useNavigate();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (storyId: string) => {
    setImageErrors((prev) => ({ ...prev, [storyId]: true }));
  };

  const formatDate = (value?: string) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-white/60 border border-slate-200/60 shadow-sm rounded-3xl overflow-hidden flex flex-col h-[460px] dark:bg-slate-900/35 dark:border-white/5"
          >
            <div className="relative h-44 bg-slate-200/80 dark:bg-slate-800/50">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-100 to-transparent dark:from-[#03050C] opacity-60"></div>
              <div className="absolute top-4 left-4 h-6 w-16 bg-slate-300/50 rounded-full border border-slate-300/30 dark:bg-slate-800/50 dark:border-white/10" />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="h-5 bg-slate-300/60 rounded-lg w-3/4 mb-4 dark:bg-slate-800/60" />
                <div className="space-y-2.5">
                  <div className="h-3 bg-slate-200/70 rounded-lg w-full dark:bg-slate-800/40" />
                  <div className="h-3 bg-slate-200/70 rounded-lg w-full dark:bg-slate-800/40" />
                  <div className="h-3 bg-slate-200/70 rounded-lg w-5/6 dark:bg-slate-800/40" />
                </div>
              </div>
              <div className="border-t border-slate-100 dark:border-white/5 pt-4 mt-auto flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-300/50 dark:bg-slate-800/60" />
                <div className="space-y-1 flex-1">
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
              className="cursor-pointer bg-white text-slate-900 border border-slate-200/60 rounded-3xl shadow-sm hover:shadow-xl dark:shadow-none hover:shadow-slate-200/50 hover:-translate-y-2.5 transition-all duration-500 overflow-hidden group flex flex-col h-[460px] dark:bg-[#0f172a]/30 dark:text-white dark:border-white/5 dark:hover:border-indigo-500/30 dark:hover:shadow-[0_8px_30px_rgba(99,102,241,0.06)]"
            >
              <div className="relative overflow-hidden bg-slate-200 h-44 dark:bg-slate-800 flex-shrink-0">
                {!imageErrors[story._id] && story.imageURL ? (
                  <img
                    src={story.imageURL}
                    alt={`Cover image for ${story.title}`}
                    onError={() => handleImageError(story._id)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-blue-500/20 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" />
                    <i className="fas fa-book-open text-3xl text-indigo-400/80 relative z-10 animate-pulse" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent opacity-100 pointer-events-none dark:from-slate-950/60 dark:via-transparent dark:to-transparent"></div>

                <div className="absolute top-3.5 right-3.5 z-10" onClick={(e) => e.stopPropagation()}>
                  <BookmarkButton
                    storyId={story._id}
                    className="backdrop-blur-md bg-slate-950/40 border-white/15 hover:bg-indigo-600/30 hover:border-indigo-500/50 hover:scale-110 active:scale-95 text-white p-2 !rounded-full shadow-lg transition-all duration-300"
                  />
                </div>

                <div className="absolute top-3.5 left-3.5 flex gap-2 z-10">
                  <span className="px-2.5 py-0.5 backdrop-blur-md bg-slate-950/40 border border-white/15 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md">
                    {story.tag}
                  </span>
                  {story.language && (
                    <span className="px-2.5 py-0.5 backdrop-blur-md bg-slate-950/40 border border-white/15 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md">
                      {story.language}
                    </span>
                  )}
                </div>
              </div>

              <div className="px-6 py-5 flex-1 flex flex-col justify-between overflow-hidden relative z-10">
                <div className="flex-1 flex flex-col overflow-hidden mb-4">
                  <h3 className="font-extrabold text-lg mb-2 text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 dark:text-white dark:group-hover:text-indigo-400">
                    {story.title}
                  </h3>

                  <p className="text-xs text-slate-500 mb-0 line-clamp-3 leading-relaxed dark:text-slate-400 flex-1 overflow-hidden">
                    {story.content}
                  </p>
                </div>

                <div className="border-t border-slate-100 dark:border-white/5 pt-3 mt-auto">
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-start gap-2.5 max-w-[70%]">
                      <SSProfile name={story.author?.name || "Unknown"} size="h-7 w-7" />
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-xs font-semibold text-slate-900 dark:text-gray-200 truncate">
                          {story.author?.name || "Unknown"}
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider dark:text-slate-500 mt-0.5">
                          {formatDate(story.publishedAt || story.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="text-[9px] font-extrabold uppercase tracking-widest text-indigo-500 bg-indigo-50/80 dark:bg-indigo-500/10 dark:text-indigo-400 px-2 py-0.5 rounded">
                      {formatReadingStats(story.content).toUpperCase()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 text-[11px] font-semibold pt-1">
                    <div className="flex gap-3.5">
                      <span className="flex items-center gap-1 hover:text-red-500 transition-colors animate-heartPulse">
                        <i className="fas fa-heart text-slate-350 dark:text-slate-600"></i> {story.likesCount || 0}
                      </span>
                      <span className="flex items-center gap-1 hover:text-blue-500 transition-colors animate-commentWiggle">
                        <i className="fas fa-comment text-slate-350 dark:text-slate-600"></i> {story.commentsCount || 0}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 hover:text-green-500 transition-colors animate-eyeExpand">
                      <i className="fas fa-eye text-slate-350 dark:text-slate-600"></i> {story.viewsCount || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
             <div className="w-20 h-20 mb-5 rounded-full bg-slate-100 flex items-center justify-center dark:bg-slate-800/40">
               <i className="fas fa-book-open text-3xl text-slate-300 dark:text-slate-600"></i>
             </div>
             <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2.5">No posts available</h3>
             <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
               Check back later for new stories, or try adjusting your search filters.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreViewListComponent;
