import { Post } from "../../../models/post";
import { useGetFeaturedListsQuery } from "../../../redux/apis/post.api";
import LoadingAnimation from "../../loading/loading.component";
import { useNavigate } from "react-router-dom";

const MOCK_FEATURED_POSTS = [
  {
    _id: "mock1",
    title: "The Future of AI in Creative Writing",
    content: "Discover how artificial intelligence is transforming the way we brainstorm, draft, and edit our stories. Explore the latest tools and techniques to enhance your creative process.",
  },
  {
    _id: "mock2",
    title: "Mastering World-Building: A Guide for Fantasy Writers",
    content: "Dive deep into the essential elements of creating believable and immersive fantasy worlds. From magic systems to political structures, learn how to craft a setting that captivates your readers.",
  },
] as Post[];

const FeatureComponent = () => {
  const { data, isLoading, isError } = useGetFeaturedListsQuery(undefined);
  const navigate = useNavigate();
  if (isLoading) return <LoadingAnimation />;

  const posts = isError || !data?.posts?.length ? MOCK_FEATURED_POSTS : data.posts;

  return (
    <section className="mb-12">
      <h2 className="mb-6 text-2xl font-bold text-slate-800 dark:text-slate-100">Featured Posts</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:gap-6">
        {posts.map((post: Post) => (
          <button key={post._id} onClick={() => navigate(`/post/${post._id}`)} className="motion-card story-panel rounded-lg p-5 text-left">
            <h3 className="mb-2 text-xl font-bold text-slate-800 dark:text-slate-100">{post.title}</h3>
            <p className="line-clamp-2 text-slate-600 dark:text-slate-400">{post.content || ""}</p>
          </button>
        ))}
      </div>
    </section>
  );
};

export default FeatureComponent;
