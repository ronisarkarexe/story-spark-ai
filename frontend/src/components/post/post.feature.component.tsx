import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetFeaturedListsQuery } from "../../redux/apis/post.api";
import { Post } from "../../models/post";
import LoadingAnimation from "../loading/loading.component";
import EmptyState from "../ui-component/empty-state/empty-state.component";

const ExploreFeatureComponent = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetFeaturedListsQuery(undefined);
  const posts = data?.posts ?? [];

  if (isLoading) {
    return <LoadingAnimation variant="skeleton" skeletonCount={2} />;
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        title="No featured stories"
        description="Featured picks will appear here when available."
        icon="fa-regular fa-star"
      />
    );
  }

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
      {posts.map((post: Post) => (
        <article
          key={post._id}
          role="button"
          tabIndex={0}
          onClick={() => navigate(`/post/${post._id}`)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate(`/post/${post._id}`);
            }
          }}
          className="premium-card group cursor-pointer overflow-hidden rounded-2xl transition hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
        >
          <div className="relative h-64 overflow-hidden">
            <img
              src={post.imageURL}
              alt=""
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-xl font-semibold text-white">{post.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-slate-300">
                {post.content.slice(0, 100)}...
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="rounded-full bg-indigo-500/30 px-3 py-1 text-xs text-indigo-100">
                  {post.tag}
                </span>
                <div className="flex gap-3 text-sm text-slate-300">
                  <span>
                    <i className="fas fa-heart mr-1" aria-hidden="true" />
                    {post.likesCount}
                  </span>
                  <span>
                    <i className="fas fa-comment mr-1" aria-hidden="true" />
                    {post.commentsCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default ExploreFeatureComponent;
