import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  useGetUniverseByIdQuery,
  useGetMemoriesQuery,
  useCreateMemoryMutation,
  useUpdateMemoryMutation,
  useDeleteMemoryMutation,
  useUpdateUniverseMutation,
  useDeleteUniverseMutation,
  useGetUniversesQuery,
} from "../../redux/apis/universe.api";
import { useGetPostListsQuery } from "../../redux/apis/post.api";
import { LoreForm } from "./LoreForm";

const TABS = [
  { id: "all", label: "All Lore", icon: "fas fa-folder-open" },
  { id: "character", label: "Characters", icon: "fas fa-user-ninja" },
  { id: "location", label: "Locations", icon: "fas fa-map-marked-alt" },
  { id: "magic_system", label: "Magic Systems", icon: "fas fa-magic" },
  { id: "object", label: "Artifacts", icon: "fas fa-gem" },
  { id: "rule", label: "Rules & Laws", icon: "fas fa-scroll" },
  { id: "event", label: "Events", icon: "fas fa-history" },
  { id: "other", label: "Other", icon: "fas fa-ellipsis-h" },
];

const LORE_TYPE_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  character: { label: "Character", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20", icon: "fas fa-user-ninja" },
  relationship: { label: "Relationship", color: "bg-rose-500/10 text-rose-400 border-rose-500/20", icon: "fas fa-heart-broken" },
  location: { label: "Location", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: "fas fa-map-marked-alt" },
  magic_system: { label: "Magic", color: "bg-purple-500/10 text-purple-400 border-purple-500/20", icon: "fas fa-magic" },
  object: { label: "Artifact", color: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: "fas fa-gem" },
  rule: { label: "Rule", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20", icon: "fas fa-scroll" },
  event: { label: "Event", color: "bg-orange-500/10 text-orange-400 border-orange-500/20", icon: "fas fa-history" },
  other: { label: "Other", color: "bg-slate-500/10 text-slate-400 border-slate-500/20", icon: "fas fa-ellipsis-h" },
};

export const UniverseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: universe, isLoading: isUniLoading, error: uniError } = useGetUniverseByIdQuery(id as string);
  const [updateUniverse, { isLoading: isUpdatingUni }] = useUpdateUniverseMutation();
  const [deleteUniverse] = useDeleteUniverseMutation();

  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: memories, isLoading: isMemLoading } = useGetMemoriesQuery({
    universeId: id as string,
    type: activeTab === "all" ? undefined : activeTab,
    searchTerm: searchTerm.trim() || undefined,
  });

  const [createMemory, { isLoading: isCreatingMemory }] = useCreateMemoryMutation();
  const [updateMemory, { isLoading: isUpdatingMemory }] = useUpdateMemoryMutation();
  const [deleteMemory] = useDeleteMemoryMutation();

  const { data: postData } = useGetPostListsQuery({ limit: 100 });

  // Modal control states
  const [isLoreModalOpen, setIsLoreModalOpen] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<any | null>(null);

  const [isUniEditOpen, setIsUniEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [isLinkStoriesOpen, setIsLinkStoriesOpen] = useState(false);

  const handleOpenEditUni = () => {
    if (universe) {
      setEditName(universe.name);
      setEditDescription(universe.description);
      setIsUniEditOpen(true);
    }
  };

  const handleUpdateUni = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editDescription.trim()) return;

    try {
      await updateUniverse({
        id: id as string,
        data: { name: editName.trim(), description: editDescription.trim() },
      }).unwrap();
      toast.success("Universe updated successfully!");
      setIsUniEditOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update universe.");
    }
  };

  const handleDeleteUni = async () => {
    if (window.confirm("Are you absolutely sure you want to delete this universe? This will unlink all stories and delete all stored lore entries permanently!")) {
      try {
        await deleteUniverse(id as string).unwrap();
        toast.success("Universe deleted successfully!");
        navigate("/dashboard/universes");
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to delete universe.");
      }
    }
  };

  const handleOpenAddLore = () => {
    setSelectedMemory(null);
    setIsLoreModalOpen(true);
  };

  const handleOpenEditLore = (memory: any) => {
    setSelectedMemory(memory);
    setIsLoreModalOpen(true);
  };

  const handleLoreSubmit = async (payload: any) => {
    try {
      if (selectedMemory) {
        await updateMemory({
          universeId: id as string,
          memoryId: selectedMemory._id,
          data: payload,
        }).unwrap();
        toast.success("Lore entry updated successfully!");
      } else {
        await createMemory({
          universeId: id as string,
          data: payload,
        }).unwrap();
        toast.success("Lore entry created successfully!");
      }
      setIsLoreModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save lore entry.");
    }
  };

  const handleDeleteLore = async (memoryId: string) => {
    if (window.confirm("Are you sure you want to delete this lore entry?")) {
      try {
        await deleteMemory({ universeId: id as string, memoryId }).unwrap();
        toast.success("Lore entry deleted successfully!");
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to delete lore entry.");
      }
    }
  };

  const toggleStoryLink = async (storyId: string) => {
    if (!universe) return;
    const isLinked = universe.stories?.some((s: any) => s._id === storyId);
    let updatedStories = universe.stories?.map((s: any) => s._id) || [];

    if (isLinked) {
      updatedStories = updatedStories.filter((sId: string) => sId !== storyId);
    } else {
      updatedStories = [...updatedStories, storyId];
    }

    try {
      await updateUniverse({
        id: id as string,
        data: { stories: updatedStories },
      }).unwrap();
      toast.success(isLinked ? "Story unlinked successfully." : "Story linked successfully.");
    } catch (err: any) {
      toast.error("Failed to update story links.");
    }
  };

  if (isUniLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-indigo-300">
        <i className="fas fa-circle-notch fa-spin text-4xl mb-3"></i>
        <span className="text-sm font-semibold">Loading universe details...</span>
      </div>
    );
  }

  if (uniError || !universe) {
    return (
      <div className="text-center py-20 text-rose-400">
        <i className="fas fa-exclamation-triangle text-4xl mb-3"></i>
        <h3 className="text-lg font-bold">Universe not found</h3>
        <p className="text-sm text-slate-400 mt-1">Make sure you have access to this universe.</p>
        <button
          onClick={() => navigate("/dashboard/universes")}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm"
        >
          Back to universes
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-transparent p-1 sm:p-4 text-slate-100">
      <Toaster position="top-right" />

      {/* Universe Profile Hub */}
      <div className="mb-8 p-6 rounded-2xl bg-slate-900/30 border border-white/5 backdrop-blur-md flex flex-col md:flex-row justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {universe.name}
            </h2>
            <button
              onClick={handleOpenEditUni}
              className="text-slate-400 hover:text-slate-200 transition text-sm cursor-pointer"
              aria-label="Edit universe details"
            >
              <i className="fas fa-edit"></i>
            </button>
          </div>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            {universe.description}
          </p>

          <div className="flex flex-wrap gap-4 mt-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <i className="fas fa-scroll"></i> {memories?.length || 0} Lore Entries
            </span>
            <span className="flex items-center gap-1.5">
              <i className="fas fa-book-open"></i> {universe.stories?.length || 0} Linked Stories
            </span>
          </div>
        </div>

        <div className="flex flex-row md:flex-col gap-3 justify-end mt-auto">
          <button
            onClick={() => setIsLinkStoriesOpen(true)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-2 rounded-xl transition flex items-center gap-2 cursor-pointer text-xs"
          >
            <i className="fas fa-link"></i> Link Stories
          </button>
          <button
            onClick={handleDeleteUni}
            className="bg-rose-950/20 border border-rose-900/30 hover:bg-rose-900/20 text-rose-400 font-semibold px-4 py-2 rounded-xl transition flex items-center gap-2 cursor-pointer text-xs"
          >
            <i className="fas fa-trash-alt"></i> Delete Universe
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content: Lore entries list */}
        <div className="flex-1 space-y-6">
          {/* Navigation Tabs and Search */}
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-slate-900/20 border border-white/5 p-4 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search lore details..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <i className="fas fa-search text-xs"></i>
                </span>
              </div>
            </div>
            
            <button
              onClick={handleOpenAddLore}
              className="bg-indigo-650 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow transition flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              <i className="fas fa-plus"></i> Add Lore Entry
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin scrollbar-thumb-white/15">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow"
                    : "bg-slate-900/40 text-slate-400 hover:text-slate-250 border border-white/5"
                }`}
              >
                <i className={tab.icon}></i>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Lore cards grid */}
          {!isMemLoading ? (
            memories && memories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {memories.map((mem) => {
                  const meta = LORE_TYPE_LABELS[mem.type] || LORE_TYPE_LABELS.other;

                  return (
                    <div
                      key={mem._id}
                      className="group relative flex flex-col justify-between p-5 rounded-2xl bg-slate-900/40 border border-white/10 hover:border-indigo-500/30 transition-all duration-300"
                    >
                      <div>
                        <div className="flex justify-between items-start gap-3 mb-3">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${meta.color} flex items-center gap-1.5`}>
                            <i className={meta.icon}></i> {meta.label}
                          </span>
                          
                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpenEditLore(mem)}
                              className="text-slate-400 hover:text-slate-200 transition text-xs p-1.5 cursor-pointer"
                              aria-label="Edit lore"
                            >
                              <i className="fas fa-pencil-alt"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteLore(mem._id)}
                              className="text-slate-500 hover:text-rose-400 transition text-xs p-1.5 cursor-pointer"
                              aria-label="Delete lore"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </div>

                        <h4 className="text-base font-bold text-slate-200 mb-2">
                          {mem.title}
                        </h4>
                        
                        <p className="text-slate-400 text-xs leading-relaxed whitespace-pre-line line-clamp-4 mb-4">
                          {mem.content}
                        </p>
                      </div>

                      <div className="space-y-3 pt-3 mt-auto border-t border-white/5">
                        {/* Attributes lists */}
                        {mem.attributes && Object.keys(mem.attributes).length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {Object.entries(mem.attributes).map(([key, value]) => (
                              <span
                                key={key}
                                className="inline-flex text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-lg border border-white/5"
                              >
                                <strong className="text-slate-450 mr-1">{key}:</strong> {String(value)}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Tags list */}
                        {mem.tags && mem.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {mem.tags.map((tag: string) => (
                              <span
                                key={tag}
                                className="text-[10px] text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded-full"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-900/10 rounded-2xl border border-white/5 p-6">
                <i className="fas fa-feather-alt text-3xl text-slate-600 mb-3"></i>
                <h4 className="font-bold text-slate-350">No lore entries found</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Add custom lore entries in this category. They will automatically be parsed during AI generations to maintain coherence.
                </p>
              </div>
            )
          ) : (
            <div className="flex justify-center py-20 text-indigo-300">
              <i className="fas fa-circle-notch fa-spin text-2xl"></i>
            </div>
          )}
        </div>

        {/* Sidebar: Linked stories lists */}
        <div className="w-full lg:w-72 space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/35 border border-white/10 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
              <i className="fas fa-book-open text-indigo-400"></i> Linked Stories
            </h3>
            
            <div className="space-y-3">
              {universe.stories && universe.stories.length > 0 ? (
                universe.stories.map((story: any) => (
                  <div
                    key={story._id}
                    className="flex justify-between items-center p-3 rounded-xl bg-slate-900/60 border border-white/5 text-xs font-semibold group"
                  >
                    <span className="truncate flex-1 pr-2 text-slate-300">{story.title}</span>
                    <button
                      onClick={() => toggleStoryLink(story._id)}
                      className="text-slate-500 hover:text-rose-400 transition ml-2 opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Unlink story"
                    >
                      <i className="fas fa-unlink"></i>
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic p-3 text-center bg-slate-950/20 rounded-xl">
                  No linked stories.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lore Entry Form Modal */}
      {isLoreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsLoreModalOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-100 mb-6">
              {selectedMemory ? "Edit Lore Entry" : "Create Lore Entry"}
            </h3>
            
            <LoreForm
              initialData={selectedMemory}
              onSubmit={handleLoreSubmit}
              onCancel={() => setIsLoreModalOpen(false)}
              isSubmitting={isCreatingMemory || isUpdatingMemory}
            />
          </div>
        </div>
      )}

      {/* Edit Universe Details Modal */}
      {isUniEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsUniEditOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl z-10">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Edit Universe Details</h3>
            
            <form onSubmit={handleUpdateUni} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsUniEditOpen(false)}
                  className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/[0.05] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingUni}
                  className="rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white px-4 py-2.5 text-sm font-semibold shadow transition cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Link Stories Modal */}
      {isLinkStoriesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsLinkStoriesOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl z-10 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Link Stories to Universe</h3>
            <p className="text-xs text-slate-400 mb-4">
              Select stories to link them directly to this universe so they automatically share lore context.
            </p>

            <div className="space-y-2 border border-white/10 rounded-xl p-2 max-h-60 overflow-y-auto bg-slate-900">
              {postData?.posts && postData.posts.length > 0 ? (
                postData.posts.map((post) => {
                  const isLinked = universe.stories?.some((s: any) => s._id === post._id);
                  return (
                    <div
                      key={post._id}
                      onClick={() => toggleStoryLink(post._id)}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition ${
                        isLinked
                          ? "bg-indigo-600/20 text-indigo-300"
                          : "hover:bg-white/[0.05] text-slate-350"
                      }`}
                    >
                      <span className="text-xs truncate font-medium pr-2">{post.title}</span>
                      <span className={`text-[10px] font-bold ${isLinked ? "text-indigo-400" : "text-slate-500"}`}>
                        {isLinked ? "Linked" : "Click to Link"}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-500 italic p-3 text-center">
                  No stories available.
                </p>
              )}
            </div>

            <div className="flex justify-end pt-4 mt-4 border-t border-white/5">
              <button
                type="button"
                onClick={() => setIsLinkStoriesOpen(false)}
                className="rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 text-xs font-semibold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default UniverseDetails;
