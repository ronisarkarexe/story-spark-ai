import React, { useState } from "react";
import {
  rewriteStory,
  CreativityLevel,
} from "../../utils/storyRewrite";

interface StoryRewritePanelProps {
  story: string;
}

const StoryRewritePanel: React.FC<StoryRewritePanelProps> = ({
  story,
}) => {
  const [creativity, setCreativity] =
    useState<CreativityLevel>("Balanced");

  const [rewrittenStory, setRewrittenStory] =
    useState(story);

  const handleRewrite = () => {
    const result = rewriteStory({
      story,
      creativity,
    });

    setRewrittenStory(result.rewrittenStory);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(rewrittenStory);
  };

  const handleReplace = () => {
    alert("Replace original story functionality.");
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">

      <h2 className="text-2xl font-bold text-white mb-6">
        ✨ AI Story Rewrite
      </h2>

      <div className="mb-6">
        <label className="block text-white font-semibold mb-2">
          Creativity Level
        </label>

        <select
          value={creativity}
          onChange={(e) =>
            setCreativity(
              e.target.value as CreativityLevel
            )
          }
          className="w-full bg-zinc-800 text-white rounded-lg p-3"
        >
          <option value="Low">Low</option>
          <option value="Balanced">Balanced</option>
          <option value="High">High</option>
          <option value="Experimental">
            Experimental
          </option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <div>
          <h3 className="text-white font-semibold mb-2">
            Original Story
          </h3>

          <textarea
            readOnly
            value={story}
            className="w-full h-72 bg-zinc-800 text-white rounded-lg p-3"
          />
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">
            Rewritten Story
          </h3>

          <textarea
            value={rewrittenStory}
            onChange={(e) =>
              setRewrittenStory(e.target.value)
            }
            className="w-full h-72 bg-zinc-800 text-white rounded-lg p-3"
          />
        </div>

      </div>

      <div className="flex gap-3 mt-6 flex-wrap">

        <button
          onClick={handleRewrite}
          className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg text-white"
        >
          ✨ Rewrite Story
        </button>

        <button
          onClick={handleReplace}
          className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-white"
        >
          Replace Original
        </button>

        <button
          onClick={handleCopy}
          className="bg-zinc-700 hover:bg-zinc-600 px-5 py-2 rounded-lg text-white"
        >
          Copy
        </button>

      </div>

    </div>
  );
};

export default StoryRewritePanel;