import { useState } from "react";
import { useRemixStoryMutation, useRemixFreeStoryMutation } from "../../redux/apis/ai.model.api";
import { IStories } from "../stories/stories.view.component";

interface Props {
  story: IStories;
  isLogin: boolean;
  onRemixComplete: (remixedStory: IStories) => void;
  onClose: () => void;
}

const REMIX_OPTIONS = [
  {
    type: "setting",
    label: "🌍 Change Setting",
    description: "Same plot, different world",
    options: ["Space Station", "Medieval Fantasy", "Cyberpunk City", "Wild West", "Underwater Kingdom", "Post-Apocalyptic Earth"],
  },
  {
    type: "perspective",
    label: "👁️ Perspective Shift",
    description: "Retell from a different viewpoint",
    options: ["The Villain", "A Side Character", "An Animal", "An Omniscient Narrator", "A Child"],
  },
  {
    type: "time_period",
    label: "⏰ Time Period",
    description: "Same story, different era",
    options: ["Ancient Rome", "Victorian England", "1920s Jazz Era", "Far Future 2500", "Renaissance Italy", "1980s America"],
  },
  {
    type: "tone",
    label: "🎭 Tone Shift",
    description: "Change the emotional feel",
    options: ["Comedy", "Dark Thriller", "Romance", "Horror", "Inspirational", "Satirical"],
  },
  {
    type: "gender_swap",
    label: "🔄 Gender Swap",
    description: "All characters gender-swapped",
    options: ["Gender Swap"],
  },
];

export default function StoryRemix({ story, isLogin, onRemixComplete, onClose }: Props) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isRemixing, setIsRemixing] = useState(false);
  const [error, setError] = useState("");

  const [remixStory] = useRemixStoryMutation();
  const [remixFreeStory] = useRemixFreeStoryMutation();

  const selectedRemix = REMIX_OPTIONS.find(r => r.type === selectedType);

  const handleRemix = async () => {
    if (!selectedType || !selectedOption) return;
    setIsRemixing(true);
    setError("");

    try {
      const payload = {
        title: story.title,
        content: story.content,
        tag: story.tag,
        remixType: selectedType,
        remixOption: selectedOption,
      };

      const result = isLogin
        ? await remixStory(payload).unwrap()
        : await remixFreeStory(payload).unwrap();

      if (result?.data) {
        const remixedStory: IStories = {
          uuid: `remix-${Date.now()}`,
          title: result.data.title,
          content: result.data.content,
          tag: result.data.tag,
          imageURL: story.imageURL,
        };
        onRemixComplete(remixedStory);
      }
    } catch {
      setError("Remix failed. Please try again.");
    } finally {
      setIsRemixing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#0f1117] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-purple-400">🔀 Remix This Story</h2>
            <p className="text-xs text-white/40 mt-0.5 truncate max-w-xs">{story.title}</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition text-xl">✕</button>
        </div>

        <div className="px-6 py-5">
          {/* Step 1: Choose remix type */}
          <p className="text-sm text-white/60 mb-3 font-medium">Step 1 — Choose how to remix:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {REMIX_OPTIONS.map((remix) => (
              <button
                key={remix.type}
                onClick={() => { setSelectedType(remix.type); setSelectedOption(null); }}
                className={`text-left p-4 rounded-xl border transition-all ${
                  selectedType === remix.type
                    ? "border-purple-500 bg-purple-500/15"
                    : "border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5"
                }`}
              >
                <div className="font-semibold text-white text-sm">{remix.label}</div>
                <div className="text-xs text-white/40 mt-0.5">{remix.description}</div>
              </button>
            ))}
          </div>

          {/* Step 2: Choose option */}
          {selectedRemix && selectedRemix.type !== "gender_swap" && (
            <div className="mb-6">
              <p className="text-sm text-white/60 mb-3 font-medium">Step 2 — Choose an option:</p>
              <div className="flex flex-wrap gap-2">
                {selectedRemix.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedOption(option)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                      selectedOption === option
                        ? "border-purple-500 bg-purple-500/20 text-purple-300"
                        : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedRemix?.type === "gender_swap" && !selectedOption && setSelectedOption("Gender Swap") && null}

          {error && (
            <p className="text-red-400 text-sm mb-4">{error}</p>
          )}

          {/* Remix Button */}
          <button
            onClick={handleRemix}
            disabled={!selectedType || (!selectedOption && selectedType !== "gender_swap") || isRemixing}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-lg transition-all"
          >
            {isRemixing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⟳</span> Remixing...
              </span>
            ) : (
              "🔀 Generate Remix"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}