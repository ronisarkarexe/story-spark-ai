import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import { MoodProfile } from "./StoryMoodDetector";

interface StoryParticlesProps {
  mood: MoodProfile;
  density?: number;
}

const StoryParticles = ({ mood, density = 18 }: StoryParticlesProps) => {
  const reduceMotion = useReducedMotion();
  const particles = useMemo(
    () =>
      Array.from({ length: density }, (_, index) => ({
        id: `${mood.mood}-${index}`,
        left: `${(index * 97) % 100}%`,
        top: `${(index * 43) % 100}%`,
        size: 6 + ((index * 3) % 16),
        duration: 8 + (index % 5) * 1.8,
        delay: index * 0.22,
        color: mood.particleColors[index % mood.particleColors.length],
      })),
    [density, mood.mood, mood.particleColors]
  );

  if (reduceMotion) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle, index) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full blur-[1px]"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            background:
              mood.particleShape === "mist"
                ? `radial-gradient(circle, ${particle.color} 0%, transparent 72%)`
                : particle.color,
            clipPath:
              mood.particleShape === "heart"
                ? "path('M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z')"
                : undefined,
          }}
          animate={{
            y: [-10, -34 - (index % 4) * 14, -8],
            x: [0, index % 2 === 0 ? 14 : -14, 0],
            opacity: [0.12, 0.8, 0.14],
            scale: [0.85, 1.2, 0.9],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default StoryParticles;
