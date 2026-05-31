import { useGetLatestListsQuery } from "../../../redux/apis/post.api";
import { Post } from "../../../models/post";
import LoadingAnimation from "../../loading/loading.component";
import SSProfile from "../../ui-component/ss-profile/ss-profile";
import { formatDateShort } from "../../../utils/time-formate";
import { useNavigate } from "react-router-dom";
import BookmarkButton from "../../BookmarkButton";

const LatestPostsComponent = () => {
  const { data, isLoading, isError, refetch } = useGetLatestListsQuery(undefined);
  const navigate = useNavigate();
  if (isLoading) return <LoadingAnimation />;
  if (isError) {
    return (
      <section className="mb-12 text-slate-100">
        <h2 className="mb-6 text-2xl font-bold">Latest Posts</h2>
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-5 text-center text-red-200">
          <p className="mb-3 font-semibold">Failed to load latest posts.</p>
          <button
            onClick={() => refetch()}
            className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="text-slate-100">
      <h2 className="mb-6 text-2xl font-bold">Latest Posts</h2>
      <div className="space-y-5">
        {(data?.posts ?? []).length > 0 ? (
          (data?.posts ?? []).map((post: Post) => (
            <button key={post._id} onClick={() => navigate(`/post/${post._id}`)} className="motion-card-subtle story-panel rounded-lg p-5 text-left">
              <h3 className="mb-2 text-xl font-bold text-slate-100">{post.title}</h3>
              <p className="line-clamp-2 text-slate-400">{post.content || ""}</p>
            </button>
          ))
        ) : (
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20 px-4 py-5 text-slate-500 dark:text-slate-400">
            Posts are not available.
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestPostsComponent;