import React, { useState } from "react";
import {
  extractRelationships,
  RelationshipGraphData,
} from "../../utils/relationshipGraph";

interface Props {
  story: string;
}

export default function RelationshipGraph({
  story,
}: Props) {
  const [graph, setGraph] =
    useState<RelationshipGraphData>({
      nodes: [],
      edges: [],
    });

  const handleAnalyze = () => {
    setGraph(extractRelationships(story));
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

      <h2 className="text-2xl font-bold text-white mb-4">
        👥 Character Relationship Graph
      </h2>

      <button
        onClick={handleAnalyze}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
      >
        Generate Graph
      </button>

      <div className="mt-6">

        <h3 className="text-lg text-white font-semibold">
          Characters
        </h3>

        <ul className="mt-2 text-gray-300">
          {graph.nodes.map((node) => (
            <li key={node.id}>{node.name}</li>
          ))}
        </ul>

        <h3 className="text-lg text-white font-semibold mt-6">
          Relationships
        </h3>

        <div className="space-y-3 mt-3">
          {graph.edges.map((edge, index) => (
            <div
              key={index}
              className="border border-zinc-700 rounded-lg p-3"
            >
              <p className="text-white">
                {edge.source} → {edge.target}
              </p>

              <p className="text-indigo-400">
                {edge.relationship}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}