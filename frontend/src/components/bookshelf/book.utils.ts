// book.utils.ts

export interface IBookStory {
  uuid: string;
  title: string;
  content: string;
  tag: string;
  imageURL?: string;
}

export const GENRE_COLORS: Record<string, { spine: string; glow: string; text: string }> = {
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