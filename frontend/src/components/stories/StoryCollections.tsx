import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface StoryCollection {
  id: string;
  name: string;
  stories: string[];
}

interface StoryCollectionsProps {
  storyId: string;
  storyTitle: string;
}

const StoryCollections = ({
  storyId,
  storyTitle,
}: StoryCollectionsProps) => {
  const [collections, setCollections] = useState<StoryCollection[]>([]);
  const [collectionName, setCollectionName] = useState("");
  const [search, setSearch] = useState("");

  // Load collections
  useEffect(() => {
    const saved = localStorage.getItem("story-collections");

    if (saved) {
      setCollections(JSON.parse(saved));
    }
  }, []);

  // Save collections
  useEffect(() => {
    localStorage.setItem(
      "story-collections",
      JSON.stringify(collections)
    );
  }, [collections]);

  // Create collection
  const handleCreate = () => {
    if (!collectionName.trim()) {
      toast.error("Enter collection name");
      return;
    }

    const newCollection: StoryCollection = {
      id: Date.now().toString(),
      name: collectionName,
      stories: [],
    };

    setCollections([...collections, newCollection]);
    setCollectionName("");
    toast.success("Collection created");
  };

  // Add story
  const addStory = (id: string) => {
    setCollections((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              stories: item.stories.includes(storyId)
                ? item.stories
                : [...item.stories, storyId],
            }
          : item
      )
    );

    toast.success("Story added to collection");
  };

  // Delete collection
  const deleteCollection = (id: string) => {
    setCollections(
      collections.filter((item) => item.id !== id)
    );

    toast.success("Collection deleted");
  };

  const filteredCollections = collections.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-xl bg-slate-900 p-5 text-white mt-5">
      <h2 className="text-xl font-bold mb-4">
        📚 Story Collections
      </h2>

      {/* Create Collection */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={collectionName}
          placeholder="Create collection..."
          onChange={(e) => setCollectionName(e.target.value)}
          className="flex-1 p-2 rounded text-black"
        />

        <button
          onClick={handleCreate}
          className="bg-blue-600 px-4 rounded"
        >
          Create
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search collections..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 rounded text-black mb-4"
      />

      {/* Collections */}
      <div className="space-y-3">
        {filteredCollections.length > 0 ? (
          filteredCollections.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800 p-3 rounded"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-400">
                    {item.stories.length} stories
                  </p>
                </div>

                <button
                  onClick={() => deleteCollection(item.id)}
                  className="text-red-400"
                >
                  Delete
                </button>
              </div>

              <button
                onClick={() => addStory(item.id)}
                className="mt-2 bg-green-600 px-3 py-1 rounded"
              >
                Add "{storyTitle}" 
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400">
            No collections found
          </p>
        )}
      </div>
    </div>
  );
};

export default StoryCollections;