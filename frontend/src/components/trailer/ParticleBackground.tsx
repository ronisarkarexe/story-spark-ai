import { useEffect, useRef } from "react";

interface Props {
  genre: string;
}

const GENRE_THEMES: Record<string, {
  bg: string;
  particles: string;
  particleCount: number;
}> = {
  Horror:    { bg: "radial-gradient(ellipse at center, #1a0000 0%, #0a0000 100%)", particles: "#ff0000", particleCount: 30 },
  Romance:   { bg: "radial-gradient(ellipse at center, #2d0a1a 0%, #0f0008 100%)", particles: "#ff69b4", particleCount: 40 },
  Fantasy:   { bg: "radial-gradient(ellipse at center, #0f0a2e 0%, #050010 100%)", particles: "#a855f7", particleCount: 50 },
  "Sci-Fi":  { bg: "radial-gradient(ellipse at center, #000a1a 0%, #000508 100%)", particles: "#00ffff", particleCount: 60 },
  Adventure: { bg: "radial-gradient(ellipse at center, #1a0f00 0%, #0a0500 100%)", particles: "#f97316", particleCount: 35 },
  Mystery:   { bg: "radial-gradient(ellipse at center, #0a0a1a 0%, #050508 100%)", particles: "#6366f1", particleCount: 25 },
  Comedy:    { bg: "radial-gradient(ellipse at center, #1a1a00 0%, #0a0a00 100%)", particles: "#eab308", particleCount: 45 },
  Drama:     { bg: "radial-gradient(ellipse at center, #0a1a0f 0%, #050a08 100%)", particles: "#14b8a6", particleCount: 30 },
  Thriller:  { bg: "radial-gradient(ellipse at center, #000a14 0%, #000508 100%)", particles: "#3b82f6", particleCount: 25 },
  default:   { bg: "radial-gradient(ellipse at center, #0f0a1a 0%, #050008 100%)", particles: "#6366f1", particleCount: 40 },
};

export default function ParticleBackground({ genre }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = GENRE_THEMES[genre] || GENRE_THEMES.default;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: {
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; fadeDir: number;
    }[] = [];

    for (let i = 0; i < theme.particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random(),
        fadeDir: Math.random() > 0.5 ? 1 : -1,
      });
    }

    let animId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.opacity += p.fadeDir * 0.005;
        if (p.opacity >= 1 || p.opacity <= 0) p.fadeDir *= -1;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = theme.particles + Math.floor(p.opacity * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });

      animId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animId);
  }, [genre]);

  return (
    <>
      <div style={{
        position: "absolute",
        inset: 0,
        background: theme.bg,
      }} />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </>
  );
}