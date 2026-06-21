import { describe, it, expect } from "vitest";
import { buildStoryTree, DBStoryNode } from "../treeUtils";

describe("treeUtils - buildStoryTree", () => {
  it("should return empty elements for empty database nodes", () => {
    const result = buildStoryTree([]);
    expect(result.nodes).toEqual([]);
    expect(result.edges).toEqual([]);
  });

  it("should sort nodes chronologically and position root node at the origin", () => {
    const dbNodes: DBStoryNode[] = [
      {
        id: "child1",
        title: "Child Story A",
        parentStoryId: "root1",
        branchDepth: 1,
        createdAt: "2026-06-21T01:00:00.000Z",
      },
      {
        id: "root1",
        title: "Root Story",
        parentStoryId: null,
        branchDepth: 0,
        createdAt: "2026-06-21T00:00:00.000Z",
      },
    ];

    const { nodes, edges } = buildStoryTree(dbNodes);

    expect(nodes).toHaveLength(2);
    // Root node should be sorted first chronologically
    expect(nodes[0].id).toBe("root1");
    expect(nodes[0].position.y).toBe(0);

    // Child node should be below the root node
    expect(nodes[1].id).toBe("child1");
    expect(nodes[1].position.y).toBe(220); // depth 1 * 220

    expect(edges).toHaveLength(1);
    expect(edges[0]).toEqual({
      id: "e-root1-child1",
      source: "root1",
      target: "child1",
      animated: true,
      style: { stroke: "#4f46e5", strokeWidth: 2 },
    });
  });

  it("should center parent node horizontally over its children", () => {
    const dbNodes: DBStoryNode[] = [
      {
        id: "root",
        title: "Root Story",
        parentStoryId: null,
        branchDepth: 0,
        createdAt: "2026-06-21T00:00:00.000Z",
      },
      {
        id: "child1",
        title: "Child A",
        parentStoryId: "root",
        branchDepth: 1,
        createdAt: "2026-06-21T01:00:00.000Z",
      },
      {
        id: "child2",
        title: "Child B",
        parentStoryId: "root",
        branchDepth: 1,
        createdAt: "2026-06-21T02:00:00.000Z",
      },
    ];

    const { nodes } = buildStoryTree(dbNodes);

    const rootNode = nodes.find(n => n.id === "root");
    const c1Node = nodes.find(n => n.id === "child1");
    const c2Node = nodes.find(n => n.id === "child2");

    expect(rootNode).toBeDefined();
    expect(c1Node).toBeDefined();
    expect(c2Node).toBeDefined();

    // Sibling nodes should have horizontal spacing (x difference of 280)
    expect(Math.abs(c2Node!.position.x - c1Node!.position.x)).toBe(280);

    // Parent should be centered directly between its children
    const expectedParentX = (c1Node!.position.x + c2Node!.position.x) / 2;
    expect(rootNode!.position.x).toBe(expectedParentX);
  });

  it("should prevent cycle reference recursion from crashing", () => {
    const dbNodes: DBStoryNode[] = [
      {
        id: "node1",
        title: "Node A",
        parentStoryId: "node2", // Cyclical
        branchDepth: 0,
        createdAt: "2026-06-21T00:00:00.000Z",
      },
      {
        id: "node2",
        title: "Node B",
        parentStoryId: "node1", // Cyclical
        branchDepth: 1,
        createdAt: "2026-06-21T01:00:00.000Z",
      },
    ];

    // Cycle detection will identify cycle, reject edge connection, and treat node2 as parent but prevent loop back from node1.
    const { nodes, edges } = buildStoryTree(dbNodes);
    expect(nodes).toHaveLength(2);
    expect(edges).toHaveLength(1); // One back-edge is rejected, leaving the other valid edge
  });
});
