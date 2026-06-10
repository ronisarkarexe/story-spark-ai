import { useState } from "react";
import { IBookStory, getGenreColor } from "./BookShelf";

interface Props {
  story: IBookStory;
  onClick: () => void;
}

export default function Book3D({ story, onClick }: Props) {
  const [hovered, setHovered] = useState(false);
  const colors = getGenreColor(story.tag);

  const height = Math.min(180, Math.max(120, 120 + story.content.split(/\s+/).length / 20));
  const width = Math.min(60, Math.max(35, 35 + story.title.length / 3));

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: "1",
        perspective: "600px",
        cursor: "pointer",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        height: `${height + 20}px`,
      }}
    >
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          position: "relative",
          transformStyle: "preserve-3d",
          transform: hovered
            ? "rotateY(-25deg) translateY(-12px)"
            : "rotateY(-5deg)",
          transition: "all 0.3s ease",
          filter: hovered ? `drop-shadow(0 0 12px ${colors.glow}80)` : "none",
        }}
      >
        {/* Book spine (front face) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(135deg, ${colors.spine} 0%, ${colors.glow}40 100%)`,
            borderRadius: "2px 6px 6px 2px",
            border: `1px solid ${colors.glow}40`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px 4px",
            overflow: "hidden",
          }}
        >
          {/* Decorative lines */}
          <div style={{
            position: "absolute",
            top: "8px",
            left: "4px",
            right: "4px",
            height: "1px",
            background: `${colors.glow}40`,
          }} />
          <div style={{
            position: "absolute",
            bottom: "8px",
            left: "4px",
            right: "4px",
            height: "1px",
            background: `${colors.glow}40`,
          }} />

          {/* Title (vertical) */}
          <div
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              transform: "rotate(180deg)",
              fontSize: "10px",
              fontWeight: "700",
              color: colors.text,
              textAlign: "center",
              lineHeight: "1.2",
              maxHeight: `${height - 30}px`,
              overflow: "hidden",
              textOverflow: "ellipsis",
              letterSpacing: "0.05em",
            }}
          >
            {story.title}
          </div>

          {/* Genre dot */}
          <div style={{
            position: "absolute",
            bottom: "16px",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: colors.glow,
            boxShadow: `0 0 6px ${colors.glow}`,
          }} />
        </div>

        {/* Book side (right face for 3D effect) */}
        <div
          style={{
            position: "absolute",
            top: "2px",
            bottom: "2px",
            right: "-8px",
            width: "8px",
            background: `linear-gradient(90deg, ${colors.spine} 0%, #0a0a0f 100%)`,
            transform: "rotateY(90deg)",
            transformOrigin: "left center",
            borderRadius: "0 2px 2px 0",
          }}
        />

        {/* Book top */}
        <div
          style={{
            position: "absolute",
            top: "-4px",
            left: "2px",
            right: "-6px",
            height: "4px",
            background: `linear-gradient(90deg, #e8e0d0 0%, #c8b8a0 100%)`,
            transform: "rotateX(90deg)",
            transformOrigin: "bottom center",
            borderRadius: "2px 2px 0 0",
          }}
        />
      </div>
    </div>
  );
}