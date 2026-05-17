import { useGetLatestListsQuery } from "../../../redux/apis/post.api";
import { Post } from "../../../models/post";
import LoadingAnimation from "../../loading/loading.component";
import SSProfile from "../../ui-component/ss-profile/ss-profile";
import { formatDateShort } from "../../../utils/time-formate";
import EmptyState from "../../ui-component/empty-state/empty-state.component";
import SectionHeading from "../../ui-component/section-heading/section-heading.component";
import SectionHighlights from "../../ui-component/section-heading/section-highlights.component";
import { Link } from "react-router-dom";

const LATEST_HIGHLIGHTS = [
  {
    icon: "fa-clock",
    title: "Fresh daily",
    text: "New chapters and shorts land here as writers publish.",
  },
  {
    icon: "fa-comments",
    title: "Join the chat",
    text: "Like, comment, and follow authors you enjoy.",
  },
  {
    icon: "fa-pen-nib",
    title: "Your turn",
    text: "Use AI prompts to draft and share your own tale.",
  },
];

const sectionLinkClass =
  "inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:border-indigo-400/40 hover:bg-indigo-500/15 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400";

const LatestPostsComponent = () => {
  const { data, isLoading } = useGetLatestListsQuery(undefined);
  const posts = data?.posts ?? [];
  const hasPosts = posts.length > 0;

  if (isLoading) {
    return <LoadingAnimation variant="skeleton" skeletonCount={3} />;
  }

  return (
    <div>
      <SectionHeading
        title="Latest Posts"
        description="Newest drops from our writing community — updated as stories go live."
        action={
          <Link to="/stories" className={sectionLinkClass}>
            <i className="fas fa-wand-magic-sparkles text-indigo-300" aria-hidden="true" />
            Start writing
          </Link>
        }
      />

      {!hasPosts && (
        <SectionHighlights items={LATEST_HIGHLIGHTS} className="mb-6" />
      )}

      <div className="space-y-6">
        {hasPosts ? (
          posts.map((post: Post) => (
            <article
              key={post._id}
              className="premium-card overflow-hidden rounded-[1.75rem] border-white/10 p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <SSProfile name={post.author.name} size="h-10 w-10" />
                  <div>
                    <p className="text-sm font-medium text-slate-200">
                      {post.author.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDateShort(post.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                  {post.topic.map((topic) => (
                    <span
                      key={topic._id}
                      className={`inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 ${topic.color}`}
                    >
                      {topic.title}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="mb-3 text-2xl font-semibold text-white">
                  {post.title}
                </h3>
                <p className="mb-5 leading-relaxed text-slate-400">
                  {post.content.slice(0, 170)}...
                </p>
                <div className="flex items-center gap-6 text-sm text-slate-300">
                  <span className="flex items-center gap-2">
                    <i className="far fa-heart" aria-hidden="true" />{" "}
                    {post.likesCount}
                  </span>
                  <span className="flex items-center gap-2">
                    <i className="far fa-comment" aria-hidden="true" />{" "}
                    {post.commentsCount}
                  </span>
                </div>
              </div>
            </article>
          ))
        ) : (
          <EmptyState
            title="No posts yet"
            description="Be the first to share a story with the community."
            icon="fa-regular fa-newspaper"
            action={
              <Link to="/stories" className="button-primary rounded-xl px-5 py-2.5">
                Create a story
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
};

export default LatestPostsComponent;
