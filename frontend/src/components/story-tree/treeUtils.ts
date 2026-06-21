import { Node, Edge } from "reactflow";

export interface DBStoryNode {
  id: string;
  title: string;
  parentStoryId: string | null;
  branchDepth: number;
  createdAt: string;
}

export const buildStoryTree = (dbNodes: DBStoryNode[]): { nodes: Node[]; edges: Edge[] } => {
  if (!dbNodes || dbNodes.length === 0) {
    return { nodes: [], edges: [] };
  }

  // 1. Sort nodes chronologically to guarantee correct layout flow
  const sortedDbNodes = [...dbNodes].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const nodeMap = new Map<string, DBStoryNode>();
  const childrenMap = new Map<string, string[]>();
  const parentMap = new Map<string, string>();

  sortedDbNodes.forEach(node => {
    nodeMap.set(node.id, node);
    childrenMap.set(node.id, []);
  });

  // 2. Build parent-child relationships while preventing cycles
  sortedDbNodes.forEach(node => {
    if (node.parentStoryId && nodeMap.has(node.parentStoryId)) {
      // Cycle detection: trace parents
      let currentParent = node.parentStoryId;
      let hasCycle = false;
      while (currentParent) {
        if (currentParent === node.id) {
          hasCycle = true;
          break;
        }
        currentParent = parentMap.get(currentParent) || "";
      }

      if (!hasCycle) {
        childrenMap.get(node.parentStoryId)?.push(node.id);
        parentMap.set(node.id, node.parentStoryId);
      }
    }
  });

  const roots = sortedDbNodes.filter(node => !parentMap.has(node.id));

  // If no root is found due to invalid data, take the first node as root
  if (roots.length === 0 && sortedDbNodes.length > 0) {
    roots.push(sortedDbNodes[0]);
  }

  const positions = new Map<string, { x: number; y: number }>();
  const nextXAtDepth = new Map<number, number>();

  // Layout subtree recursively (bottom-up centering approach)
  const layoutSubtree = (nodeId: string, depth: number) => {
    const children = childrenMap.get(nodeId) || [];
    
    children.forEach(childId => {
      layoutSubtree(childId, depth + 1);
    });

    const y = depth * 220; // Vertical spacing (parent above children)
    let x = 0;

    if (children.length === 0) {
      // Leaf node: place at next available X position at this depth
      x = nextXAtDepth.get(depth) || 0;
    } else if (children.length === 1) {
      // Single child: center directly above it
      x = positions.get(children[0])!.x;
    } else {
      // Multiple children: center between first and last child
      const firstChildX = positions.get(children[0])!.x;
      const lastChildX = positions.get(children[children.length - 1])!.x;
      x = (firstChildX + lastChildX) / 2;
    }

    // Resolve overlaps at the current depth
    const minX = nextXAtDepth.get(depth) || 0;
    if (x < minX) {
      const diff = minX - x;
      shiftSubtree(nodeId, diff);
      x = minX;
    }

    positions.set(nodeId, { x, y });
    nextXAtDepth.set(depth, x + 280);
  };

  const shiftSubtree = (nodeId: string, amount: number) => {
    const pos = positions.get(nodeId);
    if (pos) {
      pos.x += amount;
    }
    const children = childrenMap.get(nodeId) || [];
    children.forEach(childId => shiftSubtree(childId, amount));
  };

  roots.forEach(root => {
    layoutSubtree(root.id, 0);
  });

  // Build React Flow nodes
  const nodes: Node[] = sortedDbNodes.map(node => {
    const pos = positions.get(node.id) || { x: 0, y: 0 };
    return {
      id: node.id,
      position: pos,
      type: "storyNode",
      data: {
        title: node.title,
        branchDepth: node.branchDepth ?? 0,
        createdAt: node.createdAt,
        isRoot: !parentMap.has(node.id),
      },
    };
  });

  // Build React Flow edges
  const edges: Edge[] = [];
  sortedDbNodes.forEach(node => {
    const parentId = parentMap.get(node.id);
    if (parentId) {
      edges.push({
        id: `e-${parentId}-${node.id}`,
        source: parentId,
        target: node.id,
        animated: true,
        style: { stroke: "#4f46e5", strokeWidth: 2 },
      });
    }
  });

  return { nodes, edges };
};
