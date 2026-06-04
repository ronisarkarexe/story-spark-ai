import React from "react";
import { useGetFeaturedListsQuery } from "../../redux/apis/post.api";
import { Post } from "../../models/post";
import ImageFallback from "../ImageFallback";

const ExploreFeatureComponent = () => {
  const { data, isLoading, isError } = useGetFeaturedListsQuery(undefined);
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/60 h-[400px] flex flex-col justify-end p-8 dark:bg-slate-900/35 dark:border-white/5"
          >
            {/* Cinematic Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-200/80 via-slate-100/30 to-transparent dark:from-slate-950 dark:via-slate-900/40 dark:to-transparent" />
            
            {/* Title Skeleton */}
            <div className="h-8 bg-slate-300 dark:bg-slate-800 rounded-lg w-2/3 mb-3 relative z-10" />
            
            {/* Excerpt lines */}
            <div className="space-y-2 mb-6 relative z-10">
              <div className="h-3.5 bg-slate-200 dark:bg-slate-800/60 rounded-lg w-full" />
              <div className="h-3.5 bg-slate-200 dark:bg-slate-800/60 rounded-lg w-5/6" />
            </div>
            
            {/* Footer */}
            <div className="flex items-center pt-4 border-t border-slate-200 dark:border-white/5 relative z-10 w-full">
              <div className="h-6 w-16 bg-slate-300/50 dark:bg-slate-800/50 rounded-full" />
              <div className="ml-auto flex gap-4">
                <div className="h-3 w-8 bg-slate-300/50 dark:bg-slate-800/50 rounded-md" />
                <div className="h-3 w-8 bg-slate-300/50 dark:bg-slate-800/50 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (isError) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="animate-pulse rounded-xl bg-gray-200 dark:bg-slate-800 h-72"
          ></div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {(data?.posts?.length ?? 0) > 0 ? (
        data?.posts?.map((post: Post) => (
          <div key={post._id} className="relative group overflow-hidden rounded-3xl border border-slate-200/60 shadow-lg dark:shadow-none cursor-pointer bg-white text-slate-900 dark:bg-[#0f172a]/30 dark:border-white/5 dark:text-white dark:hover:border-indigo-500/30 transition-all duration-500">
            <ImageFallback
              src={post.imageURL || "broken-url"}
              alt={post.title || "Post Image"}
              className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-transparent p-8 flex flex-col justify-end dark:from-slate-950 dark:via-slate-950/70 dark:to-transparent">
              <h3 className="text-slate-900 text-2xl font-bold tracking-tight drop-shadow-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors dark:text-white">{post.title}</h3>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed max-w-2xl line-clamp-2 dark:text-slate-350">
                {post.content}
              </p>
              <div className="flex items-center mt-6 pt-4 border-t border-slate-200 dark:border-white/5">
                <span className="backdrop-blur-md bg-slate-950/40 border border-white/15 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md px-3 py-1">
                  {post.tag}
                </span>
                <div className="ml-auto flex items-center gap-4 text-slate-500 text-xs font-semibold dark:text-slate-400">
                  <span className="flex items-center gap-1.5 hover:text-red-500 transition-colors animate-heartPulse">
                    <i className="fas fa-heart text-slate-450 dark:text-slate-500"></i> {post.likesCount || 0}
                  </span>
                  <span className="flex items-center gap-1.5 hover:text-blue-500 transition-colors animate-commentWiggle">
                    <i className="fas fa-comment text-slate-450 dark:text-slate-500"></i> {post.commentsCount || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="animate-pulse rounded-xl bg-gray-200 dark:bg-slate-800 h-72 w-full"></div>
      )}
    </div>
  );
};

export default ExploreFeatureComponent;
