import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Post } from "../../models/post";
import BookmarkButton from "../BookmarkButton";
import SSProfile from "../ui-component/ss-profile/ss-profile";
import { formatReadingStats } from "../../utils/story-utils";
import ImageFallback from "../ImageFallback";
import { SkeletonGrid } from "../cards/SkeletonCard";

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
    return <SkeletonGrid count={8} variant="default" />;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {posts.length > 0 ? (
          posts.map((story) => (
            <div
              key={story._id}
              onClick={() => navigate(`/post/${story._id}`)}
              className="cursor-pointer bg-gray-50 text-slate-900 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-300 overflow-hidden group flex flex-col h-full dark:bg-slate-900/60 dark:text-white dark:border-slate-800"
            >
              <div className="relative overflow-hidden bg-slate-200 dark:bg-slate-800">
                {!imageErrors[story._id] && story.imageURL ? (
                  <ImageFallback
                    src={story.imageURL}
                    alt={`Cover image for ${story.title}`}
                    className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                ) : (
                  <div className="w-full h-52 bg-gradient-to-br from-indigo-500/25 via-purple-500/25 to-blue-500/25 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" />
                    <i className="fas fa-book-open text-4xl text-indigo-400/80 relative z-10 animate-pulse" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent opacity-100 pointer-events-none dark:from-slate-900/90 dark:via-transparent dark:to-transparent"></div>

                <div className="absolute top-4 right-4 z-10" onClick={(e) => e.stopPropagation()}>
                  <BookmarkButton
                    storyId={story._id}
                    className="backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 hover:bg-white/30 p-2 !rounded-full shadow-lg hover:scale-110 transition-all duration-300"
                  />
                </div>

                <div className="absolute top-4 left-4 flex gap-1.5 flex-wrap max-w-[80%]">
                  <span className="inline-flex items-center px-2 py-0.5 bg-indigo-600 border border-indigo-500/50 text-white text-[9px] font-bold uppercase tracking-wider rounded-full shadow-lg max-w-[120px] truncate">
                    {story.tag}
                  </span>
                  {story.language && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-600 border border-purple-500/50 text-white text-[9px] font-bold uppercase tracking-wider rounded-full shadow-lg whitespace-nowrap">
                      🌐 {story.language}
                    </span>
                  )}
                </div>
              </div>

              <div className="px-6 py-5 flex-1 flex flex-col relative z-10">
                <h3 className="font-extrabold text-xl mb-3 text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 dark:text-white dark:group-hover:text-indigo-400">
                  {story.title}
                </h3>

                <p className="text-sm text-slate-600 mb-6 line-clamp-3 leading-relaxed dark:text-slate-400 flex-1">
                  {story.content}
                </p>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-auto">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <SSProfile name={story.author?.name || "Unknown"} size="h-8 w-8" />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900 dark:text-gray-200">
                          {story.author?.name || "Unknown"}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider dark:text-slate-400">
                          {formatDate(story.publishedAt || story.createdAt)}
                        </span>
                        {story.author?.profile?.bio ? (
                          <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                            {story.author.profile.bio}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400 px-2 py-1 rounded-md">
                      {formatReadingStats(story.content).toUpperCase()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                        <i className="fas fa-heart text-red-400/80"></i> {story.likesCount || 0}
                      </span>
                      <span className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                        <i className="fas fa-comment text-blue-400/80"></i> {story.commentsCount || 0}
                      </span>
                    </div>
                    <span className="flex items-center gap-1.5 hover:text-green-500 transition-colors">
                      <i className="fas fa-eye text-green-400/80"></i> {story.viewsCount || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
             <div className="w-24 h-24 mb-6 rounded-full bg-slate-100 flex items-center justify-center dark:bg-slate-800">
               <i className="fas fa-book-open text-4xl text-slate-300 dark:text-slate-600"></i>
             </div>
             <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">No posts available</h3>
             <p className="text-slate-500 dark:text-slate-400 max-w-sm">
               Check back later for new stories, or try adjusting your search filters.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreViewListComponent;
