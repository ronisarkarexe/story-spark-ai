import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IStories } from "./stories.view.component";

export interface IRelatedStoriesComponentProps {
  posts: (IStories & { _id: string })[];
  currentPostId: string;
}

export const RelatedStoriesComponent: React.FC<IRelatedStoriesComponentProps> = ({ posts, currentPostId }) => {
  const navigate = useNavigate();
  const MAX_RELATED = 4;
  const filteredPosts = posts
    .filter((post) => post._id !== currentPostId)
    .slice(0, MAX_RELATED);


  return (
    <div className="mt-8">
      <h4 className="text-lg font-bold text-slate-200 mb-4">Related Content</h4>
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPosts.map((post) => (
            <Link
              key={post._id}
              to={`/stories/${post._id}`}
              className="block p-4 bg-slate-700/40 rounded-xl border border-slate-600/30 hover:bg-slate-700/60 transition-colors"
            >
              <p className="text-sm font-semibold text-white truncate">
                {post.title || "Untitled Story"}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-slate-500 py-4 border border-dashed border-slate-700 rounded-xl">No related stories found.</p>
      )}
    </div>
  );
};

export default RelatedStoriesComponent;
