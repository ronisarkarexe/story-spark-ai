import React, { useState } from "react";
import { Link } from "react-router-dom";
import { isLoggedIn } from "../../../services/auth.service";
import { useToggleFollowMutation } from "../../../redux/apis/user.api";

const RecommendedWritersComponent = () => {
  const recommendedWriters = [
    {
      id: "roni-sarkar-id",
      name: "Roni Sarkar",
      role: "AI Writer",
      image: "https://avatars.githubusercontent.com/u/76697055?v=4",
    },
    {
      id: "sarah-lee-id",
      name: "Sarah Lee",
      role: "Content Creator",
      image: "https://i.pravatar.cc/150?img=5",
    },
    {
      id: "john-doe-id",
      name: "John Doe",
      role: "Story Writer",
      image: "https://i.pravatar.cc/150?img=8",
    },
  ];

  const [following, setFollowing] = useState<number[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [toggleFollowMutation, { isLoading }] = useToggleFollowMutation();

  const toggleFollow = async (index: number, authorId: string) => {
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }

    try {
      await toggleFollowMutation(authorId).unwrap();

      if (following.includes(index)) {
        setFollowing(following.filter((id) => id !== index));
      } else {
        setFollowing([...following, index]);
      }
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    }
  };

  return (
    <>
      <section className="parchment-card p-6">
        <h3 className="text-lg font-bold font-[Playfair_Display] text-[#2c1810] dark:text-[#f5ead6] mb-4 border-b border-[#d4b896]/20 pb-2">
          Recommended Writers
        </h3>

        <div className="space-y-4">
          {recommendedWriters.map((writer, index) => (
            <div key={writer.id} className="flex items-center justify-between">
              <div className="flex items-center">

                <img className="h-10 w-10 rounded-full border border-[#d4b896] filter sepia-[10%]" src={writer.image} alt={writer.name} />

                <div className="ml-3">
                  <p className="text-sm font-semibold font-[Playfair_Display] text-[#2c1810] dark:text-[#f5ead6]">{writer.name}</p>
                  <p className="text-xs font-[EB_Garamond] text-[#5c3d2e] dark:text-[#d4b896]">{writer.role}</p>
=======
                <img
                  className="h-10 w-10 rounded-full"
                  src={writer.image}
                  alt={writer.name}
                />

                <div className="ml-3">
                  <p className="text-sm font-medium text-slate-700 dark:text-gray-400">
                    {writer.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-gray-500">
                    {writer.role}
                  </p>

                </div>
              </div>

              <button

                onClick={() => toggleFollow(index)}
                className="!rounded-button text-[#8b1a1a] hover:text-[#a01f1f] dark:text-[#c9a227] dark:hover:text-[#e8d5b0] font-[Cormorant_Garamond] text-xs font-bold uppercase tracking-wider cursor-pointer transition-all hover:scale-105"
              >
                {following.includes(index) ? "✓ Following" : "Follow"}
=======
                onClick={() => toggleFollow(index, writer.id)}
                disabled={isLoading}
                className="!rounded-button text-indigo-600 text-sm font-medium hover:text-indigo-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {following.includes(index) ? "Following" : "Follow"}

              </button>
            </div>
          ))}
        </div>
      </section>

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#fdf8f0] dark:bg-[#2c1810] border-2 border-[#d4b896] dark:border-[#5c3d2e] rounded-lg shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#8b1a1a]/10 dark:bg-[#c9a227]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-user-lock text-2xl text-[#8b1a1a] dark:text-[#c9a227]"></i>
              </div>

              <h3 className="text-2xl font-bold font-[Playfair_Display] text-[#2c1810] dark:text-[#f5ead6] mb-2">Authentication Required</h3>
              <p className="font-[EB_Garamond] text-[#5c3d2e] dark:text-[#d4b896] mb-6 leading-relaxed">You need to log in or sign up to follow writers.</p>
              <div className="flex flex-col gap-3">
                <Link to="/login" className="parchment-btn-primary w-full text-center block">
                  Log In
                </Link>
                <Link to="/signup" className="parchment-btn w-full text-center block">
                  Sign Up
                </Link>
                <button onClick={() => setShowLoginModal(false)} className="text-xs font-[Cormorant_Garamond] font-bold text-[#5c3d2e] dark:text-[#d4b896] hover:text-[#8b1a1a] dark:hover:text-[#c9a227] uppercase tracking-wider cursor-pointer py-2 transition-all">
=======

              <h3 className="text-2xl font-bold text-gray-200 mb-2">
                Authentication Required
              </h3>

              <p className="text-gray-400 mb-6 leading-relaxed">
                You need to log in or sign up to follow writers.
              </p>

              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25"
                >
                  Log In
                </Link>

                <Link
                  to="/signup"
                  className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-3 px-4 rounded-xl transition-all border border-white/10"
                >
                  Sign Up
                </Link>

                <button
                  onClick={() => setShowLoginModal(false)}
                  className="w-full bg-transparent hover:bg-white/5 text-gray-400 hover:text-gray-300 font-medium py-3 px-4 rounded-xl transition-all mt-1"
                >

                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecommendedWritersComponent;