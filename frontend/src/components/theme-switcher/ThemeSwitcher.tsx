import { useEffect, useState } from "react";

const themes = [
  {
    id: 1,
    name: "Dark",
    bg: "#0f0f1a",
    text: "#ffffff",
    accent: "#6c63ff",
    card: "#1a1a2e",
  },
  {
    id: 2,
    name: "Light",
    bg: "#ffffff",
    text: "#1a1a1a",
    accent: "#6c63ff",
    card: "#f5f5f5",
  },
  {
    id: 3,
    name: "Sunset",
    bg: "#1a0a00",
    text: "#ffd4a3",
    accent: "#ff6b35",
    card: "#2d1200",
  },
  {
    id: 4,
    name: "Forest",
    bg: "#0a1a0a",
    text: "#d4ffd4",
    accent: "#4caf50",
    card: "#122012",
  },
  {
    id: 5,
    name: "Neon",
    bg: "#050510",
    text: "#e0e0ff",
    accent: "#00ffcc",
    card: "#0a0a20",
  },
];

const ThemeSwitcher = () => {
  const saved = localStorage.getItem("selectedTheme");
  const [activeTheme, setActiveTheme] = useState(
    saved ? JSON.parse(saved) : themes[0]
  );

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--bg-color", activeTheme.bg);
    root.style.setProperty("--text-color", activeTheme.text);
    root.style.setProperty("--accent-color", activeTheme.accent);
    root.style.setProperty("--card-color", activeTheme.card);
    localStorage.setItem("selectedTheme", JSON.stringify(activeTheme));
  }, [activeTheme]);

  return (
    <div
      style={{
        position: "fixed",
        right: "16px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {themes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => setActiveTheme(theme)}
          title={theme.name}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: activeTheme.id === theme.id
              ? `3px solid ${theme.accent}`
              : "2px solid #444",
            background: theme.bg,
            color: theme.text,
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.2)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "scale(1)")
          }
        >
          {theme.id}
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;