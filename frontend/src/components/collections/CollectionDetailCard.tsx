import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Collection } from "../../models/collection";
import {
  useDeleteCollectionMutation,
  useRemoveStoryFromCollectionMutation,
  useUpdateCollectionMutation,
} from "../../redux/apis/collection.api";
interface Props {
  collection: Collection;
  isOwner: boolean;
  onDelete?: () => void;
}

const CollectionDetailCard: React.FC<Props> = ({ collection, isOwner, onDelete }) => {
  const navigate = useNavigate();
  const [deleteCollection, { isLoading: isDeleting }] = useDeleteCollectionMutation();
  const [removeStory] = useRemoveStoryFromCollectionMutation();
  const [updateCollection] = useUpdateCollectionMutation();

  const handleDelete = async () => {
    if (!window.confirm("Delete this collection? The stories won't be removed.")) return;
    try {
      await deleteCollection(collection._id).unwrap();
      toast.success("Collection deleted.");
      onDelete?.();
      navigate(-1);
    } catch {
      toast.error("Failed to delete collection.");
    }
  };

  const handleRemoveStory = async (storyId: string) => {
    try {
      await removeStory({ collectionId: collection._id, storyId }).unwrap();
      toast.success("Story removed from collection.");
    } catch {
      toast.error("Failed to remove story.");
    }
  };

  const handleToggleVisibility = async () => {
    const newVisibility = collection.visibility === "public" ? "private" : "public";
    try {
      await updateCollection({
        id: collection._id,
        data: { visibility: newVisibility },
      }).unwrap();
      toast.success(`Collection is now ${newVisibility}.`);
    } catch {
      toast.error("Failed to update visibility.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-[#0b1329] dark:text-white">
      {/* Hero banner */}
      <div
        className="relative w-full h-64 bg-gradient-to-br from-indigo-700 via-purple-800 to-slate-900 overflow-hidden flex items-end"
        style={
          collection.coverImageUrl
            ? { backgroundImage: `url(${collection.coverImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
            : {}
        }
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative z-10 px-8 pb-8 w-full flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl">📚</span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  collection.visibility === "public"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-slate-700/60 text-slate-300 border border-slate-600"
                }`}
              >
                {collection.visibility === "public" ? "🌐 Public" : "🔒 Private"}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white drop-shadow-lg leading-tight">
              {collection.title}
            </h1>
            {collection.description && (
              <p className="text-slate-300 text-sm mt-1 max-w-xl leading-relaxed">
                {collection.description}
              </p>
            )}
            <p className="text-slate-400 text-xs mt-2">
              {collection.storyIds?.length ?? 0} stories
            </p>
          </div>

          {isOwner && (
            <div className="flex flex-col gap-2 flex-shrink-0">
              <button
                onClick={handleToggleVisibility}
                className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition cursor-pointer"
              >
                {collection.visibility === "public" ? "Make Private" : "Make Public"}
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-xs px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 transition disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Story grid */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {collection.storyIds && collection.storyIds.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {collection.storyIds.map((story) => (
              <div
                key={story._id}
                className="group relative bg-gray-50 border border-gray-200 dark:bg-slate-800/60 dark:border-slate-700 rounded-2xl overflow-hidden hover:shadow-xl hover:border-indigo-400/50 transition-all duration-300"
              >
                {/* Cover image */}
                {story.imageURL && (
                  <div className="w-full h-40 overflow-hidden">
                    <img
                      src={story.imageURL}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="p-4">
                  <Link
                    to={`/post/${story._id}`}
                    className="text-base font-bold text-slate-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition line-clamp-2 leading-snug"
                  >
                    {story.title}
                  </Link>

                  {story.author && (
                    <Link
                      to={`/profile/${story.author._id}`}
                      className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition mt-1 block"
                    >
                      by {story.author.name}
                    </Link>
                  )}

                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-500 dark:text-slate-500">
                    <span>❤️ {story.likesCount ?? 0}</span>
                    <span>💬 {story.commentsCount ?? 0}</span>
                    <span className="ml-auto bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full">
                      {story.tag}
                    </span>
                  </div>

                  {isOwner && (
                    <button
                      onClick={() => handleRemoveStory(story._id)}
                      className="mt-3 w-full text-xs py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition cursor-pointer"
                    >
                      Remove from collection
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <span className="text-5xl">📭</span>
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mt-4">
              No stories yet
            </h3>
            <p className="text-slate-500 dark:text-slate-500 mt-2 text-sm">
              {isOwner
                ? 'Head to one of your stories and click "Add to Collection".'
                : "The author hasn't added any stories yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionDetailCard;
