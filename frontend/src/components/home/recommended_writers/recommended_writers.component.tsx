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

  const [following, setFollowing] = useState<string[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [toggleFollowMutation, { isLoading }] = useToggleFollowMutation();

  const toggleFollow = async (authorId: string) => {
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }

    try {
      await toggleFollowMutation(authorId).unwrap();
      if (following.includes(authorId)) {
        setFollowing(following.filter((id) => id !== authorId));
      } else {
        setFollowing([...following, authorId]);
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
          {recommendedWriters.map((writer) => (
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
              </div>

              <button
                onClick={() => toggleFollow(writer.id)}
                disabled={isLoading}
                aria-label={following.includes(writer.id) ? `Unfollow ${writer.name}` : `Follow ${writer.name}`}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-150 active:scale-[0.97] disabled:opacity-50 select-none cursor-pointer uppercase tracking-wider ${
                  following.includes(writer.id)
                    ? "bg-slate-200 text-slate-700"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                }`}
              >
                {following.includes(writer.id) ? "Following" : "Follow"}
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
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0f172a] border border-white/10 rounded-2xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-bold text-gray-200 mb-2">Authentication Required</h3>
              <p className="text-gray-400 mb-6">You need to log in to follow writers.</p>
              <div className="flex flex-col gap-3">
                <Link to="/login" className="w-full bg-blue-600 text-white py-3 rounded-xl text-center font-semibold">Log In</Link>
                <button onClick={() => setShowLoginModal(false)} className="text-gray-400 py-2">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RecommendedWritersComponent;