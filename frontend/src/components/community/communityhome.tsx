import React from "react";
import {
  Users,
  BookOpen,
  MessageSquare,
  Trophy,
  Lightbulb,
  Users2,
  Award,
  Clock,
  ArrowRight,
  Star,
} from "lucide-react";

const CommunityHome = () => {
  return (
    <div className="space-y-16">
      {/* 1. Community Hero Section */}
      <div className="relative bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 rounded-3xl overflow-hidden text-white">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="relative px-8 py-16 md:py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Welcome to the StorySpark{" "}
            <span className="text-yellow-300">Community</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl md:text-2xl opacity-90 mb-10">
            Connect, collaborate, and grow with fellow storytellers, writers,
            and AI enthusiasts.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-indigo-700 hover:bg-white/90 font-semibold px-8 py-4 rounded-2xl flex items-center gap-3 transition-all hover:scale-105">
              Join Discussion <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border border-white/70 hover:bg-white/10 font-semibold px-8 py-4 rounded-2xl flex items-center gap-3 transition-all">
              Start a Topic
            </button>
            <button className="border border-white/70 hover:bg-white/10 font-semibold px-8 py-4 rounded-2xl flex items-center gap-3 transition-all">
              Create Challenge
            </button>
          </div>
        </div>
      </div>

      {/* 2. Community Statistics */}
      <div>
        <h2 className="text-3xl font-bold mb-8 text-center">
          Community at a Glance
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              label: "Total Members",
              value: "12,459",
              icon: Users,
              trend: "+284 this week",
            },
            {
              label: "Stories Published",
              value: "48,291",
              icon: BookOpen,
              trend: "+392 today",
            },
            {
              label: "Discussions",
              value: "3,872",
              icon: MessageSquare,
              trend: "Active",
            },
            {
              label: "Active Challenges",
              value: "18",
              icon: Trophy,
              trend: "Join now",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 hover:border-violet-500 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="w-10 h-10 text-violet-600" />
                <span className="text-emerald-500 text-sm font-medium">
                  {stat.trend}
                </span>
              </div>
              <div className="text-4xl font-bold mb-1">{stat.value}</div>
              <div className="text-slate-600 dark:text-slate-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 3. Trending Discussions */}
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Trending Discussions</h2>
            <button className="text-violet-600 hover:text-violet-700 font-medium flex items-center gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {[
              {
                title: "How do you handle writer's block with AI?",
                category: "Writing Tips",
                replies: 142,
                time: "2h ago",
              },
              {
                title: "Best practices for multi-character arcs",
                category: "Plot Development",
                replies: 89,
                time: "5h ago",
              },
              {
                title: "Sharing my new AI-assisted world-building prompt",
                category: "AI Techniques",
                replies: 67,
                time: "11h ago",
              },
            ].map((post, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-violet-400 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-lg mb-1">
                      {post.title}
                    </div>
                    <div className="text-sm text-violet-600">
                      {post.category}
                    </div>
                  </div>
                  <div className="text-right text-sm text-slate-500">
                    {post.replies} replies
                    <br />
                    <span className="text-xs">{post.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Writing Challenges */}
        <div className="lg:col-span-5">
          <h2 className="text-3xl font-bold mb-6">Active Writing Challenges</h2>
          <div className="space-y-6">
            {[
              {
                prompt: "A world where emotions are visible as colors",
                participants: 1243,
                timeLeft: "4 days left",
                prize: "Featured Story",
              },
              {
                prompt: "Write a story ending with a single red door",
                participants: 867,
                timeLeft: "11 days left",
                prize: "Community Spotlight",
              },
            ].map((challenge, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Trophy className="w-6 h-6 text-amber-500" />
                  <span className="font-semibold">Weekly Challenge</span>
                </div>
                <p className="text-lg font-medium mb-4">“{challenge.prompt}”</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Users2 className="w-4 h-4" /> {challenge.participants}{" "}
                    participating
                  </div>
                  <div className="flex items-center gap-2 text-rose-500">
                    <Clock className="w-4 h-4" /> {challenge.timeLeft}
                  </div>
                </div>
                <button className="mt-5 w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3.5 rounded-2xl font-semibold hover:brightness-110 transition">
                  Join Challenge
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Prompt Exchange + 6. Collaboration Board */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Prompt Exchange */}
        <div>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Lightbulb className="w-8 h-8 text-amber-500" /> Prompt Exchange
          </h2>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-700">
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Discover, remix, and share powerful storytelling prompts with the
              community.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
              <button className="border border-dashed border-slate-400 hover:border-violet-500 rounded-2xl py-8 font-medium transition">
                Browse Prompts
              </button>
              <button className="border border-dashed border-slate-400 hover:border-violet-500 rounded-2xl py-8 font-medium transition">
                Share Your Prompt
              </button>
            </div>
          </div>
        </div>

        {/* Collaboration Board */}
        <div>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Users className="w-8 h-8 text-teal-500" /> Collaboration Board
          </h2>
          <div className="space-y-4">
            {[
              "Looking for a co-writer for dark fantasy series",
              "Need beta readers for my sci-fi thriller (first 3 chapters)",
              "Building a shared universe — open to contributors",
            ].map((req, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition"
              >
                {req}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Member Spotlight */}
      <div>
        <h2 className="text-3xl font-bold mb-8">Member Spotlight</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Elena Voss",
              role: "Top Contributor",
              story: "The Last Lantern Keeper",
              avatar: "🌟",
            },
            {
              name: "Marcus Kane",
              role: "Challenge Champion",
              story: "Echoes in the Grid",
              avatar: "🏆",
            },
            {
              name: "Priya Sharma",
              role: "Prompt Wizard",
              story: "The Memory Weaver",
              avatar: "✨",
            },
          ].map((member, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-700"
            >
              <div className="text-6xl mb-4">{member.avatar}</div>
              <div className="font-semibold text-xl mb-1">{member.name}</div>
              <div className="text-violet-600 mb-4">{member.role}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                “{member.story}”
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8. Recent Community Activity */}
      <div>
        <h2 className="text-3xl font-bold mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[
            "Sarah Chen just published 'Whispers of the Forgotten Star'",
            "New Challenge Winner: 'The Silent Symphony' by Jamal Wright",
            "Alex Rivera started a discussion: 'Should AI co-authors get credit?'",
          ].map((activity, i) => (
            <div
              key={i}
              className="flex items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xl">
                👥
              </div>
              <p>{activity}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 9. Feature Requests & Voting */}
      <div className="bg-slate-100 dark:bg-slate-900 rounded-3xl p-10 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Have an idea to improve StorySpark?
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
          Your voice matters. Vote on existing ideas or submit your own.
        </p>
        <button className="bg-violet-600 hover:bg-violet-700 text-white px-10 py-4 rounded-2xl text-lg font-semibold transition">
          Visit Feature Board →
        </button>
      </div>

      {/* 10. Social Links */}
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-6">Connect With Us</h3>
        <div className="flex justify-center gap-8 text-3xl">
          <a href="#" className="hover:text-violet-600 transition">
            𝕏
          </a>
          <a href="#" className="hover:text-violet-600 transition">
            📘
          </a>
          <a href="#" className="hover:text-violet-600 transition">
            📷
          </a>
          <a href="#" className="hover:text-violet-600 transition">
            💬
          </a>
          <a href="#" className="hover:text-violet-600 transition">
            🐙
          </a>
        </div>
      </div>
    </div>
  );
};

export default CommunityHome;
