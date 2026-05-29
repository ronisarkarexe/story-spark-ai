import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import StoryInspirationCard from "./story_inspiration_card.component";
import { inspirationData } from "./inspirationData";

const StoryInspirationComponent: React.FC = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] =
    useState<string>("");

  const [selectedGenre, setSelectedGenre] =
    useState<string>("All");

  const genres = [
    "All",
    "Fantasy",
    "Horror",
    "Sci-Fi",
    "Mystery",
    "Adventure",
    "Romance",
  ];

  const filteredStories =
    inspirationData.filter((story) => {
      const matchesGenre =
        selectedGenre === "All" ||
        story.genre === selectedGenre;

      const searchLower = searchQuery
        .toLowerCase()
        .trim();

      const matchesSearch =
        searchLower === "" ||
        story.title
          .toLowerCase()
          .includes(searchLower) ||
        story.author
          .toLowerCase()
          .includes(searchLower) ||
        story.summary
          .toLowerCase()
          .includes(searchLower) ||
        story.genre
          .toLowerCase()
          .includes(searchLower) ||
        story.themes.some((theme) =>
          theme
            .toLowerCase()
            .includes(searchLower)
        );

      return matchesGenre && matchesSearch;
    });

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f7ff] dark:bg-[#050816] text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-250px] left-[-120px] w-[650px] h-[650px] bg-indigo-500/15 blur-3xl rounded-full" />

        <div className="absolute top-[20%] right-[-150px] w-[500px] h-[500px] bg-blue-500/15 blur-3xl rounded-full" />

        <div className="absolute bottom-[-200px] left-[20%] w-[550px] h-[550px] bg-purple-500/10 blur-3xl rounded-full" />

        {/* Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06] bg-[linear-gradient(to_right,#6366f1_1px,transparent_1px),linear-gradient(to_bottom,#6366f1_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">

        {/* Top Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-10 flex items-center justify-between"
        >
          <button
            onClick={() => navigate("/")}
            className="
              group inline-flex items-center gap-3
              px-5 py-3 rounded-2xl
              bg-white/70 dark:bg-white/[0.05]
              border border-white/60 dark:border-white/10
              backdrop-blur-xl
              shadow-lg shadow-black/[0.03]
              hover:shadow-indigo-500/15
              hover:border-indigo-400/40
              transition-all duration-300
            "
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-lg">
              <i className="fas fa-arrow-left text-sm group-hover:-translate-x-0.5 transition-transform" />
            </div>

            <div className="text-left">
              <p className="text-sm font-semibold text-slate-800 dark:text-white">
                Back to Home
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Return to homepage
              </p>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full bg-white/70 dark:bg-white/[0.04] border border-white/60 dark:border-white/10 backdrop-blur-xl">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

            <span className="text-xs font-semibold tracking-wider uppercase text-slate-700 dark:text-slate-300">
              AI Powered Inspiration
            </span>
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative pt-20 pb-20 text-center"
        >
          {/* Glow */}
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-[900px] h-[450px] rounded-full bg-gradient-to-r from-indigo-500/20 via-blue-500/15 to-purple-500/20 blur-[130px]" />
          </div>

          {/* Badge */}
          <div className="
            inline-flex items-center gap-3
            px-5 py-2.5 rounded-full
            bg-white/80 dark:bg-white/[0.06]
            border border-white/60 dark:border-white/10
            backdrop-blur-xl
            shadow-lg shadow-black/[0.04]
            mb-8
          ">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>

              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </div>

            <span className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-700 dark:text-indigo-300">
              Creative Story Universe
            </span>
          </div>

          {/* Heading */}
          <h1 className="
            text-5xl md:text-7xl xl:text-8xl
            font-black tracking-tight
            leading-[0.95]
            mb-8
          ">
            <span className="block text-slate-900 dark:text-white">
              Story
            </span>

            <span className="
              block text-transparent bg-clip-text
              bg-gradient-to-r
              from-indigo-600
              via-blue-600
              to-purple-600
              dark:from-indigo-300
              dark:via-blue-300
              dark:to-purple-300
            ">
              Inspiration Hub
            </span>
          </h1>

          {/* Subtitle */}
          <p className="
            max-w-3xl mx-auto
            text-lg md:text-xl
            leading-relaxed
            text-slate-600 dark:text-slate-400
          ">
            Explore timeless narratives, cinematic worlds,
            iconic themes, and powerful writing prompts to
            spark your next masterpiece.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-5 mt-12">
            <button
              onClick={() =>
                document
                  .getElementById("discover-section")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="
                group px-8 py-4 rounded-2xl
                bg-gradient-to-r from-indigo-600 to-blue-600
                text-white font-bold
                shadow-2xl shadow-indigo-500/25
                hover:scale-[1.03]
                transition-all duration-300
              "
            >
              <span className="flex items-center gap-3">
                Explore Inspirations

                <i className="fas fa-arrow-right text-sm group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            <button
              onClick={() => navigate("/stories")}
              className="
                px-8 py-4 rounded-2xl
                bg-white/80 dark:bg-white/[0.05]
                border border-white/60 dark:border-white/10
                backdrop-blur-xl
                font-semibold
                hover:border-indigo-400/40
                hover:shadow-xl hover:shadow-indigo-500/10
                transition-all duration-300
              "
            >
              Generate Custom Story
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-20 max-w-4xl mx-auto">
            {[
              {
                value: inspirationData.length,
                label: "Story Inspirations",
                icon: "fa-book-open",
              },
              {
                value: genres.length - 1,
                label: "Creative Genres",
                icon: "fa-layer-group",
              },
              {
                value: "∞",
                label: "Writing Possibilities",
                icon: "fa-sparkles",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -6 }}
                className="
                  relative overflow-hidden
                  rounded-[2rem]
                  border border-white/60 dark:border-white/10
                  bg-white/80 dark:bg-white/[0.04]
                  backdrop-blur-2xl
                  p-7
                  shadow-xl shadow-black/[0.04]
                "
              >
                <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-500/10 blur-3xl rounded-full" />

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white flex items-center justify-center mx-auto mb-5 shadow-xl shadow-indigo-500/25">
                    <i className={`fas ${item.icon} text-lg`} />
                  </div>

                  <h3 className="text-4xl font-black text-slate-900 dark:text-white">
                    {item.value}
                  </h3>

                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {item.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Search Section */}
        <motion.section
          id="discover-section"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-20"
        >
          <div className="
            relative overflow-hidden
            rounded-[2.5rem]
            border border-white/60 dark:border-white/10
            bg-white/80 dark:bg-white/[0.04]
            backdrop-blur-2xl
            shadow-[0_25px_80px_rgba(0,0,0,0.06)]
            p-6 md:p-10
          ">
            {/* Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-3xl rounded-full" />

            {/* Header */}
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
                  Discover Inspirations
                </h2>

                <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl">
                  Search through genres, themes, and iconic
                  storytelling structures to unlock your next idea.
                </p>
              </div>

              <div className="
                px-5 py-4 rounded-2xl
                bg-gradient-to-r from-indigo-500/10 to-blue-500/10
                border border-indigo-500/10
                min-w-[220px]
              ">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Matching Results
                </p>

                <h3 className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                  {filteredStories.length}
                </h3>
              </div>
            </div>

            {/* Search */}
            <div className="
              relative flex items-center gap-4
              rounded-3xl
              border border-slate-200 dark:border-white/10
              bg-white dark:bg-slate-900/60
              px-6 py-5
              shadow-lg
              focus-within:border-indigo-500/40
              transition-all duration-300
            ">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <i className="fas fa-search" />
              </div>

              <input
                type="text"
                placeholder="Search titles, themes, genres, authors..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                className="
                  w-full bg-transparent outline-none
                  text-lg text-slate-800 dark:text-white
                  placeholder:text-slate-400 dark:placeholder:text-slate-500
                "
              />

              {searchQuery.length > 0 && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="
                    w-11 h-11 rounded-2xl
                    bg-red-50 dark:bg-red-500/10
                    hover:scale-105
                    transition-all duration-300
                    text-red-500
                  "
                >
                  <i className="fas fa-xmark" />
                </button>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              {genres.map((genre) => {
                const active =
                  selectedGenre === genre;

                return (
                  <button
                    key={genre}
                    onClick={() =>
                      setSelectedGenre(genre)
                    }
                    className={`
                      relative overflow-hidden
                      px-6 py-3.5 rounded-2xl
                      text-sm font-semibold
                      transition-all duration-300
                      border backdrop-blur-xl
                      ${
                        active
                          ? `
                            bg-gradient-to-r
                            from-indigo-600 to-blue-600
                            text-white
                            border-transparent
                            shadow-xl shadow-indigo-500/25
                            scale-105
                          `
                          : `
                            bg-white dark:bg-white/[0.04]
                            border-slate-200 dark:border-white/10
                            text-slate-700 dark:text-slate-300
                            hover:border-indigo-400/40
                            hover:text-indigo-600 dark:hover:text-indigo-300
                          `
                      }
                    `}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Stories Grid */}
        {filteredStories.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredStories.map((story) => (
              <StoryInspirationCard
                key={story.id}
                story={story}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="
              max-w-2xl mx-auto
              rounded-[2.5rem]
              border border-white/60 dark:border-white/10
              bg-white/80 dark:bg-white/[0.04]
              backdrop-blur-2xl
              p-16 text-center
              shadow-2xl
            "
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-white flex items-center justify-center mx-auto shadow-2xl shadow-indigo-500/25">
              <i className="fas fa-search-minus text-3xl" />
            </div>

            <h3 className="mt-8 text-3xl font-black text-slate-900 dark:text-white">
              No Inspiration Found
            </h3>

            <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
              Try adjusting your search keywords or explore
              different genres to uncover more creative ideas.
            </p>

            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedGenre("All");
              }}
              className="
                mt-10 px-8 py-4 rounded-2xl
                bg-gradient-to-r from-indigo-600 to-blue-600
                text-white font-bold
                hover:scale-[1.03]
                transition-all duration-300
                shadow-xl shadow-indigo-500/20
              "
            >
              Reset Filters
            </button>
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.section
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-28"
        >
          <div className="
            relative overflow-hidden
            rounded-[3rem]
            border border-white/60 dark:border-white/10
            bg-gradient-to-br
            from-indigo-600
            via-blue-600
            to-purple-700
            p-10 md:p-16
            text-white
            shadow-[0_25px_100px_rgba(79,70,229,0.35)]
          ">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 blur-3xl rounded-full" />

            <div className="absolute bottom-[-120px] left-[-100px] w-[320px] h-[320px] bg-cyan-400/20 blur-3xl rounded-full" />

            <div className="relative z-10 max-w-3xl">
              <div className="
                inline-flex items-center gap-2
                px-4 py-2 rounded-full
                bg-white/10 border border-white/15
                backdrop-blur-xl mb-6
              ">
                <i className="fas fa-sparkles text-yellow-300" />

                <span className="text-xs font-bold uppercase tracking-[0.2em]">
                  AI Story Engine
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black leading-tight">
                Ready To Build Your Own Universe?
              </h2>

              <p className="mt-6 text-lg text-white/80 leading-relaxed">
                Use StorySparkAI to transform inspirations into
                complete stories, plots, and cinematic adventures
                powered by intelligent AI storytelling.
              </p>

              <div className="flex flex-wrap gap-5 mt-10">
                <button
                  onClick={() => navigate("/stories")}
                  className="
                    group px-8 py-4 rounded-2xl
                    bg-white text-slate-900
                    font-bold
                    hover:scale-[1.03]
                    transition-all duration-300
                    shadow-2xl
                  "
                >
                  <span className="flex items-center gap-3">
                    Start Writing

                    <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>

                <button
                  onClick={() =>
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    })
                  }
                  className="
                    px-8 py-4 rounded-2xl
                    border border-white/20
                    bg-white/10
                    backdrop-blur-xl
                    font-semibold
                    hover:bg-white/15
                    transition-all duration-300
                  "
                >
                  Explore More
                </button>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default StoryInspirationComponent;