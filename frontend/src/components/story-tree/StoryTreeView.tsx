import React, { useState, useEffect, useMemo, useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  Node,
  Edge,
  NodeMouseHandler,
} from "reactflow";
import "reactflow/dist/style.css";
import "./StoryTreeView.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useGetStoryTreeQuery, useLazyGetPostByIdQuery } from "../../redux/apis/post.api";
import { setStory } from "../../redux/slices/storySlice";
import { buildStoryTree, DBStoryNode } from "./treeUtils";
import StoryTreeNode from "./StoryTreeNode";

interface StoryTreeViewProps {
  rootStoryId: string;
}

// Register custom node type mapping
const nodeTypes = {
  storyNode: StoryTreeNode,
};

const StoryTreeInner: React.FC<{
  rootStoryId: string;
  nodes: Node[];
  edges: Edge[];
  rawNodes: DBStoryNode[];
}> = ({ rootStoryId, nodes: initialNodes, edges: initialEdges, rawNodes }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setCenter, fitView } = useReactFlow();

  const [triggerGetPost] = useLazyGetPostByIdQuery();

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(rootStoryId);
  const [searchTerm, setSearchTerm] = useState("");
  const [maxDepth, setMaxDepth] = useState<number>(10);
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
  const [isOpeningStory, setIsOpeningStory] = useState(false);

  // Find the maximum depth present in the tree
  const maxTreeDepth = useMemo(() => {
    return rawNodes.reduce((max, node) => Math.max(max, node.branchDepth ?? 0), 0);
  }, [rawNodes]);

  // Adjust maxDepth state to match the tree limit initially
  useEffect(() => {
    setMaxDepth(maxTreeDepth);
  }, [maxTreeDepth]);

  // Synchronize internal React Flow states with tree layout updates
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Handle Collapsed Nodes Hierarchy
  const isDescendantOfCollapsed = useCallback((nodeId: string): boolean => {
    if (collapsedNodes.size === 0) return false;

    // Helper to traverse parent chain up to root
    const parentMap = new Map<string, string>();
    initialEdges.forEach(e => parentMap.set(e.target, e.source));

    let current: string | undefined = parentMap.get(nodeId);
    while (current) {
      if (collapsedNodes.has(current)) {
        return true;
      }
      current = parentMap.get(current);
    }
    return false;
  }, [collapsedNodes, initialEdges]);

  // Compute active nodes and edges applying Search, Depth, and Collapse state filters
  const filteredElements = useMemo(() => {
    const visibleNodeIds = new Set<string>();

    const updatedNodes = nodes.map((node) => {
      const dbNode = rawNodes.find(n => n.id === node.id);
      const depth = dbNode?.branchDepth ?? 0;
      const isCollapsedDescendant = isDescendantOfCollapsed(node.id);
      
      // Node visibility criteria
      const isVisible = depth <= maxDepth && !isCollapsedDescendant;
      if (isVisible) {
        visibleNodeIds.add(node.id);
      }

      // Check search match
      const isMatchingSearch =
        searchTerm.trim() !== "" &&
        node.data.title.toLowerCase().includes(searchTerm.toLowerCase());

      return {
        ...node,
        style: { ...node.style, opacity: isVisible ? 1 : 0, pointerEvents: isVisible ? "all" as const : "none" as const },
        data: {
          ...node.data,
          isSelected: node.id === selectedNodeId,
          isMatchingSearch,
        },
      };
    });

    const updatedEdges = edges.map((edge) => {
      const isVisible = visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target);
      return {
        ...edge,
        style: { ...edge.style, opacity: isVisible ? 1 : 0 },
      };
    });

    return { nodes: updatedNodes, edges: updatedEdges };
  }, [nodes, edges, rawNodes, selectedNodeId, searchTerm, maxDepth, isDescendantOfCollapsed]);

  // Expand / Collapse specific branches
  const toggleCollapseNode = useCallback((nodeId: string) => {
    setCollapsedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  // Fit graph view
  const handleRecenter = useCallback(() => {
    fitView({ padding: 0.15, duration: 800 });
  }, [fitView]);

  // Handle Node Click: Highlight, Center Node, load full story details, redirect
  const onNodeClick: NodeMouseHandler = useCallback(
    async (_, node) => {
      setSelectedNodeId(node.id);

      // Auto-center camera on the clicked node
      if (node.position) {
        setCenter(node.position.x + 120, node.position.y + 40, {
          zoom: 1.1,
          duration: 800,
        });
      }

      // Fetch full post content and switch workspace
      setIsOpeningStory(true);
      const toastId = toast.loading("Loading story workspace...");
      try {
        const post = await triggerGetPost(node.id).unwrap();
        if (post) {
          // Format structure to fit Redux slice expectancies
          const formattedStory = {
            id: post._id,
            title: post.title,
            chapters: [
              {
                id: 1,
                title: post.title,
                content: post.content,
                createdAt: post.createdAt,
              },
            ],
            userId: typeof post.author === "object" ? post.author._id : post.author,
          };
          dispatch(setStory(formattedStory));
          toast.success("Loaded story workspace!");
          navigate("/story-workspace");
        }
      } catch (error) {
        console.error("Failed to load story details:", error);
        toast.error("Failed to load story details.");
      } finally {
        toast.dismiss(toastId);
        setIsOpeningStory(false);
      }
    },
    [setCenter, triggerGetPost, dispatch, navigate]
  );

  return (
    <div className="relative flex flex-col h-[650px] w-full rounded-xl bg-slate-950 border border-slate-800 overflow-hidden text-gray-200">
      {/* Visualizer Controls bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center gap-3 bg-slate-900/90 backdrop-blur-md px-4 py-3 rounded-lg border border-slate-800 shadow-xl">
        {/* Title Search */}
        <div className="relative flex-1 min-w-[200px]">
          <input
            className="w-full h-9 pl-8 pr-3 bg-slate-950/80 border border-slate-800 rounded-md text-xs placeholder-slate-500 text-slate-200 focus:outline-none focus:border-indigo-500"
            placeholder="Search nodes by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="fas fa-search absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-500"></i>
        </div>

        {/* Max Depth Slider */}
        <div className="flex items-center gap-2 px-2 bg-slate-950/50 h-9 rounded-md border border-slate-800/40">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Max Depth:</span>
          <input
            type="range"
            min="0"
            max={maxTreeDepth}
            value={maxDepth}
            onChange={(e) => setMaxDepth(Number(e.target.value))}
            className="w-24 accent-indigo-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs font-bold text-indigo-400 w-5 text-center">{maxDepth}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {selectedNodeId && (
            <button
              onClick={() => toggleCollapseNode(selectedNodeId)}
              className="h-9 px-3 bg-slate-800 hover:bg-slate-700/80 rounded-md text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Expand/Collapse descendants of selected node"
            >
              <i className={`fas ${collapsedNodes.has(selectedNodeId) ? "fa-folder-open" : "fa-folder"} text-slate-400`}></i>
              {collapsedNodes.has(selectedNodeId) ? "Expand Node" : "Collapse Node"}
            </button>
          )}

          <button
            onClick={handleRecenter}
            className="h-9 px-3 bg-slate-800 hover:bg-slate-700/80 rounded-md text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            title="Recenter camera on tree"
          >
            <i className="fas fa-crosshairs text-slate-400"></i>
            Recenter
          </button>
        </div>
      </div>

      {/* React Flow Workspace Canvas */}
      <div className="flex-1 w-full h-full bg-slate-950/60">
        <ReactFlow
          nodes={filteredElements.nodes}
          edges={filteredElements.edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          minZoom={0.1}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#334155" gap={20} size={1} />
          <Controls className="react-flow__controls-dark" showInteractive={false} />
          <MiniMap
            nodeStrokeColor={(n) => (n.id === selectedNodeId ? "#6366f1" : "#1e293b")}
            nodeColor={(n) => (n.id === selectedNodeId ? "rgba(99,102,241,0.5)" : "#0f172a")}
            style={{ backgroundColor: "#020617", border: "1px solid #1e293b" }}
          />
        </ReactFlow>
      </div>

      {/* Loading Overlay */}
      {isOpeningStory && (
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] z-50 flex items-center justify-center">
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-6 py-5 shadow-2xl flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            <span className="text-sm font-semibold text-slate-200">Opening story details...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export const StoryTreeView: React.FC<StoryTreeViewProps> = ({ rootStoryId }) => {
  const { data, isLoading, isError, refetch } = useGetStoryTreeQuery(rootStoryId);

  // Parse layouted elements based on backend results
  const treeData = useMemo(() => {
    if (!data?.nodes || data.nodes.length === 0) {
      return { nodes: [], edges: [] };
    }
    // Typecast nodes to layout elements
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbNodes: DBStoryNode[] = data.nodes.map((node: any) => ({
      id: node.id,
      title: node.title,
      parentStoryId: node.parentStoryId || null,
      branchDepth: node.branchDepth ?? 0,
      createdAt: node.createdAt || "",
    }));

    return buildStoryTree(dbNodes);
  }, [data]);

  if (isLoading) {
    return (
      <div className="h-[600px] w-full rounded-xl bg-slate-950 border border-slate-850 flex flex-col items-center justify-center gap-3 text-slate-400">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        <span className="text-sm font-medium">Fetching story lineage tree...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-[600px] w-full rounded-xl bg-slate-950 border border-slate-850 flex flex-col items-center justify-center p-6 text-center text-slate-400">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 text-2xl text-rose-500 border border-rose-500/20">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <h4 className="text-base font-bold text-slate-200">Failed to load story tree</h4>
        <p className="mt-2 text-sm max-w-sm text-slate-500">
          We encountered an issue retrieving the lineage history. Please try again.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data?.nodes || data.nodes.length === 0) {
    return (
      <div className="h-[600px] w-full rounded-xl bg-slate-950 border border-slate-850 flex flex-col items-center justify-center p-6 text-center text-slate-400">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-2xl text-slate-600">
          <i className="fas fa-project-diagram"></i>
        </div>
        <h4 className="text-base font-bold text-slate-200">No Lineage History</h4>
        <p className="mt-2 text-sm max-w-sm text-slate-500">
          This story doesn't have any branches or variations yet.
        </p>
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <StoryTreeInner
        rootStoryId={rootStoryId}
        nodes={treeData.nodes}
        edges={treeData.edges}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rawNodes={data.nodes as any}
      />
    </ReactFlowProvider>
  );
};

export default StoryTreeView;
