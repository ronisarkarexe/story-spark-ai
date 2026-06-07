import { useEffect, useState } from "react";
import {
  Globe,
  GitPullRequest,
  Users,
  Sparkles,
  Trophy,
  Star,
  ExternalLink,
  Code2,
} from "lucide-react";

interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

export default function ContributorsComponent() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const res = await fetch(
          "https://api.github.com/repos/ronisarkarexe/story-spark-ai/contributors"
        );
        const data: Contributor[] = await res.json();
        const sorted = data
          .filter((c) => c.contributions > 0)
          .sort((a, b) => b.contributions - a.contributions);
        setContributors(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContributors();
  }, []);

  const totalPRs = contributors.reduce((acc, c) => acc + c.contributions, 0);
  const maxContributions = contributors.length
    ? Math.max(...contributors.map((c) => c.contributions))
    : 1;

  return (
    <div className="min-h-screen text-white relative overflow-hidden bg-[#030712]">
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">

        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-5 py-2 text-sm text-indigo-300 mb-8">
            <Sparkles size={14} />
            Open Source Community
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white">
            Meet Our Contributors
          </h1>
          <p className="mt-6 text-slate-400 max-w-2xl mx-auto">
            The brilliant minds behind StorySparkAI.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {[
            { icon: <Users size={22} />, label: "Contributors", value: contributors.length },
            { icon: <GitPullRequest size={22} />, label: "Total Commits", value: totalPRs },
            { icon: <Code2 size={22} />, label: "Repositories", value: 1 },
            { icon: <Star size={22} />, label: "Community Love", value: "100%" },
          ].map((stat, i) => (
            <div key={i} className="rounded-2xl p-6 border border-white/10 bg-white/5">
              <div className="text-blue-400 mb-3">{stat.icon}</div>
              <p className="text-slate-400 text-sm">{stat.label}</p>
              <h3 className="text-3xl font-bold mt-2 text-white">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-indigo-500/30" />
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Trophy size={24} className="text-amber-400" />
            Hall of Fame
          </h2>
          <div className="h-px flex-1 bg-indigo-500/30" />
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {contributors.map((c, i) => (
              <a
                key={c.login}
                href={c.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 text-center hover:border-indigo-500/40 transition-all"
              >
                <div className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full bg-white/10">
                  #{i + 1}
                </div>
                <img
                  src={c.avatar_url}
                  alt={c.login}
                  className="h-20 w-20 mx-auto rounded-full border border-white/10 group-hover:border-blue-400 transition-all"
                />
                <h3 className="mt-4 font-semibold text-white">{c.login}</h3>
                <p className="text-xs text-slate-400 mt-1">{c.contributions} contributions</p>
                <div className="mt-3 h-1 w-full bg-white/10 rounded overflow-hidden">
                  <div
                    className="h-full bg-blue-400/70"
                    style={{ width: `${Math.min((c.contributions / maxContributions) * 100, 100)}%` }}
                  />
                </div>
                <div className="mt-4 text-slate-400 group-hover:text-white transition flex items-center justify-center gap-1 text-sm">
                  <ExternalLink size={14} />
                  View Profile
                </div>
              </a>
            ))}
          </div>
        )}

        <div className="mt-24 text-center rounded-3xl border border-indigo-500/15 bg-white/5 p-10">
          <h3 className="text-3xl font-black text-white mb-4">Ready to Contribute?</h3>
          <p className="text-slate-400 mb-8">Fork the repo, pick an issue, and make your first PR.</p>
          <a
            href="https://github.com/ronisarkarexe/story-spark-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition"
          >
            <Globe size={18} />
            Start Contributing
            <ExternalLink size={16} />
          </a>
        </div>

      </div>
    </div>
  );
}