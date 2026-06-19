import { useEffect, useState } from "react";
import CinematicSlide from "./CinematicSlide";
import { useGenerateModelMutation } from "../../redux/apis/ai.model.api";

interface Props {
  title: string;
  content: string;
  tag: string;
  isLogin: boolean;
  onClose: () => void;
}

export default function StoryTrailer({ title, content, tag, isLogin, onClose }: Props) {
  const [scenes, setScenes] = useState<string[]>([]);
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const totalSlides = scenes.length + 1; // +1 for final title slide

  // Extract scenes using Gemini via existing API
  const [generateModel] = useGenerateModelMutation();

  useEffect(() => {
    const extractScenes = async () => {
      setIsLoading(true);
      try {
        const prompt = `Extract exactly 5 of the most dramatic and cinematic moments from this story. Return ONLY a JSON array of 5 strings, each being a short dramatic caption (maximum 8 words). No other text, just the JSON array.

Story: ${content.slice(0, 1000)}

Example format: ["The darkness consumed everything around him", "She ran but could not escape", "A secret buried for decades revealed", "Their eyes met across the burning room", "Nothing would ever be the same again"]`;

        const result = await generateModel({
          prompt,
          wordLength: 50,
          numStories: 1,
          language: "English",
        }).unwrap();

        if (result?.data?.[0]?.content) {
          try {
            const raw = result.data[0].content;
            const match = raw.match(/\[.*\]/s);
            if (match) {
              const parsed = JSON.parse(match[0]);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setScenes(parsed.slice(0, 5));
                setIsPlaying(true);
                return;
              }
            }
          } catch {
            // fallback
          }
        }
        // Fallback scenes if AI fails
        const fallback = content.split(/[.!?]+/).filter(s => s.trim().length > 20).slice(0, 5).map(s => s.trim().split(" ").slice(0, 8).join(" "));
        setScenes(fallback.length >= 3 ? fallback : [
          "A story begins in the shadows",
          "Nothing is as it seems",
          "The truth changes everything",
          "There is no turning back now",
          "The end is only the beginning",
        ]);
        setIsPlaying(true);
      } catch {
        setError("Failed to generate trailer. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    extractScenes();
  }, [content]);

  // Auto-advance slides
  useEffect(() => {
    if (!isPlaying || scenes.length === 0) return;
    const timer = setTimeout(() => {
      if (currentScene < totalSlides - 1) {
        setCurrentScene((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, 3500);
    return () => clearTimeout(timer);
  }, [isPlaying, currentScene, totalSlides, scenes.length]);

  const handlePrev = () => {
    setCurrentScene((prev) => Math.max(0, prev - 1));
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (currentScene < totalSlides - 1) {
      setCurrentScene((prev) => prev + 1);
    }
    setIsPlaying(false);
  };

  const handleReplay = () => {
    setCurrentScene(0);
    setIsPlaying(true);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "#000",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Loading state */}
      {isLoading && (
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#000",
          zIndex: 200,
        }}>
          <div style={{
            fontSize: "48px",
            marginBottom: "16px",
            animation: "pulse 1s infinite",
          }}>🎬</div>
          <p style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "14px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}>
            Generating your trailer...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#000",
          zIndex: 200,
        }}>
          <p style={{ color: "#ef4444", marginBottom: "16px" }}>{error}</p>
          <button onClick={onClose} style={{
            padding: "8px 24px",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "8px",
            color: "#fff",
            cursor: "pointer",
          }}>Close</button>
        </div>
      )}

      {/* Slides */}
      {!isLoading && !error && (
        <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
          {scenes.map((scene, i) => (
            <CinematicSlide
              key={i}
              scene={scene}
              sceneNumber={i + 1}
              totalScenes={scenes.length}
              genre={tag}
              isActive={currentScene === i}
              storyTitle={title}
            />
          ))}
          {/* Final title slide */}
          <CinematicSlide
            key="final"
            scene={title}
            sceneNumber={scenes.length + 1}
            totalScenes={scenes.length}
            genre={tag}
            isActive={currentScene === scenes.length}
            storyTitle={title}
            isFinal
          />
        </div>
      )}

      {/* Controls */}
      {!isLoading && !error && (
        <div style={{
          position: "absolute",
          bottom: "14%",
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          zIndex: 50,
        }}>
          <button onClick={handlePrev} disabled={currentScene === 0} style={{
            width: "40px", height: "40px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff", fontSize: "16px", cursor: "pointer",
            opacity: currentScene === 0 ? 0.3 : 1,
          }}>‹</button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              width: "48px", height: "48px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "#fff", fontSize: "18px", cursor: "pointer",
            }}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>

          <button onClick={handleNext} disabled={currentScene === totalSlides - 1} style={{
            width: "40px", height: "40px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff", fontSize: "16px", cursor: "pointer",
            opacity: currentScene === totalSlides - 1 ? 0.3 : 1,
          }}>›</button>

          {!isPlaying && currentScene === totalSlides - 1 && (
            <button onClick={handleReplay} style={{
              padding: "8px 20px",
              borderRadius: "20px",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff", fontSize: "12px", cursor: "pointer",
              letterSpacing: "0.1em",
            }}>↺ REPLAY</button>
          )}
        </div>
      )}

      {/* Progress dots */}
      {!isLoading && !error && (
        <div style={{
          position: "absolute",
          bottom: "10%",
          left: 0, right: 0,
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          zIndex: 50,
        }}>
          {Array.from({ length: totalSlides }).map((_, i) => (
            <div
              key={i}
              onClick={() => { setCurrentScene(i); setIsPlaying(false); }}
              style={{
                width: i === currentScene ? "24px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background: i === currentScene ? "#fff" : "rgba(255,255,255,0.3)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      )}

      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "14%",
          right: "20px",
          zIndex: 50,
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "50%",
          width: "36px", height: "36px",
          color: "#fff", fontSize: "16px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >✕</button>
    </div>
  );
}