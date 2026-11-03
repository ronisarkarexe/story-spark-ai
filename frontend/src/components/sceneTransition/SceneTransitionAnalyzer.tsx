import useSceneTransition from "../../hooks/useSceneTransition";

interface Props {
  story: string;
}

export default function SceneTransitionAnalyzer({
  story,
}: Props) {
  const results = useSceneTransition(story);

  return (
    <div className="rounded-lg border p-5 shadow bg-white">

      <h2 className="text-xl font-bold mb-4">
        Scene Transition Analyzer
      </h2>

      {results.map((item) => (
        <div
          key={item.scene}
          className="border rounded p-3 mb-3"
        >
          <div className="flex justify-between">

            <h3 className="font-semibold">
              Scene {item.scene}
            </h3>

            <span
              className={`font-medium ${
                item.status === "Good"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {item.status}
            </span>

          </div>

          <p className="mt-2 text-sm">
            {item.suggestion}
          </p>

        </div>
      ))}

    </div>
  );
}