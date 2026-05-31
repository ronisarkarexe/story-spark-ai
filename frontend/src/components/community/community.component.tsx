import React from 'react';
import GenreCard from './genre_card.component';
import { isLoggedIn } from '../../services/auth.service';
import { genres, featuredWriters, resources, stats } from './community.data';
import GithubcontributorsComponent from './Githubcontributors.component';
import ImageFallback from "../ImageFallback";

const CommunityComponent: React.FC = () => {
  const isLogin = isLoggedIn();

  return (
    <div className="min-h-screen bg-white text-slate-900 px-4 sm:px-6 lg:px-8 py-20 transition-colors duration-300 dark:bg-[#081120] dark:text-white">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-600 text-xs font-semibold tracking-[0.2em] uppercase mb-6 dark:bg-blue-500/5 dark:text-blue-400">
              Explore Communities
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-5 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Discover Your Writing Universe
            </h2>
            <p className="text-lg leading-relaxed text-slate-600 dark:text-gray-400">
              Find your niche and connect with specialists in your favorite storytelling styles.
            </p>
          </div>
        </div>
      </div>

      {/* Genres Grid */}
      <div className="max-w-7xl mx-auto mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {genres.map((genre, index) => (
            <GenreCard key={index} {...genre} isLogin={isLogin} />
          ))}
        </div>
      </div>

      {/* Stats Counter Section */}
      <div className="max-w-7xl mx-auto mb-20 p-8 sm:p-12 rounded-3xl bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              <span className="text-4xl sm:text-5xl font-extrabold text-blue-600 dark:text-blue-400 mb-2">
                {stat.value}
              </span>
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Writers Section */}
      <section className="max-w-7xl mx-auto mb-20">
        <div className="p-8 sm:p-12 bg-slate-50 rounded-3xl border border-slate-200 text-slate-900 transition-colors duration-300 dark:bg-white/5 dark:border-white/10 dark:text-white">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Community Spotlight
            </h2>
            <p className="text-slate-600 dark:text-gray-400">
              Meet the pioneers of AI-assisted storytelling.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {featuredWriters.map((writer, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  <ImageFallback
                    src={writer.avatar}
                    alt={writer.name}
                    className="w-24 h-24 rounded-full border-2 border-white/10 group-hover:border-blue-500 transition-colors relative z-10 object-cover shadow-lg"
                  />
                </div>
                <h3 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">{writer.name}</h3>
                <p className="text-blue-600 dark:text-blue-400 text-sm mb-4">{writer.role}</p>
                <div className="text-xs text-slate-500 uppercase tracking-widest">
                  {writer.stories} Stories Published
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GitHub Contributors Section */}
      <section className="max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 bg-slate-50 rounded-3xl border border-slate-200 text-slate-900 transition-colors duration-300 dark:bg-white/5 dark:border-white/10 dark:text-white">
          <GithubcontributorsComponent />
        </div>
      </section>
    </div>
  );
};

export default CommunityComponent;
