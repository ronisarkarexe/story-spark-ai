import { useState } from "react";
import { IBookStory, getGenreColor } from "./BookShelf";

interface Props {
  story: IBookStory;
  onClose: () => void;
}

export default function BookOpen({ story, onClose }: Props) {
  const [isOpened, setIsOpened] = useState(false);
  const colors = getGenreColor(story.tag);
  const wordCount = story.content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Trigger open animation
  setTimeout(() => setIsOpened(true), 50);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "800px",
          transform: isOpened ? "scale(1) rotateX(0deg)" : "scale(0.8) rotateX(20deg)",
          opacity: isOpened ? 1 : 0,
          transition: "all 0.4s ease",
          perspective: "1000px",
        }}
      >
        {/* Book container */}
        <div
          style={{
            background: "#f5f0e8",
            borderRadius: "4px 12px 12px 4px",
            boxShadow: `0 0 60px ${colors.glow}40, -8px 0 20px rgba(0,0,0,0.5), 8px 0 20px rgba(0,0,0,0.3)`,
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            minHeight: "500px",
          }}
        >
          {/* Left page — Cover */}
          <div
            style={{
              background: `linear-gradient(135deg, ${colors.spine} 0%, ${colors.glow}80 100%)`,
              padding: "32px 24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              borderRight: "2px solid rgba(0,0,0,0.2)",
            }}
          >
            {/* Decorative corner */}
            <div style={{
              position: "absolute",
              top: 0, left: 0, right: 0, bottom: 0,
              background: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.02) 11px)",
              pointerEvents: "none",
            }} />

            <div>
              <div style={{
                display: "inline-block",
                background: "rgba(255,255,255,0.15)",
                border: `1px solid ${colors.glow}60`,
                borderRadius: "20px",
                padding: "4px 12px",
                fontSize: "11px",
                fontWeight: "700",
                color: colors.text,
                marginBottom: "16px",
                letterSpacing: "0.1em",
              }}>
                {story.tag.toUpperCase()}
              </div>

              <h2 style={{
                fontSize: "24px",
                fontWeight: "800",
                color: "#ffffff",
                lineHeight: "1.3",
                marginBottom: "16px",
                textShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}>
                {story.title}
              </h2>

              <div style={{
                height: "2px",
                background: `linear-gradient(90deg, ${colors.glow}, transparent)`,
                marginBottom: "16px",
              }} />

              <p style={{
                fontSize: "12px",
                color: "rgba(255,255,255,0.6)",
                lineHeight: "1.6",
                fontStyle: "italic",
              }}>
                "{story.content.slice(0, 120)}..."
              </p>
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              {[
                { label: "Words", value: wordCount },
                { label: "Min Read", value: readingTime },
              ].map((stat) => (
                <div key={stat.label} style={{
                  textAlign: "center",
                  background: "rgba(0,0,0,0.2)",
                  borderRadius: "8px",
                  padding: "8px 12px",
                }}>
                  <div style={{ fontSize: "18px", fontWeight: "700", color: "#fff" }}>{stat.value}</div>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right page — Content */}
          <div
            style={{
              background: "#faf7f2",
              padding: "32px 28px",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            {/* Page lines */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "repeating-linear-gradient(transparent, transparent 27px, #e8e0d0 27px, #e8e0d0 28px)",
              pointerEvents: "none",
              opacity: 0.4,
            }} />

            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "rgba(0,0,0,0.1)",
                border: "none",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                cursor: "pointer",
                fontSize: "14px",
                color: "#666",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>

            <h3 style={{
              fontSize: "14px",
              fontWeight: "700",
              color: "#333",
              marginBottom: "16px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              position: "relative",
            }}>
              Chapter I
            </h3>

            <div
              style={{
                flex: 1,
                overflowY: "auto",
                fontSize: "13px",
                lineHeight: "2",
                color: "#2c2c2c",
                fontFamily: "Georgia, serif",
                position: "relative",
                maxHeight: "380px",
              }}
            >
              {story.content}
            </div>

            {/* Page number */}
            <div style={{
              textAlign: "center",
              fontSize: "11px",
              color: "#999",
              marginTop: "12px",
              fontStyle: "italic",
              position: "relative",
            }}>
              — 1 —
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}