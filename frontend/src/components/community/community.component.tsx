import React  from 'react';


export default function CommunityCardsPreview() {
  const genres = [
    {
      title: 'Fantasy Hub',
      description:
        'From dragons to ancient magic, collaborate with fantasy writers and build immersive worlds together.',
      writers: '1.2K',
      icon: '🧙',
      category: 'Popular Hub',
    },
    {
      title: 'Sci‑Fi Nexus',
      description:
        'Explore futuristic civilizations, AI ethics, and space adventures with fellow sci‑fi creators.',
      writers: '980',
      icon: '🚀',
      category: 'Trending',
    },
    {
      title: 'Mystery Lounge',
      description:
        'Craft suspenseful plots, hidden clues, and thrilling investigations with mystery enthusiasts.',
      writers: '760',
      icon: '🕵️',
      category: 'New',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 px-6 py-20 transition-colors duration-300 dark:bg-[#081120] dark:text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-600 text-xs font-semibold tracking-[0.2em] uppercase mb-6 dark:bg-blue-500/5 dark:text-blue-400">
              Explore Communities
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
              Discover Your Writing Universe
            </h2>

            <p className="text-lg leading-relaxed text-slate-600 dark:text-gray-400">
              Find your niche and connect with specialists in your favorite storytelling styles.
            </p>
          </div>

          <button className="text-blue-600 font-semibold hover:translate-x-1 transition-transform dark:text-blue-400">
            VIEW ALL GENRES →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {genres.map((genre, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/60 transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10 dark:border-white/10 dark:bg-gradient-to-br dark:from-[#0f172a] dark:to-[#111827] dark:shadow-none"
            >
              <div className="absolute -top-24 right-0 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl shadow-lg shadow-blue-500/20 mb-8 group-hover:scale-110 transition-transform duration-300">
                {genre.icon}
              </div>

              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-5">
                {genre.category}
              </div>

              <h3 className="text-3xl font-bold mb-4 group-hover:text-blue-600 transition-colors dark:group-hover:text-blue-400">
                {genre.title}
              </h3>

              <p className="text-slate-600 leading-relaxed line-clamp-3 mb-10 dark:text-gray-400">
                {genre.description}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-white/10">
                <div className="flex items-center text-sm font-medium text-slate-500 dark:text-gray-400">
                  👥 {genre.writers} Writers
                </div>

                <button className="inline-flex items-center text-blue-600 font-semibold hover:translate-x-1 transition-transform dark:text-blue-400">
                  Enter Hub →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
