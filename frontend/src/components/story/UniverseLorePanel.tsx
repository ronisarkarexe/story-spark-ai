import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  useGetUniversesQuery,
  useGetMemoriesQuery,
  useCreateMemoryMutation,
  useUpdateUniverseMutation,
} from "../../redux/apis/universe.api";
import { LoreForm } from "../story-universe/LoreForm";

interface Props {
  storyId: string;
}

const CATEGORIES = [
  { id: "all", label: "All Lore", icon: "fas fa-folder-open" },
  { id: "character", label: "Characters", icon: "fas fa-user-ninja" },
  { id: "location", label: "Locations", icon: "fas fa-map-marked-alt" },
  { id: "magic_system", label: "Magic", icon: "fas fa-magic" },
  { id: "object", label: "Artifacts", icon: "fas fa-gem" },
  { id: "rule", label: "Rules", icon: "fas fa-scroll" },
  { id: "event", label: "Events", icon: "fas fa-history" },
  { id: "other", label: "Other", icon: "fas fa-ellipsis-h" },
];

export const UniverseLorePanel: React.FC<Props> = ({ storyId }) => {
  const { data: universes, isLoading: isUnisLoading } = useGetUniversesQuery();
  const [selectedUniverseId, setSelectedUniverseId] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [expandedMemoryId, setExpandedMemoryId] = useState<string | null>(null);

  // Modals and operations
  const [isLoreModalOpen, setIsLoreModalOpen] = useState(false);
  const [createMemory, { isLoading: isCreating }] = useCreateMemoryMutation();
  const [updateUniverse] = useUpdateUniverseMutation();

  // Load from local storage on mount/storyId change
  useEffect(() => {
    const saved = localStorage.getItem(`story_universe_${storyId}`);
    if (saved) {
      setSelectedUniverseId(saved);
    } else {
      setSelectedUniverseId("");
    }
  }, [storyId]);

  const { data: memories, isLoading: isMemoriesLoading } = useGetMemoriesQuery(
    {
      universeId: selectedUniverseId,
      type: activeCategory === "all" ? undefined : activeCategory,
      searchTerm: searchTerm.trim() || undefined,
    },
    { skip: !selectedUniverseId }
  );

  const handleUniverseChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const universeId = e.target.value;
    setSelectedUniverseId(universeId);

    if (universeId) {
      localStorage.setItem(`story_universe_${storyId}`, universeId);
      toast.success("Story linked to universe!");

      // Also attempt to update the universe stories list on the backend if storyId is a valid MongoDB ID
      const isValidMongoId = /^[0-9a-fA-F]{24}$/.test(storyId);
      if (isValidMongoId) {
        try {
          const selectedUniverse = universes?.find((u) => u._id === universeId);
          const currentStories = selectedUniverse?.stories?.map((s: any) => s._id) || [];
          if (!currentStories.includes(storyId)) {
            await updateUniverse({
              id: universeId,
              data: { stories: [...currentStories, storyId] },
            }).unwrap();
          }
        } catch (err) {
          console.warn("Failed to link story in backend universe:", err);
        }
      }
    } else {
      localStorage.removeItem(`story_universe_${storyId}`);
      toast.success("Universe unlinked.");
    }
  };

  const handleLoreSubmit = async (payload: any) => {
    if (!selectedUniverseId) return;

    try {
      await createMemory({
        universeId: selectedUniverseId,
        data: payload,
      }).unwrap();
      toast.success("Lore entry added to universe!");
      setIsLoreModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save lore entry.");
    }
  };

  return (
    <div className="w-80 h-full flex flex-col bg-zinc-950/90 border-l border-zinc-800 backdrop-blur-md text-zinc-150 select-none">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <i className="fas fa-globe text-indigo-400"></i> Universe Lore
        </h3>
        {selectedUniverseId && (
          <button
            onClick={() => setIsLoreModalOpen(true)}
            className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wide transition cursor-pointer"
            title="Add Lore Entry"
          >
            <i className="fas fa-plus"></i> Add
          </button>
        )}
      </div>

      {/* Universe Selector */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-950/40">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
          Linked Universe
        </label>
        {isUnisLoading ? (
          <div className="h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs text-zinc-500">
            <i className="fas fa-spinner fa-spin mr-2"></i> Loading universes...
          </div>
        ) : (
          <div className="relative">
            <select
              value={selectedUniverseId}
              onChange={handleUniverseChange}
              className="w-full text-xs rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-200 outline-none focus:border-indigo-500 appearance-none cursor-pointer"
            >
              <option value="">-- No Universe Linked --</option>
              {universes?.map((uni) => (
                <option key={uni._id} value={uni._id}>
                  {uni.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400 text-[10px]">
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
        )}
      </div>

      {/* Main Panel Content */}
      {selectedUniverseId ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search bar */}
          <div className="p-3 border-b border-zinc-800/40">
            <div className="relative">
              <input
                type="text"
                placeholder="Search lore entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-[11px] rounded-lg border border-zinc-850 bg-zinc-900/60 pl-8 pr-3 py-1.5 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
              <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-zinc-500 text-[10px]">
                <i className="fas fa-search"></i>
              </span>
            </div>
          </div>

          {/* Categories Horizontal scroll */}
          <div className="flex gap-1.5 px-3 py-2 overflow-x-auto border-b border-zinc-850/30 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setExpandedMemoryId(null);
                }}
                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 transition whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-indigo-600 text-white"
                    : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800/50"
                }`}
              >
                <i className={cat.icon}></i>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Memories list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 scrollbar-thin">
            {!isMemoriesLoading ? (
              memories && memories.length > 0 ? (
                memories.map((mem) => {
                  const isExpanded = expandedMemoryId === mem._id;
                  return (
                    <div
                      key={mem._id}
                      onClick={() => setExpandedMemoryId(isExpanded ? null : mem._id)}
                      className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700/60 transition cursor-pointer"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/5 px-1.5 py-0.5 rounded border border-indigo-500/10">
                          {mem.type}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          <i className={`fas ${isExpanded ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-zinc-200 truncate">{mem.title}</h4>
                      
                      {isExpanded ? (
                        <div className="mt-2 text-[11px] leading-relaxed text-zinc-400 space-y-2 border-t border-zinc-800/40 pt-2 whitespace-pre-line">
                          <p>{mem.content}</p>
                          
                          {mem.attributes && Object.keys(mem.attributes).length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {Object.entries(mem.attributes).map(([key, value]) => (
                                <span
                                  key={key}
                                  className="text-[9px] bg-zinc-800 text-zinc-350 px-1.5 py-0.5 rounded border border-zinc-750"
                                >
                                  <strong>{key}:</strong> {String(value)}
                                </span>
                              ))}
                            </div>
                          )}

                          {mem.tags && mem.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {mem.tags.map((tag) => (
                                <span key={tag} className="text-[9px] text-indigo-400 font-medium">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-[10px] text-zinc-500 line-clamp-1 mt-1">{mem.content}</p>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 px-4">
                  <i className="fas fa-feather-alt text-zinc-700 text-xl mb-2"></i>
                  <p className="text-xs text-zinc-500">No lore entries found</p>
                  <p className="text-[10px] text-zinc-650 mt-0.5">
                    Add new custom profiles/rules for the AI to keep consistent.
                  </p>
                </div>
              )
            ) : (
              <div className="flex justify-center py-10 text-indigo-400">
                <i className="fas fa-circle-notch fa-spin"></i>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Unlinked state description */
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-3">
            <i className="fas fa-globe-americas"></i>
          </div>
          <h4 className="text-xs font-bold text-zinc-400">No Universe Linked</h4>
          <p className="text-[10px] text-zinc-650 max-w-[180px] mt-1">
            Associate this story with a universe to retrieve lore context during auto-generations.
          </p>
        </div>
      )}

      {/* Lore Entry Form Modal */}
      {isLoreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsLoreModalOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl z-10 max-h-[85vh] overflow-y-auto">
            <h3 className="text-base font-bold text-zinc-100 mb-4">
              Add New Lore Entry
            </h3>
            
            <LoreForm
              onSubmit={handleLoreSubmit}
              onCancel={() => setIsLoreModalOpen(false)}
              isSubmitting={isCreating}
            />
          </div>
        </div>
      )}
    </div>
  );
};
