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
            className="animate-pulse relative overflow-hidden rounded-3xl border border-slate-200 bg-[#f8fafc]/90 h-[400px] flex flex-col justify-end p-8 dark:bg-slate-900/40 dark:border-slate-700/50"
          >
            {/* Cinematic Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-200/80 via-slate-100/30 to-transparent dark:from-slate-950 dark:via-slate-900/60 dark:to-transparent" />
            
            {/* Title Skeleton */}
            <div className="h-9 bg-slate-300 dark:bg-slate-800 rounded-lg w-2/3 mb-3 relative z-10" />
            
            {/* Excerpt lines */}
            <div className="space-y-2 mb-6 relative z-10">
              <div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded-lg w-full" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded-lg w-5/6" />
            </div>
            
            {/* Footer */}
            <div className="flex items-center pt-4 border-t border-slate-200 dark:border-white/10 relative z-10 w-full">
              <div className="h-7 w-20 bg-slate-300/50 border border-slate-300/30 dark:bg-blue-600/40 dark:border-blue-500/50 rounded-full" />
              <div className="ml-auto flex gap-4">
                <div className="h-4 w-10 bg-slate-300/50 dark:bg-slate-700 rounded-md" />
                <div className="h-4 w-10 bg-slate-300/50 dark:bg-slate-700 rounded-md" />
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
          <div key={post._id} className="relative group overflow-hidden rounded-3xl border border-gray-200 shadow-2xl cursor-pointer bg-white text-slate-900 dark:bg-transparent dark:border-slate-700/50 dark:text-white">
            <ImageFallback
                  src={post.imageURL}
                  alt={post.title || "Post Image"}
                  className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent p-8 flex flex-col justify-end dark:from-slate-950 dark:via-slate-900/60 dark:to-transparent">
              <h3 className="text-slate-900 text-3xl font-bold tracking-tight drop-shadow-md group-hover:text-blue-600 transition-colors dark:text-white dark:group-hover:text-blue-300">{post.title}</h3>
              <p className="text-slate-600 text-base mt-3 leading-relaxed max-w-2xl line-clamp-2 dark:text-slate-300">
                {post.content.slice(0, 150)}...
              </p>
              <div className="flex items-center mt-6 pt-4 border-t border-gray-200 dark:border-white/10">
                <span className="bg-blue-600/10 border border-blue-500/20 backdrop-blur-md text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg dark:bg-blue-600/40 dark:border-blue-500/50 dark:text-blue-100">
                  {post.tag}
                </span>
                <div className="ml-auto flex items-center gap-6 text-slate-600 text-sm font-medium dark:text-slate-200">
                  <span className="flex items-center gap-2 hover:text-slate-900 transition-colors dark:hover:text-white"><i className="fas fa-heart text-red-400"></i> {post.likesCount}</span>
                  <span className="flex items-center gap-2 hover:text-slate-900 transition-colors dark:hover:text-white"><i className="fas fa-comment text-blue-400"></i> {post.commentsCount}</span>
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
