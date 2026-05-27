import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe, GitPullRequest, Users } from "lucide-react";

interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

const ContributorsComponent = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/ronisarkarexe/story-spark-ai/contributors"
        );

        const data = await response.json();

        const filtered = data.filter(
          (contributor: Contributor) => contributor.contributions >= 3
        );

        setContributors(filtered);
      } catch (error) {
        console.error("Failed to fetch contributors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, []);

  const totalPRs = contributors.reduce(
    (acc, contributor) => acc + contributor.contributions,
    0
  );

  return (
    <div className="min-h-screen bg-[#050816] text-white relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_45%)]" />
      <div className="absolute top-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1 text-sm text-blue-300 mb-5">
            ✨ Open Source Community
          </div>

          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Contributors
          </h1>

          <p className="mt-6 text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Meet the amazing contributors helping build and improve StorySparkAI.
            Every contribution helps empower creativity through AI storytelling.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20">

          <motion.div
            whileHover={{ y: -6 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-7"
          >
            <div className="flex items-center gap-3 mb-3">
              <Users className="text-blue-400" />
              <h3 className="text-lg font-semibold">Contributors</h3>
            </div>

            <p className="text-4xl font-bold text-blue-400">
              {contributors.length}+
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-7"
          >
            <div className="flex items-center gap-3 mb-3">
              <GitPullRequest className="text-indigo-400" />
              <h3 className="text-lg font-semibold">Total PRs</h3>
            </div>

            <p className="text-4xl font-bold text-indigo-400">
              {totalPRs}+
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-7"
          >
            <div className="flex items-center gap-3 mb-3">
              <Globe className="text-purple-400" />
              <h3 className="text-lg font-semibold">Community Driven</h3>
            </div>

            <p className="text-4xl font-bold text-purple-400">
              Open Source
            </p>
          </motion.div>
        </div>

        {/* Contributors Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="h-60 rounded-2xl bg-white/5 animate-pulse border border-white/10"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {contributors.map((contributor, index) => (
              <motion.a
                key={contributor.login}
                href={contributor.html_url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{
                  y: -8,
                  scale: 1.03,
                }}
                className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:border-blue-400/40 hover:bg-white/[0.08]"
              >
                <div className="relative mb-5">
                  <img
                    src={contributor.avatar_url}
                    alt={contributor.login}
                    className="h-24 w-24 rounded-full border-4 border-blue-500/20 object-cover transition-all duration-300 group-hover:border-blue-400/50"
                  />

                  <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <h3 className="text-lg font-semibold text-white">
                  {contributor.login}
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  {contributor.contributions} contributions
                </p>

                <div className="mt-4 inline-flex items-center gap-2 text-blue-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Globe size={16} />
                  View Profile
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContributorsComponent;