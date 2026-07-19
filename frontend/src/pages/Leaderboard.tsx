import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Crown,
  Medal,
  Sparkles,
  Flame,
} from "lucide-react";

interface LeaderboardUser {
  username: string;
  avatar: string;
  score: number;
}

interface LeaderboardData {
  totalStories: number;
  leaderboard: LeaderboardUser[];
}

export default function Leaderboard() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(
          "/api/v1/leaderboard"
        );

        const json = await res.json();

        setData(json);
      } catch (error) {
        console.error("Leaderboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-hidden relative">

      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-5 py-2 text-sm text-yellow-300">
            <Sparkles size={15} />
            Weekly Rankings
          </div>

          <h1 className="mt-8 text-6xl font-black tracking-tight">
            Story
            <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-red-400 bg-clip-text text-transparent">
              Leaderboard
            </span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-slate-400 text-lg">
            Celebrating the most active and creative contributors
            in the StorySpark AI community.
          </p>
        </motion.div>

        {/* Stats */}
        {!loading && data && (
          <div className="mt-16 grid md:grid-cols-3 gap-6">

            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
              <Trophy className="text-yellow-400 mb-4" size={30} />

              <p className="text-slate-400 text-sm">
                Total Stories
              </p>

              <h2 className="text-4xl font-black mt-2">
                {data.totalStories}
              </h2>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
              <Flame className="text-orange-400 mb-4" size={30} />

              <p className="text-slate-400 text-sm">
                Active Writers
              </p>

              <h2 className="text-4xl font-black mt-2">
                {data.leaderboard.length}
              </h2>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
              <Crown className="text-blue-400 mb-4" size={30} />

              <p className="text-slate-400 text-sm">
                Weekly Champion
              </p>

              <h2 className="text-2xl font-bold mt-2">
                {data.leaderboard[0]?.username || "N/A"}
              </h2>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div className="mt-20">

          <div className="flex items-center gap-3 mb-10">
            <Medal className="text-yellow-400" />
            <h2 className="text-3xl font-bold">
              Top Writers
            </h2>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-56 rounded-3xl bg-white/5 animate-pulse border border-white/10"
                />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

              {data?.leaderboard.map((user, index) => (
                <motion.div
                  key={user.username}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                  }}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-7"
                >

                  {/* Hover Glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-yellow-500/10 to-orange-500/10" />

                  {/* Rank */}
                  <div className="absolute top-4 right-4 rounded-full bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 text-xs font-semibold text-yellow-300">
                    #{index + 1}
                  </div>

                  <div className="relative z-10">

                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="h-24 w-24 rounded-full border-4 border-white/10 object-cover"
                    />

                    <h3 className="mt-5 text-2xl font-bold">
                      {user.username}
                    </h3>

                    <p className="text-slate-400 text-sm mt-1">
                      Community Writer
                    </p>

                    <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-sm text-orange-300">
                      <Flame size={15} />
                      {user.score} points
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}