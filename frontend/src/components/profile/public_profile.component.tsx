import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  useGetUserByIdQuery,
  useToggleFollowMutation,
  useGetFollowStatusQuery,
} from "../../redux/apis/user.api";
import { useGetPostListsQuery } from "../../redux/apis/post.api";
import { getUserInfo, isLoggedIn } from "../../services/auth.service";
import LoadingAnimation from "../loading/loading.component";
import SSProfile from "../ui-component/ss-profile/ss-profile";
import toast, { Toaster } from "react-hot-toast";

const PublicProfileComponent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = getUserInfo();
  const isLogin = isLoggedIn();
  const isOwnProfile = currentUser?.userId === id;

  const { data: user, isLoading: isUserLoading, isError: isUserError } = useGetUserByIdQuery(id || "");
  const { data: postsData, isLoading: isPostsLoading } = useGetPostListsQuery(
    { author: id || "", limit: 12 },
    { skip: !id }
  );

  const { data: followData } = useGetFollowStatusQuery(id || "", {
    skip: !id || !isLogin || isOwnProfile,
  });

  const [toggleFollowMutation, { isLoading: isFollowToggling }] = useToggleFollowMutation();

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const handleFollow = async () => {
    if (!isLogin) {
      toast.error("You need to login to follow this writer");
      return;
    }
    if (!id) return;

    try {
      const res = await toggleFollowMutation(id).unwrap();
      if (res.isFollowing) {
        toast.success(`Followed ${user?.name || "writer"}!`);
      } else {
        toast.success(`Unfollowed ${user?.name || "writer"}.`);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <LoadingAnimation />
      </div>
    );
  }

  if (isUserError || !user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 mb-6 border border-rose-500/20">
          <i className="fas fa-exclamation-triangle text-3xl"></i>
        </div>
        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Writer Not Found</h2>
        <p className="text-slate-500 dark:text-gray-400 max-w-md mb-8 leading-relaxed">
          The writer profile you are looking for does not exist or has been deactivated.
        </p>
        <button
          onClick={() => navigate("/")}
          className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 transition duration-200 shadow-md shadow-indigo-500/20"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const isFollowing = followData?.isFollowing;
  const posts = postsData?.posts || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070c18] py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* PROFILE CARD */}
        <div className="relative rounded-2xl border border-slate-200 bg-white/70 shadow-2xl backdrop-blur-md dark:border-white/[0.06] dark:bg-slate-900/60 overflow-hidden">
          {/* Header Banner Accent */}
          <div className="h-32 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
          
          <div className="px-6 pb-8 sm:px-10 sm:pb-10 relative">
            {/* Avatar & Action Button Row */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 mb-6 gap-4">
              <div className="inline-block relative p-1 bg-white dark:bg-slate-900 rounded-full shadow-lg">
                <SSProfile name={user.name} imageUrl={user.profile?.avatar} size="h-28 w-28" />
              </div>

              <div className="flex gap-3">
                {isOwnProfile ? (
                  <Link
                    to="/dashboard/profile"
                    className="px-5 py-2.5 rounded-xl border border-slate-350 dark:border-slate-700 text-slate-700 dark:text-gray-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition duration-200 flex items-center gap-2"
                  >
                    <i className="fas fa-edit text-xs"></i> Edit Settings
                  </Link>
                ) : (
                  <button
                    onClick={handleFollow}
                    disabled={isFollowToggling}
                    className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition duration-200 shadow-md flex items-center gap-2 cursor-pointer ${
                      isFollowing
                        ? "bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-gray-200 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30"
                        : "bg-indigo-650 hover:bg-indigo-700 text-white shadow-indigo-600/15"
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <i className="fas fa-user-check"></i> Following
                      </>
                    ) : (
                      <>
                        <i className="fas fa-user-plus"></i> Follow
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* User Bio Information */}
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                  {user.name}
                  {user.role === "writer" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 uppercase tracking-wide">
                      Writer
                    </span>
                  )}
                </h1>
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
                  Joined on {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                </p>
              </div>

              {user.profile?.bio ? (
                <p className="text-slate-700 dark:text-gray-300 leading-relaxed text-base max-w-2xl whitespace-pre-line">
                  {user.profile.bio}
                </p>
              ) : (
                <p className="text-slate-400 dark:text-gray-500 italic text-sm">
                  No bio provided yet.
                </p>
              )}

              {/* Social Links */}
              {user.profile?.social && Object.values(user.profile.social).some(Boolean) && (
                <div className="flex flex-wrap gap-3 pt-2">
                  {user.profile.social.github && (
                    <a
                      href={user.profile.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-slate-100 dark:bg-slate-800/60 rounded-xl text-slate-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                      title="GitHub"
                    >
                      <i className="fab fa-github text-lg"></i>
                    </a>
                  )}
                  {user.profile.social.linkedin && (
                    <a
                      href={user.profile.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-slate-100 dark:bg-slate-800/60 rounded-xl text-slate-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition"
                      title="LinkedIn"
                    >
                      <i className="fab fa-linkedin text-lg"></i>
                    </a>
                  )}
                  {user.profile.social.twitter && (
                    <a
                      href={user.profile.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-slate-100 dark:bg-slate-800/60 rounded-xl text-slate-700 dark:text-gray-300 hover:text-blue-400 dark:hover:text-blue-300 transition"
                      title="Twitter"
                    >
                      <i className="fab fa-twitter text-lg"></i>
                    </a>
                  )}
                  {user.profile.social.facebook && (
                    <a
                      href={user.profile.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-slate-100 dark:bg-slate-800/60 rounded-xl text-slate-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                      title="Facebook"
                    >
                      <i className="fab fa-facebook text-lg"></i>
                    </a>
                  )}
                  {user.profile.social.instagram && (
                    <a
                      href={user.profile.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-slate-100 dark:bg-slate-800/60 rounded-xl text-slate-700 dark:text-gray-300 hover:text-pink-650 dark:hover:text-pink-400 transition"
                      title="Instagram"
                    >
                      <i className="fab fa-instagram text-lg"></i>
                    </a>
                  )}
                  {user.profile.social.discord && (
                    <a
                      href={user.profile.social.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-slate-100 dark:bg-slate-800/60 rounded-xl text-slate-700 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition"
                      title="Discord"
                    >
                      <i className="fab fa-discord text-lg"></i>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Stats Counter Section */}
            <div className="grid grid-cols-3 gap-4 border-t border-slate-200 dark:border-white/[0.06] mt-8 pt-6 text-center">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {posts.length}
                </p>
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
                  Published Stories
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowFollowers(true)}
                className="hover:text-indigo-500 dark:hover:text-indigo-400 transition cursor-pointer"
              >
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {user.followers?.length ?? 0}
                </p>
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
                  Followers
                </p>
              </button>

              <button
                type="button"
                onClick={() => setShowFollowing(true)}
                className="hover:text-indigo-500 dark:hover:text-indigo-400 transition cursor-pointer"
              >
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {user.following?.length ?? 0}
                </p>
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
                  Following
                </p>
              </button>
            </div>

          </div>
        </div>

        {/* STORIES SECTION */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <i className="fas fa-book-open text-indigo-500"></i> Stories Published
          </h2>

          {isPostsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 animate-pulse">
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-full" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-5/6" />
                  </div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/4 pt-4" />
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800/80 rounded-2xl p-6 shadow-md transition duration-200 hover:shadow-xl flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
                        {post.tag}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white hover:text-indigo-500 dark:hover:text-indigo-400 transition line-clamp-1">
                      <Link to={`/post/${post._id}`}>{post.title}</Link>
                    </h3>

                    <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
                      {post.content || "No preview available."}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex gap-4">
                      <span><i className="fas fa-heart text-red-500/70 mr-1.5" />{post.likesCount || 0}</span>
                      <span><i className="fas fa-eye text-blue-500/70 mr-1.5" />{post.viewsCount || 0}</span>
                    </div>

                    <Link
                      to={`/post/${post._id}`}
                      className="text-indigo-650 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-bold transition flex items-center gap-1"
                    >
                      Read Story <i className="fas fa-arrow-right text-[10px]" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-350 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10 p-12 text-center text-slate-450 dark:text-slate-500">
              <i className="fas fa-book-open text-4xl mb-4 text-slate-350 dark:text-slate-700 block" />
              <p className="font-semibold text-lg">No Stories Published</p>
              <p className="text-sm mt-1">This writer hasn't published any stories yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* ================= FOLLOWERS MODAL ================= */}
      {showFollowers && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl w-full max-w-sm shadow-2xl max-h-[80vh] flex flex-col">
            <h2 className="text-xl font-bold mb-5 text-slate-900 dark:text-white flex items-center gap-2 border-b dark:border-slate-800 pb-3">
              <i className="fas fa-users text-indigo-500"></i> Followers
            </h2>

            <div className="flex-1 overflow-y-auto space-y-3">
              {(user.followers?.length ?? 0) > 0 ? (
                (user.followers as any[]).map((follower) => (
                  <Link
                    key={follower._id}
                    to={`/profile/${follower._id}`}
                    onClick={() => setShowFollowers(false)}
                    className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border dark:border-slate-800/50 transition duration-150"
                  >
                    <SSProfile name={follower.name} imageUrl={follower.profile?.avatar} size="h-10 w-10" />
                    <p className="font-semibold text-slate-800 dark:text-gray-250 text-sm">
                      {follower.name}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="text-center py-10 text-slate-450 dark:text-slate-600">
                  👥 No followers yet
                </div>
              )}
            </div>

            <button
              onClick={() => setShowFollowers(false)}
              className="mt-6 w-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 py-2.5 rounded-xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ================= FOLLOWING MODAL ================= */}
      {showFollowing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl w-full max-w-sm shadow-2xl max-h-[80vh] flex flex-col">
            <h2 className="text-xl font-bold mb-5 text-slate-900 dark:text-white flex items-center gap-2 border-b dark:border-slate-800 pb-3">
              <i className="fas fa-user-plus text-indigo-500"></i> Following
            </h2>

            <div className="flex-1 overflow-y-auto space-y-3">
              {(user.following?.length ?? 0) > 0 ? (
                (user.following as any[]).map((followedUser) => (
                  <Link
                    key={followedUser._id}
                    to={`/profile/${followedUser._id}`}
                    onClick={() => setShowFollowing(false)}
                    className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border dark:border-slate-800/50 transition duration-150"
                  >
                    <SSProfile name={followedUser.name} imageUrl={followedUser.profile?.avatar} size="h-10 w-10" />
                    <p className="font-semibold text-slate-800 dark:text-gray-250 text-sm">
                      {followedUser.name}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="text-center py-10 text-slate-450 dark:text-slate-600">
                  ➕ Not following anyone
                </div>
              )}
            </div>

            <button
              onClick={() => setShowFollowing(false)}
              className="mt-6 w-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 py-2.5 rounded-xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default PublicProfileComponent;
