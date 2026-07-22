import { useState, useMemo } from "react";
import {
  EntityType,
  generateNames,
} from "../../utils/storyNamingAssistant";

interface Props {
  onInsert?: (name: string) => void;
}

export default function StoryNamingAssistant({
  onInsert,
}: Props) {
  const [genre, setGenre] =
    useState("Fantasy");

  const [entity, setEntity] =
    useState<EntityType>("Character");

  const names = useMemo(
    () => generateNames(genre, entity),
    [genre, entity]
  );

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <h2 className="text-2xl font-bold text-white mb-6">
        🪄 AI Story Naming Assistant
      </h2>

      <div className="grid md:grid-cols-2 gap-4 mb-6">

        <select
          value={genre}
          onChange={(e) =>
            setGenre(e.target.value)
          }
          className="rounded border bg-zinc-800 p-2 text-white"
        >
          <option>Fantasy</option>
          <option>SciFi</option>
        </select>

        <select
          value={entity}
          onChange={(e) =>
            setEntity(
              e.target.value as EntityType
            )
          }
          className="rounded border bg-zinc-800 p-2 text-white"
        >
          <option>Character</option>
          <option>City</option>
          <option>Kingdom</option>
          <option>Artifact</option>
          <option>Organization</option>
          <option>Planet</option>
        </select>

      </div>

      <div className="space-y-3">

        {names.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg border border-zinc-700 p-3"
          >
            <div>

              <h3 className="font-semibold text-white">
                {item.name}
              </h3>

              <p className="text-sm text-gray-400">
                {item.entityType}
              </p>

            </div>

            <button
              onClick={() =>
                onInsert?.(item.name)
              }
              className="rounded bg-indigo-600 px-3 py-2 text-white"
            >
              Insert
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}