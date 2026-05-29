import { useRef, useState } from "react";
import html2canvas from "html2canvas";

interface Props {
  title: string;
  content: string;
  tag: string;
  uuid: string;
  onClose: () => void;
}

const RARITY = (wordCount: number) => {
  if (wordCount < 200) return { label: "Common", color: "#9ca3af", glow: "rgba(156,163,175,0.3)", symbol: "⚪" };
  if (wordCount < 400) return { label: "Rare", color: "#3b82f6", glow: "rgba(59,130,246,0.3)", symbol: "🔵" };
  if (wordCount < 600) return { label: "Epic", color: "#a855f7", glow: "rgba(168,85,247,0.3)", symbol: "🟣" };
  return { label: "Legendary", color: "#f59e0b", glow: "rgba(245,158,11,0.4)", symbol: "🟡" };
};

const GENRE_COLORS: Record<string, string> = {
  Horror: "#ef4444",
  Romance: "#ec4899",
  Fantasy: "#8b5cf6",
  "Sci-Fi": "#06b6d4",
  Mystery: "#6366f1",
  Adventure: "#f97316",
  Comedy: "#eab308",
  Drama: "#14b8a6",
  Thriller: "#dc2626",
};

function getKeyQuote(content: string): string {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
  if (sentences.length === 0) return content.slice(0, 80) + "...";
  const longest = sentences.reduce((a, b) => a.length > b.length ? a : b);
  const quote = longest.trim();
  return quote.length > 80 ? quote.slice(0, 80) + "..." : quote;
}

export default function StoryTradingCard({ title, content, tag, uuid, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  const rarity = RARITY(wordCount);
  const genreColor = GENRE_COLORS[tag] || "#6366f1";
  const keyQuote = getKeyQuote(content);
  const cardId = `SSAI-${uuid.slice(0, 8).toUpperCase()}`;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = `${title.replace(/\s+/g, "-")}-card.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-6">

        {/* Card */}
        <div
          ref={cardRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            width: "320px",
            background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)",
            borderRadius: "16px",
            border: `2px solid ${rarity.color}`,
            boxShadow: isHovered
              ? `0 0 40px ${rarity.glow}, 0 0 80px ${rarity.glow}, inset 0 0 30px rgba(255,255,255,0.03)`
              : `0 0 20px ${rarity.glow}`,
            padding: "20px",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
        >
          {/* Holographic shimmer overlay */}
          {isHovered && (
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)",
              pointerEvents: "none",
            }} />
          )}

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{
              fontSize: "10px",
              fontWeight: "700",
              letterSpacing: "0.1em",
              color: "#ffffff60",
              fontFamily: "monospace",
            }}>STORYSPARK AI</span>
            <span style={{
              fontSize: "11px",
              fontWeight: "700",
              color: rarity.color,
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}>
              {rarity.symbol} {rarity.label.toUpperCase()}
            </span>
          </div>

          {/* Title */}
          <div style={{
            fontSize: "18px",
            fontWeight: "800",
            color: "#ffffff",
            marginBottom: "8px",
            lineHeight: "1.3",
            textShadow: `0 0 20px ${rarity.glow}`,
          }}>
            {title}
          </div>

          {/* Genre badge */}
          <div style={{
            display: "inline-block",
            background: `${genreColor}22`,
            border: `1px solid ${genreColor}60`,
            borderRadius: "20px",
            padding: "3px 12px",
            fontSize: "11px",
            fontWeight: "600",
            color: genreColor,
            marginBottom: "16px",
          }}>
            {tag}
          </div>

          {/* Divider */}
          <div style={{
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${rarity.color}60, transparent)`,
            marginBottom: "16px",
          }} />

          {/* Key Quote */}
          <div style={{
            fontSize: "12px",
            color: "#ffffff80",
            fontStyle: "italic",
            lineHeight: "1.6",
            marginBottom: "16px",
            padding: "10px",
            background: "rgba(255,255,255,0.03)",
            borderRadius: "8px",
            borderLeft: `3px solid ${rarity.color}60`,
          }}>
            "{keyQuote}"
          </div>

          {/* Stats */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "8px",
            marginBottom: "16px",
          }}>
            {[
              { label: "WORDS", value: wordCount },
              { label: "READ", value: `${readingTime}m` },
              { label: "GENRE", value: tag.slice(0, 5).toUpperCase() },
            ].map((stat) => (
              <div key={stat.label} style={{
                textAlign: "center",
                padding: "8px 4px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.05)",
              }}>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#ffffff", fontFamily: "monospace" }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: "9px", color: "#ffffff40", letterSpacing: "0.1em", marginTop: "2px" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <span style={{ fontSize: "10px", color: "#ffffff30", fontFamily: "monospace" }}>{cardId}</span>
            <span style={{ fontSize: "10px", color: rarity.color, fontFamily: "monospace" }}>✦ {rarity.label}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-sm transition-all disabled:opacity-50"
          >
            {downloading ? "⟳ Saving..." : "⬇️ Download Card"}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-sm transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}