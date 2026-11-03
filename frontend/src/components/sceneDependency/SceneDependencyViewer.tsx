import { useState } from "react";
import useSceneDependency from "../../hooks/useSceneDependency";

export default function SceneDependencyViewer() {
  const scenes = useSceneDependency();
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="rounded-lg border bg-white shadow p-6">
      <h2 className="text-2xl font-bold mb-5">
        Scene Dependency Viewer
      </h2>

      <div className="space-y-4">
        {scenes.map((scene) => (
          <div
            key={scene.id}
            className={`border rounded-lg p-4 cursor-pointer transition ${
              selected === scene.id
                ? "border-blue-500 bg-blue-50"
                : ""
            }`}
            onClick={() => setSelected(scene.id)}
          >
            <div className="flex justify-between">
              <h3 className="font-semibold">
                Scene {scene.id}: {scene.title}
              </h3>

              <span className="text-sm text-gray-500">
                Depends on {scene.dependsOn.length} scene(s)
              </span>
            </div>

            {scene.dependsOn.length > 0 ? (
              <p className="mt-2 text-gray-700">
                Linked Scenes: {scene.dependsOn.join(", ")}
              </p>
            ) : (
              <p className="mt-2 text-green-600">
                Starting Scene
              </p>
            )}

            {selected === scene.id && (
              <div className="mt-3 rounded bg-gray-100 p-3 text-sm">
                Navigate to connected scenes:
                {scene.dependsOn.length === 0
                  ? " None"
                  : ` ${scene.dependsOn.join(", ")}`}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}