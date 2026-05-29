import { useNavigate } from "react-router-dom";
import { Post } from "../../../models/post";
import { useGetLatestListsQuery } from "../../../redux/apis/post.api";
import LoadingAnimation from "../../loading/loading.component";
import SSProfile from "../../ui-component/ss-profile/ss-profile";

const CommunitySpotlightComponent = () => {
  const { data, isLoading, isError } = useGetLatestListsQuery(undefined);
  const navigate = useNavigate();

  if (isLoading) return <LoadingAnimation />;
  if (isError) return <div className="px-5 py-10 text-red-400">Failed to load spotlight stories.</div>;

  return (
    <section className="story-section">
      <div className="story-page-shell">
        <div className="mb-8 max-w-2xl">
          <h2 className="story-section-heading">Community Spotlight</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {(data?.posts ?? []).slice(0, 6).map((post: Post) => (
            <button key={post._id} onClick={() => navigate(`/post/${post._id}`)} className="motion-card-subtle story-panel rounded-lg p-5 text-left">
              <div className="mb-3 flex items-center gap-3">
                <SSProfile name={post.author?.name || "Unknown User"} size="h-9 w-9" />
                <p className="text-sm font-semibold text-slate-300">{post.author?.name || "Unknown User"}</p>
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-100">{post.title}</h3>
              <p className="line-clamp-3 text-sm text-slate-400">{post.content}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunitySpotlightComponent;
