import { useGetLatestListsQuery } from "../../../redux/apis/post.api";
import { Post } from "../../../models/post";
import LoadingAnimation from "../../loading/loading.component";
import SSProfile from "../../ui-component/ss-profile/ss-profile";
import { formatDateShort } from "../../../utils/time-formate";
import { useNavigate } from "react-router-dom";
import BookmarkButton from "../../BookmarkButton";

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
=======
  return (
    <div className="w-full text-slate-900 dark:text-slate-100">
      {/* Section Heading */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Latest Posts
        </h2>

        <div className="h-[2px] flex-1 ml-6 bg-gradient-to-r from-blue-500/60 to-transparent rounded-full"></div>
      </div>

      {/* Posts Container */}
      <div className="flex flex-col gap-8 w-full">
        {data?.posts?.length ?? 0 > 0 ? (
          data?.posts?.map((post: Post) => (
            <div
              key={post._id}
              onClick={() => navigate(`/post/${post._id}`)}
              className="
                w-full
                motion-card-subtle
                bg-white/70
                dark:bg-slate-900/60
                backdrop-blur-xl
                rounded-3xl
                shadow-md
                border
                border-slate-200
                dark:border-slate-700/40
                p-7
                cursor-pointer
                transition-all
                duration-300
                hover:shadow-2xl
                hover:-translate-y-1
                hover:border-blue-400/40
                group
              "
            >
              {/* Top Section */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-center min-w-0">
                  <SSProfile
                    name={post.author?.name || "Unknown User"}
                    size="h-10 w-10"
                  />

                  <div className="ml-4 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 dark:text-gray-300 truncate">
                      {post.author?.name || "Unknown User"}
                    </p>

                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <p className="text-xs text-slate-500 dark:text-gray-500">
                        {formatDateShort(post.createdAt)}
                      </p>

                      <span className="text-slate-400 text-xs">•</span>

                      <p className="text-xs text-purple-500 font-medium flex items-center gap-1">
                        ⏱️ {calculateReadingTime(post.content)} min read
                      </p>
                    </div>

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
=======
                {/* Bookmark */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="relative z-10 flex-shrink-0"
                >
                  <BookmarkButton
                    storyId={post._id}
                    bookmarks={post.bookmarks}
                    className="
                      p-2
                      rounded-full
                      hover:bg-slate-200
                      dark:hover:bg-slate-700/50
                      text-slate-400
                      hover:text-purple-500
                      transition-all
                    "

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
=======

              {/* Title */}
              <h3
                className="
                  text-2xl
                  font-bold
                  text-slate-900
                  dark:text-gray-200
                  mb-3
                  group-hover:text-blue-500
                  transition-colors
                  line-clamp-2
                "
              >
                {post.title}
              </h3>

              {/* Content */}
              <p
                className="
                  text-slate-600
                  dark:text-gray-400
                  text-[15px]
                  leading-7
                  mb-6
                  line-clamp-3
                "
              >
                {post.content}
              </p>

              {/* Bottom Section */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                {/* Likes + Comments */}
                <div className="flex items-center text-sm text-slate-500 dark:text-gray-400 flex-wrap gap-4">
                  <span className="flex items-center">
                    <i className="far fa-heart mr-2"></i>
                    {post.likesCount}
                  </span>

                  <span className="flex items-center">
                    <i className="far fa-comment mr-2"></i>
                    {post.commentsCount}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {post.topic.map((topic) => (
                    <span
                      key={topic._id}
                      className={`
                        inline-flex
                        items-center
                        px-4
                        py-1
                        rounded-full
                        text-xs
                        font-semibold
                        shadow-sm
                        ${topic.color}
                      `}
                    >
                      #{topic.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div
            className="
              rounded-2xl
              border
              border-slate-200
              dark:border-slate-700/70
              bg-slate-100
              dark:bg-slate-900/40
              px-6
              py-6
              text-slate-700
              dark:text-slate-300
              text-center
            "
          >
            Post is not available!

          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestPostsComponent;