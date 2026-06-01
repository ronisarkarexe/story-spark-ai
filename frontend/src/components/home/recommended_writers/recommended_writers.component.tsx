import { useState } from "react";
import { Link } from "react-router-dom";

import { isLoggedIn } from "../../../services/auth.service";
import { useToggleFollowMutation } from "../../../redux/apis/user.api";
import ImageFallback from "../../ImageFallback";

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
      setFollowing((prev) =>
        prev.includes(index) ? prev.filter((id) => id !== index) : [...prev, index]
      );
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    }
  };

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/5 dark:bg-slate-900/40 dark:shadow-none">
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
          Recommended Writers
        </h3>

        <div className="space-y-4">
          {recommendedWriters.map((writer, index) => (
            <div key={writer.id} className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <ImageFallback
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                  src={writer.image}
                  alt={writer.name}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                    {writer.name}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {writer.role}
                  </p>
                </div>
              </div>

              <button
                disabled={isLoading}
                onClick={() => toggleFollow(index, writer.id)}
                className="motion-cta shrink-0 rounded-full bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
                type="button"
              >
                {following.includes(index) ? "Following" : "Follow"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0f172a] p-6 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20">
                <i className="fas fa-user-lock text-2xl text-blue-400"></i>
              </div>

              <h3 className="mb-2 text-2xl font-bold text-gray-200">
                Authentication Required
              </h3>

              <p className="mb-6 leading-relaxed text-gray-400">
                You need to log in or sign up to follow writers.
              </p>

              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:from-blue-600 hover:to-indigo-700 hover:shadow-indigo-500/25"
                >
                  Log In
                </Link>

                <Link
                  to="/signup"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-medium text-white transition-all hover:bg-white/10"
                >
                  Sign Up
                </Link>

                <button
                  onClick={() => setShowLoginModal(false)}
                  className="mt-1 w-full rounded-xl bg-transparent px-4 py-3 font-medium text-gray-400 transition-all hover:bg-white/5 hover:text-gray-300"
                  type="button"
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

