import React, { useMemo, useState } from "react";

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar?: string;
  storiesCount: number;
  creativeScore: number;
  collaborations: number;
  type: "Writers" | "Storytellers" | "Contributors";
}

const LeaderboardComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<
    "rank" | "stories" | "score" | "collaborations"
  >("rank");

  const contributors: LeaderboardUser[] = [
    { rank: 1, name: "Aarav Sharma", storiesCount: 14, creativeScore: 98, collaborations: 6, type: "Writers" },
    { rank: 2, name: "Suraj Bharsakle", storiesCount: 12, creativeScore: 95, collaborations: 8, type: "Storytellers" },
    { rank: 3, name: "Ananya Iyer", storiesCount: 10, creativeScore: 92, collaborations: 4, type: "Contributors" },
    { rank: 4, name: "Rohan Verma", storiesCount: 8, creativeScore: 89, collaborations: 3, type: "Writers" },
    { rank: 5, name: "Diya Patel", storiesCount: 7, creativeScore: 87, collaborations: 5, type: "Contributors" }
  ];

  const filteredContributors = useMemo(() => {
    let data =
      activeTab === "All"
        ? [...contributors]
        : contributors.filter((c) => c.type === activeTab);

    if (searchTerm.trim()) {
      data = data.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (sortBy) {
      case "stories":
        data.sort((a, b) => b.storiesCount - a.storiesCount);
        break;

      case "score":
        data.sort((a, b) => b.creativeScore - a.creativeScore);
        break;

      case "collaborations":
        data.sort((a, b) => b.collaborations - a.collaborations);
        break;

      default:
        data.sort((a, b) => a.rank - b.rank);
    }

    return data;
  }, [contributors, activeTab, searchTerm, sortBy]);
  const topThree = contributors.slice(0, 3);
  return (
    <div className="w-full min-h-screen bg-[#070b12] text-slate-100 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8 pb-16 relative overflow-hidden box-border">
      {/* Background Radial Premium Ambient Glow Effects */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-purple-600/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-indigo-600/10 to-transparent rounded-full blur-[120px] pointer-events-none" />

      {/* Title Section */}
      <div className="text-center max-w-3xl mx-auto mb-16 select-none">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-500">
          Weekly Chronicles Leaderboard
        </h1>
        <p className="text-slate-400 font-medium text-sm sm:text-base leading-relaxed uppercase tracking-wider">
          Celebrating top writers, creative storytellers, and active contributors ✨
        </p>
      </div>

      {/* Top 3 Podium Cards Spotlight Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-4xl mx-auto mb-16">
        {/* 2nd Place */}
        {topThree[1] && (
          <div className="bg-[#0e131f]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 text-center order-2 md:order-1 transform hover:-translate-y-1 transition-all duration-300 relative shadow-xl">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-slate-400 rounded-full flex items-center justify-center font-black text-slate-950 shadow-md">2</div>
            <h3 className="text-lg font-bold text-white mt-2">{topThree[1].name}</h3>
            <p className="text-xs font-semibold tracking-wider text-purple-400 uppercase mt-1">{topThree[1].type}</p>
            <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-xs text-slate-400">
              <div>📚 <b>{topThree[1].storiesCount}</b> Stories</div>
              <div>⚡ <b>{topThree[1].creativeScore}</b> Score</div>
            </div>
          </div>
        )}

        {/* 1st Place */}
        {topThree[0] && (
          <div className="bg-[#0e131f]/90 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 text-center order-1 md:order-2 transform hover:-translate-y-2 transition-all duration-300 relative shadow-2xl ring-2 ring-purple-500/10 md:mb-4">
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 bg-amber-400 rounded-full flex items-center justify-center font-black text-slate-950 text-xl shadow-lg animate-pulse">👑</div>
            <h2 className="text-xl font-black text-white mt-2">{topThree[0].name}</h2>
            <p className="text-xs font-black tracking-widest text-amber-400 uppercase mt-1">👑 Weekly Champion</p>
            <div className="mt-5 pt-4 border-t border-white/5 grid grid-cols-3 gap-2 text-xs text-slate-300 font-medium">
              <div>📚 <br /><b>{topThree[0].storiesCount}</b></div>
              <div>⚡ <br /><b>{topThree[0].creativeScore}</b></div>
              <div>🤝 <br /><b>{topThree[0].collaborations}</b></div>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {topThree[2] && (
          <div className="bg-[#0e131f]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 text-center order-3 transform hover:-translate-y-1 transition-all duration-300 relative shadow-xl">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center font-black text-white shadow-md">3</div>
            <h3 className="text-lg font-bold text-white mt-2">{topThree[2].name}</h3>
            <p className="text-xs font-semibold tracking-wider text-purple-400 uppercase mt-1">{topThree[2].type}</p>
            <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-xs text-slate-400">
              <div>📚 <b>{topThree[2].storiesCount}</b> Stories</div>
              <div>⚡ <b>{topThree[2].creativeScore}</b> Score</div>
            </div>
          </div>
        )}
      </div>

      {/* Glassmorphic Interaction Filters Tab Bar */}
      <div className="flex justify-center border-b border-white/5 mb-8 select-none">
        {["All", "Writers", "Storytellers", "Contributors"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-bold text-xs uppercase tracking-wider transition-all border-b-2 cursor-pointer ${activeTab === tab
                ? "border-purple-500 text-purple-400 bg-white/5 rounded-t-xl"
                : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 justify-between mb-6">

        <input
          type="text"
          placeholder="Search contributors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-[#0e131f] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
        />

        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as "rank" | "stories" | "score" | "collaborations")
          }
          className="bg-[#0e131f] border border-white/10 rounded-lg px-4 py-2 text-white"
        >
          <option value="rank">Sort by Rank</option>
          <option value="stories">Sort by Stories</option>
          <option value="score">Sort by Score</option>
          <option value="collaborations">Sort by Collaborations</option>
        </select>

        <button
          onClick={() => {
            setActiveTab("All");
            setSearchTerm("");
            setSortBy("rank");
          }}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold"
        >
          Clear Filters
        </button>

      </div>
      {/* Ranking List View Group Row Cards */}
      <p className="max-w-4xl mx-auto mb-4 text-sm text-slate-400">
        Showing {filteredContributors.length} contributor
        {filteredContributors.length !== 1 ? "s" : ""}
      </p>
      <div className="space-y-3 max-w-4xl mx-auto w-full box-border">
        {filteredContributors.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <h3 className="text-xl font-bold mb-2">
              No contributors found
            </h3>
            <p>
              Try changing the search term or selected category.
            </p>
          </div>
        ) : (
          filteredContributors.map((user) => (
            <div
              key={user.rank}
              className="group/row bg-[#0e131f]/80 backdrop-blur-xl border border-white/5 hover:border-purple-500/20 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(168,85,247,0.02)]"
            >
              <div className="flex items-center gap-4 text-left w-full sm:w-auto">
                <span className="w-8 text-center font-black text-slate-500 text-sm group-hover/row:text-purple-400 transition-colors">
                  #{user.rank}
                </span>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-white/10 flex items-center justify-center text-white font-black uppercase text-sm select-none">
                  {user.name.slice(0, 2)}
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-white group-hover/row:text-purple-300 transition-colors">
                    {user.name}
                  </h4>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-0.5">
                    🛡️ {user.type}
                  </span>
                </div>
              </div>
          

              {/* Metrics Snapshot Info Block */}
              <div className="flex items-center gap-6 sm:gap-10 justify-between sm:justify-end w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0 text-slate-400 text-xs uppercase font-bold tracking-wider select-none">
                <div>
                  <span className="text-[10px] text-slate-500 block mb-0.5">Stories</span>
                  <span className="text-white font-black text-sm">{user.storiesCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block mb-0.5">Score</span>
                  <span className="text-purple-400 font-black text-sm">{user.creativeScore}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block mb-0.5">Collabs</span>
                  <span className="text-blue-400 font-black text-sm">{user.collaborations}</span>
                </div>
              </div>
            </div>
          ))
          )}
      </div>
    </div>
  );
};

export default LeaderboardComponent;