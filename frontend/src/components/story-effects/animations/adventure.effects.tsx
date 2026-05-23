import { MoodProfile } from "../StoryMoodDetector";

export const adventureEffects: Partial<MoodProfile> = {
  animationTheme: "adventure",
  soundTheme: "cinematic-wind",
  backgroundStyle:
    "from-slate-950 via-amber-950/90 to-sky-950/90",
  overlayEffect: "clouds",
  narrationTone: "bold",
  accentClass: "from-amber-200 via-orange-200 to-sky-200",
  particleShape: "ember",
  particleColors: ["#f59e0b", "#fb923c", "#7dd3fc"],
  cardClassName:
    "border-amber-300/20 bg-slate-950/35 shadow-[0_0_80px_rgba(245,158,11,0.18)]",
};
