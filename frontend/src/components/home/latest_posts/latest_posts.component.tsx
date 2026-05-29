import { useNavigate } from "react-router-dom";
import { Post } from "../../../models/post";
import { useGetLatestListsQuery } from "../../../redux/apis/post.api";
import LoadingAnimation from "../../loading/loading.component";

const LatestPostsComponent = () => {
  const { data, isLoading } = useGetLatestListsQuery(undefined);
  const navigate = useNavigate();
  if (isLoading) return <LoadingAnimation />;

  return (
    <section className="text-slate-100">
      <h2 className="mb-6 text-2xl font-bold">Latest Posts</h2>
      <div className="space-y-5">
        {(data?.posts ?? []).length > 0 ? (
          (data?.posts ?? []).map((post: Post) => (
            <button key={post._id} onClick={() => navigate(`/post/${post._id}`)} className="motion-card-subtle story-panel w-full rounded-lg p-5 text-left">
              <h3 className="mb-2 text-xl font-bold text-slate-100">{post.title}</h3>
              <p className="line-clamp-2 text-slate-400">{post.content || ""}</p>
            </button>
          ))
        ) : (
          <div className="story-panel rounded-lg px-4 py-5 text-slate-300">Posts are not available.</div>
        )}
      </div>
    </section>
  );
};

export default LatestPostsComponent;
