import React, { useEffect, useRef } from "react";

interface AudioVisualizerProps {
  isPlaying: boolean;
  barCount?: number;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  barCount = 32,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const barHeightsRef = useRef<number[]>(
    Array.from({ length: barCount }, () => Math.random() * 0.3 + 0.1)
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const barWidth = width / barCount;
      const gap = barWidth * 0.3;

      for (let i = 0; i < barCount; i++) {
        if (isPlaying) {
          const target = Math.random() * 0.85 + 0.15;
          barHeightsRef.current[i] +=
            (target - barHeightsRef.current[i]) * 0.35;
        } else {
          barHeightsRef.current[i] +=
            (0.08 - barHeightsRef.current[i]) * 0.15;
        }

        const barHeight = Math.max(2, barHeightsRef.current[i] * height);
        const x = i * barWidth + gap / 2;
        const y = (height - barHeight) / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, "#818cf8");
        gradient.addColorStop(1, "#c084fc");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        const radius = Math.min(3, (barWidth - gap) / 2);
        const w = barWidth - gap;
        ctx.roundRect(x, y, w, barHeight, radius);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, barCount]);

  return (
    <div
      role="img"
      aria-label={isPlaying ? "Audio waveform, narration playing" : "Audio waveform, idle"}
      className="w-full h-16 rounded-xl bg-slate-100 dark:bg-slate-800/60 overflow-hidden"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default AudioVisualizer;