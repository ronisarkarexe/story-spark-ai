import { useEffect, useState } from "react";
import {
  detectScenes,
  renameScene,
} from "../../utils/storySceneNavigator";

interface Props {
  story: string;
}

export default function StorySceneNavigator({
  story,
}: Props) {
  const [scenes, setScenes] = useState(
    detectScenes(story)
  );

  const [activeScene, setActiveScene] = useState(1);

  useEffect(() => {
    setScenes(detectScenes(story));
  }, [story]);

  const handleRename = (
    id: number,
    value: string
  ) => {
    setScenes((prev) =>
      renameScene(prev, id, value)
    );
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

      <h2 className="text-2xl font-bold text-white mb-6">
        🎬 Story Scene Navigator
      </h2>

      <div className="space-y-4">
        {scenes.map((scene) => (
          <div
            key={scene.id}
            className={`rounded-lg border p-4 cursor-pointer ${
              activeScene === scene.id
                ? "border-indigo-500 bg-zinc-800"
                : "border-zinc-700"
            }`}
            onClick={() => setActiveScene(scene.id)}
          >
            <input
              value={scene.title}
              onChange={(e) =>
                handleRename(scene.id, e.target.value)
              }
              className="w-full bg-transparent text-white font-semibold"
            />

            <p className="text-sm text-gray-400 mt-2 line-clamp-2">
              {scene.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}