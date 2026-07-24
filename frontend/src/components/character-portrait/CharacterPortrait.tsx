import React from "react";
import toast from "react-hot-toast";
import {
  CharacterResponse,
  useGenerateCharacterPortraitMutation,
} from "../../redux/apis/character.api";

interface CharacterPortraitProps {
  character: CharacterResponse;
}

const CharacterPortrait: React.FC<CharacterPortraitProps> = ({
  character,
}) => {
  const [generatePortrait, { isLoading }] =
    useGenerateCharacterPortraitMutation();

  const handleGeneratePortrait = async () => {
    try {
      await generatePortrait(character._id).unwrap();

      toast.success(
        character.portraitUrl
          ? "Character portrait regenerated!"
          : "Character portrait generated!"
      );
    } catch (error) {
      console.error("Failed to generate character portrait:", error);
      toast.error("Failed to generate character portrait.");
    }
  };

  return (
    <div className="flex items-center gap-3">
      {character.portraitUrl ? (
        <img
          src={character.portraitUrl}
          alt={`${character.name} portrait`}
          className="h-16 w-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
        />
      ) : (
        <div className="h-16 w-16 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-2xl">
          👤
        </div>
      )}

      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {character.name}
        </span>

        <button
          type="button"
          onClick={handleGeneratePortrait}
          disabled={isLoading}
          className="text-xs font-bold text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? "Generating..."
            : character.portraitUrl
              ? "Regenerate Portrait"
              : "Generate Portrait"}
        </button>
      </div>
    </div>
  );
};

export default CharacterPortrait;
