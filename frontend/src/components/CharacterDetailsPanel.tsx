import React from "react";

interface Character {
  id: string;
  name: string;
  appearanceCount: number;
  importanceScore: number;
}

interface Relationship {
  id: string;
  source: string;
  target: string;
  type: string;
  strength: number;
  interactionCount: number;
}

interface CharacterDetailsPanelProps {
  selectedNode: Character | null;
  selectedEdge: Relationship | null;
  allCharacters: Character[];
  allRelationships: Relationship[];
  onNodeSelect: (nodeId: string) => void;
}

const CharacterDetailsPanel = ({
  selectedNode,
  selectedEdge,
  allCharacters,
  allRelationships,
  onNodeSelect,
}: CharacterDetailsPanelProps) => {
  const getCharacterName = (id: string) => {
    return allCharacters.find((c) => c.id === id)?.name || id;
  };

  return (
    <div className="flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl p-4 w-full md:w-80 shadow-md h-fit text-sm text-slate-300">
      <div className="pb-2 border-b border-zinc-800">
        <h3 className="font-bold text-white text-base">Details</h3>
      </div>

      {selectedNode ? (
        <div className="flex flex-col gap-4 mt-3">
          <div>
            <h4 className="text-xl font-bold text-white leading-tight">{selectedNode.name}</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded text-xs font-semibold">
                Score: <strong>{selectedNode.importanceScore}%</strong>
              </span>
              <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded text-xs font-semibold">
                Mentions: <strong>{selectedNode.appearanceCount}</strong>
              </span>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Relationships
            </h5>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
              {allRelationships
                .filter((r) => r.source === selectedNode.id || r.target === selectedNode.id)
                .map((r) => {
                  const targetId = r.source === selectedNode.id ? r.target : r.source;
                  const targetName = getCharacterName(targetId);
                  return (
                    <button
                      key={r.id}
                      onClick={() => onNodeSelect(targetId)}
                      className="flex justify-between items-center bg-zinc-950 hover:bg-zinc-800/50 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-left text-slate-300 transition"
                    >
                      <span className="font-semibold text-slate-200">{targetName}</span>
                      <span className="text-[10px] bg-slate-800 text-indigo-300 border border-zinc-800 px-1.5 py-0.5 rounded-full font-medium">
                        {r.type} ({r.strength})
                      </span>
                    </button>
                  );
                })}
              {allRelationships.filter((r) => r.source === selectedNode.id || r.target === selectedNode.id).length === 0 && (
                <div className="text-xs text-slate-500 italic">No recorded relationships.</div>
              )}
            </div>
          </div>
        </div>
      ) : selectedEdge ? (
        <div className="flex flex-col gap-4 mt-3 text-xs">
          <div>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
              Relationship Link
            </span>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="font-bold text-white text-sm">
                {getCharacterName(selectedEdge.source)}
              </span>
              <span className="text-zinc-500">↔</span>
              <span className="font-bold text-white text-sm">
                {getCharacterName(selectedEdge.target)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg">
            <div>
              <span className="text-[10px] text-slate-500 block">Type</span>
              <strong className="text-white text-sm font-semibold">{selectedEdge.type}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Strength</span>
              <strong className="text-white text-sm font-semibold">{selectedEdge.strength}/100</strong>
            </div>
            <div className="col-span-2 pt-1.5 border-t border-zinc-800 mt-1">
              <span className="text-[10px] text-slate-500 block">Direct Interactions</span>
              <strong className="text-white text-sm font-semibold">
                {selectedEdge.interactionCount}
              </strong>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-10 text-center italic text-xs text-slate-500">
          Select a character or link on the graph to inspect details.
        </div>
      )}
    </div>
  );
};

export default CharacterDetailsPanel;
