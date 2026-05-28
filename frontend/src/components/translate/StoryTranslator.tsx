import { useState } from "react";
import { useTranslateStoryMutation, useTranslateFreeStoryMutation } from "../../redux/apis/ai.model.api";
import { IStories } from "../stories/stories.view.component";

interface Props {
  story: IStories;
  isLogin: boolean;
  onClose: () => void;
}

const LANGUAGES = [
  { code: "Hindi", flag: "🇮🇳" },
  { code: "Spanish", flag: "🇪🇸" },
  { code: "French", flag: "🇫🇷" },
  { code: "German", flag: "🇩🇪" },
  { code: "Japanese", flag: "🇯🇵" },
  { code: "Chinese", flag: "🇨🇳" },
  { code: "Arabic", flag: "🇸🇦" },
  { code: "Portuguese", flag: "🇧🇷" },
  { code: "Russian", flag: "🇷🇺" },
  { code: "Korean", flag: "🇰🇷" },
  { code: "Italian", flag: "🇮🇹" },
  { code: "Bengali", flag: "🇧🇩" },
];

export default function StoryTranslator({ story, isLogin, onClose }: Props) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [translatedTitle, setTranslatedTitle] = useState<string>("");
  const [translatedContent, setTranslatedContent] = useState<string>("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState("");
  const [isDone, setIsDone] = useState(false);

  const [translateStory] = useTranslateStoryMutation();
  const [translateFreeStory] = useTranslateFreeStoryMutation();

  const handleTranslate = async () => {
    if (!selectedLanguage) return;
    setIsTranslating(true);
    setError("");
    setIsDone(false);

    try {
      const payload = {
        title: story.title,
        content: story.content,
        targetLanguage: selectedLanguage,
      };

      const result = isLogin
        ? await translateStory(payload).unwrap()
        : await translateFreeStory(payload).unwrap();

      if (result?.data) {
        setTranslatedTitle(result.data.title);
        setTranslatedContent(result.data.content);
        setIsDone(true);
      }
    } catch {
      setError("Translation failed. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#0f1117] rounded-2xl border border-white/10 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-emerald-400">🌍 Story Translator</h2>
            <p className="text-xs text-white/40 mt-0.5 truncate max-w-xs">{story.title}</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition text-xl">✕</button>
        </div>

        <div className="px-6 py-5 overflow-y-auto flex-1">
          {/* Language selector */}
          <p className="text-sm text-white/60 mb-3 font-medium">Select target language:</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-6">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { setSelectedLanguage(lang.code); setIsDone(false); }}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all ${
                  selectedLanguage === lang.code
                    ? "border-emerald-500 bg-emerald-500/15 text-emerald-300"
                    : "border-white/10 bg-white/3 hover:border-white/20 text-white/70"
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium">{lang.code}</span>
              </button>
            ))}
          </div>

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          {/* Translate button */}
          {!isDone && (
            <button
              onClick={handleTranslate}
              disabled={!selectedLanguage || isTranslating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-lg transition-all mb-6"
            >
              {isTranslating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⟳</span> Translating to {selectedLanguage}...
                </span>
              ) : (
                `🌍 Translate to ${selectedLanguage || "..."}`
              )}
            </button>
          )}

          {/* Side by side view */}
          {isDone && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-emerald-400">✅ Translated to {selectedLanguage}!</p>
                <button
                  onClick={() => { setIsDone(false); setSelectedLanguage(""); }}
                  className="text-xs text-white/40 hover:text-white border border-white/10 px-3 py-1 rounded-lg transition"
                >
                  Translate Again
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">🇬🇧 Original (English)</p>
                  <p className="text-sm font-semibold text-white mb-2">{story.title}</p>
                  <p className="text-xs text-white/60 leading-relaxed max-h-48 overflow-y-auto">{story.content}</p>
                </div>
                {/* Translated */}
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                  <p className="text-xs font-bold text-emerald-400/60 uppercase tracking-widest mb-2">
                    {LANGUAGES.find(l => l.code === selectedLanguage)?.flag} {selectedLanguage}
                  </p>
                  <p className="text-sm font-semibold text-white mb-2">{translatedTitle}</p>
                  <p className="text-xs text-white/60 leading-relaxed max-h-48 overflow-y-auto">{translatedContent}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}