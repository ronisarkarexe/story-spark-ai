import { useMemo } from "react";
import {
  analyzeCharacterProfiles,
} from "../../utils/characterPersonalityProfiles";

interface Props {
  story: string;
  onRefresh: () => void;
}

export default function CharacterPersonalityProfiles({
  story,
  onRefresh,
}: Props) {

  const profiles = useMemo(
    () => analyzeCharacterProfiles(story),
    [story]
  );

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold text-white">
          👤 AI Character Personality Profiles
        </h2>

        <button
          onClick={onRefresh}
          className="rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Refresh
        </button>

      </div>

      <div className="space-y-6">

        {profiles.map((character) => (

          <div
            key={character.id}
            className="rounded-lg border border-zinc-700 p-5"
          >

            <h3 className="text-xl font-semibold text-white">
              {character.name}
            </h3>

            <p className="mt-3 text-gray-300">
              <strong>Traits:</strong>{" "}
              {character.traits.join(", ")}
            </p>

            <p className="mt-2 text-gray-300">
              <strong>Strengths:</strong>{" "}
              {character.strengths.join(", ")}
            </p>

            <p className="mt-2 text-gray-300">
              <strong>Weaknesses:</strong>{" "}
              {character.weaknesses.join(", ")}
            </p>

            <p className="mt-2 text-gray-300">
              <strong>Motivation:</strong>{" "}
              {character.motivation}
            </p>

            <p className="mt-2 text-gray-300">
              <strong>Development:</strong>{" "}
              {character.development}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}