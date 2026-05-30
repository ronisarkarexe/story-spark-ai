import React from "react";
import { Post } from "../../models/post";
import { useNavigate } from "react-router-dom";

interface IRelatedStoriesComponentProps {
  posts: Post[];
  currentPostId: string;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80";

const RelatedStoriesComponent: React.FC<IRelatedStoriesComponentProps> = ({
  posts,
  currentPostId,
}) => {
  const navigate = useNavigate();
  const filteredPosts = posts.filter((post) => post._id !== currentPostId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post: Post) => (
          <article
            onClick={() => navigate(`/post/${post._id}`)}
            key={post._id}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && navigate(`/post/${post._id}`)}
            className="cursor-pointer bg-white text-slate-900 border border-gray-200 rounded-2xl shadow-md hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col h-full dark:bg-slate-900/60 dark:text-white dark:border-slate-800"
          >
            <div className="relative overflow-hidden flex-shrink-0">
              <img
                src={post.imageURL || FALLBACK_IMAGE}
                alt={post.title}
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                }}
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 pointer-events-none"></div>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h4 className="font-bold text-lg mb-2 text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 dark:text-slate-100 dark:group-hover:text-blue-400">
                {post.title}
              </h4>
              <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed dark:text-slate-400">
                {post?.content.slice(0, 120)}...
              </p>
            </div>
          </article>
        ))
      ) : (
        <div className="col-span-1 md:col-span-2 py-10 flex flex-col items-center justify-center text-center bg-gray-50 border border-dashed border-gray-200 rounded-2xl dark:bg-slate-900/20 dark:border-slate-800">
          <div className="w-12 h-12 mb-3 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
            <i className="fas fa-book text-slate-400 dark:text-slate-500"></i>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm">No related stories found.</p>
        </div>
      )}
    </div>
  );
};

export default RelatedStoriesComponent;
