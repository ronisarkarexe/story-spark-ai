import React, { useEffect, useState } from "react";
import { BranchingService } from "../../services/branching.service";
import "./BranchTree.css";

interface BranchNode {
  id: string;
  parentId: string | null;
  content: string;
  branchPath: string;
  branchDepth: number;
  choicesCount: number;
  isLeaf: boolean;
}

interface BranchEdge {
  source: string;
  target: string;
}

interface Props {
  storyId: string;
  maxDepth?: number;
  onNodeClick?: (nodeId: string) => void;
}

export const BranchTree: React.FC<Props> = ({ storyId, maxDepth, onNodeClick }) => {
  const [nodes, setNodes] = useState<BranchNode[]>([]);
  const [edges, setEdges] = useState<BranchEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["root"]));

  useEffect(() => {
    const loadTree = async () => {
      try {
        setLoading(true);
        const tree = await BranchingService.getBranchTree(storyId, maxDepth);
        setNodes(tree.nodes);
        setEdges(tree.edges);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load branch tree");
      } finally {
        setLoading(false);
      }
    };

    loadTree();
  }, [storyId, maxDepth]);

  const toggleNodeExpansion = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const getChildNodes = (parentId: string | null) => {
    return edges
      .filter((e) => e.source === parentId)
      .map((e) => nodes.find((n) => n.id === e.target))
      .filter(Boolean) as BranchNode[];
  };

  const renderNode = (node: BranchNode, depth: number): React.ReactNode => {
    const childNodes = getChildNodes(node.id);
    const isExpanded = expandedNodes.has(node.id);

    return (
      <div key={node.id} className="tree-node" style={{ marginLeft: `${depth * 20}px` }}>
        <div className="node-header">
          {childNodes.length > 0 && (
            <button
              className="expand-button"
              onClick={() => toggleNodeExpansion(node.id)}
            >
              {isExpanded ? "▼" : "▶"}
            </button>
          )}
          <button
            className="node-button"
            onClick={() => {
              onNodeClick?.(node.id);
              toggleNodeExpansion(node.id);
            }}
          >
            <span className="node-path">{node.branchPath}</span>
            {node.isLeaf && <span className="leaf-badge">End</span>}
            <span className="node-choices">{node.choicesCount} choices</span>
          </button>
        </div>

        {isExpanded && childNodes.length > 0 && (
          <div className="node-children">
            {childNodes.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="branch-tree-loading">Loading branch tree...</div>;
  }

  if (error) {
    return <div className="branch-tree-error">Error: {error}</div>;
  }

  const rootNode = nodes.find((n) => !n.parentId);

  return (
    <div className="branch-tree-container">
      <div className="tree-stats">
        <p>Total segments: {nodes.length}</p>
        <p>Total branches: {edges.length}</p>
      </div>

      <div className="tree-visualization">
        {rootNode ? renderNode(rootNode, 0) : <p>No segments found</p>}
      </div>
    </div>
  );
};

export default BranchTree;
