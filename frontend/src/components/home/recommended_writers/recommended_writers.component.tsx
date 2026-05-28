import { useState } from "react";
import { Link } from "react-router-dom";
import { isLoggedIn } from "../../../services/auth.service";
import { useToggleFollowMutation } from "../../../redux/apis/user.api";

const writers = [
  { id: "roni-sarkar-id", name: "Roni Sarkar", role: "AI Writer", image: "https://avatars.githubusercontent.com/u/76697055?v=4" },
  { id: "sarah-lee-id", name: "Sarah Lee", role: "Content Creator", image: "https://i.pravatar.cc/150?img=5" },
  { id: "john-doe-id", name: "John Doe", role: "Story Writer", image: "https://i.pravatar.cc/150?img=8" },
];

const RecommendedWritersComponent = () => {
  const [following, setFollowing] = useState<number[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [toggleFollowMutation, { isLoading }] = useToggleFollowMutation();

  const toggleFollow = async (index: number, authorId: string) => {
    if (!isLoggedIn()) return setShowLoginModal(true);
    await toggleFollowMutation(authorId).unwrap();
    setFollowing((prev) => (prev.includes(index) ? prev.filter((v) => v !== index) : [...prev, index]));
  };

  return (
    <>
      <section className="story-panel rounded-lg p-5 sm:p-6">
        <h3 className="mb-5 text-lg font-bold tracking-tight text-slate-100">Recommended Writers</h3>
        <div className="space-y-3">
          {writers.map((writer, index) => (
            <div key={writer.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-700/40 bg-slate-950/20 p-3">
              <div className="flex items-center gap-3">
                <img className="h-10 w-10 rounded-full object-cover" src={writer.image} alt={writer.name} />
                <div>
                  <p className="text-sm font-semibold text-slate-300">{writer.name}</p>
                  <p className="text-xs text-slate-500">{writer.role}</p>
                </div>
              </div>
              <button disabled={isLoading} onClick={() => toggleFollow(index, writer.id)} className="motion-cta rounded-full px-3 py-1.5 text-sm font-semibold disabled:opacity-50">
                {following.includes(index) ? "Following" : "Follow"}
              </button>
            </div>
          ))}
        </div>
      </section>
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="rounded-xl border border-white/10 bg-slate-900 p-6">
            <p className="mb-4 text-slate-200">You need to log in or sign up to follow writers.</p>
            <div className="flex gap-3">
              <Link to="/login" className="motion-cta rounded-lg px-4 py-2">Log In</Link>
              <button onClick={() => setShowLoginModal(false)} className="rounded-lg px-4 py-2 text-slate-300">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecommendedWritersComponent;
