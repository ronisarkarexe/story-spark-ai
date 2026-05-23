import { MoodProfile } from "../StoryMoodDetector";

export const romanceEffects: Partial<MoodProfile> = {
  animationTheme: "romance",
  soundTheme: "soft-rain",
  backgroundStyle:
    "from-rose-950 via-fuchsia-900/90 to-orange-900/80",
  overlayEffect: "hearts",
  narrationTone: "warm",
  accentClass: "from-rose-300 via-pink-300 to-orange-200",
  particleShape: "heart",
  particleColors: ["#fda4af", "#f9a8d4", "#fdba74"],
  cardClassName:
    "border-rose-300/20 bg-rose-950/35 shadow-[0_0_60px_rgba(251,113,133,0.16)]",
};
