export interface CharacterNode {
  id: string;
  name: string;
}

export interface RelationshipEdge {
  source: string;
  target: string;
  label:
    | "Family"
    | "Friend"
    | "Rival"
    | "Romance"
    | "Mentor"
    | "Alliance";
}

export interface RelationshipGraph {
  nodes: CharacterNode[];
  edges: RelationshipEdge[];
}

export function generateRelationshipGraph(
  story: string
): RelationshipGraph {
  if (!story.trim()) {
    return {
      nodes: [],
      edges: [],
    };
  }

  return {
    nodes: [
      { id: "1", name: "Main Character" },
      { id: "2", name: "Best Friend" },
      { id: "3", name: "Mentor" },
      { id: "4", name: "Villain" },
    ],
    edges: [
      {
        source: "1",
        target: "2",
        label: "Friend",
      },
      {
        source: "1",
        target: "3",
        label: "Mentor",
      },
      {
        source: "1",
        target: "4",
        label: "Rival",
      },
    ],
  };
}