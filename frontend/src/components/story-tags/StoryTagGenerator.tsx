import { useMemo, useState } from "react";
import {
  generateTags,
  addTag,
  removeTag,
  StoryTag,
} from "../../utils/storyTagGenerator";

interface Props {
  story: string;
}

export default function StoryTagGenerator({
  story,
}: Props) {

  const [tags, setTags] = useState<StoryTag[]>([]);

  useMemo(() => {
    setTags(generateTags(story));
  }, [story]);

  const handleAddTag = () => {
    const value = prompt("Enter new tag");

    if (!value) return;

    setTags(prev =>
      addTag(prev, {
        id: Date.now(),
        name: value,
        category: "Theme",
      })
    );
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold text-white">
          🏷️ Smart Story Tags
        </h2>

        <button
          onClick={handleAddTag}
          className="rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Add Tag
        </button>

      </div>

      <div className="flex flex-wrap gap-3">

        {tags.map(tag => (

          <div
            key={tag.id}
            className="flex items-center gap-2 rounded-full bg-zinc-800 px-4 py-2"
          >
            <span className="text-white">
              {tag.name}
            </span>

            <button
              onClick={() =>
                setTags(prev =>
                  removeTag(prev, tag.id)
                )
              }
              className="text-red-400"
            >
              ✕
            </button>

          </div>

        ))}

      </div>

      <div className="mt-8">

        <h3 className="text-lg font-semibold text-white mb-4">
          Categories
        </h3>

        <div className="grid md:grid-cols-4 gap-3">

          <div className="rounded-lg bg-zinc-800 p-3">
            Genre
          </div>

          <div className="rounded-lg bg-zinc-800 p-3">
            Theme
          </div>

          <div className="rounded-lg bg-zinc-800 p-3">
            Emotion
          </div>

          <div className="rounded-lg bg-zinc-800 p-3">
            Character
          </div>

        </div>

      </div>

    </div>
  );
}