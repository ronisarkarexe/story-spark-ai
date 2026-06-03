import React from "react";
import { Link } from "react-router-dom";
import { isLoggedIn } from "../../services/auth.service";
import { genres, featuredWriters, resources, stats } from "./community.data";
import GithubcontributorsComponent from "./Githubcontributors.component";
import ImageFallback from "../ImageFallback";

const CommunityComponent: React.FC = () => {
  const isLogin = isLoggedIn();

  return (
    <div className="min-h-screen bg-white text-slate-900 px-4 sm:px-6 lg:px-8 py-20 transition-colors duration-300 dark:bg-[#081120] dark:text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-600 text-xs font-semibold tracking-[0.2em] uppercase mb-6 dark:bg-blue-500/5 dark:text-blue-400">
              Explore Communities
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 dark:from-white dark:via-gray-100 dark:to-indigo-300">
              Discover Your Writing Universe
            </h2>
            <p className="text-lg leading-relaxed text-slate-600 dark:text-gray-400">
              Find your niche, collaborate on prompts, and connect with specialists in your favorite storytelling styles.
            </p>
          </div>
          {!isLogin && (
            <Link
              to="/signup"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/20 whitespace-nowrap self-start md:self-end"
            >
              Join the Spark Hub →
            </Link>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm text-center"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-2">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Genres/Hubs Grid */}
        <div className="mb-24">
          <h3 className="text-2xl font-bold mb-8 text-slate-950 dark:text-white">Active Writing Hubs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {genres.map((genre, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-md shadow-slate-200/50 transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/30 hover:shadow-xl dark:border-white/10 dark:bg-gradient-to-br dark:from-[#0f172a] dark:to-[#111827]"
              >
                <div className="absolute -top-24 right-0 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  <i className={`fa-solid ${genre.icon} text-lg`}></i>
                </div>
                <h4 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors dark:group-hover:text-blue-400">
                  {genre.title}
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed dark:text-gray-400 mb-6">
                  {genre.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5 text-xs text-slate-500 dark:text-gray-400">
                  <span>👥 {genre.count} Writers</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Enter Hub →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Spotlight Section */}
        <section className="mb-24 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Community Spotlight</h2>
            <p className="text-slate-600 dark:text-gray-400">Meet the pioneers of AI-assisted storytelling.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {featuredWriters.map((writer, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  <ImageFallback
                    src={writer.avatar}
                    alt={writer.name}
                    className="w-24 h-24 rounded-full border-2 border-slate-200 dark:border-white/10 group-hover:border-blue-500 transition-colors relative z-10 object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">{writer.name}</h3>
                <p className="text-blue-600 dark:text-blue-400 text-sm mb-4">{writer.role}</p>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                  {writer.stories} Stories Published
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Resources & Guides Section */}
        <div className="mb-24">
          <h3 className="text-2xl font-bold mb-8 text-slate-950 dark:text-white">Guides & Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {resources.map((res, index) => (
              <div
                key={index}
                className="p-6 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-3xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 text-xs font-semibold dark:text-blue-400">
                      {res.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">⏱️ {res.readTime}</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {res.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 line-clamp-4">
                    {res.overview}
                  </p>
                </div>
                <Link
                  to={`/resources/${res.slug}`}
                  className="w-full py-2.5 text-center bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold rounded-xl text-sm transition-all border border-slate-250 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white dark:border-white/5"
                >
                  Read Guide
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* GitHub Contributors Section */}
        <div className="pt-10 border-t border-slate-200 dark:border-white/5">
          <h3 className="text-2xl font-bold mb-8 text-slate-950 dark:text-white">Repository Contributors</h3>
          <GithubcontributorsComponent />
        </div>

      </div>
    </div>
  );
};

export default CommunityComponent;
