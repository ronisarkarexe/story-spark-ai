import { Post } from "../../../models/post";
import { useGetFeaturedListsQuery } from "../../../redux/apis/post.api";
import { formatDateShort } from "../../../utils/time-formate";
import LoadingAnimation from "../../loading/loading.component";
import SSProfile from "../../ui-component/ss-profile/ss-profile";
import { useNavigate } from "react-router-dom";
import BookmarkButton from "../../BookmarkButton";

import { FaLinkedin, FaEnvelope } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const dummyFeaturedPosts: any[] = [
  {
    _id: "dummy-feat-1",
    title: "The Clockwork Citadel of Aetheria",
    content: "Deep within the rolling stormclouds of the Aetherian sky lies a monument of lost science: a floating city governed by brass gears and steam-powered mechanisms. The chronometer at its heart has ticked, undisturbed, for four hundred years, keeping the cosmic rhythm.",
    imageURL: "/mystical_castle.png",
    author: { name: "Master Elian Thistle" },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    likesCount: 342,
    commentsCount: 89,
    bookmarks: [],
  },
  {
    _id: "dummy-feat-2",
    title: "The Alchemist's Lost Ledger",
    content: "Hidden behind a false brick in the ruined laboratory of the Grand Alchemist was a leather-bound book containing recipes not for gold, but for memory. Its yellowed parchment pages, stained with elderberry ink and candle wax, hold the secrets to forgotten times.",
    imageURL: "/alchemist_scroll.png",
    author: { name: "Isadora Vance" },
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    likesCount: 284,
    commentsCount: 56,
    bookmarks: [],
  }
];

const FeatureComponent = () => {
  const { data, isLoading, isError } = useGetFeaturedListsQuery(undefined);
  const navigate = useNavigate();

  // Dynamic reading calculation logic
  const calculateReadingTime = (content: string): number => {
    if (!content) return 1;

    const words = content.trim().split(/\s+/).length;

    return Math.max(1, Math.ceil(words / 200));
  };

  if (isLoading) {
    return <LoadingAnimation />;
  }


  const postsToRender = data?.posts && data.posts.length > 0 ? data.posts : dummyFeaturedPosts;
=======
  if (isError) {
    return (
      <div className="mb-12 text-slate-900 dark:text-slate-100">
        <h2 className="text-2xl font-bold mb-6">Featured Posts</h2>
        <div className="rounded-lg border border-red-200 dark:border-red-900/70 bg-red-50 dark:bg-red-900/20 px-4 py-5 text-red-700 dark:text-red-400">
          Failed to load featured posts. Please try again later.
        </div>
      </div>
    );
  }


  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold font-[Playfair_Display] text-[#2c1810] dark:text-[#f5ead6] mb-6 border-b border-[#d4b896]/30 pb-2">
        Featured Posts
      </h2>

      <div className="grid gap-8 sm:grid-cols-2">
        {postsToRender.map((post: any) => {
          const postUrl = `${window.location.origin}/post/${post._id}`;

          return (
            <div
              key={post._id}
              onClick={() => {
                if (post._id.startsWith("dummy")) {
                  // For dummy posts, we can navigate to stories page to inspire writing
                  navigate("/stories");
                } else {
                  navigate(`/post/${post._id}`);
                }
              }}
              className="motion-card h-full overflow-hidden cursor-pointer flex flex-col group"
            >
              <div className="relative overflow-hidden h-52 border-b border-[#d4b896]/30">
                <img
                  className="motion-image h-full w-full object-cover filter sepia-[15%] group-hover:sepia-0 transition-all duration-500 group-hover:scale-105"
                  src={post.imageURL}
                  alt={post.title || "Featured Post"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2c1810]/40 to-transparent opacity-60"></div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <SSProfile
                        name={post.author?.name || "Unknown User"}
                        size="h-8 w-8"
                      />

                      <div className="ml-3">
                        <p className="text-sm font-semibold font-[Cormorant_Garamond] text-[#2c1810] dark:text-[#f5ead6]">
                          {post.author?.name || "Unknown User"}
                        </p>

                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-xs font-[EB_Garamond] text-[#5c3d2e]/80 dark:text-[#d4b896]/80">
                            {formatDateShort(post.createdAt)}
                          </p>

                          <span className="text-[#d4b896] dark:text-[#5c3d2e] text-xs">
                            •
                          </span>

                          <p className="text-xs font-[Cormorant_Garamond] font-bold text-[#8b1a1a] dark:text-[#c9a227]">
                            ⏱️ {calculateReadingTime(post.content)} min read
                          </p>
                        </div>
                      </div>
                    </div>

                    {!post._id.startsWith("dummy") && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative z-10"
                      >
                        <BookmarkButton
                          storyId={post._id}
                          bookmarks={post.bookmarks}
                          className="p-1.5 rounded-full hover:bg-[#2c1810]/10 dark:hover:bg-[#f5ead6]/10 text-[#5c3d2e] dark:text-[#d4b896] hover:text-[#8b1a1a] dark:hover:text-[#c9a227] transition-colors"
                        />
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold font-[Playfair_Display] text-[#2c1810] dark:text-[#f5ead6] mb-2 leading-tight group-hover:text-[#8b1a1a] dark:group-hover:text-[#c9a227] transition-colors">
                    {post.title}
                  </h3>

                  <p className="font-[EB_Garamond] text-[#5c3d2e] dark:text-[#d4b896] mb-4 line-clamp-3 leading-relaxed text-[15px]">
                    {post.content || ""}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-[#d4b896]/20 dark:border-[#5c3d2e]/30 pt-4 text-sm text-[#5c3d2e]/80 dark:text-[#d4b896]/80 mt-auto">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center text-xs font-[Cormorant_Garamond] font-semibold">
                      <i className="far fa-heart mr-1.5 text-[#8b1a1a] dark:text-[#c9a227]"></i>
                      {post.likesCount ?? 0}
                    </span>

                    <span className="flex items-center text-xs font-[Cormorant_Garamond] font-semibold">
                      <i className="far fa-comment mr-1.5 text-[#5c3d2e] dark:text-[#d4b896]"></i>
                      {post.commentsCount ?? 0}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-[#5c3d2e]/70 dark:text-[#d4b896]/70">
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                        postUrl
                      )}&text=${encodeURIComponent(post.title || "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Share on X"
                      className="motion-icon hover:text-[#8b1a1a] dark:hover:text-[#c9a227] hover:-translate-y-0.5 transition-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FaXTwitter size={14} />
                    </a>

                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                        postUrl
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Share on LinkedIn"
                      className="motion-icon hover:text-[#8b1a1a] dark:hover:text-[#c9a227] hover:-translate-y-0.5 transition-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FaLinkedin size={14} />
                    </a>

                    <a
                      href={`mailto:?subject=${encodeURIComponent(
                        post.title || ""
                      )}&body=${encodeURIComponent(
                        `${(post.content || "").slice(
                          0,
                          120
                        )}...\n\nRead more: ${postUrl}`
                      )}`}
                      title="Share via Email"
                      className="motion-icon hover:text-[#8b1a1a] dark:hover:text-[#c9a227] hover:-translate-y-0.5 transition-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FaEnvelope size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureComponent;