import React from "react";
import CharacterDialogueCard from "./CharacterDialogueCard";
import { useDialogueAnalysis } from "../../hooks/useDialogueAnalysis";

export default function DialogueStyleAnalyzer({ story }: { story: string }) {
  const analysis = useDialogueAnalysis(story);

  return (
    <div className="rounded-xl border p-6">
      <div className="flex justify-between mb-5">
        <h2 className="text-xl font-bold">
          Character Dialogue Style Analyzer
        </h2>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Analyze
        </button>
      </div>

      {analysis.map((character) => (
        <CharacterDialogueCard key={character.id} character={character} />
      ))}
    </div>
  );
}