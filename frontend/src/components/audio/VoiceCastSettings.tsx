import React, { useEffect, useState } from "react";
import { getVoices, IVoice } from "../../services/narration.service";
import { Story } from "../../types/story.types";

interface Props {
  story: Story;
  onSave: (voiceMap: Record<string, string>) => void;
  onClose: () => void;
}

export const VoiceCastSettings: React.FC<Props> = ({
  story,
  onSave,
  onClose,
}) => {
  const [voices, setVoices] = useState<IVoice[]>([]);
  const [characterNames, setCharacterNames] = useState<string[]>([]);
  const [newCharacterName, setNewCharacterName] = useState("");
  const [voiceMap, setVoiceMap] = useState<Record<string, string>>(
    story.characterVoiceMap || {}
  );
  const [loading, setLoading] = useState(true);

  // Load voices from ElevenLabs backend
  useEffect(() => {
    const loadVoices = async () => {
      try {
        const data = await getVoices();
        setVoices(data);
      } catch (error) {
        console.error("Failed to load voices:", error);
      } finally {
        setLoading(false);
      }
    };
    loadVoices();
  }, []);

  // Parse characters from story content automatically
  useEffect(() => {
    const names = new Set<string>();
    story.chapters.forEach((chapter) => {
      // Look for lines like "Alice: hello" or "Bob said:"
      const regex = /^([A-Z][a-zA-Z]{1,15})(?=\s*[:])/gm;
      let match;
      while ((match = regex.exec(chapter.content)) !== null) {
        if (match[1]) names.add(match[1]);
      }
    });

    // Merge in any characters already in the voice map
    Object.keys(voiceMap).forEach((name) => {
      if (name !== "Narrator") {
        names.add(name);
      }
    });

    setCharacterNames(Array.from(names));
  }, [story, voiceMap]);

  const handleVoiceChange = (character: string, voiceId: string) => {
    setVoiceMap((prev) => ({
      ...prev,
      [character]: voiceId,
    }));
  };

  const handleAddCharacter = () => {
    const trimmed = newCharacterName.trim();
    if (trimmed && !characterNames.includes(trimmed)) {
      setCharacterNames((prev) => [...prev, trimmed]);
      // Assign the first voice as default
      if (voices.length > 0) {
        handleVoiceChange(trimmed, voices[0].voiceId);
      }
      setNewCharacterName("");
    }
  };

  const handleRemoveCharacter = (name: string) => {
    setCharacterNames((prev) => prev.filter((c) => c !== name));
    setVoiceMap((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  const handleSave = () => {
    onSave(voiceMap);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-gradient-to-r from-zinc-900 to-black">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              🎙️ ElevenLabs Voice Cast Settings
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Assign distinct AI narrator and character voice presets for narration.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition p-1.5 hover:bg-zinc-800 rounded-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-zinc-400">Loading ElevenLabs voices...</span>
            </div>
          ) : (
            <>
              {/* Default Narrator Voice */}
              <div className="bg-zinc-900/50 p-4 border border-zinc-800/80 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-sm flex items-center gap-2">
                    📖 Default Narrator Voice
                  </span>
                  <span className="text-xxs px-2 py-0.5 bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-full font-semibold">
                    REQUIRED
                  </span>
                </div>
                <select
                  value={voiceMap["Narrator"] || ""}
                  onChange={(e) => handleVoiceChange("Narrator", e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="" disabled>Select Narrator Voice</option>
                  {voices.map((v) => (
                    <option key={v.voiceId} value={v.voiceId}>
                      {v.name} ({v.description || "Narrator"})
                    </option>
                  ))}
                </select>
              </div>

              {/* Character Cast Mappings */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-zinc-300">
                  🎭 Character Cast Map
                </h3>

                <div className="space-y-3 max-h-[30vh] overflow-y-auto pr-1">
                  {characterNames.length === 0 ? (
                    <div className="text-center py-6 text-zinc-500 text-sm border border-dashed border-zinc-800 rounded-xl bg-zinc-950">
                      No dialog characters detected. Add character names below.
                    </div>
                  ) : (
                    characterNames.map((name) => (
                      <div
                        key={name}
                        className="flex items-center justify-between gap-3 p-3 bg-zinc-900/30 border border-zinc-800/60 rounded-xl hover:border-zinc-800 transition"
                      >
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <span className="font-semibold text-white text-sm">{name}</span>
                        </div>

                        <div className="flex-1 flex items-center gap-2">
                          <select
                            value={voiceMap[name] || ""}
                            onChange={(e) => handleVoiceChange(name, e.target.value)}
                            className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                          >
                            <option value="">Choose voice...</option>
                            {voices.map((v) => (
                              <option key={v.voiceId} value={v.voiceId}>
                                {v.name}
                              </option>
                            ))}
                          </select>

                          <button
                            onClick={() => handleRemoveCharacter(name)}
                            className="text-zinc-500 hover:text-rose-400 p-1.5 transition rounded-lg hover:bg-rose-500/10 cursor-pointer"
                            title="Remove Character"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Add Custom Character */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Character Name (e.g. Alice)"
                  value={newCharacterName}
                  onChange={(e) => setNewCharacterName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCharacter()}
                  className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                />
                <button
                  type="button"
                  onClick={handleAddCharacter}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-sm px-4 py-2 rounded-xl border border-zinc-700 transition cursor-pointer"
                >
                  ＋ Add Cast
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-950 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 text-sm font-semibold transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !voiceMap["Narrator"]}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800/40 disabled:text-zinc-500 text-white text-sm font-semibold transition shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            Save Voice Cast
          </button>
        </div>
      </div>
    </div>
  );
};
