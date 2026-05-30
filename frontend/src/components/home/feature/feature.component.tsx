import { Post } from "../../../models/post";
import { useGetFeaturedListsQuery } from "../../../redux/apis/post.api";
import LoadingAnimation from "../../loading/loading.component";
import { useNavigate } from "react-router-dom";

const FeatureComponent = () => {
  const { data, isLoading, isError, refetch } = useGetFeaturedListsQuery(undefined);
  const navigate = useNavigate();
  if (isLoading) return <LoadingAnimation />;
  if (isError) {
    return (
      <div className="mb-12 rounded-lg border border-red-500/20 bg-red-500/10 p-5 text-center text-red-200">
        <p className="mb-3 font-semibold">Failed to load featured posts.</p>
        <button
          onClick={() => refetch()}
          className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="mb-12 text-slate-100">
      <h2 className="mb-6 text-2xl font-bold">Featured Posts</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:gap-6">
        {(data?.posts ?? []).map((post: Post) => (
          <button key={post._id} onClick={() => navigate(`/post/${post._id}`)} className="motion-card story-panel rounded-lg p-5 text-left">
            <h3 className="mb-2 text-xl font-bold text-slate-100">{post.title}</h3>
            <p className="line-clamp-2 text-slate-400">{post.content || ""}</p>
          </button>
        ))}
      </div>
    </section>
  );
};

export default FeatureComponent;
