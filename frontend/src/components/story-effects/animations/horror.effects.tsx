import { MoodProfile } from "../StoryMoodDetector";

export const horrorEffects: Partial<MoodProfile> = {
  animationTheme: "horror",
  soundTheme: "whisper-wind",
  backgroundStyle:
    "from-slate-950 via-zinc-950 to-red-950/80",
  overlayEffect: "fog",
  narrationTone: "dramatic",
  accentClass: "from-red-400 via-orange-200 to-red-200",
  particleShape: "mist",
  particleColors: ["#7f1d1d", "#b91c1c", "#d1d5db"],
  cardClassName:
    "border-red-500/20 bg-slate-950/55 shadow-[0_0_80px_rgba(127,29,29,0.35)]",
};
