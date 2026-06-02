import React from "react";

const GENRE_THEMES: Record<string, { gradient: string; accent: string; icon: string }> = {
  fantasy: { gradient: "135deg, #667eea 0%, #764ba2 50%, #f093fb 100%", accent: "#c084fc", icon: "✦" },
  romance: { gradient: "135deg, #f857a6 0%, #ff5858 50%, #ffb347 100%", accent: "#fb7185", icon: "♡" },
  horror: { gradient: "135deg, #0f0c29 0%, #302b63 50%, #24243e 100%", accent: "#a855f7", icon: "☽" },
  thriller: { gradient: "135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%", accent: "#38bdf8", icon: "◈" },
  mystery: { gradient: "135deg, #2c3e50 0%, #3498db 50%, #2980b9 100%", accent: "#60a5fa", icon: "◎" },
  adventure: { gradient: "135deg, #f7971e 0%, #ffd200 50%, #21d4fd 100%", accent: "#fbbf24", icon: "⊕" },
  scifi: { gradient: "135deg, #0f2027 0%, #203a43 50%, #2c5364 100%", accent: "#22d3ee", icon: "◇" },
  "sci-fi": { gradient: "135deg, #0f2027 0%, #203a43 50%, #2c5364 100%", accent: "#22d3ee", icon: "◇" },
  comedy: { gradient: "135deg, #fddb92 0%, #d1fdff 50%, #f5af19 100%", accent: "#f59e0b", icon: "◉" },
  drama: { gradient: "135deg, #8e2de2 0%, #4a00e0 50%, #3b82f6 100%", accent: "#a78bfa", icon: "✧" },
  historical: { gradient: "135deg, #b79891 0%, #94716b 50%, #6b4226 100%", accent: "#d4a574", icon: "⬡" },
  default: { gradient: "135deg, #667eea 0%, #764ba2 50%, #4facfe 100%", accent: "#a78bfa", icon: "✦" },
};

function getGenreTheme(tag?: string) {
  const key = (tag || "default").toLowerCase().trim();
  return GENRE_THEMES[key] ?? GENRE_THEMES.default;
}

function getInitials(title?: string): string {
  if (!title || !title.trim()) return "?";
  const words = title.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words.slice(0, 2).map((word) => word[0] ?? "").join("").toUpperCase();
}

interface StoryCoverImageProps {
  title?: string;
  tag?: string;
  size?: "full" | "thumb";
  className?: string;
  style?: React.CSSProperties;
}

const StoryCoverImage: React.FC<StoryCoverImageProps> = ({
  title = "",
  tag = "default",
  size = "full",
  className = "",
  style = {},
}) => {
  const theme = getGenreTheme(tag);
  const initials = getInitials(title);

  if (size === "thumb") {
    return (
      <div
        className={className}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: `linear-gradient(${theme.gradient})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.1rem",
          fontWeight: 700,
          color: "#fff",
          letterSpacing: "0.05em",
          textShadow: "0 1px 4px rgba(0,0,0,0.4)",
          userSelect: "none",
          ...style,
        }}
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      aria-label={`${title || "Story"} cover preview`}
      className={className}
      role="img"
      style={{
        width: "100%",
        height: "100%",
        minHeight: "192px",
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(${theme.gradient})`,
        borderRadius: "inherit",
        ...style,
      }}
    >
      <div style={{
        position: "absolute", top: "-30%", right: "-15%",
        width: "60%", height: "120%",
        background: "rgba(255,255,255,0.08)",
        borderRadius: "50%",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-20%", left: "-10%",
        width: "45%", height: "80%",
        background: "rgba(0,0,0,0.12)",
        borderRadius: "50%",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: "12px", right: "16px",
        fontSize: "3.5rem",
        color: theme.accent,
        opacity: 0.35,
        lineHeight: 1,
        userSelect: "none",
        pointerEvents: "none",
        fontWeight: 300,
      }}>
        {theme.icon}
      </div>
      <div style={{
        position: "absolute", top: "14px", left: "14px",
        background: "rgba(0,0,0,0.28)",
        backdropFilter: "blur(6px)",
        color: "#fff",
        fontSize: "0.65rem",
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        padding: "3px 10px",
        borderRadius: "999px",
        border: `1px solid ${theme.accent}55`,
        userSelect: "none",
      }}>
        {tag}
      </div>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          fontSize: "5rem",
          fontWeight: 900,
          color: "rgba(255,255,255,0.12)",
          letterSpacing: "-0.04em",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
        }}>
          {initials}
        </div>
      </div>
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)",
        padding: "32px 14px 12px",
      }}>
        <p style={{
          margin: 0,
          color: "#fff",
          fontSize: "0.9rem",
          fontWeight: 700,
          lineHeight: 1.3,
          textShadow: "0 1px 6px rgba(0,0,0,0.5)",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {title}
        </p>
      </div>
    </div>
  );
};

export default StoryCoverImage;
