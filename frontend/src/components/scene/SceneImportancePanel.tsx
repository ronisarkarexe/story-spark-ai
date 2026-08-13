import React from "react";
import SceneScoreCard from "./SceneScoreCard";
import { useSceneImportance } from "../../hooks/useSceneImportance";

export default function SceneImportancePanel({ story }: { story: string }) {
  const scores = useSceneImportance(story);

  return (
    <div className="rounded-xl border p-5">
      <div className="flex justify-between mb-5">
        <h2 className="text-xl font-bold">
          Scene Importance Analysis
        </h2>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Reanalyze
        </button>
      </div>

      {scores.map((scene: any) => (
        <SceneScoreCard key={scene.id} scene={scene} />
      ))}
    </div>
  );
}