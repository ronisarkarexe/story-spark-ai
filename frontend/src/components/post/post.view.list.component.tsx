import React from "react";
import { useNavigate } from "react-router-dom";
import { Post } from "../../models/post";
import BookmarkButton from "../BookmarkButton";
import SSProfile from "../ui-component/ss-profile/ss-profile";

interface IExploreViewListComponentProps {
  posts: Post[];
  isLoading: boolean;
}

const ExploreViewListComponent: React.FC<IExploreViewListComponentProps> = ({
  posts,
  isLoading,
}) => {
  const navigate = useNavigate();

  const calculateReadingTime = (content: string): number => {
    if (!content) return 1;
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-[#f8fafc]/90 border border-slate-200/60 shadow-lg rounded-[2.5rem] overflow-hidden flex flex-col h-[520px] dark:bg-slate-900/40 dark:border-white/5 dark:shadow-2xl"
          >
            <div className="relative aspect-video bg-slate-200/80 dark:bg-slate-800/50">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-100 to-transparent dark:from-[#03050C] opacity-60"></div>
              <div className="absolute top-6 left-6 h-7 w-20 bg-slate-300/50 rounded-full border border-slate-300/30 dark:bg-blue-500/10 dark:border-blue-500/10" />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="h-6 bg-slate-300/60 rounded-lg w-3/4 mb-4 dark:bg-slate-800/60" />
              <div className="space-y-3 mb-8 flex-1">
                <div className="h-3.5 bg-slate-200/70 rounded-lg w-full dark:bg-slate-800/40" />
                <div className="h-3.5 bg-slate-200/70 rounded-lg w-full dark:bg-slate-800/40" />
                <div className="h-3.5 bg-slate-200/70 rounded-lg w-5/6 dark:bg-slate-800/40" />
              </div>
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
              className="cursor-pointer bg-gray-50 text-slate-900 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-300 overflow-hidden group flex flex-col h-full dark:bg-slate-900/60 dark:text-white dark:border-slate-800"
            >
              <div className="relative overflow-hidden">
                <img
                  src={story.imageURL}
                  alt={`Cover image for ${story.title}`}
                  className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent opacity-100 pointer-events-none dark:from-slate-900/90 dark:via-transparent dark:to-transparent"></div>

                <div className="absolute top-4 right-4 z-10" onClick={(e) => e.stopPropagation()}>
                  <BookmarkButton
                    storyId={story._id}
                    bookmarks={story.bookmarks}
                    className="backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 hover:bg-white/30 p-2 !rounded-full shadow-lg hover:scale-110 transition-all duration-300"
                  />
                </div>

                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-indigo-600/80 backdrop-blur-md border border-indigo-500/50 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                    {story.tag}
                  </span>
                  {story.language && (
                    <span className="px-3 py-1 bg-purple-600/80 backdrop-blur-md border border-purple-500/50 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                      {story.language}
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
                    <div className="flex items-center gap-3">
                      <SSProfile name={story.author?.name || "Unknown"} size="h-8 w-8" />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900 dark:text-gray-200">
                          {story.author?.name || "Unknown"}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider dark:text-slate-400">
                          {new Date(story.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400 px-2 py-1 rounded-md">
                      {calculateReadingTime(story.content)} MIN READ
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
