import { useGetLatestListsQuery } from "../../../redux/apis/post.api";
import { Post } from "../../../models/post";
import LoadingAnimation from "../../loading/loading.component";
import SSProfile from "../../ui-component/ss-profile/ss-profile";
import BookmarkButton from "../../BookmarkButton";
import { useNavigate } from "react-router-dom";
import { useToggleReactionMutation } from "../../../redux/apis/reaction.api";
import toast from "react-hot-toast";

const CommunitySpotlightComponent = () => {
  const { data, isLoading, isError } = useGetLatestListsQuery(undefined);
  const navigate = useNavigate();
  const [toggleReaction] = useToggleReactionMutation();

  const calculateReadingTime = (content: string): number => {
    if (!content) return 1;
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const handleLike = async (
    e: React.MouseEvent,
    postId: string
  ) => {
    e.stopPropagation();
    try {
      await toggleReaction({ postId }).unwrap();
    } catch (error) {
      console.error(error);
      toast.error("You need to login to perform this action");
    }
  };

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (isError) {
    return (
      <div className="px-5 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-gray-200">
            Community Spotlight
          </h2>
          <p className="text-slate-600 dark:text-gray-400 mt-2">
            Top stories handpicked from our community
          </p>
        </div>
        <div className="rounded-lg border border-red-200 dark:border-red-900/70 bg-red-50 dark:bg-red-900/20 px-4 py-5 text-red-700 dark:text-red-400">
          Failed to load community spotlight stories. Please try again later.
        </div>
      </div>
    );
  }
  return (
    <div className="px-5 py-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-gray-200">
          Community Spotlight
        </h2>
        <p className="text-slate-600 dark:text-gray-400 mt-2">
          Top stories handpicked from our community
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(data?.posts?.length ?? 0) > 0 ? (
          data?.posts?.slice(0, 6).map((post: Post) => (
            <div
              key={post._id}
              onClick={() => navigate(`/post/${post._id}`)}
              className="bg-blue-500/10 rounded-xl p-6 hover:bg-blue-500/20 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <SSProfile name={post.author.name} size="h-9 w-9" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-slate-700 dark:text-gray-300">
                        {post.author.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <p className="text-xs text-slate-500 dark:text-gray-500">
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </p>
                        <span className="text-slate-400 dark:text-gray-600 text-xs">•</span>
                        <span className="text-xs text-purple-400 font-medium">
                          ⏱️ {calculateReadingTime(post.content)} min read
                        </span>
                      </div>
                    </div>
                  </div>

                  <div onClick={(e) => e.stopPropagation()} className="relative z-10">
                    <BookmarkButton
                      storyId={post._id}
                      bookmarks={post.bookmarks}
                      className="p-1.5 rounded-full hover:bg-slate-700/40 text-slate-400 hover:text-purple-400 transition-colors"
                    />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-200 mb-2">
                  {post.title}
                </h3>
                <p className="text-slate-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                  {post.content}
                </p>
              </div>

              <div className="flex items-center justify-between mt-auto border-t border-slate-200 dark:border-slate-700/40 pt-4">
                <div className="flex items-center text-xs text-slate-500 dark:text-gray-500 gap-3">
                  <span className="flex items-center gap-1">
                    <i className="far fa-eye"></i> {post.viewsCount}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleLike(e, post._id)}
                    className="flex items-center gap-1 text-slate-500 dark:text-gray-500 hover:text-red-400 transition"
                  >
                    <i className="far fa-heart"></i>
                    {post.likesCount}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {post.topic.slice(0, 2).map((topic) => (
                    <span
                      key={topic._id}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${topic.color}`}
                    >
                      {topic.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-3 rounded-lg border border-slate-200 dark:border-slate-700/70 bg-slate-100 dark:bg-slate-900/40 px-4 py-4 text-slate-700 dark:text-slate-300">
            No spotlight stories yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default CommunitySpotlightComponent;
