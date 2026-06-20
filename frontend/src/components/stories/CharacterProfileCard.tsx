import React, { useState } from "react";
import { CharacterProfile } from "./stories.utils";
import toast from "react-hot-toast";

interface CharacterProfileCardProps {
  profile: CharacterProfile;
}

const CharacterProfileCard: React.FC<CharacterProfileCardProps> = ({
  profile,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyProfile = async () => {
    const profileText = `
Character Name: ${profile.name}
Role: ${profile.role}
Personality: ${profile.personality}
Strengths: ${profile.strengths.join(", ")}
Weaknesses: ${profile.weaknesses.join(", ")}
Relationships: ${profile.relationships}
`;

    try {
      await navigator.clipboard.writeText(profileText);
      setIsCopied(true);
      toast.success("Character profile copied!");

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to copy profile.");
    }
  };

  return (
    <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-5 shadow-lg">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-purple-300">
          👤 {profile.name}
        </h3>

        <button
          onClick={handleCopyProfile}
          className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-500 transition"
        >
          {isCopied ? "✓ Copied" : "📋 Copy"}
        </button>
      </div>

      <div className="space-y-3 text-slate-300">
        <p>
          <span className="font-semibold text-white">🎭 Role:</span>{" "}
          {profile.role}
        </p>

        <p>
          <span className="font-semibold text-white">🧠 Personality:</span>{" "}
          {profile.personality}
        </p>

        <p>
          <span className="font-semibold text-white">💪 Strengths:</span>{" "}
          {profile.strengths.join(", ")}
        </p>

        <p>
          <span className="font-semibold text-white">⚠️ Weaknesses:</span>{" "}
          {profile.weaknesses.join(", ")}
        </p>

        <p>
          <span className="font-semibold text-white">🤝 Relationships:</span>{" "}
          {profile.relationships}
        </p>
      </div>
    </div>
  );
};

export default CharacterProfileCard;