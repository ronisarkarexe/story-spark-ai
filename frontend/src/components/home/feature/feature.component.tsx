import { Post } from "../../../models/post";
import { useGetFeaturedListsQuery } from "../../../redux/apis/post.api";
import { formatDateShort } from "../../../utils/time-formate";
import LoadingAnimation from "../../loading/loading.component";
import SSProfile from "../../ui-component/ss-profile/ss-profile";
import EmptyState from "../../ui-component/empty-state/empty-state.component";
import SectionHeading from "../../ui-component/section-heading/section-heading.component";
import SectionHighlights from "../../ui-component/section-heading/section-highlights.component";
import { Link } from "react-router-dom";

const FEATURED_HIGHLIGHTS = [
  {
    icon: "fa-star",
    title: "Editor's picks",
    text: "Stories highlighted for craft, originality, and reader love.",
  },
  {
    icon: "fa-fire",
    title: "Trending now",
    text: "Rising tales ranked by engagement across the community.",
  },
  {
    icon: "fa-wand-magic-sparkles",
    title: "AI-crafted",
    text: "Spark-generated fiction with vivid covers and tags.",
  },
];

const sectionLinkClass =
  "inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:border-indigo-400/40 hover:bg-indigo-500/15 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400";

const FeatureComponent = () => {
  const { data, isLoading } = useGetFeaturedListsQuery(undefined);
  const posts = data?.posts ?? [];
  const hasPosts = posts.length > 0;

  if (isLoading) {
    return <LoadingAnimation variant="skeleton" skeletonCount={2} />;
  }

  return (
    <div className="mb-12">
      <SectionHeading
        title="Featured Posts"
        description="Handpicked stories for premium readers — curated weekly from our community."
        action={
          <Link to="/explore" className={sectionLinkClass}>
            <i className="fas fa-compass text-indigo-300" aria-hidden="true" />
            Browse explore
          </Link>
        }
      />

      {!hasPosts && (
        <SectionHighlights items={FEATURED_HIGHLIGHTS} className="mb-6" />
      )}

      <div className="grid gap-8 sm:grid-cols-2">
        {hasPosts ? (
          posts.map((post: Post) => (
            <article
              key={post._id}
              className="premium-card overflow-hidden rounded-[2rem]"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  className="h-full w-full object-cover brightness-90"
                  src={post.imageURL}
                  alt={post.title}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent p-4">
                  <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-200">
                    Featured
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
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
                  <div className="inline-flex items-center gap-3 text-sm text-slate-300">
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
                <h3 className="mb-3 text-2xl font-semibold text-white">
                  {post.title}
                </h3>
                <p className="leading-relaxed text-slate-400">
                  {post.content.slice(0, 100)}...
                </p>
              </div>
            </article>
          ))
        ) : (
          <div className="sm:col-span-2">
            <EmptyState
              title="No featured posts yet"
              description="Check back soon or explore stories from the community."
              icon="fa-regular fa-star"
              action={
                <Link
                  to="/explore"
                  className="button-primary rounded-xl px-5 py-2.5"
                >
                  Explore stories
                </Link>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureComponent;
