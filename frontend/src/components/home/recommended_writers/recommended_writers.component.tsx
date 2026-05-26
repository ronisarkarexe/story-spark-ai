import React, { useState } from "react";
import { Link } from "react-router-dom";
import { isLoggedIn } from "../../../services/auth.service";

const RecommendedWritersComponent = () => {
  const recommendedWriters = [
    {
      name: "Roni Sarkar",
      role: "AI Writer",
      image: "https://avatars.githubusercontent.com/u/76697055?v=4",
    },
    {
      name: "Sarah Lee",
      role: "Content Creator",
      image: "https://i.pravatar.cc/150?img=5",
    },
    {
      name: "John Doe",
      role: "Story Writer",
      image: "https://i.pravatar.cc/150?img=8",
    },
  ];

  const [following, setFollowing] = useState<number[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const toggleFollow = (index: number) => {
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }

    if (following.includes(index)) {
      setFollowing(following.filter((id) => id !== index));
    } else {
      setFollowing([...following, index]);
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
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <img className="h-10 w-10 rounded-full border border-[#d4b896] filter sepia-[10%]" src={writer.image} alt={writer.name} />

                <div className="ml-3">
                  <p className="text-sm font-semibold font-[Playfair_Display] text-[#2c1810] dark:text-[#f5ead6]">{writer.name}</p>
                  <p className="text-xs font-[EB_Garamond] text-[#5c3d2e] dark:text-[#d4b896]">{writer.role}</p>
                </div>
              </div>

              <button
                onClick={() => toggleFollow(index)}
                className="!rounded-button text-[#8b1a1a] hover:text-[#a01f1f] dark:text-[#c9a227] dark:hover:text-[#e8d5b0] font-[Cormorant_Garamond] text-xs font-bold uppercase tracking-wider cursor-pointer transition-all hover:scale-105"
              >
                {following.includes(index) ? "✓ Following" : "Follow"}
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