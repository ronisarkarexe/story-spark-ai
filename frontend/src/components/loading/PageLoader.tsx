import React from "react";

/**
 * PageLoader — shown as Suspense fallback during lazy-loaded route transitions.
 * Uses CSS-only shimmer + a subtle progress bar so users never see a blank screen.
 */
const PageLoader: React.FC = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0b1120 0%, #111827 50%, #0f172a 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
        padding: "2rem",
      }}
    >
      {/* Logo mark */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.75rem",
          animation: "pageloader-pulse 2s ease-in-out infinite",
        }}
      >
        {/* Spark icon */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "16px",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa)",
            boxShadow: "0 0 32px rgba(99,102,241,0.5), 0 0 64px rgba(139,92,246,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.75rem",
          }}
        >
          ✦
        </div>
        <span
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "1.1rem",
            background: "linear-gradient(135deg, #a5b4fc, #c4b5fd, #f9a8d4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "0.04em",
          }}
        >
          StorySpark AI
        </span>
      </div>

      {/* Skeleton shimmer cards */}
      <div
        style={{
          width: "100%",
          maxWidth: "640px",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        {[100, 85, 92, 70].map((w, i) => (
          <div
            key={i}
            style={{
              height: i === 0 ? "20px" : "14px",
              width: `${w}%`,
              borderRadius: "8px",
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.04) 80%)",
              backgroundSize: "200% 100%",
              animation: `pageloader-shimmer 1.8s ease-in-out infinite ${i * 0.15}s`,
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: "200px",
          height: "3px",
          borderRadius: "9999px",
          background: "rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: "40%",
            borderRadius: "9999px",
            background: "linear-gradient(90deg, #6366f1, #a78bfa, #6366f1)",
            backgroundSize: "200% 100%",
            animation: "pageloader-progress 1.5s ease-in-out infinite",
          }}
        />
      </div>

      <style>{`
        @keyframes pageloader-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes pageloader-pulse {
          0%, 100% { opacity: 0.85; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.03); }
        }
        @keyframes pageloader-progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  );
};

export default PageLoader;
