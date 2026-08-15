import type { CharacterDialogueAnalysis } from "../../types/dialogue";

interface CharacterDialogueCardProps {
  character: CharacterDialogueAnalysis;
}

export default function CharacterDialogueCard({ character }: CharacterDialogueCardProps) {
  return (
    <article className="mb-4 rounded-lg border p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold">{character.character}</h3>
        <span>{character.uniquenessScore}/100</span>
      </div>
      <p className="mt-2">{character.speechPattern}</p>
      <p className="mt-1 text-sm">Vocabulary: {character.vocabularyStyle}</p>
      {character.similarTo && (
        <p className="mt-1 text-sm">Similar to {character.similarTo}</p>
      )}
      <ul className="mt-2 list-disc pl-5 text-sm">
        {character.suggestions.map((suggestion) => (
          <li key={suggestion}>{suggestion}</li>
        ))}
      </ul>
    </article>
  );
}
