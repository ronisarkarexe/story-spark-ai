import React, { useState } from "react";
import { Sparkles, Loader2, AlertCircle, RefreshCw, AudioLines } from "lucide-react";
import {
  getDialogueFingerprint,
  IDialogueFingerprintResponse,
} from "../../services/dialogue-fingerprint.service";
import CharacterFingerprintCard from "./CharacterFingerprintCard";
import SimilarityTable from "./SimilarityTable";
import RecommendationsPanel from "./RecommendationsPanel";

interface DialogueFingerprintPanelProps {
  storyId: string;
}

const fingerprintCache: Record<string, IDialogueFingerprintResponse> = {};

export const DialogueFingerprintPanel: React.FC<
  DialogueFingerprintPanelProps
> = ({ storyId }) => {
  const [data, setData] = useState<IDialogueFingerprintResponse | null>(
    fingerprintCache[storyId] || null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFingerprint = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getDialogueFingerprint(storyId);
      fingerprintCache[storyId] = result;
      setData(result);
    } catch (err: unknown) {
      console.error(err);
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(
        axiosError?.response?.data?.message ||
          "Failed to generate dialogue fingerprint analysis. Please check your dialogue segments and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-zinc-950 text-white space-y-6">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <AudioLines className="w-6 h-6 text-indigo-400" />
            Dialogue Voice Fingerprint Analysis
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Analyze speaking style distinctiveness, vocabulary overlap, sentence complexity, and contractions rate among characters.
          </p>
        </div>
        {data && (
          <button
            onClick={fetchFingerprint}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg text-xs font-semibold border border-zinc-800 transition cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            Regenerate
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl flex gap-3 items-center">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="flex-1">{error}</p>
          <button
            onClick={fetchFingerprint}
            className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-white rounded text-xs font-semibold transition cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {!data && !loading && (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-10 text-center max-w-2xl mx-auto my-8 space-y-5 shadow-lg">
          <div className="w-14 h-14 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto text-indigo-400">
            <AudioLines className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-white font-bold text-lg">
              Analyze Character Voices
            </h4>
            <p className="text-zinc-400 text-sm mt-2 max-w-md mx-auto leading-relaxed">
              Identify vocabulary overlaps, contraction trends, pacing anomalies, and similarities between speech patterns to ensure your characters sound distinct.
            </p>
          </div>
          <button
            onClick={fetchFingerprint}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition shadow-lg hover:shadow-indigo-500/25 cursor-pointer inline-flex items-center gap-2"
          >
            Analyze Dialogue Voices
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <div className="text-center">
            <p className="text-zinc-300 font-semibold text-sm">
              Analyzing dialogue fingerprints...
            </p>
            <p className="text-zinc-500 text-xs mt-1">
              Extracting quotes and computing styles. This will take a moment.
            </p>
          </div>
        </div>
      )}

      {data && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm">Character Fingerprints</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.characters.map((char) => (
                  <CharacterFingerprintCard
                    key={char.character}
                    analysis={char}
                  />
                ))}
              </div>
            </div>

            <SimilarityTable similarities={data.similarities} />
          </div>

          <div className="lg:col-span-1">
            <RecommendationsPanel recommendations={data.recommendations} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DialogueFingerprintPanel;
