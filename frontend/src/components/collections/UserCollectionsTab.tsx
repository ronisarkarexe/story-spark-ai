/* eslint-disable */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useGetUserCollectionsQuery, useCreateCollectionMutation } from "../../redux/apis/collection.api";

interface Props {
  userId: string;
  isOwner: boolean;
}

const UserCollectionsTab: React.FC<Props> = ({ userId, isOwner }) => {
  const { data: collections, isLoading } = useGetUserCollectionsQuery(userId);
  const [createCollection, { isLoading: isCreating }] = useCreateCollectionMutation();

  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");

  const handleCreate = async () => {
    if (!title.trim()) { toast.error("Title is required."); return; }
    try {
      await createCollection({ title: title.trim(), description: description.trim() || undefined, visibility }).unwrap();
      toast.success("Collection created!");
      setShowCreate(false);
      setTitle("");
      setDescription("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create collection.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create new — only for owner */}
      {isOwner && (
        <div>
          {!showCreate ? (
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition cursor-pointer shadow-md"
            >
              + New Collection
            </button>
          ) : (
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 space-y-3 max-w-lg">
              <h3 className="font-bold text-white text-sm">Create Collection</h3>
              <input
                type="text"
                placeholder="Collection title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
              <textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                rows={2}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none"
              />
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
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
                  disabled={isCreating}
                  className="flex-1 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 text-sm font-semibold transition disabled:opacity-50 cursor-pointer"
                >
                  {isCreating ? "Creating…" : "Create"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Collection grid */}
      {collections && collections.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((col) => {
            const previewStories = col.storyIds?.slice(0, 3) ?? [];
            return (
              <Link
                key={col._id}
                to={`/collections/${col._id}`}
                className="group bg-gray-50 border border-gray-200 dark:bg-slate-800/60 dark:border-slate-700 rounded-2xl overflow-hidden hover:shadow-xl hover:border-indigo-400/50 transition-all duration-300 block"
              >
                {/* Mini mosaic preview */}
                <div className="relative w-full h-36 bg-gradient-to-br from-indigo-700/40 via-purple-800/30 to-slate-900 flex items-center justify-center overflow-hidden">
                  {previewStories.length > 0 ? (
                    <div className="grid grid-cols-3 gap-0.5 w-full h-full">
                      {previewStories.map((story: any) =>
                        story.imageURL ? (
                          <img
                            key={story._id}
                            src={story.imageURL}
                            alt={story.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div key={story._id} className="w-full h-full bg-indigo-900/40 flex items-center justify-center text-2xl">
                            📖
                          </div>
                        )
                      )}
                      {/* Fill remaining slots */}
                      {Array.from({ length: 3 - previewStories.length }).map((_, i) => (
                        <div key={`empty-${i}`} className="w-full h-full bg-slate-800/40" />
                      ))}
                    </div>
                  ) : (
                    <span className="text-4xl">📚</span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span
                    className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      col.visibility === "public"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-slate-700/60 text-slate-300 border border-slate-600"
                    }`}
                  >
                    {col.visibility === "public" ? "🌐" : "🔒"}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm leading-snug group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition line-clamp-2">
                    {col.title}
                  </h3>
                  {col.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {col.description}
                    </p>
                  )}
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                    {col.storyIds?.length ?? 0} stories
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <span className="text-4xl">📭</span>
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mt-3">
            No collections yet
          </h3>
          {isOwner && (
            <p className="text-slate-500 text-sm mt-1">
              Create your first collection above to showcase your stories as a series.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserCollectionsTab;
