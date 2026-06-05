import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
      <section className="w-full max-w-full overflow-hidden bg-blue-500/10 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-300 mb-4">
          Recommended Writers
        </h3>

        <div className="space-y-4">
          {recommendedWriters.map((writer, index) => (
            <div key={writer.id} className="flex min-w-0 items-center justify-between gap-3">
              <div className="flex min-w-0 items-center">
                <img
                  className="h-10 w-10 shrink-0 rounded-full"
                  src={writer.image}
                  alt={writer.name}
                />

                <div className="ml-3 min-w-0">
                  <p className="truncate text-sm font-medium text-slate-700 dark:text-gray-400">
                    {writer.name}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-gray-500">
                    {writer.role}
                  </p>
                </div>
                <button 
                  disabled={isLoading} 
                  onClick={() => toggleFollow(writer.id)} 
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-150 active:scale-[0.97] disabled:opacity-50 select-none cursor-pointer uppercase tracking-wider ${
                    isFollowing
                      ? "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-sm shadow-blue-500/10"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </div>

              <button
                onClick={() => toggleFollow(index, writer.id)}
                disabled={isLoading}
                aria-label={following.includes(index) ? `Unfollow ${writer.name}` : `Follow ${writer.name}`}
                className="!rounded-button text-indigo-600 text-sm font-medium hover:text-indigo-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {following.includes(index) ? "Following" : "Follow"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 30, stiffness: 200, mass: 0.8 }}
              className="bg-[#0f172a] border border-white/10 rounded-2xl shadow-[0_0_15px_rgba(59,130,246,0.5)] max-w-md w-full p-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-user-lock text-2xl text-blue-400"></i>
                </div>

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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RecommendedWritersComponent;