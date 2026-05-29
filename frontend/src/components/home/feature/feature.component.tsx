import { Post } from "../../../models/post";
import { useGetFeaturedListsQuery } from "../../../redux/apis/post.api";
import LoadingAnimation from "../../loading/loading.component";
import { useNavigate } from "react-router-dom";

const FeatureComponent = () => {
  const { data, isLoading, isError } = useGetFeaturedListsQuery(undefined);
  const navigate = useNavigate();
  if (isLoading) return <LoadingAnimation />;
  if (isError) return <div className="mb-12 text-red-400">Failed to load featured posts.</div>;

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
