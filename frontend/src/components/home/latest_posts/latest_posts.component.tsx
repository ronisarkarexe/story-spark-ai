import { useGetLatestListsQuery } from "../../../redux/apis/post.api";
import { Post } from "../../../models/post";
import LoadingAnimation from "../../loading/loading.component";
import SSProfile from "../../ui-component/ss-profile/ss-profile";
import { formatDateShort } from "../../../utils/time-formate";
import { useNavigate } from "react-router-dom";
import BookmarkButton from "../../BookmarkButton"; // Import the core bookmark module securely

const dummyLatestPosts: any[] = [
  {
    _id: "dummy-lat-1",
    title: "The Charting of Legend Reef",
    content: "Navigators have long whispered of a place where the stars change alignment and old compasses spin wild. Using a brass astrolabe and a map recovered from a shipwrecked vessel, we set sail into the Great Unknown to chart the coordinates of the legendary Sea Serpent's Deep.",
    author: { name: "Capt. Gideon Vance" },
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    likesCount: 124,
    commentsCount: 28,
    bookmarks: [],
    topic: [
      { _id: "topic-1", title: "#Cartography" },
      { _id: "topic-2", title: "#Adventure" }
    ]
  },
  {
    _id: "dummy-lat-2",
    title: "Whispers of the Great Library",
    content: "There is a silent scriptorium where scribes copy books that haven't been written yet. The smell of cedarwood, crushed pigment, and dried vellum hangs heavy in the air. A single candle flickers as we search for the forgotten folio of the first star-gazers.",
    author: { name: "Brother Austin" },
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    likesCount: 95,
    commentsCount: 19,
    bookmarks: [],
    topic: [
      { _id: "topic-3", title: "#Lore" },
      { _id: "topic-4", title: "#Mystery" }
    ]
  },
  {
    _id: "dummy-lat-3",
    title: "The Ironwood Dryad's Heart",
    content: "Deep within the heart of the Whispering Woods, the ancient trees do not grow from organic seed, but from cold iron and tightly wound clockwork springs. They breathe the brass-scented steam of the core engine nestled deep beneath the rich forest loam.",
    author: { name: "Sylvia Greenwood" },
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    likesCount: 167,
    commentsCount: 43,
    bookmarks: [],
    topic: [
      { _id: "topic-5", title: "#Fantasy" },
      { _id: "topic-6", title: "#Steampunk" }
    ]
  }
];

const LatestPostsComponent = () => {
  const { data, isLoading } = useGetLatestListsQuery(undefined);
  const navigate = useNavigate();

  // Dynamic reading time calculation matching your exact feature request specs
  const calculateReadingTime = (content: string): number => {
    if (!content) return 1;
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  if (isLoading) {
    return <LoadingAnimation />;
  }

  const postsToRender = data?.posts && data.posts.length > 0 ? data.posts : dummyLatestPosts;

  return (
    <div className="text-slate-900 dark:text-slate-100">
      <h2 className="text-3xl font-bold font-[Playfair_Display] text-[#2c1810] dark:text-[#f5ead6] mb-6 border-b border-[#d4b896]/30 pb-2">
        Latest Posts
      </h2>
      <div className="space-y-6">
        {postsToRender.map((post: any) => (
          <div
            key={post._id}
            onClick={() => {
              if (post._id.startsWith("dummy")) {
                navigate("/stories");
              } else {
                navigate(`/post/${post._id}`);
              }
            }}
            className="motion-card-subtle parchment-card p-6 cursor-pointer relative group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <SSProfile name={post.author?.name || 'Unknown User'} size="h-8 w-8" />
                <div className="ml-4">
                  <p className="text-sm font-semibold font-[Cormorant_Garamond] text-[#2c1810] dark:text-[#f5ead6]">
                    {post.author?.name || 'Unknown User'}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs font-[EB_Garamond] text-[#5c3d2e]/80 dark:text-[#d4b896]/80">
                      {formatDateShort(post.createdAt)}
                    </p>
                    <span className="text-[#d4b896] dark:text-[#5c3d2e] text-xs">•</span>
                    {/* ⏱️ Dynamic Reading Time Element Addition */}
                    <p className="text-xs font-[Cormorant_Garamond] font-bold text-[#8b1a1a] dark:text-[#c9a227] flex items-center gap-1">
                      ⏱️ {calculateReadingTime(post.content)} min read
                    </p>
                  </div>
                </div>
              </div>

              {/* 🔖 Interactive Bookmark Button Component Injection */}
              {!post._id.startsWith("dummy") && (
                <div onClick={(e) => e.stopPropagation()} className="relative z-10">
                  <BookmarkButton
                    storyId={post._id}
                    bookmarks={post.bookmarks}
                    className="p-1.5 rounded-full hover:bg-[#2c1810]/10 dark:hover:bg-[#f5ead6]/10 text-[#5c3d2e] dark:text-[#d4b896] hover:text-[#8b1a1a] dark:hover:text-[#c9a227] transition-colors"
                  />
                </div>
              )}
            </div>
            
            <h3 className="text-xl font-bold font-[Playfair_Display] text-[#2c1810] dark:text-[#f5ead6] mb-2 group-hover:text-[#8b1a1a] dark:group-hover:text-[#c9a227] transition-colors leading-tight">
              {post.title}
            </h3>
            
            <p className="font-[EB_Garamond] text-[#5c3d2e] dark:text-[#d4b896] mb-4 line-clamp-2 leading-relaxed text-[15px]">
              {post.content}
            </p>
            
            <div className="flex items-center justify-between border-t border-[#d4b896]/20 dark:border-[#5c3d2e]/30 pt-4 mt-2">
              <div className="flex items-center text-sm">
                <span className="flex items-center mr-4 text-xs font-[Cormorant_Garamond] font-semibold text-[#5c3d2e] dark:text-[#d4b896]">
                  <i className="far fa-heart mr-1.5 text-[#8b1a1a] dark:text-[#c9a227]"></i> {post.likesCount}
                </span>
                <span className="flex items-center text-xs font-[Cormorant_Garamond] font-semibold text-[#5c3d2e] dark:text-[#d4b896]">
                  <i className="far fa-comment mr-1.5 text-[#5c3d2e] dark:text-[#d4b896]"></i> {post.commentsCount}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {post.topic && post.topic.map((topic: any) => (
                  <span
                    key={topic._id}
                    className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-[Cormorant_Garamond] font-bold border border-[#d4b896] dark:border-[#5c3d2e] bg-[#fdf8f0] text-[#8b1a1a] dark:bg-[#3d2314] dark:text-[#c9a227] shadow-sm"
                  >
                    {topic.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestPostsComponent;
