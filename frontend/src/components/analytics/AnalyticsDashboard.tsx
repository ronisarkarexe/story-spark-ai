import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid, LineChart, Line
} from "recharts";
import { Link } from "react-router-dom";
import { AUTH_KEY } from "../../constants/storage-key";
import { getBaseUrl } from "../../helpers/config";
import { getFromLocalStorage } from "../../utils/local-storage";

const API_BASE = getBaseUrl();

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#14b8a6"];

interface IOverview {
  totalStories: number;
  totalWords: number;
  currentStreak: number;
  longestStreak: number;
  totalLikes: number;
  totalViews: number;
  storyLengths?: {
    short: number;
    medium: number;
    long: number;
  };
}

interface IHeatmapDay { date: string; count: number; }
interface IGenre { genre: string; count: number; }
interface IWordCloud { text: string; value: number; }
interface IHour { hour: number; count: number; }

const HOUR_LABELS = ["12am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am",
  "12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"];

export default function AnalyticsDashboard() {
  const [overview, setOverview] = useState<IOverview | null>(null);
  const [heatmap, setHeatmap] = useState<IHeatmapDay[]>([]);
  const [genres, setGenres] = useState<IGenre[]>([]);
  const [wordCloud, setWordCloud] = useState<IWordCloud[]>([]);
  const [hours, setHours] = useState<IHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = getFromLocalStorage(AUTH_KEY) || "";

  const fetchData = async (
    endpoint: string,
    signal: AbortSignal
  ) => {
    const res = await fetch(
      `${API_BASE}/analytics/${endpoint}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        signal,
      }
    );

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.message || "Unable to load analytics data");
    }
    return data.data;
  };

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setError("");
        if (!token) {
          throw new Error("Please log in again to view analytics.");
        }
        const [ov, hm, gn, wc, hr] = await Promise.all([
          fetchData("overview", controller.signal),
          fetchData("heatmap", controller.signal),
          fetchData("genres", controller.signal),
          fetchData("wordcloud", controller.signal),
          fetchData("productive-hours", controller.signal),
        ]);

        if (!controller.signal.aborted) {
          setOverview(ov);
          setHeatmap(hm);
          setGenres(gn);
          setWordCloud(wc);
          setHours(hr);
        }
      } catch (e) {
        if ((e as Error).name !== "AbortError") {
          console.error(e);
          setError(e instanceof Error ? e.message : "Unable to load analytics data");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      controller.abort();
    };
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return (
    <div className="min-h-screen bg-[#0d0d14] flex items-center justify-center">
      <div className="text-indigo-400 text-xl animate-pulse">Loading your analytics...</div>
    </div>
  );

  const maxHour = hours.reduce((max, h) => h.count > max.count ? h : max, hours[0] || { hour: 0, count: 0 });

  // Derived Data
  const storyLengthData = overview?.storyLengths ? [
    { name: "Short (<500w)", value: overview.storyLengths.short },
    { name: "Medium", value: overview.storyLengths.medium },
    { name: "Long (>2000w)", value: overview.storyLengths.long },
  ].filter(d => d.value > 0) : [];

  // Sort heatmap by date for line chart timeline
  const timelineData = [...heatmap].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const badges = [
    { id: "first_story", name: "First Story", desc: "Write your first story", icon: "✨", unlocked: (overview?.totalStories || 0) > 0 },
    { id: "novelist", name: "Novelist", desc: "Write over 10,000 words", icon: "📚", unlocked: (overview?.totalWords || 0) > 10000 },
    { id: "dedicated", name: "Dedicated Writer", desc: "Maintain a 7-day streak", icon: "🎯", unlocked: (overview?.longestStreak || 0) >= 7 },
    { id: "popular", name: "Popular Author", desc: "Receive 100+ total views", icon: "🌟", unlocked: (overview?.totalViews || 0) >= 100 },
    { id: "engaging", name: "Engaging Storyteller", desc: "Receive 50+ total likes", icon: "💖", unlocked: (overview?.totalLikes || 0) >= 50 },
  ];

  return (
    <div className="min-h-screen bg-[#0d0d14] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        {/* Header */}
<div className="flex items-center justify-between mb-10">
  <div>
    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
      📊 Story Analytics
    </h1>
    <p className="text-white/40 mt-2">
      Your personal writing insights and patterns
    </p>
  </div>

  <Link
   to="/"
    className="px-4 py-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 hover:bg-indigo-500/30 transition"
  >
    ← Back to Home
  </Link>
</div>
        {/* Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {[
            { label: "Stories", value: overview?.totalStories || 0, icon: "📖" },
            { label: "Words Written", value: (overview?.totalWords || 0).toLocaleString(), icon: "✍️" },
            { label: "Current Streak", value: `${overview?.currentStreak || 0}d`, icon: "🔥" },
            { label: "Longest Streak", value: `${overview?.longestStreak || 0}d`, icon: "🏆" },
            { label: "Total Likes", value: overview?.totalLikes || 0, icon: "❤️" },
            { label: "Total Views", value: overview?.totalViews || 0, icon: "👁️" },
          ].map((card) => (
            <div key={card.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">{card.icon}</div>
              <div className="text-2xl font-bold text-indigo-400">{card.value}</div>
              <div className="text-xs text-white/40 mt-1">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10">
          <h2 className="text-xl font-bold mb-4 text-white">🏆 Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {badges.map(badge => (
              <div key={badge.id} className={`p-4 rounded-xl border text-center transition-all ${badge.unlocked ? "bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]" : "bg-white/5 border-white/10 opacity-50 grayscale"}`}>
                <div className="text-4xl mb-2">{badge.icon}</div>
                <div className="font-semibold text-sm mb-1">{badge.name}</div>
                <div className="text-[10px] text-white/50">{badge.desc}</div>
                {badge.unlocked && <div className="mt-2 text-[10px] uppercase font-bold text-indigo-400">Unlocked</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Genre Distribution */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4 text-indigo-300">🎭 Genre Distribution</h2>
            {genres.length === 0 ? (
              <p className="text-white/30 text-center py-8">No genre data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={genres} dataKey="count" nameKey="genre" cx="50%" cy="50%" outerRadius={90} label={({ name }: { name?: string }) => name ?? ""}>
                    {genres.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #ffffff20", borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Productive Hours */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-1 text-indigo-300">⏰ Most Productive Hours</h2>
            {maxHour && <p className="text-xs text-white/40 mb-4">You write best at {HOUR_LABELS[maxHour.hour]}</p>}
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={hours.map(h => ({ ...h, label: HOUR_LABELS[h.hour] }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="label" tick={{ fill: "#ffffff40", fontSize: 10 }} interval={3} />
                <YAxis tick={{ fill: "#ffffff40", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #ffffff20", borderRadius: 8 }} />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Timeline */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4 text-indigo-300">📈 Creation Timeline</h2>
            {timelineData.length === 0 ? (
              <p className="text-white/30 text-center py-8">No data to display</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: "#ffffff40", fontSize: 10 }} minTickGap={30} />
                  <YAxis tick={{ fill: "#ffffff40", fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #ffffff20", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: "#8b5cf6", strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: "#c4b5fd" }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Story Length Statistics */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4 text-indigo-300">📏 Story Lengths</h2>
            {storyLengthData.length === 0 ? (
              <p className="text-white/30 text-center py-8">No length data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={storyLengthData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} label={({ name }: { name?: string }) => name ?? ""}>
                    {storyLengthData.map((_, i) => <Cell key={i} fill={COLORS[(i + 4) % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #ffffff20", borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Writing Activity Heatmap */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-indigo-300">📅 Writing Activity</h2>
          {heatmap.length === 0 ? (
            <p className="text-white/30 text-center py-8">No activity data yet — start writing!</p>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex gap-1 flex-wrap">
                {Array.from({ length: 365 }, (_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - (364 - i));
                  const dateStr = date.toISOString().split("T")[0];
                  const day = heatmap.find(h => h.date === dateStr);
                  const count = day?.count || 0;
                  const opacity = count === 0 ? 0.05 : count === 1 ? 0.3 : count === 2 ? 0.6 : 1;
                  return (
                    <div
                      key={dateStr}
                      title={`${dateStr}: ${count} stories`}
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: `rgba(99, 102, 241, ${opacity})` }}
                    />
                  );
                })}
              </div>
              <div className="flex items-center gap-2 mt-3 text-xs text-white/30">
                <span>Less</span>
                {[0.05, 0.3, 0.6, 1].map((o, i) => (
                  <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: `rgba(99,102,241,${o})` }} />
                ))}
                <span>More</span>
              </div>
            </div>
          )}
        </div>

        {/* Word Cloud */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-indigo-300">☁️ Your Story Themes</h2>
          {wordCloud.length === 0 ? (
            <p className="text-white/30 text-center py-8">No stories yet — generate some!</p>
          ) : (
            <div className="flex flex-wrap gap-2 justify-center py-4">
              {wordCloud.map((word, i) => {
                const size = Math.max(12, Math.min(36, 12 + (word.value / wordCloud[0].value) * 24));
                return (
                  <span
                    key={word.text}
                    style={{ fontSize: `${size}px`, color: COLORS[i % COLORS.length], opacity: 0.7 + (word.value / wordCloud[0].value) * 0.3 }}
                    className="font-semibold hover:opacity-100 transition-opacity cursor-default"
                  >
                    {word.text}
                  </span>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
