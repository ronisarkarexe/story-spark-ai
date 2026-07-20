/* eslint-disable */
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import {
  useGetUserCollectionsQuery,
  useAddStoryToCollectionMutation,
  useCreateCollectionMutation,
} from "../../redux/apis/collection.api";

interface Props {
  storyId: string;
  userId: string;
  onClose: () => void;
}

const AddToCollectionModal: React.FC<Props> = ({ storyId, userId, onClose }) => {
  const { data: collections, isLoading } = useGetUserCollectionsQuery(userId);
  const [addStory, { isLoading: isAdding }] = useAddStoryToCollectionMutation();
  const [createCollection, { isLoading: isCreating }] = useCreateCollectionMutation();

  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newVisibility, setNewVisibility] = useState<"public" | "private">("public");

  const handleAdd = async (collectionId: string) => {
    try {
      await addStory({ collectionId, storyId }).unwrap();
      toast.success("Story added to collection!");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add story.");
    }
  };

  const handleCreate = async () => {
    if (!newTitle.trim()) {
      toast.error("Collection title is required.");
      return;
    }
    try {
      const res: any = await createCollection({
        title: newTitle.trim(),
        description: newDesc.trim() || undefined,
        visibility: newVisibility,
      }).unwrap();
      // Now add the story to the newly created collection
      await addStory({ collectionId: res.data._id, storyId }).unwrap();
      toast.success("Collection created and story added!");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create collection.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white">Add to Collection</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition text-xl leading-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="text-slate-400 text-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-indigo-500 mx-auto mb-2" />
              Loading collections…
            </div>
          ) : collections && collections.length > 0 ? (
            <div className="space-y-2">
              {collections.map((col) => (
                <button
                  key={col._id}
                  onClick={() => handleAdd(col._id)}
                  disabled={isAdding}
                  className="w-full flex items-center gap-3 p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500 rounded-xl transition text-left disabled:opacity-50 cursor-pointer group"
                >
                  {col.coverImageUrl ? (
                    <img
                      src={col.coverImageUrl}
                      alt={col.title}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-indigo-600/30 flex items-center justify-center text-lg flex-shrink-0">
                      📚
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">{col.title}</p>
                    <p className="text-xs text-slate-400">
                      {col.storyIds?.length ?? 0} stories · {col.visibility}
                    </p>
                  </div>
                  <span className="text-indigo-400 opacity-0 group-hover:opacity-100 transition text-sm">
                    Add →
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm text-center py-4">
              No collections yet. Create one below.
            </p>
          )}

          {/* Divider */}
          <div className="border-t border-slate-800 pt-4">
            {!showCreate ? (
              <button
                onClick={() => setShowCreate(true)}
                className="w-full py-2 rounded-xl border border-dashed border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10 transition text-sm font-semibold cursor-pointer"
              >
                + Create New Collection
              </button>
            ) : (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-300">New Collection</h3>
                <input
                  type="text"
                  placeholder="Collection title *"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  maxLength={200}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
                <textarea
                  placeholder="Short description (optional)"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  maxLength={500}
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none"
                />
                <select
                  value={newVisibility}
                  onChange={(e) => setNewVisibility(e.target.value as "public" | "private")}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="public">🌐 Public</option>
                  <option value="private">🔒 Private</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCreate(false)}
                    className="flex-1 py-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 text-sm transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={isCreating || isAdding}
                    className="flex-1 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 text-sm font-semibold transition disabled:opacity-50 cursor-pointer"
                  >
                    {isCreating || isAdding ? "Creating…" : "Create & Add"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCollectionModal;
