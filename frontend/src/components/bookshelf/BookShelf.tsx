import { useState } from "react";
import Book3D from "./Book3D";
import BookOpen from "./BookOpen";

export interface IBookStory {
  uuid: string;
  title: string;
  content: string;
  tag: string;
  imageURL?: string;
}

const GENRE_COLORS: Record<string, { spine: string; glow: string; text: string }> = {
  Horror:    { spine: "#7f1d1d", glow: "#ef4444", text: "#fca5a5" },
  Romance:   { spine: "#831843", glow: "#ec4899", text: "#fbcfe8" },
  Fantasy:   { spine: "#3b0764", glow: "#a855f7", text: "#d8b4fe" },
  "Sci-Fi":  { spine: "#0c4a6e", glow: "#06b6d4", text: "#a5f3fc" },
  Mystery:   { spine: "#1e1b4b", glow: "#6366f1", text: "#c7d2fe" },
  Adventure: { spine: "#7c2d12", glow: "#f97316", text: "#fed7aa" },
  Comedy:    { spine: "#713f12", glow: "#eab308", text: "#fef08a" },
  Drama:     { spine: "#134e4a", glow: "#14b8a6", text: "#99f6e4" },
  Thriller:  { spine: "#1e3a5f", glow: "#3b82f6", text: "#bfdbfe" },
  default:   { spine: "#1e1b4b", glow: "#6366f1", text: "#c7d2fe" },
};

export function getGenreColor(tag: string) {
  return GENRE_COLORS[tag] || GENRE_COLORS.default;
}

const BOOKS_PER_SHELF = 5;

interface Props {
  stories: IBookStory[];
}

export default function BookShelf({ stories }: Props) {
  const [openBook, setOpenBook] = useState<IBookStory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGenre, setFilterGenre] = useState("All");

  const genres = ["All", ...Array.from(new Set(stories.map(s => s.tag)))];

  const filtered = stories.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = filterGenre === "All" || s.tag === filterGenre;
    return matchesSearch && matchesGenre;
  });

  // Split into shelves
  const shelves: IBookStory[][] = [];
  for (let i = 0; i < Math.max(filtered.length, BOOKS_PER_SHELF); i += BOOKS_PER_SHELF) {
    shelves.push(filtered.slice(i, i + BOOKS_PER_SHELF));
  }

  // Stats
  const genreCounts = stories.reduce((acc, s) => {
    acc[s.tag] = (acc[s.tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const favoriteGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

  return (
    <div className="min-h-screen bg-[#0d0d14] text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-2">
            📚 My Bookshelf
          </h1>
          <p className="text-white/40">Your personal story library</p>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Stories", value: stories.length, icon: "📖" },
            { label: "Genres", value: Object.keys(genreCounts).length, icon: "🎭" },
            { label: "Favourite Genre", value: favoriteGenre, icon: "⭐" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl font-bold text-amber-400">{stat.value}</div>
              <div className="text-xs text-white/40 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your stories..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-amber-500/50"
          />
          <div className="flex gap-2 flex-wrap">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setFilterGenre(genre)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  filterGenre === genre
                    ? "border-amber-500 bg-amber-500/20 text-amber-300"
                    : "border-white/10 bg-white/5 text-white/50 hover:border-white/20"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {stories.length === 0 && (
          <div className="text-center py-20 text-white/30">
            <p className="text-5xl mb-4">📚</p>
            <p className="text-xl">Your bookshelf is empty</p>
            <p className="text-sm mt-2">Generate some stories to fill your shelf!</p>
          </div>
        )}

        {/* Shelves */}
        <div className="space-y-12">
          {shelves.map((shelfBooks, shelfIndex) => (
            <div key={shelfIndex}>
              {/* Books on shelf */}
              <div className="flex items-end gap-3 px-4 pb-0">
                {shelfBooks.map((story) => (
                  <Book3D
                    key={story.uuid}
                    story={story}
                    onClick={() => setOpenBook(story)}
                  />
                ))}
                {/* Empty slots */}
                {Array.from({ length: BOOKS_PER_SHELF - shelfBooks.length }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="flex-1"
                    style={{
                      height: "160px",
                      border: "2px dashed rgba(255,255,255,0.05)",
                      borderRadius: "4px",
                    }}
                  />
                ))}
              </div>
              {/* Shelf plank */}
              <div style={{
                height: "16px",
                background: "linear-gradient(180deg, #5c3d1e 0%, #3d2a15 50%, #2a1d0f 100%)",
                borderRadius: "2px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                marginTop: "0px",
              }} />
              {/* Shelf support */}
              <div style={{
                height: "4px",
                background: "rgba(0,0,0,0.3)",
                borderRadius: "2px",
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* Open Book Modal */}
      {openBook && (
        <BookOpen story={openBook} onClose={() => setOpenBook(null)} />
      )}
    </div>
  );
}