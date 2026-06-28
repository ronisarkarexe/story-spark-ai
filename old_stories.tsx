import React, { useMemo } from "react";
import { Post } from "../../models/post";
import { useNavigate } from "react-router-dom";

interface IRelatedStoriesComponentProps {
  posts: Post[];
  currentPostId: string;
}

const RelatedStoriesComponent: React.FC<IRelatedStoriesComponentProps> = ({
  posts = [], // Added a fallback default value
  currentPostId,
}) => {
  const navigate = useNavigate();

  // 1. Memoized filtering to protect performance
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => post && post._id !== currentPostId);
  }, [posts, currentPostId]);

  return (
    <div className="grid grid-cols-2 gap-6">
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post: Post) => (
          <button
            type="button"
            onClick={() => navigate(`/post/${post._id}`)}
            key={post._id}
            className="text-left w-full cursor-pointer bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col h-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="relative overflow-hidden w-full">
              <img
                src={post.imageURL || "/placeholder-image.webp"} // Safe fallback image
                alt={post.title || "Related Story"}
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy" // Improved image performance 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60 pointer-events-none"></div>
            </div>
            
            <div className="p-5 flex flex-col flex-1">
              <h4 className="font-bold text-lg mb-2 text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-2">
                {post.title}
              </h4>
              {/* Removed the dangerous Javascript .slice() and relied entirely on Tailwind line-clamp */}
              <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
                {post.content || "Read more about this story..."}
              </p>
            </div>
          </button>
        ))
      ) : (
        <p className="text-center text-slate-500 col-span-2 py-8">
          No related stories found.
        </p>
      )}
    </div>
  );
};

export default RelatedStoriesComponent;
