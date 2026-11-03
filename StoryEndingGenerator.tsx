import React, { useState } from "react";

interface StoryEndingGeneratorProps {
  story: {
    title: string;
    content: string;
  };
  onClose: () => void;
}

const endingStyles = [
  "Happy 😊",
  "Tragic 💔",
  "Mystery 🕵️",
  "Unexpected 😲",
];

const StoryEndingGenerator: React.FC<StoryEndingGeneratorProps> = ({
  story,
  onClose,
}) => {
  const [selectedStyle, setSelectedStyle] = useState("");
  const [generatedEnding, setGeneratedEnding] = useState("");

  const generateEnding = () => {
    if (!selectedStyle) return;

    const endings: Record<string, string> = {
      "Happy 😊":
        "The journey ended with happiness, peace, and a brighter future for all characters.",
      "Tragic 💔":
        "The story concluded with sacrifice and loss, leaving unforgettable memories behind.",
      "Mystery 🕵️":
        "The final chapter revealed new secrets, but some mysteries remained unsolved.",
      "Unexpected 😲":
        "A shocking twist changed everything, making the characters question their entire journey.",
    };

    setGeneratedEnding(endings[selectedStyle]);
  };

  const copyEnding = async () => {
    if (generatedEnding) {
      await navigator.clipboard.writeText(generatedEnding);
      alert("Ending copied!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-2xl border border-slate-700">
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            ✨ AI Story Ending Generator
          </h2>

          <button
            onClick={onClose}
            className="text-white text-xl hover:text-red-400"
          >
            ✕
          </button>
        </div>

        <p className="text-slate-300 mb-4">
          Create a new ending for: <strong>{story.title}</strong>
        </p>

        <div className="flex flex-wrap gap-3 mb-5">
          {endingStyles.map((style) => (
            <button
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`px-4 py-2 rounded-lg transition ${
                selectedStyle === style
                  ? "bg-purple-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {style}
            </button>
          ))}
        </div>

        <button
          onClick={generateEnding}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg"
        >
          Generate Ending
        </button>

        {generatedEnding && (
          <div className="mt-5 bg-slate-700 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-2">
              Generated {selectedStyle} Ending
            </h3>

            <p className="text-slate-300">
              {generatedEnding}
            </p>

            <button
              onClick={copyEnding}
              className="mt-4 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              📋 Copy Ending
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryEndingGenerator;