export interface CharacterNode {
  id: string;
  name: string;
}

export interface RelationshipEdge {
  source: string;
  target: string;
  relationship:
    | "Friend"
    | "Family"
    | "Rival"
    | "Mentor"
    | "Romance"
    | "Unknown";
}

export interface RelationshipGraphData {
  nodes: CharacterNode[];
  edges: RelationshipEdge[];
}

export const extractRelationships = (
  story: string
): RelationshipGraphData => {
  return {
    nodes: [],
    edges: [],
  };
};

export const refreshRelationshipGraph = (
  story: string
): RelationshipGraphData => {
  return extractRelationships(story);
};

export const getCharacterCount = (
  graph: RelationshipGraphData
): number => {
  return graph.nodes.length;
};

export const getRelationshipCount = (
  graph: RelationshipGraphData
): number => {
  return graph.edges.length;
};