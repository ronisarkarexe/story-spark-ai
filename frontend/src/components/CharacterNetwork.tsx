import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useGetCharacterNetworkQuery } from "../redux/apis/storyVersion.api";
import CharacterNode from "./CharacterNode";
import RelationshipEdge from "./RelationshipEdge";
import GraphFilters from "./GraphFilters";
import CharacterDetailsPanel from "./CharacterDetailsPanel";

const nodeTypes = {
  character: CharacterNode,
};

const edgeTypes = {
  relationship: RelationshipEdge,
};

interface CharacterNetworkProps {
  storyId: string;
}

const CharacterNetwork = ({ storyId }: CharacterNetworkProps) => {
  const { data: networkData, isLoading, error, refetch } = useGetCharacterNetworkQuery(storyId);

  // Filter States
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [minStrength, setMinStrength] = useState<number>(1);

  // Selection States
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Clear filters
  const handleClearFilters = useCallback(() => {
    setSearch("");
    setSelectedTypes([]);
    setMinStrength(1);
  }, []);

  // Sync / Refetch when story content changes
  useEffect(() => {
    refetch();
  }, [storyId, refetch]);

  // Nodes & Edges computing based on active filters
  const rawCharacters = useMemo(() => networkData?.characters || [], [networkData]);
  const rawRelationships = useMemo(() => networkData?.relationships || [], [networkData]);

  // Find selected item objects
  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return rawCharacters.find((c) => c.id === selectedNodeId) || null;
  }, [selectedNodeId, rawCharacters]);

  const selectedEdge = useMemo(() => {
    if (!selectedEdgeId) return null;
    return rawRelationships.find((r) => r.id === selectedEdgeId) || null;
  }, [selectedEdgeId, rawRelationships]);

  // Run filtering
  const filteredData = useMemo(() => {
    const searchLower = search.toLowerCase().trim();

    // 1. Filter characters by search name
    const matchedChars = rawCharacters.filter((char) =>
      char.name.toLowerCase().includes(searchLower)
    );
    const matchedCharIds = new Set(matchedChars.map((c) => c.id));

    // 2. Filter relationships
    const filteredRelationships = rawRelationships.filter((rel) => {
      // Connects visible characters
      const matchesChars = matchedCharIds.has(rel.source) && matchedCharIds.has(rel.target);
      // Matches type if any selected
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(rel.type);
      // Matches min strength
      const matchesStrength = rel.strength >= minStrength;

      return matchesChars && matchesType && matchesStrength;
    });

    // 3. To prevent lonely nodes when searching (unless searched directly), we keep characters that have at least one visible relationship,
    // or if search query is active we keep matching nodes.
    const activeCharIds = new Set<string>();
    filteredRelationships.forEach((rel) => {
      activeCharIds.add(rel.source);
      activeCharIds.add(rel.target);
    });

    // Final list of characters to display: matched by search, or participating in active relationships
    const finalCharacters = rawCharacters.filter((char) => {
      if (searchLower) {
        return char.name.toLowerCase().includes(searchLower);
      }
      return activeCharIds.has(char.id) || matchedCharIds.has(char.id);
    });

    return {
      characters: finalCharacters,
      relationships: filteredRelationships,
    };
  }, [rawCharacters, rawRelationships, search, selectedTypes, minStrength]);

  // Calculate circular layout positions
  useEffect(() => {
    const chars = filteredData.characters;
    const rels = filteredData.relationships;

    if (chars.length === 0) {
      setNodes([]);
      setEdges([]);
      return;
    }

    // Positions layout: circular
    const radius = Math.max(160, chars.length * 28);
    const cx = 350;
    const cy = 250;

    const newNodes = chars.map((char, index) => {
      const angle = (index / chars.length) * 2 * Math.PI;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);

      return {
        id: char.id,
        type: "character",
        position: { x, y },
        data: {
          name: char.name,
          appearanceCount: char.appearanceCount,
          importanceScore: char.importanceScore,
          isSelected: selectedNodeId === char.id,
        },
      };
    });

    const newEdges = rels.map((rel) => {
      return {
        id: rel.id,
        source: rel.source,
        target: rel.target,
        type: "relationship",
        selected: selectedEdgeId === rel.id,
        data: {
          type: rel.type,
          strength: rel.strength,
          interactionCount: rel.interactionCount,
        },
        animated: rel.strength > 70, // Animate strong relations for dynamic feel
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 12,
          height: 12,
          color: selectedEdgeId === rel.id ? "#6366F1" : "#4b5563",
        },
      };
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [filteredData, selectedNodeId, selectedEdgeId, setNodes, setEdges]);

  // Node Selection Handlers
  const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    setSelectedNodeId(node.id);
    setSelectedEdgeId(null);
  }, []);

  // Edge Selection Handlers
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: any) => {
    setSelectedEdgeId(edge.id);
    setSelectedNodeId(null);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }, []);

  const handleNodeSelect = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
    setSelectedEdgeId(null);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-[#101319] text-indigo-300 py-20">
        <i className="fas fa-spinner fa-spin text-3xl mb-3"></i>
        <span className="text-sm font-semibold">Analyzing story content...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-[#101319] text-rose-400 py-20 px-6 text-center">
        <i className="fas fa-exclamation-triangle text-3xl mb-3"></i>
        <h4 className="font-bold text-lg text-white">Analysis Failed</h4>
        <p className="text-xs max-w-sm mt-1 text-slate-400">
          We couldn't analyze the character network for this story. Make sure the story contains text and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row flex-1 bg-[#101319] overflow-hidden min-h-[600px] h-full">
      {/* Filters Side Panel */}
      <div className="p-4 md:border-r border-zinc-800 flex flex-col gap-4">
        <GraphFilters
          search={search}
          onSearchChange={setSearch}
          selectedTypes={selectedTypes}
          onTypesChange={setSelectedTypes}
          minStrength={minStrength}
          onMinStrengthChange={setMinStrength}
          onClear={handleClearFilters}
        />
        <CharacterDetailsPanel
          selectedNode={selectedNode}
          selectedEdge={selectedEdge}
          allCharacters={rawCharacters}
          allRelationships={rawRelationships}
          onNodeSelect={handleNodeSelect}
        />
      </div>

      {/* React Flow Graph Area */}
      <div className="flex-1 relative h-[500px] md:h-auto bg-zinc-950/20" aria-label="Character network graph workspace">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          maxZoom={2}
        >
          <Background color="#272a30" gap={16} size={1} />
          <Controls className="bg-zinc-900 border-zinc-800 text-white rounded-lg overflow-hidden [&_button]:bg-zinc-900 [&_button]:border-zinc-800 [&_button]:text-slate-300 hover:[&_button]:bg-zinc-800 [&_svg]:fill-slate-300" />
        </ReactFlow>
      </div>
    </div>
  );
};

export default CharacterNetwork;
