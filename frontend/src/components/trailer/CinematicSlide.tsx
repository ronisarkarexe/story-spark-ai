import { useEffect, useState } from "react";
import ParticleBackground from "./ParticleBackground";

interface Props {
  scene: string;
  sceneNumber: number;
  totalScenes: number;
  genre: string;
  isActive: boolean;
  storyTitle: string;
  isFinal?: boolean;
}

export default function CinematicSlide({
  scene,
  sceneNumber,
  totalScenes,
  genre,
  isActive,
  storyTitle,
  isFinal,
}: Props) {
  const [visibleWords, setVisibleWords] = useState<number>(0);
  const words = scene.split(" ");

  useEffect(() => {
    if (!isActive) {
      setVisibleWords(0);
      return;
    }
    setVisibleWords(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleWords(i);
      if (i >= words.length) clearInterval(interval);
    }, 150);
    return () => clearInterval(interval);
  }, [isActive, scene]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: isActive ? 1 : 0,
        transition: "opacity 0.8s ease",
        overflow: "hidden",
      }}
    >
      {/* Background */}
      <ParticleBackground genre={genre} />

      {/* Letterbox bars */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "12%",
        background: "#000",
        zIndex: 10,
      }} />
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: "12%",
        background: "#000",
        zIndex: 10,
      }} />

      {/* Scene number */}
      <div style={{
        position: "absolute",
        top: "15%",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 20,
        fontSize: "11px",
        fontWeight: "700",
        letterSpacing: "0.3em",
        color: "rgba(255,255,255,0.4)",
        textTransform: "uppercase",
      }}>
        {isFinal ? "THE END" : `Scene ${sceneNumber} of ${totalScenes}`}
      </div>

      {/* Main text */}
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 20,
        padding: "0 10%",
      }}>
        {isFinal ? (
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: "900",
              color: "#ffffff",
              letterSpacing: "0.05em",
              textShadow: "0 0 40px rgba(255,255,255,0.5)",
              lineHeight: "1.2",
              marginBottom: "16px",
            }}>
              {storyTitle}
            </div>
            <div style={{
              fontSize: "14px",
              letterSpacing: "0.3em",
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
            }}>
              A StorySparkAI Original
            </div>
          </div>
        ) : (
          <p style={{
            fontSize: "clamp(1.5rem, 3.5vw, 2.8rem)",
            fontWeight: "700",
            color: "#ffffff",
            textAlign: "center",
            lineHeight: "1.4",
            fontFamily: "Georgia, serif",
            textShadow: "0 2px 20px rgba(0,0,0,0.8)",
            letterSpacing: "0.02em",
          }}>
            {words.map((word, i) => (
              <span
                key={i}
                style={{
                  opacity: i < visibleWords ? 1 : 0,
                  transform: i < visibleWords ? "translateY(0)" : "translateY(10px)",
                  display: "inline-block",
                  transition: "all 0.3s ease",
                  marginRight: "0.3em",
                }}
              >
                {word}
              </span>
            ))}
          </p>
        )}
      </div>

      {/* Vignette */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
        zIndex: 15,
        pointerEvents: "none",
      }} />
    </div>
  );
}