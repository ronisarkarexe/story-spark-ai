import { useState, useEffect, useRef } from "react";
import { useUpdatePostMutation } from "../../redux/apis/post.api";
import { useGetPopularTagsQuery, useSuggestTagsMutation } from "../../redux/apis/tag.api";
import toast from "react-hot-toast";

interface Props {
  storyId: string;
  title: string;
  content: string;
  initialTags?: string[];
}

export default function StoryTagGenerator({
  storyId,
  title,
  content,
  initialTags = [],
}: Props) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputVal, setInputVal] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // RTK Query & Mutation hooks
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
  const { data: popularTags = [] } = useGetPopularTagsQuery();
  const [suggestTags, { data: suggestedTags = [], isLoading: isSuggesting }] = useSuggestTagsMutation();

  useEffect(() => {
    if (initialTags) {
      setTags(initialTags);
    }
  }, [initialTags]);

  // Click outside listener for autocomplete dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter popular tags for autocomplete dropdown
  const filteredSuggestions = popularTags
    .map(t => t.name)
    .filter(tag => 
      tag.toLowerCase().includes(inputVal.toLowerCase()) && 
      !tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );

  const handleAddTag = async (tagText: string) => {
    const cleanTag = tagText.trim();
    if (!cleanTag) return;
    if (cleanTag.length > 50) {
      toast.error("Tag is too long (max 50 chars)");
      return;
    }
    if (tags.some(t => t.toLowerCase() === cleanTag.toLowerCase())) {
      toast.error("Tag already exists");
      return;
    }

    const updatedTags = [...tags, cleanTag];
    setTags(updatedTags);
    setInputVal("");
    setShowDropdown(false);

    try {
      await updatePost({ id: storyId, data: { tags: updatedTags } }).unwrap();
      toast.success(`Tag "${cleanTag}" added!`);
    } catch (err) {
      toast.error("Failed to save tag to database.");
      // Rollback on failure
      setTags(tags);
    }
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    const updatedTags = tags.filter(t => t !== tagToRemove);
    setTags(updatedTags);

    try {
      await updatePost({ id: storyId, data: { tags: updatedTags } }).unwrap();
      toast.success(`Tag "${tagToRemove}" removed!`);
    } catch (err) {
      toast.error("Failed to delete tag.");
      setTags(tags);
    }
  };

  const triggerSuggestions = async () => {
    try {
      await suggestTags({ title, content }).unwrap();
      toast.success("AI generated tag suggestions!");
    } catch (err) {
      toast.error("Failed to generate tag suggestions.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (showDropdown && filteredSuggestions[activeSuggestion]) {
        handleAddTag(filteredSuggestions[activeSuggestion]);
      } else {
        handleAddTag(inputVal);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!showDropdown) {
        setShowDropdown(true);
      } else {
        setActiveSuggestion(prev => (prev + 1) % filteredSuggestions.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (showDropdown) {
        setActiveSuggestion(prev => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length);
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-md p-6 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-zinc-800/50 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            🏷️ Smart Story Tags
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Organize and optimize discoverability for your story
          </p>
        </div>
        
        <button
          onClick={triggerSuggestions}
          disabled={isSuggesting}
          className="rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white px-4 py-2 text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 hover:scale-105 duration-200"
        >
          {isSuggesting ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            <>✨ AI Suggest Tags</>
          )}
        </button>
      </div>

      {/* Tags Display Cloud */}
      <div className="flex flex-wrap gap-2.5">
        {tags.length === 0 ? (
          <p className="text-sm text-zinc-500 italic">No tags added yet. Type below to add custom tags!</p>
        ) : (
          tags.map(tag => (
            <div
              key={tag}
              className="group flex items-center gap-2 rounded-xl bg-purple-950/40 border border-purple-500/20 hover:border-purple-500/40 px-3.5 py-1.5 transition-all duration-200"
            >
              <span className="text-xs font-medium text-purple-200">
                #{tag}
              </span>
              <button
                onClick={() => handleRemoveTag(tag)}
                disabled={isUpdating}
                className="text-zinc-500 group-hover:text-red-400 hover:scale-110 transition-all font-bold text-xs"
                title="Remove tag"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {/* Tag Inputs and Autocomplete */}
      <div className="relative" ref={dropdownRef}>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              setShowDropdown(true);
              setActiveSuggestion(0);
            }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            placeholder="Add a custom tag (e.g. Cyberpunk, Mythical)..."
            className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-inner"
          />
          <button
            onClick={() => handleAddTag(inputVal)}
            disabled={isUpdating}
            className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white px-5 py-2.5 text-sm font-semibold transition-all border border-zinc-700/50"
          >
            Add
          </button>
        </div>

        {/* Autocomplete Dropdown */}
        {showDropdown && inputVal.trim() && filteredSuggestions.length > 0 && (
          <div className="absolute left-0 right-0 z-20 mt-2 max-h-56 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl backdrop-blur-lg">
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={suggestion}
                onClick={() => handleAddTag(suggestion)}
                className={`cursor-pointer rounded-lg px-3 py-2 text-sm transition-all duration-150 ${
                  index === activeSuggestion
                    ? "bg-purple-600 text-white"
                    : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Suggested Tags (AI Feedback) */}
      {suggestedTags.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-zinc-800/40">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            🔮 Suggested Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {suggestedTags
              .filter(tag => !tags.includes(tag))
              .map(tag => (
                <button
                  key={tag}
                  onClick={() => handleAddTag(tag)}
                  className="rounded-lg bg-zinc-800 hover:bg-purple-900/30 border border-zinc-700/50 hover:border-purple-500/35 px-3 py-1.5 text-xs text-zinc-300 hover:text-purple-300 transition-all duration-200"
                >
                  + {tag}
                </button>
              ))}
            {suggestedTags.filter(tag => !tags.includes(tag)).length === 0 && (
              <p className="text-xs text-zinc-500 italic">All suggested tags have been added!</p>
            )}
          </div>
        </div>
      )}

      {/* Popular Tags Section */}
      {popularTags.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-zinc-800/40">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            🔥 Popular Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {popularTags
              .map(t => t.name)
              .filter(tag => !tags.includes(tag))
              .slice(0, 10)
              .map(tag => (
                <button
                  key={tag}
                  onClick={() => handleAddTag(tag)}
                  className="rounded-lg bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800/80 hover:border-zinc-700 px-3 py-1 text-xs text-zinc-400 hover:text-zinc-200 transition-all duration-200"
                >
                  {tag}
                </button>
              ))}
          </div>
        </div>
      )}

    </div>
  );
}