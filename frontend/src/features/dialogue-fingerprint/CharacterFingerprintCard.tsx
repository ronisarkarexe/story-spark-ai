import React from "react";
import { ICharacterDialogueAnalysis } from "../../services/dialogue-fingerprint.service";
import DistinctivenessBadge from "./DistinctivenessBadge";
import { MessageSquare, Quote, BookOpen, Percent } from "lucide-react";

interface CharacterFingerprintCardProps {
  analysis: ICharacterDialogueAnalysis;
}

export const CharacterFingerprintCard: React.FC<CharacterFingerprintCardProps> = ({
  analysis,
}) => {
  const { character, fingerprint, distinctivenessScore } = analysis;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-750 transition duration-300 space-y-4 shadow-md">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h4 className="text-white font-bold text-lg flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400 shrink-0" />
            {character}
          </h4>
          <p className="text-xs text-zinc-400 mt-1">
            Tone: <span className="text-indigo-300 font-semibold">{fingerprint.tone}</span>
          </p>
        </div>
        <DistinctivenessBadge score={distinctivenessScore} />
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-800">
        <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-850">
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-indigo-400" />
            Sentence Length
          </p>
          <p className="text-white text-lg font-bold mt-1">
            {fingerprint.averageSentenceLength}{" "}
            <span className="text-xs text-zinc-400 font-normal">words</span>
          </p>
        </div>
        <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-850">
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
            <Percent className="w-3 h-3 text-indigo-400" />
            Contractions
          </p>
          <p className="text-white text-lg font-bold mt-1">
            {Math.round(fingerprint.contractionRate * 100)}%
          </p>
        </div>
      </div>

      {fingerprint.frequentWords && fingerprint.frequentWords.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
            Preferred Vocabulary
          </p>
          <div className="flex flex-wrap gap-1.5">
            {fingerprint.frequentWords.map((word) => (
              <span
                key={word}
                className="bg-zinc-950 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-xs"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {fingerprint.catchphrases && fingerprint.catchphrases.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-zinc-800/50">
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
            <Quote className="w-3 h-3 text-indigo-400" />
            Catchphrases / Signature expressions
          </p>
          <ul className="list-disc pl-4 text-xs text-zinc-300 space-y-1">
            {fingerprint.catchphrases.map((phrase, idx) => (
              <li key={idx} className="italic">
                "{phrase}"
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CharacterFingerprintCard;
