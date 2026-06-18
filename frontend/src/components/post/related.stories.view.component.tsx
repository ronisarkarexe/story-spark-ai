import React from "react";
import { Post } from "../../models/post";
import { useNavigate } from "react-router-dom";
import ImageFallback from "../ImageFallback";

interface IRelatedStoriesComponentProps {
  posts: Post[],
  currentPostId: string;
}

const RelatedStoriesComponent: React.FC<IRelatedStoriesComponentProps> = ({
  posts,currentPostId,
}) => {
  const navigate = useNavigate();
  const filteredPosts=posts.filter((post)=>post._id!==currentPostId)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {filteredPosts.length > 0 ? (
  filteredPosts.map((post: Post) => {

    console.log("Story:", post.title);
    console.log("Image URL:", post.imageURL);

    return (
          <div
            onClick={() => navigate(`/post/${post._id}`)}
            key={post._id}
            className="cursor-pointer bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col h-full"
          >
            <div className="relative overflow-hidden">
                <ImageFallback
                  src={post.imageURL}
                  alt={post.title}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none"></div>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h4 className="font-bold text-lg mb-2 text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-2 break-words overflow-hidden text-ellipsis">
                {post.title}
              </h4>
              <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
                {post?.content.slice(0, 120)}...
              </p>
            </div>
          </div>
        );
        
        })
      ) : (
        <p className="text-center text-slate-500 col-span-2 py-8">No related stories found.</p>
      )}
    </div>
  );
};

export default RelatedStoriesComponent;
