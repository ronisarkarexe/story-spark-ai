import { useMemo } from "react";
import { generateRelationshipGraph } from "../../utils/storyRelationshipGraph";

interface Props {
  story: string;
}

export default function StoryRelationshipGraph({
  story,
}: Props) {
  const graph = useMemo(
    () => generateRelationshipGraph(story),
    [story]
  );

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <h2 className="text-2xl font-bold text-white mb-6">
        🕸 Story Relationship Graph
      </h2>

      <div className="space-y-4">

        {graph.nodes.map((node) => (
          <div
            key={node.id}
            className="rounded-lg border border-zinc-700 p-4"
          >
            <h3 className="font-semibold text-white">
              {node.name}
            </h3>

            <div className="mt-3 space-y-2">
              {graph.edges
                .filter(
                  (edge) =>
                    edge.source === node.id ||
                    edge.target === node.id
                )
                .map((edge, index) => {
                  const connected =
                    edge.source === node.id
                      ? graph.nodes.find(
                          (n) => n.id === edge.target
                        )?.name
                      : graph.nodes.find(
                          (n) => n.id === edge.source
                        )?.name;

                  return (
                    <div
                      key={index}
                      className="text-sm text-gray-300"
                    >
                      <strong>{edge.label}</strong> → {connected}
                    </div>
                  );
                })}
            </div>

          </div>
        ))}

      </div>

      <div className="mt-6 text-sm text-gray-400">
        🔍 Zoom and pan support can be integrated later using libraries
        like <strong>React Flow</strong> or <strong>vis-network</strong>.
      </div>

    </div>
  );
}