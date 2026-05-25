import { useGetLatestListsQuery } from "../../../redux/apis/post.api";
import { Post } from "../../../models/post";
import LoadingAnimation from "../../loading/loading.component";
import SSProfile from "../../ui-component/ss-profile/ss-profile";
import { formatDateShort } from "../../../utils/time-formate";
import { useNavigate } from "react-router-dom";
import BookmarkButton from "../../BookmarkButton"; // Import the core bookmark module securely

const LatestPostsComponent = () => {
  const { data, isLoading } = useGetLatestListsQuery(undefined);
  const navigate = useNavigate();

  // Dynamic reading time calculation matching your exact feature request specs
  const calculateReadingTime = (content: string): number => {
    if (!content) return 1;
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  if (isLoading) {
    return <LoadingAnimation />;
  }
  return (
    <div className="text-slate-900 dark:text-slate-100">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Latest Posts</h2>
      <div className="space-y-6">
        {data?.posts?.length ?? 0 > 0 ? (
          data?.posts?.map((post: Post) => (
            <div
              key={post._id}
              onClick={() => navigate(`/post/${post._id}`)}
              className="motion-card-subtle bg-blue-500/10 rounded-lg shadow-sm border border-slate-700/30 p-6 cursor-pointer hover:bg-blue-500/20 hover:border-blue-400/30 relative group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <SSProfile name={post.author?.name || 'Unknown User'} size="h-8 w-8" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600 dark:text-gray-400">
                      {post.author?.name || 'Unknown User'}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-slate-500 dark:text-gray-500">
                        {formatDateShort(post.createdAt)}
                      </p>
                      <span className="text-slate-400 dark:text-gray-600 text-xs">•</span>
                      {/* ⏱️ Dynamic Reading Time Element Addition */}
                      <p className="text-xs text-purple-400 font-medium flex items-center gap-1">
                        ⏱️ {calculateReadingTime(post.content)} min read
                      </p>
                    </div>
                  </div>
                </div>

                {/* 🔖 Interactive Bookmark Button Component Injection */}
                <div onClick={(e) => e.stopPropagation()} className="relative z-10">
                  <BookmarkButton
                    storyId={post._id}
                    bookmarks={post.bookmarks}
                    className="p-1.5 rounded-full hover:bg-slate-700/40 text-slate-400 hover:text-purple-400 transition-colors"
                  />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-gray-300 mb-2 group-hover:text-blue-400 transition-colors">
                {post.title}
              </h3>
              <p className="text-slate-600 dark:text-gray-400 mb-4 line-clamp-2">
                {post.content}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-slate-500 dark:text-gray-400">
                  <span className="flex items-center mr-4">
                    <i className="far fa-heart mr-1"></i> {post.likesCount}
                  </span>
                  <span className="flex items-center mr-4">
                    <i className="far fa-comment mr-1"></i> {post.commentsCount}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.topic.map((topic) => (
                    <span
                      key={topic._id}
                      className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${topic.color}`}
                    >
                      {topic.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-slate-200 dark:border-slate-700/70 bg-slate-100 dark:bg-slate-900/40 px-4 py-5 text-slate-700 dark:text-slate-300">
            Post is not available!
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestPostsComponent;
