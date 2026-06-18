import React, { useState, useEffect } from "react";
import { useGetProfileInfoQuery } from "../../../redux/apis/user.api";
import SSProfile from "../../ui-component/ss-profile/ss-profile";
import { Link, useNavigate } from "react-router-dom";

const FeatureProfileComponent = () => {
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showNoPostsModal, setShowNoPostsModal] = useState(false);

  const navigate = useNavigate();

  const { data, isLoading } = useGetProfileInfoQuery(undefined);

  useEffect(() => {
    const anyModalOpen =
      showFollowers || showFollowing || showNoPostsModal;

    document.body.style.overflow = anyModalOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showFollowers, showFollowing, showNoPostsModal]);

  // ---------------- LOADING STATE ----------------
  if (isLoading) {
    return (
      <div className="p-6 text-gray-400 animate-pulse">
        Loading profile...
      </div>
    );
  }

  // ---------------- EMPTY STATE SAFETY ----------------
  if (!data) {
    return (
      <div className="p-6 text-gray-400">
        Unable to load profile data.
      </div>
    );
  }

  return (
    <section className="bg-blue-500/10 rounded-lg shadow-sm p-6 mb-8">

      {/* PROFILE HEADER */}
      <div className="flex items-center mb-6">
        <SSProfile
          name={data.name}
          imageUrl={data.profile?.avatar}
        />

        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-300">
            {data.name}
          </h3>
          <p className="text-sm text-gray-400">{data.email}</p>
        </div>
      </div>

      {/* STATS */}
      <div className="border-t border-b border-gray-500 py-4 mb-6">
        <div className="grid grid-cols-3 gap-4 text-center">

          {/* POSTS */}
          <button
            type="button"
            aria-label={`View ${data.postsCount ?? 0} posts`}
            className="cursor-pointer hover:text-indigo-400 transition"
            onClick={() => {
              if ((data.postsCount ?? 0) > 0) {
                navigate("/posts");
              } else {
                setShowNoPostsModal(true);
              }
            }}
          >
            <p className="text-2xl font-semibold text-gray-400">
              {data.postsCount ?? 0}
            </p>
            <p className="text-sm text-gray-500">Posts</p>
          </button>

          {/* FOLLOWERS */}
          <button
            type="button"
            aria-label={`View ${data.followers?.length ?? 0} followers`}
            className="cursor-pointer hover:text-indigo-400 transition"
            onClick={() => setShowFollowers(true)}
          >
            <p className="text-2xl font-semibold text-gray-400">
              {data.followers?.length ?? 0}
            </p>
            <p className="text-sm text-gray-500">Followers</p>
          </button>

          {/* FOLLOWING */}
          <button
            type="button"
            aria-label={`View ${data.following?.length ?? 0} accounts you're following`}
            className="cursor-pointer hover:text-indigo-400 transition"
            onClick={() => setShowFollowing(true)}
          >
            <p className="text-2xl font-semibold text-gray-400">
              {data.following?.length ?? 0}
            </p>
            <p className="text-sm text-gray-500">Following</p>
          </button>
        
        </div>
      </div>

      {/* BUTTON */}
      <Link to="/stories">
        <button className="w-full bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition">
          Generate Story <i className="fas fa-magic ml-2"></i>
        </button>
      </Link>

      {/* ================= FOLLOWERS MODAL ================= */}
      {showFollowers && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">

          <div className="bg-white p-6 rounded-2xl w-[380px] shadow-2xl">

            <h2 className="text-xl font-bold mb-5 text-center">
              Followers
            </h2>

            {(data.followers?.length ?? 0) > 0 ? (
              (data.followers as any[]).map((follower) => (
                <Link
                  key={follower._id}
                  to={`/profile/${follower._id}`}
                  onClick={() => setShowFollowers(false)}
                  className="flex items-center justify-between p-3 mb-3 bg-gray-50 rounded-xl hover:shadow-md transition cursor-pointer w-full text-left"
                >
                  <div className="flex items-center gap-3">

                    <img
                      src={follower.profile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(follower.name)}&background=random`}
                      alt={follower.name}
                      className="w-11 h-11 rounded-full object-cover border"
                    />

                    <p className="font-medium text-gray-800">
                      {follower.name}
                    </p>

                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">
                👥 No followers yet
              </div>
            )}

            <button
              onClick={() => setShowFollowers(false)}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg"
            >
              Close
            </button>

          </div>
        </div>
      )}

      {/* ================= FOLLOWING MODAL ================= */}
      {showFollowing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">

          <div className="bg-white p-6 rounded-2xl w-[380px] shadow-2xl">

            <h2 className="text-xl font-bold mb-5 text-center">
              Following
            </h2>

            {(data.following?.length ?? 0) > 0 ? (
              (data.following as any[]).map((user) => (
                <Link
                  key={user._id}
                  to={`/profile/${user._id}`}
                  onClick={() => setShowFollowing(false)}
                  className="flex items-center justify-between p-3 mb-3 bg-gray-50 rounded-xl hover:shadow-md transition cursor-pointer w-full text-left"
                >
                  <div className="flex items-center gap-3">

                    <img
                      src={user.profile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                      alt={user.name}
                      className="w-11 h-11 rounded-full object-cover border"
                    />

                    <p className="font-medium text-gray-800">
                      {user.name}
                    </p>

                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">
                ➕ Not following anyone
              </div>
            )}

            <button
              onClick={() => setShowFollowing(false)}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg"
            >
              Close
            </button>

          </div>
        </div>
      )}

      {/* ================= NO POSTS MODAL ================= */}
      {showNoPostsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">

          <div className="bg-white p-6 rounded-2xl w-[360px] text-center shadow-2xl">

            <h2 className="text-xl font-bold mb-2">No Posts Yet</h2>

            <p className="text-gray-600 mb-6">
              You haven’t created any posts yet.
            </p>

            <button
              onClick={() => {
                setShowNoPostsModal(false);
                navigate("/stories");
              }}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
            >
              Create Post
            </button>

            <button
              onClick={() => setShowNoPostsModal(false)}
              className="w-full mt-2 bg-gray-200 text-gray-800 py-2 rounded-lg"
            >
              Close
            </button>

          </div>
        </div>
      )}

    </section>
  );
};

export default FeatureProfileComponent;
