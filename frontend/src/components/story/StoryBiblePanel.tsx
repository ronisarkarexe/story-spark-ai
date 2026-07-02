import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  getStoryBible,
  extractStoryBible,
  IStoryBible,
  ICharacter,
  ILocation,
  IObject,
  IRelationship,
  ITimelineEvent,
} from "../../services/storyBible.service";

interface StoryBiblePanelProps {
  storyId: string;
}

const StoryBiblePanel: React.FC<StoryBiblePanelProps> = ({ storyId }) => {
  const [bible, setBible] = useState<IStoryBible | null>(null);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "characters" | "locations" | "objects" | "relationships" | "timeline"
  >("characters");

  const loadBible = async () => {
    try {
      setLoading(true);
      const data = await getStoryBible(storyId);
      setBible(data);
    } catch (error) {
      console.error("Failed to load Story Bible", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBible();
  }, [storyId]);

  const handleExtract = async () => {
    try {
      setExtracting(true);
      toast.loading("Extracting entities from story...", { id: "extract" });
      const data = await extractStoryBible(storyId);
      setBible(data);
      toast.success("Story Bible extracted successfully!", { id: "extract" });
    } catch (error) {
      console.error("Extraction failed", error);
      toast.error("Failed to extract Story Bible.", { id: "extract" });
    } finally {
      setExtracting(false);
    }
  };

  if (loading) return <div className="p-4 text-slate-400">Loading Story Bible...</div>;

  return (
    <div className="flex flex-col h-full bg-zinc-900 border-l border-zinc-800 w-96">
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
        <h3 className="text-white font-bold">Story Bible</h3>
        <button
          onClick={handleExtract}
          disabled={extracting}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 rounded disabled:opacity-50"
        >
          {extracting ? "Extracting..." : "Auto-Extract"}
        </button>
      </div>

      <div className="flex text-xs border-b border-zinc-800">
        {["characters", "locations", "objects", "relationships", "timeline"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 py-2 text-center capitalize transition-colors ${
              activeTab === tab ? "bg-zinc-800 text-white font-bold" : "text-slate-400 hover:text-white hover:bg-zinc-800/50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {!bible && (
          <div className="text-sm text-slate-500 text-center mt-10">
            No Story Bible exists yet.<br />Click Auto-Extract to generate one.
          </div>
        )}

        {bible && activeTab === "characters" && (
          <div className="space-y-4">
            {bible.characters?.map((c: ICharacter, i: number) => (
              <div key={i} className="bg-zinc-800 p-3 rounded-lg border border-zinc-700">
                <div className="font-bold text-white mb-1">{c.name}</div>
                <div className="text-xs text-indigo-400 mb-2">{c.role}</div>
                <div className="text-xs text-slate-300"><strong>Traits:</strong> {c.physicalTraits}</div>
                <div className="text-xs text-slate-300"><strong>Personality:</strong> {c.personality}</div>
                <div className="text-xs text-slate-300"><strong>Background:</strong> {c.background}</div>
              </div>
            ))}
          </div>
        )}

        {bible && activeTab === "locations" && (
          <div className="space-y-4">
            {bible.locations?.map((l: ILocation, i: number) => (
              <div key={i} className="bg-zinc-800 p-3 rounded-lg border border-zinc-700">
                <div className="font-bold text-white mb-1">{l.name}</div>
                <div className="text-xs text-slate-300"><strong>Description:</strong> {l.description}</div>
                <div className="text-xs text-slate-300"><strong>History:</strong> {l.history}</div>
              </div>
            ))}
          </div>
        )}

        {bible && activeTab === "objects" && (
          <div className="space-y-4">
            {bible.objects?.map((o: IObject) => (
              <div key={o.id ?? o.name} className="bg-zinc-800 p-3 rounded-lg border border-zinc-700">
                <div className="text-xs text-slate-300"><strong>Description:</strong> {o.description}</div>
                <div className="text-xs text-slate-300"><strong>Significance:</strong> {o.significance}</div>
              </div>
            ))}
          </div>
        )}

        {bible && activeTab === "relationships" && (
          <div className="space-y-4">
            {bible.relationships?.map((r: IRelationship, i: number) => (
              <div key={i} className="bg-zinc-800 p-3 rounded-lg border border-zinc-700">
                <div className="font-bold text-indigo-400 mb-1">{r.character1} & {r.character2}</div>
                <div className="text-xs text-white mb-1 bg-zinc-700 inline-block px-2 py-0.5 rounded">{r.relationshipType}</div>
                <div className="text-xs text-slate-300">{r.dynamics}</div>
              </div>
            ))}
          </div>
        )}

        {bible && activeTab === "timeline" && (
          <div className="space-y-4 relative border-l border-zinc-700 ml-3 pl-4">
            {bible.timelineEvents?.map((t: ITimelineEvent, i: number) => (
              <div key={i} className="mb-6 relative">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>
                <div className="text-xs text-indigo-400 font-bold mb-1">{t.dateOrTime}</div>
                <div className="text-sm text-white mb-1">{t.description}</div>
                <div className="text-xs text-slate-500">Characters: {t.charactersInvolved?.join(", ")}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryBiblePanel;
