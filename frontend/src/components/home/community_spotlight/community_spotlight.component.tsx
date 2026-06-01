import { useNavigate } from "react-router-dom";
import { Post } from "../../../models/post";
import { useGetLatestListsQuery } from "../../../redux/apis/post.api";
import LoadingAnimation from "../../loading/loading.component";
import SSProfile from "../../ui-component/ss-profile/ss-profile";

const MOCK_SPOTLIGHT_POSTS = [
  {
    _id: "mock21",
    title: "A Letter to My Younger Self",
    content: "If I could go back and tell my younger self one thing, it would be this: your voice matters, even when it shakes.",
    author: { _id: "mock-author-1", name: "Maya Chen", email: "", createdAt: "" },
  },
  {
    _id: "mock22",
    title: "Midnight on Maple Street",
    content: "The streetlights flickered as she walked home, clutching the notebook that held every secret she was too afraid to share.",
    author: { _id: "mock-author-2", name: "James Okonkwo", email: "", createdAt: "" },
  },
  {
    _id: "mock23",
    title: "The Garden We Forgot",
    content: "Behind the old house, wildflowers had taken over what used to be a carefully tended garden ΓÇö and somehow, it was more beautiful.",
    author: { _id: "mock-author-3", name: "Elena Rodriguez", email: "", createdAt: "" },
  },
  {
    _id: "mock24",
    title: "Small Acts of Courage",
    content: "Heroism isn't always loud. Sometimes it's showing up, speaking up, or simply refusing to give up on the people you love.",
    author: { _id: "mock-author-4", name: "Arjun Patel", email: "", createdAt: "" },
  },
  {
    _id: "mock25",
    title: "Echoes in the Attic",
    content: "Every box held a memory ΓÇö faded photographs, handwritten letters, and the faint scent of a summer long gone.",
    author: { _id: "mock-author-5", name: "Sophie Laurent", email: "", createdAt: "" },
  },
  {
    _id: "mock26",
    title: "Where the River Bends",
    content: "They met where the river bends, where the water slows and the world feels like it might pause just long enough to listen.",
    author: { _id: "mock-author-6", name: "Daniel Kim", email: "", createdAt: "" },
  },
] as Post[];

const CommunitySpotlightComponent = () => {
  const { data, isLoading, isError } = useGetLatestListsQuery(undefined);
  const navigate = useNavigate();

  if (isLoading) return <LoadingAnimation />;

  const posts = isError || !data?.posts?.length ? MOCK_SPOTLIGHT_POSTS : data.posts;

  return (
    <section className="story-section">
      <div className="story-page-shell">
        <div className="mb-8 max-w-2xl">
          <h2 className="story-section-heading">Community Spotlight</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {posts.slice(0, 6).map((post: Post) => (
            <button key={post._id} onClick={() => navigate(`/post/${post._id}`)} className="motion-card-subtle story-panel rounded-lg p-5 text-left">
              <div className="mb-3 flex items-center gap-3">
                <SSProfile name={post.author?.name || "Unknown User"} size="h-9 w-9" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{post.author?.name || "Unknown User"}</p>
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-800 dark:text-slate-100">{post.title}</h3>
              <p className="line-clamp-3 text-sm text-slate-600 dark:text-slate-400">{post.content}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunitySpotlightComponent;
