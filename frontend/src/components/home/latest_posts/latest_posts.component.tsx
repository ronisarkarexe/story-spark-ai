import { useGetLatestListsQuery } from "../../../redux/apis/post.api";
import { Post } from "../../../models/post";
import LoadingAnimation from "../../loading/loading.component";
import SSProfile from "../../ui-component/ss-profile/ss-profile";
import { formatDateShort } from "../../../utils/time-formate";
import { useNavigate } from "react-router-dom";
import BookmarkButton from "../../BookmarkButton";

const LatestPostsComponent = () => {
  const { data, isLoading } = useGetLatestListsQuery(undefined);
  const navigate = useNavigate();

  const calculateReadingTime = (content: string): number => {
    if (!content) return 1;

    const words = content.trim().split(/\s+/).length;

    return Math.max(1, Math.ceil(words / 200));
  };

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (isError) {
    return (
      <div className="w-full rounded-3xl border border-slate-200 bg-white/70 p-7 text-slate-900 shadow-md backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/60 dark:text-slate-100">
        <h2 className="text-xl font-bold">Latest Posts</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          We couldn&apos;t load the latest posts right now. Please refresh and try
          again.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full text-slate-900 dark:text-slate-100">
      {/* Section Heading */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Latest Posts
        </h2>

        <div className="h-[2px] flex-1 ml-6 bg-gradient-to-r from-blue-500/60 to-transparent rounded-full"></div>
      </div>

      {/* Posts Container */}
      <div className="flex flex-col gap-8 w-full">
        {data?.posts?.length ?? 0 > 0 ? (
          data?.posts?.map((post: Post) => (
            <div
              key={post._id}
              onClick={() => navigate(`/post/${post._id}`)}
              className="
                w-full
                motion-card-subtle
                bg-white/70
                dark:bg-slate-900/60
                backdrop-blur-xl
                rounded-3xl
                shadow-md
                border
                border-slate-200
                dark:border-slate-700/40
                p-7
                cursor-pointer
                transition-all
                duration-300
                hover:shadow-2xl
                hover:-translate-y-1
                hover:border-blue-400/40
                group
              "
            >
              {/* Top Section */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-center min-w-0">
                  <SSProfile
                    name={post.author?.name || "Unknown User"}
                    size="h-10 w-10"
                  />

                  <div className="ml-4 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 dark:text-gray-300 truncate">
                      {post.author?.name || "Unknown User"}
                    </p>

                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <p className="text-xs text-slate-500 dark:text-gray-500">
                        {formatDateShort(post.createdAt)}
                      </p>

                      <span className="text-slate-400 text-xs">•</span>

                      <p className="text-xs text-purple-500 font-medium flex items-center gap-1">
                        ⏱️ {calculateReadingTime(post.content)} min read
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bookmark */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="relative z-10 flex-shrink-0"
                >
                  <BookmarkButton
                    storyId={post._id}
                    bookmarks={post.bookmarks}
                    className="
                      p-2
                      rounded-full
                      hover:bg-slate-200
                      dark:hover:bg-slate-700/50
                      text-slate-400
                      hover:text-purple-500
                      transition-all
                    "
                  />
                </div>
              </div>

              {/* Title */}
              <h3
                className="
                  text-2xl
                  font-bold
                  text-slate-900
                  dark:text-gray-200
                  mb-3
                  group-hover:text-blue-500
                  transition-colors
                  line-clamp-2
                "
              >
                {post.title}
              </h3>

              {/* Content */}
              <p
                className="
                  text-slate-600
                  dark:text-gray-400
                  text-[15px]
                  leading-7
                  mb-6
                  line-clamp-3
                "
              >
                {post.content}
              </p>

              {/* Bottom Section */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                {/* Likes + Comments */}
                <div className="flex items-center text-sm text-slate-500 dark:text-gray-400 flex-wrap gap-4">
                  <span className="flex items-center">
                    <i className="far fa-heart mr-2"></i>
                    {post.likesCount}
                  </span>

                  <span className="flex items-center">
                    <i className="far fa-comment mr-2"></i>
                    {post.commentsCount}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {post.topic.map((topic) => (
                    <span
                      key={topic._id}
                      className={`
                        inline-flex
                        items-center
                        px-4
                        py-1
                        rounded-full
                        text-xs
                        font-semibold
                        shadow-sm
                        ${topic.color}
                      `}
                    >
                      #{topic.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div
            className="
              rounded-2xl
              border
              border-slate-200
              dark:border-slate-700/70
              bg-slate-100
              dark:bg-slate-900/40
              px-6
              py-6
              text-slate-700
              dark:text-slate-300
              text-center
            "
          >
            Post is not available!
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestPostsComponent;
