import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  useGetUniversesQuery,
  useCreateUniverseMutation,
} from "../../redux/apis/universe.api";
import { useGetPostListsQuery } from "../../redux/apis/post.api";

export const UniverseDashboard: React.FC = () => {
  const { data: universes, isLoading, error } = useGetUniversesQuery();
  const [createUniverse, { isLoading: isCreating }] = useCreateUniverseMutation();
  const { data: postData } = useGetPostListsQuery({ limit: 100 });

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedStories, setSelectedStories] = useState<string[]>([]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      await createUniverse({
        name: name.trim(),
        description: description.trim(),
        stories: selectedStories,
      }).unwrap();

      toast.success("Universe created successfully!");
      setIsOpen(false);
      setName("");
      setDescription("");
      setSelectedStories([]);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create universe.");
    }
  };

  const toggleStorySelection = (storyId: string) => {
    setSelectedStories((prev) =>
      prev.includes(storyId)
        ? prev.filter((id) => id !== storyId)
        : [...prev, storyId]
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-indigo-300">
        <i className="fas fa-circle-notch fa-spin text-4xl mb-3"></i>
        <span className="text-sm font-semibold">Loading your Story Universes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-rose-400">
        <i className="fas fa-exclamation-triangle text-4xl mb-3"></i>
        <h3 className="text-lg font-bold">Failed to load universes</h3>
        <p className="text-sm text-slate-400 mt-1">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-transparent p-1 sm:p-4 text-slate-100">
      <Toaster position="top-right" />
      
      {/* Header section with glassmorphism accent */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 p-6 rounded-2xl bg-slate-900/30 border border-white/5 backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Story Universes
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Build and manage persistent lore, characters, and rules to keep your AI-generated stories consistent.
          </p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-indigo-500/20 transition flex items-center gap-2 cursor-pointer text-sm"
        >
          <i className="fas fa-plus"></i> Create Universe
        </button>
      </div>

      {/* Grid of Universes */}
      {universes && universes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {universes.map((uni) => (
            <Link
              key={uni._id}
              to={`/dashboard/universes/${uni._id}`}
              className="group relative flex flex-col justify-between p-6 rounded-2xl bg-slate-900/40 border border-white/10 hover:border-indigo-500/50 shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              {/* Background gradient micro-animation */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

              <div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">
                    {uni.name}
                  </h3>
                  <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs">
                    <i className="fas fa-globe"></i>
                  </span>
                </div>
                <p className="text-slate-400 text-sm line-clamp-3 mb-6">
                  {uni.description}
                </p>
              </div>

              <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-auto">
                <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                  <i className="fas fa-book-open"></i> {uni.stories?.length || 0} Linked Stories
                </span>
                <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore Lore <i className="fas fa-arrow-right"></i>
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl bg-slate-900/20 border border-white/5 backdrop-blur-sm">
          <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-2xl mb-4">
            <i className="fas fa-globe-americas animate-pulse"></i>
          </div>
          <h3 className="text-lg font-bold text-slate-350">No Story Universes yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mt-1 mb-6">
            Create a story universe to store character details, settings, and magic systems that the AI will remember.
          </p>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-indigo-650 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-indigo-500/20 transition cursor-pointer text-sm"
          >
            Create Your First Universe
          </button>
        </div>
      )}

      {/* Creation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog */}
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-100 mb-4">Create Story Universe</h3>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Universe Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Elderwood Saga, Neo-Tokyo 2099"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the world, its theme, genres, and central lore overview..."
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Link Existing Stories
                </label>
                <div className="border border-white/10 rounded-xl max-h-40 overflow-y-auto p-2 bg-slate-900 space-y-1">
                  {postData?.posts && postData.posts.length > 0 ? (
                    postData.posts.map((post) => (
                      <div
                        key={post._id}
                        onClick={() => toggleStorySelection(post._id)}
                        className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition ${
                          selectedStories.includes(post._id)
                            ? "bg-indigo-600/30 text-indigo-300"
                            : "hover:bg-white/[0.05] text-slate-350"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedStories.includes(post._id)}
                          onChange={() => {}} // Handled by onClick of row
                          className="rounded text-indigo-600 focus:ring-indigo-500 border-white/10"
                        />
                        <span className="text-xs truncate font-medium">{post.title}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic p-2 text-center">
                      No stories available to link.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/[0.05] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white px-4 py-2.5 text-sm font-semibold shadow transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {isCreating ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Creating...
                    </>
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default UniverseDashboard;
