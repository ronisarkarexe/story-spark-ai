import { Link } from "react-router-dom";
import { useGetLatestListsQuery } from "../../../redux/apis/post.api";
import { Post } from "../../../models/post";
import LoadingAnimation from "../../loading/loading.component";
import SSProfile from "../../ui-component/ss-profile/ss-profile";
import { formatDateShort } from "../../../utils/time-formate";

const LatestPostsComponent = () => {
  const { data, isLoading } = useGetLatestListsQuery(undefined);
  if (isLoading) {
    return <LoadingAnimation />;
  }
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-300 mb-6">Latest Posts</h2>
      <div className="space-y-6">
        {data?.posts?.length ?? 0 > 0 ? (
          data?.posts?.map((post: Post) => (
            <Link
              to={`/post/${post._id}`}
              key={post._id}
              className="block bg-blue-500/10 rounded-lg shadow-sm p-6 transition-all duration-300 hover:bg-blue-500/20 hover:scale-[1.01] hover:shadow-lg group cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <div className="flex items-center mb-4">
                <SSProfile name={post.author.name} size="h-8 w-8" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">
                    {post.author.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDateShort(post.createdAt)}
                  </p>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2 group-hover:text-blue-400 transition-colors duration-300">
                {post.title}
              </h3>
              <p className="text-gray-400 mb-4">
                {post.content.slice(0, 170)}...
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-400">
                  <span className="flex items-center mr-4">
                    <i className="far fa-heart mr-1"></i> {post.likesCount}
                  </span>
                  <span className="flex items-center mr-4">
                    <i className="far fa-comment mr-1"></i> {post.commentsCount}
                  </span>
                </div>
                <div className="flex space-x-2">
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
            </Link>
          ))
        ) : (
          <div>Post is not available!</div>
        )}
      </div>
    </div>
  );
};

export default LatestPostsComponent;
